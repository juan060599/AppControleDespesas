'use client'

import { useEffect, useState } from 'react'
import { getRecurringExpenses, addRecurringExpense, deleteRecurringExpense, RecurringExpense } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Plus, Trash2 } from 'lucide-react'

interface RecurringExpensesProps {
  userId: string
}

const FREQUENCIES: Record<string, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
}

const FREQUENCY_MULTIPLIERS: Record<string, number> = {
  daily: 30,
  weekly: 4.33,
  monthly: 1,
  quarterly: 0.25,
  yearly: 1 / 12,
}

export default function RecurringExpenses({ userId }: RecurringExpensesProps) {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    frequency: 'monthly' as const,
    next_charge_date: '',
    notes: '',
  })

  useEffect(() => {
    loadExpenses()
  }, [userId])

  const loadExpenses = async () => {
    try {
      const { data } = await getRecurringExpenses(userId)
      setExpenses(data || [])
    } catch (error) {
      console.error('Error loading recurring expenses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.description || !formData.amount || !formData.category || !formData.next_charge_date) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      await addRecurringExpense({
        user_id: userId,
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        frequency: formData.frequency,
        next_charge_date: formData.next_charge_date,
        notes: formData.notes || undefined,
        is_active: true,
      })
      setFormData({
        description: '',
        amount: '',
        category: '',
        frequency: 'monthly',
        next_charge_date: '',
        notes: '',
      })
      setIsAdding(false)
      loadExpenses()
    } catch (error) {
      console.error('Error adding recurring expense:', error)
      alert('Erro ao adicionar despesa')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover esta assinatura?')) return
    try {
      await deleteRecurringExpense(id)
      loadExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const getTotalMonthly = () => {
    return expenses.reduce((total, expense) => {
      const multiplier = FREQUENCY_MULTIPLIERS[expense.frequency] || 1
      return total + expense.amount * multiplier
    }, 0)
  }

  return (
    <div
      style={{
        background: colors.background.light,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        border: `1px solid ${colors.primary[100]}`,
        overflow: 'hidden',
      }}
    >
      {/* Header Premium */}
      <div
        style={{
          padding: spacing.lg,
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
          borderBottom: `1px solid ${colors.primary[100]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: typography.h3.fontSize,
              fontWeight: 700,
              color: colors.secondary[900],
              margin: 0,
              marginBottom: spacing.xs,
            }}
          >
            💳 Assinaturas & Gastos Recorrentes
          </h3>
          <p
            style={{
              fontSize: typography.small.fontSize,
              color: colors.secondary[600],
              margin: 0,
            }}
          >
            Rastreie suas despesas periódicas
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{
            background: colors.primary[600],
            border: 'none',
            color: 'white',
            padding: `${spacing.md} ${spacing.lg}`,
            borderRadius: borderRadius.lg,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            transition: transitions.normal,
            boxShadow: shadows.sm,
          }}
          onMouseOver={(e) => {
            (e.target as any).style.background = colors.primary[700]
            ;(e.target as any).style.boxShadow = shadows.md
          }}
          onMouseOut={(e) => {
            (e.target as any).style.background = colors.primary[600]
            ;(e.target as any).style.boxShadow = shadows.sm
          }}
        >
          <Plus size={18} />
          {isAdding ? 'Cancelar' : 'Adicionar'}
        </button>
      </div>

      {/* Form Section */}
      {isAdding && (
        <div
          style={{
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.primary[100]}`,
            backgroundColor: colors.primary[50],
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Descrição
              </label>
              <input
                type="text"
                placeholder="Netflix, Spotify, etc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Valor (R$)
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Categoria
              </label>
              <input
                type="text"
                placeholder="Streaming, Saúde, etc"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Frequência
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  background: 'white',
                  cursor: 'pointer',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {Object.entries(FREQUENCIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: spacing.md }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.small.fontSize,
                fontWeight: 600,
                color: colors.secondary[700],
                marginBottom: spacing.xs,
              }}
            >
              Próxima Cobrança
            </label>
            <input
              type="date"
              value={formData.next_charge_date}
              onChange={(e) => setFormData({ ...formData, next_charge_date: e.target.value })}
              style={{
                width: '100%',
                padding: spacing.md,
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.body.fontSize,
                boxSizing: 'border-box',
                transition: transitions.normal,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary[400]
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.primary[200]
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: spacing.md }}>
            <button
              onClick={handleAdd}
              style={{
                background: colors.status.success,
                color: 'white',
                border: 'none',
                padding: `${spacing.md} ${spacing.xl}`,
                borderRadius: borderRadius.lg,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: typography.body.fontSize,
                transition: transitions.normal,
                boxShadow: shadows.sm,
                flex: 1,
              }}
              onMouseOver={(e) => {
                (e.target as any).style.background = colors.status.success + 'dd'
                ;(e.target as any).style.boxShadow = shadows.md
              }}
              onMouseOut={(e) => {
                (e.target as any).style.background = colors.status.success
                ;(e.target as any).style.boxShadow = shadows.sm
              }}
            >
              Salvar
            </button>
            <button
              onClick={() => setIsAdding(false)}
              style={{
                background: colors.secondary[100],
                color: colors.secondary[900],
                border: 'none',
                padding: `${spacing.md} ${spacing.xl}`,
                borderRadius: borderRadius.lg,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: typography.body.fontSize,
                transition: transitions.normal,
                flex: 1,
              }}
              onMouseOver={(e) => {
                (e.target as any).style.background = colors.secondary[200]
              }}
              onMouseOut={(e) => {
                (e.target as any).style.background = colors.secondary[100]
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: spacing.lg }}>
        {isLoading ? (
          <p style={{ textAlign: 'center', color: colors.secondary[500] }}>Carregando...</p>
        ) : expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: `${spacing.lg} 0` }}>
            <p style={{ color: colors.secondary[500], margin: 0, marginBottom: spacing.md, fontSize: '16px' }}>
              Nenhuma assinatura registrada
            </p>
            <p style={{ color: colors.secondary[400], fontSize: typography.small.fontSize, margin: 0 }}>
              Clique em "Adicionar" para começar a rastrear
            </p>
          </div>
        ) : (
          <>
            {/* Expenses List */}
            <div style={{ marginBottom: spacing.lg }}>
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    border: `1px solid ${colors.primary[100]}`,
                    borderRadius: borderRadius.lg,
                    background: colors.background.light,
                    transition: transitions.normal,
                  }}
                  onMouseOver={(e) => {
                    ;(e.currentTarget as any).style.background = colors.primary[50]
                    ;(e.currentTarget as any).style.boxShadow = shadows.sm
                  }}
                  onMouseOut={(e) => {
                    ;(e.currentTarget as any).style.background = colors.background.light
                    ;(e.currentTarget as any).style.boxShadow = 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: typography.body.fontSize,
                        fontWeight: 600,
                        color: colors.secondary[900],
                        margin: 0,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {expense.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: spacing.md,
                        fontSize: typography.small.fontSize,
                        color: colors.secondary[500],
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: colors.primary[600] }}>R$ {expense.amount.toFixed(2)}</span>
                      <span>•</span>
                      <span>{FREQUENCIES[expense.frequency]}</span>
                      <span>•</span>
                      <span
                        style={{
                          background: colors.primary[50],
                          padding: `2px 8px`,
                          borderRadius: borderRadius.md,
                        }}
                      >
                        {expense.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    style={{
                      background: colors.status.error + '15',
                      border: 'none',
                      color: colors.status.error,
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: borderRadius.lg,
                      cursor: 'pointer',
                      transition: transitions.normal,
                      marginLeft: spacing.md,
                    }}
                    onMouseOver={(e) => {
                      ;(e.target as any).style.background = colors.status.error + '25'
                    }}
                    onMouseOut={(e) => {
                      ;(e.target as any).style.background = colors.status.error + '15'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div
              style={{
                padding: spacing.lg,
                background: colors.primary[50],
                borderRadius: borderRadius.lg,
                border: `2px solid ${colors.primary[200]}`,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: typography.small.fontSize,
                  color: colors.secondary[600],
                  margin: 0,
                  marginBottom: spacing.xs,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                }}
              >
                Total Mensal Estimado
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: colors.primary[600],
                  margin: 0,
                }}
              >
                R$ {getTotalMonthly().toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
