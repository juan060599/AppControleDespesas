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
        padding: spacing.lg,
        backgroundColor: colors.background.light,
        borderRadius: '12px',
        border: `1px solid ${colors.primary[100]}`,
      }}
    >
      <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[900] }}>
        📊 Limites por Categoria
      </h3>

      {message && (
        <div
          style={{
            padding: spacing.md,
            marginBottom: spacing.md,
            backgroundColor: message.type === 'success' ? colors.status.success + '15' : colors.status.error + '15',
            border: `1px solid ${message.type === 'success' ? colors.status.success : colors.status.error}`,
            borderRadius: '6px',
            color: message.type === 'success' ? colors.status.success : colors.status.error,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Adicionar novo limite */}
      <div
        style={{
          padding: spacing.md,
          backgroundColor: colors.background.lighter,
          borderRadius: '8px',
          marginBottom: spacing.lg,
          border: `1px solid ${colors.primary[100]}`,
        }}
      >
        <p style={{ ...typography.small, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[700], fontWeight: 'bold' }}>
          Adicionar novo limite
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: spacing.md, alignItems: 'end' }}>
          <div>
            <label style={{ ...typography.small, color: colors.secondary[700], display: 'block', marginBottom: spacing.xs }}>
              Categoria
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                width: '100%',
                padding: spacing.md,
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: '6px',
                fontSize: typography.body.fontSize,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="custom">Outra (digitar)</option>
            </select>
            {newCategory === 'custom' && (
              <input
                type="text"
                placeholder="Nome da categoria"
                value={newCategory === 'custom' ? '' : newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  marginTop: spacing.xs,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: '6px',
                  fontSize: typography.body.fontSize,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>

          <div>
            <label style={{ ...typography.small, color: colors.secondary[700], display: 'block', marginBottom: spacing.xs }}>
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
                padding: spacing.md,
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: '6px',
                fontSize: typography.body.fontSize,
                fontFamily: 'monospace',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleAddLimit}
            disabled={saving}
            style={{
              padding: `${spacing.md} ${spacing.lg}`,
              backgroundColor: colors.primary[500],
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de limites */}
      {limits.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {limits.map((limit) => (
            <div
              key={limit.id}
              style={{
                padding: spacing.md,
                backgroundColor: colors.background.lighter,
                borderRadius: '8px',
                border: `1px solid ${colors.primary[100]}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ ...typography.body, margin: 0, fontWeight: 'bold', color: colors.secondary[900] }}>
                  {limit.category}
                </p>
                {editingId === limit.id ? (
                  <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.xs }}>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      step="0.01"
                      min="0"
                      style={{
                        padding: spacing.sm,
                        border: `1px solid ${colors.primary[200]}`,
                        borderRadius: '4px',
                        fontSize: typography.body.fontSize,
                        fontFamily: 'monospace',
                      }}
                    />
                    <button
                      onClick={() => handleEditSave(limit.id)}
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.status.success,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                      }}
                    >
                      <Save size={16} />
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.status.error,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                      }}
                    >
                      <X size={16} />
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <p style={{ ...typography.small, margin: `${spacing.xs} 0 0 0`, color: colors.secondary[600] }}>
                    R$ {limit.limit_amount.toFixed(2)}
                  </p>
                )}
              </div>

              {editingId !== limit.id && (
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  <button
                    onClick={() => {
                      setEditingId(limit.id)
                      setEditValue(limit.limit_amount.toString())
                    }}
                    style={{
                      padding: spacing.sm,
                      backgroundColor: colors.primary[100],
                      border: `1px solid ${colors.primary[200]}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: colors.primary[600],
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(limit.id)}
                    style={{
                      padding: spacing.sm,
                      backgroundColor: colors.status.error + '20',
                      border: `1px solid ${colors.status.error}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: colors.status.error,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ ...typography.small, color: colors.secondary[500], textAlign: 'center', padding: spacing.lg, margin: 0 }}>
          Nenhum limite configurado ainda
        </p>
      )}
    </section>
  )
}
