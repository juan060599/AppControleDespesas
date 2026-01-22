'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Lightbulb, Target, PiggyBank, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

interface Suggestion {
  id: string
  title: string
  description: string
  potentialSavings: number
  icon: React.ReactNode
  priority: 'high' | 'medium' | 'low'
}

export default function SpendingSuggestions({ transactions }: { transactions: Transaction[] }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!transactions.length) {
      setLoading(false)
      return
    }

    const newSuggestions: Suggestion[] = []
    const expenses = transactions.filter((t) => t.type === 'expense')

    // Analisar gastos por categoria
    const categoryExpenses = new Map<string, number>()
    expenses.forEach((t) => {
      categoryExpenses.set(t.category, (categoryExpenses.get(t.category) || 0) + t.amount)
    })

    const totalExpense = Array.from(categoryExpenses.values()).reduce((a, b) => a + b, 0)

    // 1. Sugestão para Alimentação
    const alimentacao = categoryExpenses.get('Alimentação') || 0
    if (alimentacao > totalExpense * 0.25) {
      const potentialSavings = alimentacao * 0.1
      newSuggestions.push({
        id: 'food-reduction',
        title: '🍔 Reduzir Gastos com Alimentação',
        description: `Você gasta ${((alimentacao / totalExpense) * 100).toFixed(0)}% com alimentação. Tente preparar 2-3 refeições em casa por semana.`,
        potentialSavings,
        icon: <TrendingDown size={24} color={colors.primary[500]} />,
        priority: 'high',
      })
    }

    // 2. Sugestão para Lazer
    const lazer = categoryExpenses.get('Lazer') || 0
    if (lazer > totalExpense * 0.15) {
      const potentialSavings = lazer * 0.15
      newSuggestions.push({
        id: 'entertainment-reduction',
        title: '🎬 Otimizar Gastos com Lazer',
        description: `Você gasta R$ ${lazer.toFixed(2)} em Lazer. Considere subscrições compartilhadas e atividades gratuitas.`,
        potentialSavings,
        icon: <Target size={24} color={colors.primary[500]} />,
        priority: 'medium',
      })
    }

    // 3. Sugestão para Transporte
    const transporte = categoryExpenses.get('Transporte') || 0
    if (transporte > 100) {
      const potentialSavings = transporte * 0.1
      newSuggestions.push({
        id: 'transport-optimization',
        title: '🚗 Otimizar Gastos com Transporte',
        description: `Você gasta R$ ${transporte.toFixed(2)} em Transporte. Considere carpooling, bicicleta ou transporte público em dias alternados.`,
        potentialSavings,
        icon: <TrendingDown size={24} color={colors.primary[500]} />,
        priority: 'medium',
      })
    }

    // 4. Sugestão geral - criar fundo de emergência
    const monthlyAverage = totalExpense / 30
    newSuggestions.push({
      id: 'emergency-fund',
      title: '🏦 Criar Fundo de Emergência',
      description: `Reserve 10-15% da sua renda (média ${monthlyAverage.toFixed(2)}/dia) em uma conta separada para imprevistos.`,
      potentialSavings: monthlyAverage * 0.12 * 30,
      icon: <PiggyBank size={24} color={colors.status.success} />,
      priority: 'high',
    })

    // 5. Sugestão - orçamento por categoria
    newSuggestions.push({
      id: 'budget-planning',
      title: '📊 Definir Orçamento por Categoria',
      description: `Crie limites para cada categoria. Recomendado: Alimentação 25%, Transporte 15%, Habitação 30%, Outros 30%.`,
      potentialSavings: totalExpense * 0.1,
      icon: <Lightbulb size={24} color={colors.primary[500]} />,
      priority: 'high',
    })

    setSuggestions(newSuggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }))
    setLoading(false)
  }, [transactions])

  const priorityColor = {
    high: colors.status.error,
    medium: colors.primary[500],
    low: colors.primary[400],
  }

  const priorityBg = {
    high: colors.status.error + '10',
    medium: colors.primary[50],
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
        Gerando sugestões...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          style={{
            padding: spacing.md,
            backgroundColor: priorityBg[suggestion.priority],
            border: `1px solid ${priorityColor[suggestion.priority]}30`,
            borderRadius: borderRadius.md,
            display: 'flex',
            gap: spacing.md,
            alignItems: 'flex-start',
            transition: transitions.default,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = shadows.sm
            el.style.backgroundColor = priorityBg[suggestion.priority]
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }}
        >
          <div style={{ flexShrink: 0 }}>{suggestion.icon}</div>
          <div style={{ flex: 1 }}>
            <h4 style={{ ...typography.label, margin: `0 0 ${spacing.xs} 0`, color: colors.secondary[900] }}>
              {suggestion.title}
            </h4>
            <p style={{ ...typography.small, margin: 0, color: colors.secondary[500] }}>
              {suggestion.description}
            </p>
            <div
              style={{
                marginTop: spacing.xs,
                padding: `${spacing.xs} ${spacing.sm}`,
                backgroundColor: colors.status.success + '20',
                borderRadius: borderRadius.sm,
                display: 'inline-block',
              }}
            >
              <p style={{ ...typography.small, margin: 0, color: colors.status.success, fontWeight: 'bold' }}>
                💰 Potencial de economia: R$ {suggestion.potentialSavings.toFixed(2)}/mês
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
