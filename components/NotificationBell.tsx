'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { getCategoryLimits, getCategorySpendingThisMonth, getCategorySpendingLastMonth, CategoryLimit } from '@/lib/database'

interface NotificationBellProps {
  userId: string
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const [limitsRes, thisMonthRes, lastMonthRes] = await Promise.all([
          getCategoryLimits(userId),
          getCategorySpendingThisMonth(userId),
          getCategorySpendingLastMonth(userId),
        ])

        const limits = limitsRes.data || []
        const thisMonth = thisMonthRes.data || {}
        const lastMonth = lastMonthRes.data || {}

        const newAlerts: any[] = []

        limits.forEach((limit: CategoryLimit) => {
          const current = thisMonth[limit.category] || 0
          const percentage = (current / limit.limit_amount) * 100
          const lastMonthSpend = lastMonth[limit.category] || 0

          // Alert: Limit exceeded
          if (current > limit.limit_amount) {
            newAlerts.push({
              id: `${limit.id}-exceeded`,
              type: 'limit_exceeded',
              category: limit.category,
              icon: '🚨',
              message: `Limite excedido em ${limit.category}`,
              details: `Gastou R$ ${current.toFixed(2)} de R$ ${limit.limit_amount.toFixed(2)}`,
              severity: 'high',
            })
          }
          // Alert: Approaching limit
          else if (percentage >= 80) {
            newAlerts.push({
              id: `${limit.id}-approaching`,
              type: 'approaching_limit',
              category: limit.category,
              icon: '⚠️',
              message: `Próximo ao limite em ${limit.category}`,
              details: `${percentage.toFixed(0)}% do seu limite`,
              severity: 'medium',
            })
          }

          // Alert: Overspending vs last month
          if (current > lastMonthSpend * 1.2 && lastMonthSpend > 0) {
            newAlerts.push({
              id: `${limit.id}-overspend`,
              type: 'overspending_vs_last_month',
              category: limit.category,
              icon: '📈',
              message: `Gastou mais em ${limit.category}`,
              details: `+${((current / lastMonthSpend - 1) * 100).toFixed(0)}% comparado ao mês anterior`,
              severity: 'low',
            })
          }
        })

        setAlerts(newAlerts)
      } catch (error) {
        console.error('Error loading alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAlerts()
  }, [userId])

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '44px',
          height: '44px',
          background: colors.background.light,
          border: `1px solid ${colors.primary[200]}`,
          borderRadius: borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: transitions.normal,
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.primary[50]
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = colors.background.light
        }}
      >
        <Bell size={20} color={colors.primary[600]} />

        {/* Alert Badge */}
        {alerts.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '24px',
              height: '24px',
              background: colors.status.error,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 700,
              border: `2px solid ${colors.background.light}`,
            }}
          >
            {alerts.length}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '400px',
            maxHeight: '600px',
            overflowY: 'auto',
            backgroundColor: colors.background.light,
            borderRadius: borderRadius.xl,
            boxShadow: shadows.lg,
            border: `1px solid ${colors.primary[100]}`,
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: spacing.lg,
              borderBottom: `1px solid ${colors.primary[100]}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                fontSize: typography.body.fontSize,
                fontWeight: 700,
                color: colors.secondary[900],
                margin: 0,
              }}
            >
              🔔 Notificações
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.secondary[500],
                padding: 0,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Alerts List */}
          <div style={{ padding: spacing.lg }}>
            {alerts.length === 0 ? (
              <p
                style={{
                  fontSize: typography.small.fontSize,
                  color: colors.secondary[500],
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                ✨ Nenhuma notificação no momento!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {alerts.map((alert) => {
                  const bgColor =
                    alert.severity === 'high'
                      ? colors.status.error + '15'
                      : alert.severity === 'medium'
                      ? colors.status.warning + '15'
                      : colors.primary[50]

                  const borderColor =
                    alert.severity === 'high'
                      ? colors.status.error + '30'
                      : alert.severity === 'medium'
                      ? colors.status.warning + '30'
                      : colors.primary[100]

                  return (
                    <div
                      key={alert.id}
                      style={{
                        padding: spacing.md,
                        backgroundColor: bgColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: borderRadius.lg,
                        display: 'flex',
                        gap: spacing.sm,
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{alert.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: typography.small.fontSize,
                            fontWeight: 600,
                            color: colors.secondary[900],
                            margin: 0,
                            marginBottom: spacing.xs,
                          }}
                        >
                          {alert.message}
                        </p>
                        <p
                          style={{
                            fontSize: typography.small.fontSize,
                            color: colors.secondary[600],
                            margin: 0,
                          }}
                        >
                          {alert.details}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
