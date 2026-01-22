'use client'

import { useState, useEffect } from 'react'
import { Budget, addBudget, updateBudget } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Plus, X } from 'lucide-react'

interface BudgetManagerProps {
  userId: string
  budgets: Budget[]
  categories: string[]
  onBudgetAdded: () => void
  editingBudget?: Budget | null
  categoryAverages?: { [key: string]: number }
}

const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Utilities',
  'Saúde',
  'Educação',
  'Entretenimento',
  'Shopping',
  'Delivery',
  'Outros',
]

export default function BudgetManager({
  userId,
  budgets,
  categories,
  onBudgetAdded,
  editingBudget,
  categoryAverages = {},
}: BudgetManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [limitValue, setLimitValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editing, setEditing] = useState<Budget | null>(editingBudget || null)

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // Categorias já com orçamento
  const budgetedCategories = budgets.map((b) => b.category)

  // Categorias disponíveis para criar novo orçamento
  const availableCategories = DEFAULT_CATEGORIES.filter((cat) => !budgetedCategories.includes(cat))

  useEffect(() => {
    if (editingBudget) {
      setEditing(editingBudget)
      setSelectedCategory(editingBudget.category)
      setLimitValue(editingBudget.limit.toString())
      setIsOpen(true)
    }
  }, [editingBudget])

  // Auto-preencher limite com a média quando selecionar categoria
  useEffect(() => {
    if (selectedCategory && categoryAverages[selectedCategory] && !editing) {
      const average = categoryAverages[selectedCategory]
      setLimitValue(average.toFixed(2))
    }
  }, [selectedCategory, categoryAverages, editing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || !limitValue) {
      setMessage({ type: 'error', text: 'Preencha todos os campos' })
      return
    }

    const limit = parseFloat(limitValue)
    if (limit <= 0) {
      setMessage({ type: 'error', text: 'O limite deve ser maior que zero' })
      return
    }

    setLoading(true)

    try {
      if (editing) {
        // Atualizar orçamento existente
        await updateBudget(editing.id, { limit })
        setMessage({ type: 'success', text: 'Orçamento atualizado com sucesso!' })
      } else {
        // Criar novo orçamento
        await addBudget({
          user_id: userId,
          category: selectedCategory,
          limit,
          month: currentMonth,
        })
        setMessage({ type: 'success', text: 'Orçamento criado com sucesso!' })
      }

      setTimeout(() => {
        setIsOpen(false)
        setSelectedCategory('')
        setLimitValue('')
        setEditing(null)
        setMessage(null)
        onBudgetAdded()
      }, 1500)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar orçamento' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedCategory('')
    setLimitValue('')
    setEditing(null)
    setMessage(null)
  }

  return (
    <div>
      {/* Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
            color: 'white',
            border: 'none',
            borderRadius: borderRadius.lg,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            fontSize: typography.body.fontSize,
            transition: transitions.normal,
            marginBottom: spacing.lg,
            boxShadow: shadows.blue,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = shadows.lg
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = shadows.blue
          }}
        >
          <Plus size={20} />
          {availableCategories.length > 0 ? 'Novo Orçamento' : 'Todas categorias com orçamento'}
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: colors.background.light,
              borderRadius: borderRadius.xl,
              boxShadow: shadows.lg,
              padding: spacing.xl,
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}
            >
              <h3
                style={{
                  fontSize: typography.h3.fontSize,
                  fontWeight: 700,
                  color: colors.secondary[900],
                  margin: 0,
                }}
              >
                {editing ? '✏️ Editar Orçamento' : '📊 Novo Orçamento'}
              </h3>
              <button
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: spacing.sm,
                }}
              >
                <X size={24} color={colors.secondary[500]} />
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                style={{
                  padding: spacing.md,
                  backgroundColor:
                    message.type === 'success'
                      ? colors.status.success + '15'
                      : colors.status.error + '15',
                  border: `1px solid ${
                    message.type === 'success' ? colors.status.success : colors.status.error
                  }`,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.lg,
                  color: message.type === 'success' ? colors.status.success : colors.status.error,
                  fontSize: typography.small.fontSize,
                  fontWeight: 500,
                }}
              >
                {message.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              {/* Category Select */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontSize: typography.label.fontSize,
                    fontWeight: 600,
                    color: colors.secondary[900],
                  }}
                >
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={!!editing}
                  style={{
                    width: '100%',
                    padding: `${spacing.sm} ${spacing.md}`,
                    border: `2px solid ${colors.primary[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.body.fontSize,
                    backgroundColor: colors.background.lighter,
                    color: colors.secondary[900],
                    cursor: editing ? 'not-allowed' : 'pointer',
                    opacity: editing ? 0.6 : 1,
                    transition: transitions.normal,
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    if (!editing) {
                      e.currentTarget.style.borderColor = colors.primary[500]
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primary[200]
                  }}
                >
                  <option value="">Selecione uma categoria</option>
                  {editing ? (
                    <option value={editing.category}>{editing.category}</option>
                  ) : (
                    availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Limit Input */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontSize: typography.label.fontSize,
                    fontWeight: 600,
                    color: colors.secondary[900],
                  }}
                >
                  Limite Mensal (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={limitValue}
                  onChange={(e) => setLimitValue(e.target.value)}
                  placeholder="Ex: 800.00"
                  style={{
                    width: '100%',
                    padding: `${spacing.sm} ${spacing.md}`,
                    border: `2px solid ${colors.primary[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.body.fontSize,
                    backgroundColor: colors.background.lighter,
                    color: colors.secondary[900],
                    transition: transitions.normal,
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary[500]
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primary[200]
                  }}
                />
              </div>

              {/* Preview and Average */}
              {selectedCategory && limitValue && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                  }}
                >
                  {/* Preview */}
                  <div
                    style={{
                      padding: spacing.md,
                      backgroundColor: colors.primary[50],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.primary[200]}`,
                    }}
                  >
                    <p style={{ fontSize: typography.small.fontSize, color: colors.secondary[600], margin: 0 }}>
                      {selectedCategory} limitado a <strong>R$ {parseFloat(limitValue).toFixed(2)}</strong> por mês
                    </p>
                  </div>

                  {/* Average Spend */}
                  {categoryAverages[selectedCategory] && (
                    <div
                      style={{
                        padding: spacing.md,
                        backgroundColor: colors.status.info + '15',
                        borderRadius: borderRadius.md,
                        border: `1px solid ${colors.status.info}`,
                      }}
                    >
                      <p style={{ fontSize: typography.small.fontSize, color: colors.secondary[600], margin: `0 0 ${spacing.xs} 0` }}>
                        📊 Média histórica:
                      </p>
                      <p style={{ fontSize: typography.body.fontSize, fontWeight: 600, color: colors.secondary[900], margin: 0 }}>
                        R$ {categoryAverages[selectedCategory].toFixed(2)} por mês
                      </p>
                      <p style={{ fontSize: typography.small.fontSize, color: colors.secondary[500], margin: `${spacing.xs} 0 0 0` }}>
                        {parseFloat(limitValue) > categoryAverages[selectedCategory]
                          ? `✓ ${Math.round(((parseFloat(limitValue) - categoryAverages[selectedCategory]) / categoryAverages[selectedCategory]) * 100)}% acima da média`
                          : `⚠️ ${Math.round(((categoryAverages[selectedCategory] - parseFloat(limitValue)) / categoryAverages[selectedCategory]) * 100)}% abaixo da média`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: spacing.md }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: `${spacing.sm} ${spacing.md}`,
                    background: colors.secondary[100],
                    color: colors.secondary[600],
                    border: `1px solid ${colors.secondary[200]}`,
                    borderRadius: borderRadius.md,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: transitions.normal,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.secondary[200]
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.secondary[100]
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedCategory || !limitValue}
                  style={{
                    flex: 1,
                    padding: `${spacing.sm} ${spacing.md}`,
                    background: loading
                      ? colors.secondary[300]
                      : `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: borderRadius.md,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: transitions.normal,
                  }}
                >
                  {loading ? 'Salvando...' : editing ? 'Atualizar' : 'Criar Orçamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
