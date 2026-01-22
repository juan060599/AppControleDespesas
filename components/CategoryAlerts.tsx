'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, shadows, borderRadius } from '@/lib/designSystem'
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import {
  getCategoryLimits,
  getCategorySpendingThisMonth,
  getCategorySpendingLastMonth,
} from '@/lib/database'

interface CategoryAlertsProps {
  userId: string
}

interface Alert {
  category: string
  type: 'limit_exceeded' | 'approaching_limit' | 'overspending_vs_last_month'
  currentSpending: number
  limit?: number
  lastMonthSpending?: number
  percentage: number
}

export default function CategoryAlerts({ userId }: CategoryAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [userId])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const [limitsResult, thisMonthResult, lastMonthResult] = await Promise.all([
        getCategoryLimits(userId),
        getCategorySpendingThisMonth(userId),
        getCategorySpendingLastMonth(userId),
      ])

      const limits = limitsResult.data || []
      const thisMonth = (thisMonthResult.data || {}) as Record<string, number>
      const lastMonth = (lastMonthResult.data || {}) as Record<string, number>

      const newAlerts: Alert[] = []

      // Verificar limites excedidos e categorias se aproximando
      limits.forEach((limit: any) => {
        const currentSpending = thisMonth[limit.category] || 0
        const percentage = (currentSpending / limit.limit_amount) * 100

        if (percentage >= 100) {
          newAlerts.push({
            category: limit.category,
            type: 'limit_exceeded',
            currentSpending,
            limit: limit.limit_amount,
            percentage,
          })
        } else if (percentage >= 80) {
          newAlerts.push({
            category: limit.category,
            type: 'approaching_limit',
            currentSpending,
            limit: limit.limit_amount,
            percentage,
          })
        }
      })

      // Verificar gastos maiores que o mês anterior
      Object.entries(thisMonth).forEach(([category, spending]: [string, any]) => {
        const lastMonthSpending = lastMonth[category] || 0
        if (lastMonthSpending > 0 && spending > lastMonthSpending) {
          const percentageIncrease = ((spending - lastMonthSpending) / lastMonthSpending) * 100
          if (percentageIncrease >= 20) {
            // Apenas alertar se aumentou 20% ou mais
            newAlerts.push({
              category,
              type: 'overspending_vs_last_month',
              currentSpending: spending,
              lastMonthSpending,
              percentage: percentageIncrease,
            })
          }
        }
      })

      setAlerts(newAlerts.sort((a, b) => b.percentage - a.percentage))
    } catch (error) {
      console.error('Erro ao carregar alertas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (alerts.length === 0) {
    return (
      <section
        style={{
          padding: spacing.lg,
          backgroundColor: colors.status.success + '15',
          borderRadius: '12px',
          border: `1px solid ${colors.status.success}`,
          textAlign: 'center',
        }}
      >
        <p style={{ ...typography.body, color: colors.status.success, fontWeight: 'bold', margin: 0 }}>
          ✅ Tudo certo! Nenhum alerta no momento.
        </p>
      </section>
    )
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      <h3 style={{ ...typography.h3, margin: 0, color: colors.secondary[900] }}>
        ⚠️ Alertas por Categoria
      </h3>

      {alerts.map((alert, idx) => {
        const isExceeded = alert.type === 'limit_exceeded'
        const isApproaching = alert.type === 'approaching_limit'
        const isOverspending = alert.type === 'overspending_vs_last_month'

        const bgColor = isExceeded ? colors.status.error : isApproaching ? colors.status.warning : colors.primary[100]
        const textColor = isExceeded ? colors.status.error : isApproaching ? colors.status.warning : colors.primary[600]
        const borderColor = textColor

        return (
          <div
            key={idx}
            style={{
              padding: spacing.lg,
              backgroundColor: bgColor + '20',
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              display: 'flex',
              gap: spacing.md,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ color: textColor, marginTop: spacing.xs }}>
              {isExceeded ? <AlertTriangle size={24} /> : isOverspending ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ ...typography.label, margin: `0 0 ${spacing.xs} 0`, color: colors.secondary[900] }}>
                {alert.category}
              </h4>

              {isExceeded && (
                <p style={{ ...typography.small, margin: 0, color: textColor, fontWeight: 'bold' }}>
                  🚨 Limite EXCEDIDO: R$ {alert.currentSpending?.toFixed(2)} de R$ {alert.limit?.toFixed(2)}
                </p>
              )}

              {isApproaching && (
                <p style={{ ...typography.small, margin: 0, color: textColor, fontWeight: 'bold' }}>
                  ⚠️ Aproximando do limite: R$ {alert.currentSpending?.toFixed(2)} de R$ {alert.limit?.toFixed(2)}
                </p>
              )}

              {isOverspending && (
                <p style={{ ...typography.small, margin: 0, color: textColor, fontWeight: 'bold' }}>
                  📈 Gasto {alert.percentage.toFixed(0)}% maior que o mês anterior
                </p>
              )}

              <div
                style={{
                  marginTop: spacing.sm,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: spacing.sm,
                }}
              >
                {isExceeded || isApproaching ? (
                  <>
                    <div>
                      <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>Gasto este mês</p>
                      <p style={{ ...typography.body, margin: `${spacing.xs} 0 0 0`, fontWeight: 'bold', color: colors.secondary[900] }}>
                        R$ {alert.currentSpending?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>Limite</p>
                      <p style={{ ...typography.body, margin: `${spacing.xs} 0 0 0`, fontWeight: 'bold', color: colors.secondary[900] }}>
                        R$ {alert.limit?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>Percentual</p>
                      <p style={{ ...typography.body, margin: `${spacing.xs} 0 0 0`, fontWeight: 'bold', color: textColor }}>
                        {alert.percentage.toFixed(0)}%
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>Este mês</p>
                      <p style={{ ...typography.body, margin: `${spacing.xs} 0 0 0`, fontWeight: 'bold', color: colors.secondary[900] }}>
                        R$ {alert.currentSpending?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>Mês anterior</p>
                      <p style={{ ...typography.body, margin: `${spacing.xs} 0 0 0`, fontWeight: 'bold', color: colors.secondary[900] }}>
                        R$ {alert.lastMonthSpending?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>Aumento</p>
                      <p style={{ ...typography.body, margin: `${spacing.xs} 0 0 0`, fontWeight: 'bold', color: textColor }}>
                        +{alert.percentage.toFixed(0)}%
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Barra de progresso */}
              {(isExceeded || isApproaching) && (
                <div
                  style={{
                    marginTop: spacing.md,
                    height: '8px',
                    backgroundColor: colors.secondary[200],
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: textColor,
                      width: `${Math.min(alert.percentage, 100)}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}
