'use client'

import { Transaction, Budget, deleteBudget } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { AlertCircle, TrendingDown, Trash2, Edit2 } from 'lucide-react'
import { useMemo } from 'react'

interface BudgetTrackerProps {
  transactions: Transaction[]
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (budgetId: string) => void
}

export default function BudgetTracker({ transactions, budgets, onEdit, onDelete }: BudgetTrackerProps) {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // Calcular gastos por categoria no mês atual
  const categorySpend = useMemo(() => {
    const map: { [key: string]: number } = {}
    transactions
      .filter((t) => {
        const txMonth = t.date.substring(0, 7)
        return txMonth === currentMonth && t.type === 'expense'
      })
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount
      })
    return map
  }, [transactions])

  const handleDelete = async (budgetId: string) => {
    if (confirm('Tem certeza que deseja deletar este orçamento?')) {
      await deleteBudget(budgetId)
      onDelete(budgetId)
    }
  }

  if (budgets.length === 0) {
    return null
  }

  return (
    <div
      style={{
        background: colors.background.light,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        border: `1px solid ${colors.primary[100]}`,
        overflow: 'hidden',
        marginBottom: 'clamp(12px, 2vw, 24px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'clamp(12px, 2vw, 24px) clamp(12px, 3vw, 32px)',
          borderBottom: `1px solid ${colors.primary[100]}`,
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(12px, 2vw, 16px)',
        }}
      >
        <div
          style={{
            width: 'clamp(36px, 8vw, 44px)',
            height: 'clamp(36px, 8vw, 44px)',
            background: colors.primary[100],
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <TrendingDown size={20} color={colors.primary[600]} />
        </div>
        <div>
          <h3
            style={{
              fontSize: 'clamp(16px, 4vw, 24px)',
              fontWeight: 700,
              color: colors.secondary[900],
              margin: 0,
            }}
          >
            📊 Orçamentos
          </h3>
          <p
            style={{
              fontSize: 'clamp(11px, 1.5vw, 12px)',
              color: colors.secondary[500],
              margin: `clamp(4px, 1vw, 6px) 0 0 0`,
            }}
          >
            Controle seus limites mensais por categoria
          </p>
        </div>
      </div>

      {/* Budgets List */}
      <div style={{ padding: 'clamp(12px, 2vw, 24px)' }}>
        {budgets.map((budget, index) => {
          const spent = categorySpend[budget.category] || 0
          const percentage = Math.min((spent / budget.limit) * 100, 100)
          const isOverBudget = spent > budget.limit
          const remaining = budget.limit - spent

          return (
            <div
              key={budget.id}
              style={{
                marginBottom: index < budgets.length - 1 ? 'clamp(12px, 2vw, 24px)' : 0,
                padding: 'clamp(12px, 2vw, 24px)',
                backgroundColor: isOverBudget ? colors.status.error + '08' : colors.secondary[50],
                border: `1px solid ${
                  isOverBudget ? colors.status.error + '30' : colors.secondary[200]
                }`,
                borderRadius: borderRadius.lg,
                transition: transitions.normal,
              }}
            >
              {/* Category Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'clamp(8px, 1.5vw, 16px)',
                  gap: 'clamp(8px, 2vw, 12px)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      fontWeight: 600,
                      color: colors.secondary[900],
                      margin: 0,
                      marginBottom: 'clamp(4px, 1vw, 6px)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {budget.category}
                  </h4>
                  <p
                    style={{
                      fontSize: 'clamp(11px, 1.5vw, 12px)',
                      color: colors.secondary[500],
                      margin: 0,
                    }}
                  >
                    R$ {spent.toFixed(2)} de R$ {budget.limit.toFixed(2)}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: spacing.sm,
                  }}
                >
                  <button
                    onClick={() => onEdit(budget)}
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      background: colors.primary[500],
                      color: 'white',
                      border: 'none',
                      borderRadius: borderRadius.md,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      fontSize: typography.small.fontSize,
                      transition: transitions.normal,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.primary[600]
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.primary[500]
                    }}
                  >
                    <Edit2 size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      background: colors.status.error + '20',
                      color: colors.status.error,
                      border: `1px solid ${colors.status.error + '50'}`,
                      borderRadius: borderRadius.md,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      fontSize: typography.small.fontSize,
                      transition: transitions.normal,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.status.error + '30'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.status.error + '20'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  marginBottom: spacing.md,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: colors.secondary[200],
                    borderRadius: borderRadius.full,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background:
                        percentage < 50
                          ? colors.status.success
                          : percentage < 80
                            ? colors.status.warning
                            : colors.status.error,
                      transition: `width ${transitions.normal} ease`,
                    }}
                  />
                </div>
              </div>

              {/* Status Text */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  fontSize: typography.small.fontSize,
                }}
              >
                {isOverBudget ? (
                  <>
                    <AlertCircle size={16} color={colors.status.error} />
                    <span style={{ color: colors.status.error, fontWeight: 600 }}>
                      ⚠️ Orçamento estourado em R$ {(spent - budget.limit).toFixed(2)}
                    </span>
                  </>
                ) : remaining < budget.limit * 0.1 ? (
                  <>
                    <AlertCircle size={16} color={colors.status.warning} />
                    <span style={{ color: colors.status.warning, fontWeight: 600 }}>
                      ⚡ Apenas R$ {remaining.toFixed(2)} restante ({Math.round(100 - percentage)}%)
                    </span>
                  </>
                ) : (
                  <span style={{ color: colors.secondary[600] }}>
                    ✓ R$ {remaining.toFixed(2)} disponível ({Math.round(100 - percentage)}%)
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
