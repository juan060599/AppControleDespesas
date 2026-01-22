'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { AlertCircle, TrendingUp, DollarSign, Target } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

interface Alert {
  id: string
  type: 'duplicate' | 'high_spend' | 'unusual' | 'category_overage'
  title: string
  description: string
  amount?: number
  severity: 'low' | 'medium' | 'high'
  transactions?: string[]
}

export default function SpendingAlerts({ transactions }: { transactions: Transaction[] }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!transactions.length) {
      setLoading(false)
      return
    }

    const detectedAlerts: Alert[] = []
    const expenses = transactions.filter((t) => t.type === 'expense')

    // 1. Detectar despesas duplicadas (mesma valor, mesma categoria em dias próximos)
    const categoryDayMap = new Map<string, Transaction[]>()
    expenses.forEach((t) => {
      const key = `${t.category}-${t.amount.toFixed(2)}`
      if (!categoryDayMap.has(key)) {
        categoryDayMap.set(key, [])
      }
      categoryDayMap.get(key)!.push(t)
    })

    categoryDayMap.forEach((txs, key) => {
      if (txs.length > 1) {
        const [category, amount] = key.split('-')
        const dates = txs.map((t) => new Date(t.date).getTime())
        const dayDiffs = []
        for (let i = 1; i < dates.length; i++) {
          dayDiffs.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24))
        }
        const hasClose = dayDiffs.some((d) => d <= 3 && d > 0)
        if (hasClose) {
          detectedAlerts.push({
            id: `duplicate-${key}`,
            type: 'duplicate',
            title: `⚠️ Possível Despesa Duplicada`,
            description: `${txs.length} transações de ${category} com ${amount} em dias próximos`,
            amount: parseFloat(amount) * txs.length,
            severity: 'high',
            transactions: txs.map((t) => t.id),
          })
        }
      }
    })

    // 2. Detectar gastos anormalmente altos em uma categoria
    const categoryTotals = new Map<string, number[]>()
    expenses.forEach((t) => {
      if (!categoryTotals.has(t.category)) {
        categoryTotals.set(t.category, [])
      }
      categoryTotals.get(t.category)!.push(t.amount)
    })

    categoryTotals.forEach((amounts, category) => {
      if (amounts.length >= 2) {
        const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
        const max = Math.max(...amounts)
        if (max > avg * 2) {
          detectedAlerts.push({
            id: `high-${category}`,
            type: 'high_spend',
            title: `💸 Gasto Elevado em ${category}`,
            description: `R$ ${max.toFixed(2)} é ${((max / avg - 1) * 100).toFixed(0)}% acima da sua média de R$ ${avg.toFixed(2)}`,
            amount: max,
            severity: 'medium',
          })
        }
      }
    })

    // 3. Sugestões de economia por padrão
    const categoryExpenses = new Map<string, number>()
    expenses.forEach((t) => {
      categoryExpenses.set(t.category, (categoryExpenses.get(t.category) || 0) + t.amount)
    })

    const totalExpense = Array.from(categoryExpenses.values()).reduce((a, b) => a + b, 0)
    categoryExpenses.forEach((amount, category) => {
      const percentage = (amount / totalExpense) * 100
      if (percentage > 30 && category !== 'Salário') {
        detectedAlerts.push({
          id: `overage-${category}`,
          type: 'category_overage',
          title: `📊 ${category} acima do esperado`,
          description: `${percentage.toFixed(0)}% dos seus gastos em ${category}. Média esperada é 20%`,
          amount,
          severity: 'low',
        })
      }
    })

    setAlerts(detectedAlerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    }))
    setLoading(false)
  }, [transactions])

  const severityColor = {
    high: colors.status.error,
    medium: colors.primary[500],
    low: colors.primary[400],
  }

  const severityBg = {
    high: colors.status.error + '15',
    medium: colors.primary[100],
    low: colors.primary[50],
  }

  if (loading) {
    return (
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.background.light,
          borderRadius: borderRadius.lg,
          textAlign: 'center',
          color: colors.secondary[500],
        }}
      >
        Carregando alertas...
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.status.success + '15',
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.status.success}`,
          textAlign: 'center',
        }}
      >
        <p style={{ color: colors.status.success, fontWeight: 'bold', margin: 0 }}>
          ✅ Nenhum alerta! Seus gastos estão dentro do esperado.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            padding: spacing.md,
            backgroundColor: severityBg[alert.severity],
            border: `2px solid ${severityColor[alert.severity]}`,
            borderRadius: borderRadius.md,
            display: 'flex',
            gap: spacing.md,
            alignItems: 'flex-start',
            transition: transitions.normal,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = shadows.md
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }}
        >
          <AlertCircle size={24} color={severityColor[alert.severity]} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ ...typography.label, margin: `0 0 ${spacing.xs} 0`, color: severityColor[alert.severity] }}>
              {alert.title}
            </h4>
            <p style={{ ...typography.small, margin: 0, color: colors.secondary[500] }}>
              {alert.description}
            </p>
            {alert.amount && (
              <p style={{ ...typography.label, margin: `${spacing.xs} 0 0 0`, color: colors.secondary[900] }}>
                Impacto: R$ {alert.amount.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
