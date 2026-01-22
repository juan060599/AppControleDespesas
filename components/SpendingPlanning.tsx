'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, shadows, borderRadius } from '@/lib/designSystem'
import { Target, DollarSign } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

interface BudgetData {
  category: string
  recomendado: number
  gasto: number
}

const RECOMMENDED_PERCENTAGES: Record<string, number> = {
  Alimentação: 0.25,
  Transporte: 0.15,
  Habitação: 0.3,
  Saúde: 0.05,
  Educação: 0.05,
  Lazer: 0.1,
  Outros: 0.1,
}

const COLORS = [
  colors.primary[500],
  colors.status.success,
  colors.status.error,
  colors.primary[400],
  colors.primary[300],
  colors.primary[200],
  colors.primary[100],
]

export default function SpendingPlanning({ transactions }: { transactions: Transaction[] }) {
  const [budgetData, setBudgetData] = useState<BudgetData[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)

  useEffect(() => {
    if (!transactions.length) return

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    setTotalIncome(income)
    setTotalExpense(expenses)

    const categoryExpenses = new Map<string, number>()
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryExpenses.set(t.category, (categoryExpenses.get(t.category) || 0) + t.amount)
      })

    const data: BudgetData[] = []
    Object.entries(RECOMMENDED_PERCENTAGES).forEach(([category, percentage]) => {
      const spent = categoryExpenses.get(category) || 0
      const recommended = income * percentage

      if (spent > 0 || recommended > 0) {
        data.push({
          category,
          recomendado: recommended,
          gasto: spent,
        })
      }
    })

    setBudgetData(data)
  }, [transactions])

  if (!transactions.length) {
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
        Nenhuma transação para analisar
      </div>
    )
  }

  const balance = totalIncome - totalExpense
  const balanceIsPositive = balance >= 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Resumo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing.md,
        }}
      >
        <div
          style={{
            padding: spacing.md,
            backgroundColor: colors.primary[50],
            borderRadius: borderRadius.md,
            border: `1px solid ${colors.primary[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
            <DollarSign size={20} color={colors.status.success} />
            <p style={{ ...typography.label, margin: 0, color: colors.secondary[500] }}>Receita Total</p>
          </div>
          <p style={{ ...typography.h4, margin: 0, color: colors.status.success }}>
            R$ {totalIncome.toFixed(2)}
          </p>
        </div>

        <div
          style={{
            padding: spacing.md,
            backgroundColor: colors.status.error + '10',
            borderRadius: borderRadius.md,
            border: `1px solid ${colors.status.error}30`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
            <DollarSign size={20} color={colors.status.error} />
            <p style={{ ...typography.label, margin: 0, color: colors.secondary[500] }}>Despesa Total</p>
          </div>
          <p style={{ ...typography.h4, margin: 0, color: colors.status.error }}>
            R$ {totalExpense.toFixed(2)}
          </p>
        </div>

        <div
          style={{
            padding: spacing.md,
            backgroundColor: balanceIsPositive ? colors.status.success + '10' : colors.status.error + '10',
            borderRadius: borderRadius.md,
            border: `1px solid ${balanceIsPositive ? colors.status.success : colors.status.error}30`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
            <Target size={20} color={balanceIsPositive ? colors.status.success : colors.status.error} />
            <p style={{ ...typography.label, margin: 0, color: colors.secondary[500] }}>Saldo</p>
          </div>
          <p
            style={{
              ...typography.h4,
              margin: 0,
              color: balanceIsPositive ? colors.status.success : colors.status.error,
            }}
          >
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Gráfico de Orçamento */}
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.background.light,
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.primary[100]}`,
        }}
      >
        <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[900] }}>
          📊 Orçamento vs Gasto por Categoria
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {budgetData.map((item) => {
            const maxValue = Math.max(item.recomendado, item.gasto)
            const recommendedPercent = (item.recomendado / maxValue) * 100
            const spentPercent = (item.gasto / maxValue) * 100
            return (
              <div key={item.category} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ ...typography.label, margin: 0, color: colors.secondary[900] }}>
                    {item.category}
                  </p>
                  <span style={{ ...typography.small, color: colors.secondary[500] }}>
                    R$ {item.gasto.toFixed(2)} / R$ {item.recomendado.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: spacing.xs, height: '30px' }}>
                  <div
                    style={{
                      width: `${recommendedPercent}%`,
                      backgroundColor: colors.primary[300],
                      borderRadius: borderRadius.sm,
                      minWidth: '4px',
                    }}
                    title="Recomendado"
                  />
                  <div
                    style={{
                      width: `${spentPercent}%`,
                      backgroundColor: item.gasto > item.recomendado ? colors.status.error : colors.primary[500],
                      borderRadius: borderRadius.sm,
                      minWidth: '4px',
                    }}
                    title="Gasto Real"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Análise */}
      <div
        style={{
          padding: spacing.md,
          backgroundColor: colors.primary[50],
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.primary[200]}`,
        }}
      >
        <h4 style={{ ...typography.label, margin: `0 0 ${spacing.sm} 0`, color: colors.secondary[900] }}>
          💡 Insights do Seu Orçamento:
        </h4>
        <ul style={{ margin: 0, paddingLeft: spacing.md, color: colors.secondary[500] }}>
          {budgetData.map((item) => {
            const percentageUsed = (item.gasto / item.recomendado) * 100
            const isOverBudget = item.gasto > item.recomendado

            if (item.recomendado === 0) return null

            return (
              <li key={item.category} style={{ marginBottom: spacing.sm }}>
                <strong>{item.category}:</strong> Você gastou R$ {item.gasto.toFixed(2)} de um recomendado R$ {item.recomendado.toFixed(2)} (
                {percentageUsed.toFixed(0)}%)
                {isOverBudget && (
                  <span style={{ color: colors.status.error, marginLeft: spacing.xs }}>
                    🔴 R$ {(item.gasto - item.recomendado).toFixed(2)} acima do limite
                  </span>
                )}
                {!isOverBudget && percentageUsed > 80 && (
                  <span style={{ color: colors.primary[500], marginLeft: spacing.xs }}>
                    🟡 Próximo do limite
                  </span>
                )}
                {!isOverBudget && percentageUsed <= 80 && (
                  <span style={{ color: colors.status.success, marginLeft: spacing.xs }}>
                    ✅ Dentro do orçamento
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
