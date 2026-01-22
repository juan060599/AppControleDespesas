'use client'

import { Transaction, Budget } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius } from '@/lib/designSystem'
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react'
import { useMemo } from 'react'

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export default function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1)
    const prevMonthStr = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`

    // Transações do mês atual e anterior
    const currentMonthTx = transactions.filter((t) => {
      const txMonth = t.date.substring(0, 7)
      return txMonth === currentMonth && t.type === 'expense'
    })

    const previousMonthTx = transactions.filter((t) => {
      const txMonth = t.date.substring(0, 7)
      return txMonth === prevMonthStr && t.type === 'expense'
    })

    // Calcular gastos por categoria
    const calcCategorySpend = (txs: Transaction[]) => {
      const map: { [key: string]: number } = {}
      txs.forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount
      })
      return map
    }

    const currentCategorySpend = calcCategorySpend(currentMonthTx)
    const previousCategorySpend = calcCategorySpend(previousMonthTx)

    // Gerar insights
    const generatedInsights: string[] = []

    // 1. Insight sobre aumento/diminuição em categorias
    Object.entries(currentCategorySpend).forEach(([category, amount]) => {
      const prevAmount = previousCategorySpend[category] || 0
      if (prevAmount > 0) {
        const percentChange = ((amount - prevAmount) / prevAmount) * 100
        if (percentChange > 15) {
          generatedInsights.push(
            `Você gastou ${Math.round(percentChange)}% mais com ${category.toLowerCase()} este mês.`
          )
        } else if (percentChange < -15) {
          generatedInsights.push(
            `Você economizou ${Math.round(Math.abs(percentChange))}% em ${category.toLowerCase()} este mês.`
          )
        }
      }
    })

    // 2. Insight sobre orçamentos estourados
    const currentCategoryTotal: { [key: string]: number } = {}
    currentMonthTx.forEach((t) => {
      currentCategoryTotal[t.category] = (currentCategoryTotal[t.category] || 0) + t.amount
    })

    budgets.forEach((budget) => {
      const spent = currentCategoryTotal[budget.category] || 0
      const percentage = (spent / budget.limit) * 100
      if (percentage > 100) {
        const excess = spent - budget.limit
        generatedInsights.push(
          `Você estourou o orçamento de ${budget.category} em R$ ${excess.toFixed(2)}.`
        )
      }
    })

    // 3. Insight sobre gastos totais
    const totalThisMonth = currentMonthTx.reduce((sum, t) => sum + t.amount, 0)
    const totalLastMonth = previousMonthTx.reduce((sum, t) => sum + t.amount, 0)
    if (totalLastMonth > 0) {
      const percentChange = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
      if (percentChange > 10 && generatedInsights.length < 3) {
        generatedInsights.push(
          `Seus gastos totais aumentaram ${Math.round(percentChange)}% em relação ao mês anterior.`
        )
      }
    }

    // 4. Insight sobre melhor categoria para economizar
    const topCategories = Object.entries(currentCategorySpend)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1)

    if (topCategories.length > 0 && generatedInsights.length < 3) {
      const [category, amount] = topCategories[0]
      generatedInsights.push(
        `Sua maior despesa é ${category.toLowerCase()} (R$ ${amount.toFixed(2)}). Considere revisar este gasto.`
      )
    }

    return generatedInsights.slice(0, 3) // Limitar a 3 insights
  }, [transactions, budgets])

  if (insights.length === 0) {
    return null
  }

  return (
    <div
      style={{
        background: colors.background.light,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        border: `2px solid ${colors.primary[200]}`,
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
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            background: colors.primary[200],
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lightbulb size={24} color={colors.primary[700]} />
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
            💡 Insights Inteligentes
          </h3>
          <p
            style={{
              fontSize: typography.small.fontSize,
              color: colors.secondary[500],
              margin: `${spacing.xs} 0 0 0`,
            }}
          >
            Análise automática dos seus gastos
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div style={{ padding: spacing.lg }}>
        {insights.map((insight, index) => (
          <div
            key={index}
            style={{
              marginBottom: index < insights.length - 1 ? spacing.md : 0,
              padding: spacing.md,
              backgroundColor:
                insight.includes('estourou') || insight.includes('aumentaram')
                  ? colors.status.error + '08'
                  : insight.includes('economizou')
                    ? colors.status.success + '08'
                    : colors.primary[50],
              border: `1px solid ${
                insight.includes('estourou') || insight.includes('aumentaram')
                  ? colors.status.error + '30'
                  : insight.includes('economizou')
                    ? colors.status.success + '30'
                    : colors.primary[200]
              }`,
              borderRadius: borderRadius.lg,
              display: 'flex',
              gap: spacing.md,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                marginTop: '2px',
                flexShrink: 0,
              }}
            >
              {insight.includes('estourou') || insight.includes('aumentaram') ? (
                <AlertCircle size={20} color={colors.status.error} />
              ) : (
                <TrendingUp size={20} color={colors.primary[600]} />
              )}
            </div>
            <p
              style={{
                fontSize: typography.body.fontSize,
                color: colors.secondary[900],
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
