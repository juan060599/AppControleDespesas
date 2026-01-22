'use client'

import { useEffect, useState } from 'react'
import { Transaction, getCategoryLimits, getCategorySpendingThisMonth, CategoryLimit } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { TrendingDown } from 'lucide-react'
import { useMemo } from 'react'

interface CategoryLimitsTrackerProps {
  userId: string
  transactions: Transaction[]
}

// Insights Component
function CategoryLimitsInsights({
  limits,
  categorySpend,
}: {
  limits: CategoryLimit[]
  categorySpend: { [key: string]: number }
}) {
  const totalLimits = limits.reduce((sum, limit) => sum + limit.limit_amount, 0)
  const totalSpent = limits.reduce((sum, limit) => sum + (categorySpend[limit.category] || 0), 0)
  const overLimitCategories = limits.filter((limit) => (categorySpend[limit.category] || 0) > limit.limit_amount)
  const approachingCategories = limits.filter(
    (limit) => {
      const spent = categorySpend[limit.category] || 0
      const percentage = (spent / limit.limit_amount) * 100
      return percentage >= 80 && percentage < 100
    }
  )

  const insights = []

  // Insight 1: Total gastado vs total de limites
  const totalPercentage = (totalSpent / totalLimits) * 100
  if (totalPercentage > 100) {
    insights.push({
      type: 'error',
      icon: '🚨',
      text: `Você já gastou R$ ${(totalSpent - totalLimits).toFixed(2)} além de todos os seus limites!`,
    })
  } else if (totalPercentage >= 80) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      text: `Você está em ${totalPercentage.toFixed(0)}% de seus limites. Tome cuidado!`,
    })
  } else {
    insights.push({
      type: 'success',
      icon: '✨',
      text: `Ótimo! Você está em ${totalPercentage.toFixed(0)}% dos seus limites.`,
    })
  }

  // Insight 2: Categorias sem limite
  const categoriesWithoutLimit = limits.length > 0 ? [] : []
  if (categoriesWithoutLimit.length > 0) {
    insights.push({
      type: 'info',
      icon: 'ℹ️',
      text: `Defina limites para mais categorias para melhorar seu controle.`,
    })
  }

  // Insight 3: Categorias acima do limite
  if (overLimitCategories.length > 0) {
    insights.push({
      type: 'error',
      icon: '📈',
      text: `${overLimitCategories.length} categoria(s) acima do limite: ${overLimitCategories.map((c) => c.category).join(', ')}`,
    })
  }

  // Insight 4: Categorias aproximando
  if (approachingCategories.length > 0) {
    insights.push({
      type: 'warning',
      icon: '📊',
      text: `${approachingCategories.length} categoria(s) próxima(s) ao limite: ${approachingCategories.map((c) => c.category).join(', ')}`,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      {insights.map((insight, index) => {
        const bgColor =
          insight.type === 'error'
            ? colors.status.error + '15'
            : insight.type === 'warning'
            ? colors.status.warning + '15'
            : insight.type === 'success'
            ? colors.status.success + '15'
            : colors.primary[50]

        const borderColor =
          insight.type === 'error'
            ? colors.status.error
            : insight.type === 'warning'
            ? colors.status.warning
            : insight.type === 'success'
            ? colors.status.success
            : colors.primary[300]

        return (
          <div
            key={index}
            style={{
              padding: spacing.md,
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}30`,
              borderRadius: borderRadius.md,
              display: 'flex',
              gap: spacing.sm,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: '18px' }}>{insight.icon}</span>
            <p
              style={{
                fontSize: typography.small.fontSize,
                color: colors.secondary[700],
                margin: 0,
              }}
            >
              {insight.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default function CategoryLimitsTracker({ userId, transactions }: CategoryLimitsTrackerProps) {
  const [limits, setLimits] = useState<CategoryLimit[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    const loadLimits = async () => {
      try {
        const { data } = await getCategoryLimits(userId)
        setLimits(data || [])
      } catch (error) {
        console.error('Error loading category limits:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLimits()
  }, [userId])

  if (isLoading || limits.length === 0) {
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
        marginBottom: spacing.lg,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: spacing.lg,
          borderBottom: `1px solid ${colors.primary[100]}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            background: colors.primary[100],
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingDown size={24} color={colors.primary[600]} />
        </div>
        <div>
          <h3
            style={{
              fontSize: typography.h3.fontSize,
              fontWeight: 700,
              color: colors.secondary[900],
              margin: 0,
            }}
          >
            📈 Limites vs Gastos por Categoria
          </h3>
          <p
            style={{
              fontSize: typography.small.fontSize,
              color: colors.secondary[500],
              margin: `${spacing.xs} 0 0 0`,
            }}
          >
            Acompanhe seus gastos em relação aos limites definidos neste mês
          </p>
        </div>
      </div>

      {/* Limits List */}
      <div style={{ padding: spacing.lg }}>
        {limits.map((limit, index) => {
          const spent = categorySpend[limit.category] || 0
          const percentage = Math.min((spent / limit.limit_amount) * 100, 100)
          const isOverLimit = spent > limit.limit_amount
          const remaining = limit.limit_amount - spent

          return (
            <div
              key={limit.id}
              style={{
                marginBottom: index < limits.length - 1 ? spacing.md : 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              {/* Category Name */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: typography.small.fontSize,
                    fontWeight: 500,
                    color: colors.secondary[900],
                    margin: 0,
                  }}
                >
                  {limit.category}
                </p>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  flex: 3,
                  height: '6px',
                  backgroundColor: colors.secondary[200],
                  borderRadius: borderRadius.full,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: isOverLimit
                      ? colors.status.error
                      : percentage >= 80
                      ? colors.status.warning
                      : colors.status.success,
                    transition: transitions.normal,
                  }}
                />
              </div>

              {/* Amount and Percentage */}
              <div
                style={{
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                <p
                  style={{
                    fontSize: typography.small.fontSize,
                    fontWeight: 600,
                    color: isOverLimit ? colors.status.error : colors.secondary[900],
                    margin: 0,
                  }}
                >
                  R$ {spent.toFixed(2)} / R$ {limit.limit_amount.toFixed(2)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights Section */}
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.primary[50],
          borderTop: `1px solid ${colors.primary[100]}`,
        }}
      >
        <h4
          style={{
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            color: colors.secondary[900],
            margin: 0,
            marginBottom: spacing.md,
          }}
        >
          💡 Insights do Seu Orçamento:
        </h4>
        <CategoryLimitsInsights limits={limits} categorySpend={categorySpend} />
      </div>
    </div>
  )
}
