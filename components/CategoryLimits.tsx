'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { getCategoryLimits, setCategoryLimit, deleteCategoryLimit, getTransactions } from '@/lib/database'

interface CategoryLimit {
  id: string
  user_id: string
  category: string
  limit_amount: number
  created_at: string
  updated_at: string
}

interface CategoryLimitsProps {
  userId: string
  onLimitsUpdated?: () => void
}

export default function CategoryLimits({ userId, onLimitsUpdated }: CategoryLimitsProps) {
  const [limits, setLimits] = useState<CategoryLimit[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [newLimit, setNewLimit] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      setLoading(true)
      // Carregar limites existentes
      const { data: limitsData } = await getCategoryLimits(userId)
      if (limitsData) {
        setLimits(limitsData)
      }

      // Carregar categorias disponíveis das transações
      const { data: transactionsData } = await getTransactions(userId)
      if (transactionsData) {
        const categories = Array.from(new Set(transactionsData.map((t) => t.category)))
        setAvailableCategories(categories as string[])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLimit = async () => {
    if (!newCategory.trim() || !newLimit.trim()) {
      setMessage({ type: 'error', text: 'Preencha categoria e limite' })
      return
    }

    if (isNaN(parseFloat(newLimit)) || parseFloat(newLimit) <= 0) {
      setMessage({ type: 'error', text: 'Limite deve ser um número válido' })
      return
    }

    setSaving(true)
    try {
      const { error } = await setCategoryLimit(userId, newCategory, parseFloat(newLimit))
      if (error) {
        setMessage({ type: 'error', text: 'Erro ao salvar limite' })
        return
      }

      setMessage({ type: 'success', text: `✅ Limite para ${newCategory} salvo!` })
      setNewCategory('')
      setNewLimit('')
      setTimeout(() => setMessage(null), 2000)
      await loadData()
      onLimitsUpdated?.()
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditSave = async (id: string) => {
    if (!editValue.trim() || isNaN(parseFloat(editValue)) || parseFloat(editValue) <= 0) {
      setMessage({ type: 'error', text: 'Valor inválido' })
      return
    }

    setSaving(true)
    try {
      const limit = limits.find((l) => l.id === id)
      if (!limit) return

      const { error } = await setCategoryLimit(userId, limit.category, parseFloat(editValue))
      if (error) {
        setMessage({ type: 'error', text: 'Erro ao atualizar' })
        return
      }

      setEditingId(null)
      setMessage({ type: 'success', text: '✅ Limite atualizado!' })
      setTimeout(() => setMessage(null), 2000)
      await loadData()
      onLimitsUpdated?.()
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const limit = limits.find((l) => l.id === id)
    if (!limit) return

    if (!window.confirm(`Deletar limite de ${limit.category}?`)) return

    try {
      const { error } = await deleteCategoryLimit(id)
      if (error) {
        setMessage({ type: 'error', text: 'Erro ao deletar' })
        return
      }

      setMessage({ type: 'success', text: '✅ Limite removido!' })
      setTimeout(() => setMessage(null), 2000)
      await loadData()
      onLimitsUpdated?.()
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro' })
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.background.light,
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: colors.secondary[600] }}>Carregando...</p>
      </div>
    )
  }

  return (
    <section
      style={{
        padding: 'clamp(12px, 3vw, 20px)',
        backgroundColor: colors.background.light,
        borderRadius: '12px',
        border: `1px solid ${colors.primary[100]}`,
      }}
    >
      <h3 style={{ fontSize: 'clamp(16px, 3.5vw, 20px)', margin: `0 0 clamp(12px, 2vw, 16px) 0`, color: colors.secondary[900], fontWeight: 700 }}>
        📊 Limites por Categoria
      </h3>

      {message && (
        <div
          style={{
            padding: 'clamp(10px, 2vw, 12px)',
            marginBottom: 'clamp(12px, 2vw, 16px)',
            backgroundColor: message.type === 'success' ? colors.status.success + '15' : colors.status.error + '15',
            border: `1px solid ${message.type === 'success' ? colors.status.success : colors.status.error}`,
            borderRadius: '6px',
            color: message.type === 'success' ? colors.status.success : colors.status.error,
            fontSize: 'clamp(12px, 1.8vw, 14px)',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Adicionar novo limite */}
      <div
        style={{
          padding: 'clamp(12px, 2vw, 16px)',
          backgroundColor: colors.background.lighter,
          borderRadius: '8px',
          marginBottom: 'clamp(12px, 2vw, 16px)',
          border: `1px solid ${colors.primary[100]}`,
        }}
      >
        <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', margin: `0 0 clamp(10px, 1.5vw, 12px) 0`, color: colors.secondary[700], fontWeight: 'bold' }}>
          ➕ Adicionar Novo Limite
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(100px, 30%, 180px), 1fr))',
          gap: 'clamp(8px, 2vw, 12px)', 
          alignItems: 'end',
        }}>
          <div>
            <label style={{ fontSize: 'clamp(11px, 1.5vw, 12px)', color: colors.secondary[700], display: 'block', marginBottom: 'clamp(4px, 1vw, 6px)', fontWeight: 600 }}>
              Categoria
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(8px, 1.5vw, 10px)',
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: '6px',
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Selecione</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="custom">Outra</option>
            </select>
            {newCategory === 'custom' && (
              <input
                type="text"
                placeholder="Nome"
                value={newCategory === 'custom' ? '' : newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'clamp(8px, 1.5vw, 10px)',
                  marginTop: 'clamp(6px, 1vw, 8px)',
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: '6px',
                  fontSize: 'clamp(12px, 1.8vw, 14px)',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>

          <div>
            <label style={{ fontSize: 'clamp(11px, 1.5vw, 12px)', color: colors.secondary[700], display: 'block', marginBottom: 'clamp(4px, 1vw, 6px)', fontWeight: 600 }}>
              Limite (R$)
            </label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: 'clamp(8px, 1.5vw, 10px)',
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: '6px',
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleAddLimit}
            disabled={saving}
            style={{
              padding: `clamp(8px, 1.5vw, 10px) clamp(10px, 2vw, 14px)`,
              backgroundColor: colors.primary[500],
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(4px, 1vw, 6px)',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(12px, 1.8vw, 14px)',
              minHeight: '38px',
            }}
          >
            <Plus size='clamp(16px, 3vw, 18px)' />
            <span style={{ display: 'inline' }}>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Lista de limites - Grid compacta */}
      {limits.length > 0 ? (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 40%, 200px), 1fr))',
          gap: 'clamp(8px, 2vw, 12px)',
        }}>
          {limits.map((limit) => (
            <div
              key={limit.id}
              style={{
                padding: 'clamp(10px, 2vw, 14px)',
                backgroundColor: colors.background.lighter,
                borderRadius: '8px',
                border: `1px solid ${colors.primary[100]}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                transition: 'all 0.2s ease',
                boxShadow: `0 2px 4px ${colors.secondary[100]}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 8px ${colors.primary[100]}`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 2px 4px ${colors.secondary[100]}`
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'clamp(13px, 2vw, 14px)', margin: 0, fontWeight: 'bold', color: colors.secondary[900], wordBreak: 'break-word' }}>
                  {limit.category}
                </p>
                {editingId === limit.id ? (
                  <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 6px)', marginTop: 'clamp(8px, 1.5vw, 10px)', flexDirection: 'column' }}>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      step="0.01"
                      min="0"
                      autoFocus
                      style={{
                        padding: 'clamp(6px, 1vw, 8px)',
                        border: `1px solid ${colors.primary[200]}`,
                        borderRadius: '4px',
                        fontSize: 'clamp(12px, 1.8vw, 13px)',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 6px)' }}>
                      <button
                        onClick={() => handleEditSave(limit.id)}
                        style={{
                          flex: 1,
                          padding: `clamp(4px, 0.8vw, 6px) clamp(6px, 1vw, 8px)`,
                          backgroundColor: colors.status.success,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'clamp(2px, 0.5vw, 4px)',
                          fontSize: 'clamp(11px, 1.5vw, 12px)',
                        }}
                      >
                        <Save size={14} />
                        <span style={{ display: 'inline' }}>Salvar</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          flex: 1,
                          padding: `clamp(4px, 0.8vw, 6px) clamp(6px, 1vw, 8px)`,
                          backgroundColor: colors.status.error,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'clamp(2px, 0.5vw, 4px)',
                          fontSize: 'clamp(11px, 1.5vw, 12px)',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', margin: `clamp(6px, 1vw, 8px) 0 0 0`, color: colors.primary[600], fontWeight: 'bold', fontFamily: 'monospace' }}>
                    R$ {limit.limit_amount.toFixed(2).replace('.', ',')}
                  </p>
                )}
              </div>

              {editingId !== limit.id && (
                <div style={{ display: 'flex', gap: 'clamp(6px, 1vw, 8px)', marginTop: 'clamp(8px, 1.5vw, 10px)' }}>
                  <button
                    onClick={() => {
                      setEditingId(limit.id)
                      setEditValue(limit.limit_amount.toString())
                    }}
                    style={{
                      flex: 1,
                      padding: 'clamp(6px, 1vw, 8px)',
                      backgroundColor: colors.primary[100],
                      border: `1px solid ${colors.primary[200]}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: colors.primary[600],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(2px, 0.5vw, 4px)',
                      fontSize: 'clamp(11px, 1.5vw, 12px)',
                    }}
                    title="Editar"
                  >
                    <Edit2 size={14} />
                    <span style={{ display: 'inline' }}>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(limit.id)}
                    style={{
                      flex: 1,
                      padding: 'clamp(6px, 1vw, 8px)',
                      backgroundColor: colors.status.error + '20',
                      border: `1px solid ${colors.status.error}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: colors.status.error,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(2px, 0.5vw, 4px)',
                      fontSize: 'clamp(11px, 1.5vw, 12px)',
                    }}
                    title="Deletar"
                  >
                    <Trash2 size={14} />
                    <span style={{ display: 'inline' }}>Deletar</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 'clamp(12px, 1.8vw, 14px)', color: colors.secondary[500], textAlign: 'center', padding: 'clamp(20px, 4vw, 32px)', margin: 0 }}>
          📭 Nenhum limite configurado
        </p>
      )}
    </section>
  )
}
