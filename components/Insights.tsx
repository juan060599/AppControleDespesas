'use client'

import { useEffect, useState } from 'react'
import { Transaction, getTransactionsByPeriod, getPeriodDates } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, Target } from 'lucide-react'

interface InsightsProps {
  userId: string
  allTransactions: Transaction[]
}

interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

interface CategoryInsight {
  category: string
  amount: number
  count: number
  average: number
  trend: number
}

export default function Insights({ userId, allTransactions }: InsightsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'current-month' | 'last-month' | 'last-3-months' | 'last-6-months' | 'last-year' | 'all-time'>('last-6-months')
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [expensesByCategory, setExpensesByCategory] = useState<CategoryInsight[]>([])
  const [outliers, setOutliers] = useState<Transaction[]>([])
  const [savings, setSavings] = useState<Array<{ category: string; amount: number; savings: number }>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    analyzeData()
  }, [selectedPeriod, allTransactions])

  const analyzeData = () => {
    setIsLoading(true)
    
    // Get period dates
    const { startDate, endDate } = getPeriodDates(selectedPeriod)
    const filtered = allTransactions.filter(t => t.date >= startDate && t.date <= endDate)

    // 1. Calculate monthly data
    const monthlyMap = new Map<string, MonthlyData>()
    filtered.forEach(t => {
      const month = t.date.substring(0, 7) // YYYY-MM
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, income: 0, expense: 0, balance: 0 })
      }
      const data = monthlyMap.get(month)!
      if (t.type === 'income') {
        data.income += t.amount
      } else {
        data.expense += t.amount
      }
      data.balance = data.income - data.expense
    })
    
    const sortedMonthly = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month))
    setMonthlyData(sortedMonthly)

    // 2. Calculate expenses by category
    const expenses = filtered.filter(t => t.type === 'expense')
    const categoryMap = new Map<string, { total: number; count: number; values: number[] }>()
    
    expenses.forEach(t => {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, { total: 0, count: 0, values: [] })
      }
      const data = categoryMap.get(t.category)!
      data.total += t.amount
      data.count += 1
      data.values.push(t.amount)
    })

    // Calculate trends
    const categories = Array.from(categoryMap.entries()).map(([category, data]) => {
      const average = data.total / data.count
      // Simple trend: compare first half with second half
      const midpoint = Math.floor(data.values.length / 2)
      const firstHalf = data.values.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint || 0
      const secondHalf = data.values.slice(midpoint).reduce((a, b) => a + b, 0) / (data.values.length - midpoint) || 0
      const trend = ((secondHalf - firstHalf) / firstHalf) * 100 || 0

      return {
        category,
        amount: data.total,
        count: data.count,
        average,
        trend,
      }
    })

    setExpensesByCategory(categories.sort((a, b) => b.amount - a.amount))

    // 3. Find outliers (transactions significantly above average for their category)
    const outliersList: Transaction[] = []
    categoryMap.forEach((data, category) => {
      const mean = data.total / data.count
      const stdDev = Math.sqrt(
        data.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.count
      )
      
      filtered.forEach(t => {
        if (t.type === 'expense' && t.category === category) {
          if (t.amount > mean + stdDev * 1.5) {
            outliersList.push(t)
          }
        }
      })
    })

    setOutliers(outliersList.sort((a, b) => b.amount - a.amount).slice(0, 10))

    // 4. Calculate savings suggestions
    const savingsSuggestions = categories
      .filter(c => c.average > 100) // Only categories with significant spending
      .map(c => ({
        category: c.category,
        amount: c.amount,
        savings: Math.round(c.amount * 0.2 * 12), // 20% reduction, annualized
      }))
      .sort((a, b) => b.savings - a.savings)

    setSavings(savingsSuggestions)

    setIsLoading(false)
  }

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const calculateAverageExpense = () => {
    const expenses = expensesByCategory.reduce((sum, c) => sum + c.amount, 0)
    return expenses / (monthlyData.length || 1)
  }

  const PERIOD_LABELS: Record<string, string> = {
    'current-month': 'Este Mês',
    'last-month': 'Mês Passado',
    'last-3-months': 'Últimos 3 Meses',
    'last-6-months': 'Últimos 6 Meses',
    'last-year': 'Último Ano',
    'all-time': 'Desde o Início',
  }

  return (
    <div style={{ padding: `${spacing.lg} 0` }}>
      {/* Period Selector */}
      <div style={{
        marginBottom: spacing.xl,
        display: 'flex',
        gap: spacing.md,
        flexWrap: 'wrap',
      }}>
        {Object.entries(PERIOD_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedPeriod(key as any)}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              borderRadius: borderRadius.lg,
              border: selectedPeriod === key ? `2px solid ${colors.primary[600]}` : `1px solid ${colors.secondary[200]}`,
              background: selectedPeriod === key ? colors.primary[50] : 'white',
              color: selectedPeriod === key ? colors.primary[600] : colors.secondary[700],
              fontWeight: selectedPeriod === key ? 600 : 400,
              cursor: 'pointer',
              transition: transitions.normal,
              fontSize: typography.body.fontSize,
            }}
            onMouseOver={(e) => {
              if (selectedPeriod !== key) {
                ;(e.target as any).style.background = colors.secondary[50]
                ;(e.target as any).style.borderColor = colors.secondary[300]
              }
            }}
            onMouseOut={(e) => {
              if (selectedPeriod !== key) {
                ;(e.target as any).style.background = 'white'
                ;(e.target as any).style.borderColor = colors.secondary[200]
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p style={{ textAlign: 'center', color: colors.secondary[500] }}>Analisando dados...</p>
      ) : (
        <>
          {/* Monthly Comparison */}
          {monthlyData.length > 1 && (
            <div
              style={{
                background: colors.background.light,
                borderRadius: borderRadius.xl,
                boxShadow: shadows.md,
                border: `1px solid ${colors.primary[100]}`,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              <h3 style={{
                fontSize: typography.h3.fontSize,
                fontWeight: 700,
                color: colors.secondary[900],
                margin: 0,
                marginBottom: spacing.lg,
              }}>
                📊 Comparação Mês a Mês
              </h3>

              <div style={{
                display: 'grid',
                gap: spacing.md,
              }}>
                {monthlyData.slice(-6).reverse().map((month, idx) => {
                  const prevMonth = monthlyData[monthlyData.length - 2 - idx]
                  const expenseGrowth = prevMonth ? getGrowthPercentage(month.expense, prevMonth.expense) : 0
                  const isIncreased = expenseGrowth > 0

                  return (
                    <div
                      key={month.month}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: spacing.md,
                        background: colors.secondary[50],
                        borderRadius: borderRadius.lg,
                        border: `1px solid ${colors.secondary[100]}`,
                        transition: transitions.normal,
                      }}
                      onMouseOver={(e) => {
                        ;(e.currentTarget as any).style.background = colors.primary[50]
                        ;(e.currentTarget as any).style.boxShadow = shadows.sm
                      }}
                      onMouseOut={(e) => {
                        ;(e.currentTarget as any).style.background = colors.secondary[50]
                        ;(e.currentTarget as any).style.boxShadow = 'none'
                      }}
                    >
                      <div>
                        <p style={{
                          fontSize: typography.body.fontSize,
                          fontWeight: 600,
                          color: colors.secondary[900],
                          margin: 0,
                          marginBottom: spacing.xs,
                        }}>
                          {new Date(month.month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </p>
                        <div style={{
                          display: 'flex',
                          gap: spacing.lg,
                          fontSize: typography.small.fontSize,
                          color: colors.secondary[600],
                        }}>
                          <span>💰 {month.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          <span>💸 {month.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: typography.h4.fontSize,
                          fontWeight: 700,
                          color: month.balance >= 0 ? colors.status.success : colors.status.error,
                          margin: 0,
                          marginBottom: spacing.xs,
                        }}>
                          {month.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        {prevMonth && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                            justifyContent: 'flex-end',
                          }}>
                            {isIncreased ? (
                              <TrendingDown size={16} color={colors.status.error} />
                            ) : (
                              <TrendingUp size={16} color={colors.status.success} />
                            )}
                            <span style={{
                              fontSize: typography.small.fontSize,
                              color: isIncreased ? colors.status.error : colors.status.success,
                              fontWeight: 600,
                            }}>
                              {Math.abs(expenseGrowth).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Category Analysis */}
          {expensesByCategory.length > 0 && (
            <div
              style={{
                background: colors.background.light,
                borderRadius: borderRadius.xl,
                boxShadow: shadows.md,
                border: `1px solid ${colors.secondary[100]}`,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              <h3 style={{
                fontSize: typography.h3.fontSize,
                fontWeight: 700,
                color: colors.secondary[900],
                margin: 0,
                marginBottom: spacing.lg,
              }}>
                📈 Análise por Categoria
              </h3>

              <div style={{
                display: 'grid',
                gap: spacing.md,
              }}>
                {expensesByCategory.map((cat) => {
                  const maxAmount = Math.max(...expensesByCategory.map(c => c.amount))
                  const percentage = (cat.amount / maxAmount) * 100

                  return (
                    <div key={cat.category} style={{ marginBottom: spacing.md }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: spacing.xs,
                      }}>
                        <div>
                          <p style={{
                            fontSize: typography.body.fontSize,
                            fontWeight: 600,
                            color: colors.secondary[900],
                            margin: 0,
                          }}>
                            {cat.category}
                          </p>
                          <p style={{
                            fontSize: typography.small.fontSize,
                            color: colors.secondary[500],
                            margin: 0,
                          }}>
                            {cat.count} transações • Média: {cat.average.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{
                            fontSize: typography.h4.fontSize,
                            fontWeight: 700,
                            color: colors.primary[600],
                            margin: 0,
                          }}>
                            {cat.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                          {cat.trend !== 0 && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: spacing.xs,
                              justifyContent: 'flex-end',
                              marginTop: spacing.xs,
                            }}>
                              {cat.trend > 0 ? (
                                <TrendingDown size={14} color={colors.status.error} />
                              ) : (
                                <TrendingUp size={14} color={colors.status.success} />
                              )}
                              <span style={{
                                fontSize: typography.small.fontSize,
                                color: cat.trend > 0 ? colors.status.error : colors.status.success,
                                fontWeight: 600,
                              }}>
                                {Math.abs(cat.trend).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: colors.secondary[100],
                        borderRadius: borderRadius.full,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: colors.primary[500],
                          borderRadius: borderRadius.full,
                          transition: `width ${transitions.normal}`,
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Outliers / Abnormal Spending */}
          {outliers.length > 0 && (
            <div
              style={{
                background: colors.background.light,
                borderRadius: borderRadius.xl,
                boxShadow: shadows.md,
                border: `2px solid ${colors.status.warning}30`,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}>
                <AlertCircle size={24} color={colors.status.warning} />
                <h3 style={{
                  fontSize: typography.h3.fontSize,
                  fontWeight: 700,
                  color: colors.secondary[900],
                  margin: 0,
                }}>
                  ⚠️ Gastos Fora do Padrão
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gap: spacing.sm,
              }}>
                {outliers.map((outlier) => (
                  <div
                    key={outlier.id}
                    style={{
                      padding: spacing.md,
                      background: colors.status.warning + '10',
                      borderRadius: borderRadius.lg,
                      border: `1px solid ${colors.status.warning}40`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{
                        fontSize: typography.body.fontSize,
                        fontWeight: 600,
                        color: colors.secondary[900],
                        margin: 0,
                        marginBottom: spacing.xs,
                      }}>
                        {outlier.description}
                      </p>
                      <p style={{
                        fontSize: typography.small.fontSize,
                        color: colors.secondary[500],
                        margin: 0,
                      }}>
                        {outlier.category} • {new Date(outlier.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p style={{
                      fontSize: typography.h4.fontSize,
                      fontWeight: 700,
                      color: colors.status.warning,
                      margin: 0,
                    }}>
                      {outlier.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Savings Suggestions */}
          {savings.length > 0 && (
            <div
              style={{
                background: colors.background.light,
                borderRadius: borderRadius.xl,
                boxShadow: shadows.md,
                border: `2px solid ${colors.status.success}30`,
                padding: spacing.lg,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}>
                <Lightbulb size={24} color={colors.status.success} />
                <h3 style={{
                  fontSize: typography.h3.fontSize,
                  fontWeight: 700,
                  color: colors.secondary[900],
                  margin: 0,
                }}>
                  💡 Oportunidades de Economia
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gap: spacing.md,
              }}>
                {savings.map((saving, idx) => (
                  <div
                    key={saving.category}
                    style={{
                      padding: spacing.lg,
                      background: colors.status.success + '10',
                      borderRadius: borderRadius.lg,
                      border: `1px solid ${colors.status.success}40`,
                      transition: transitions.normal,
                    }}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as any).style.boxShadow = shadows.sm
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as any).style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: spacing.md,
                    }}>
                      <div>
                        <p style={{
                          fontSize: typography.h4.fontSize,
                          fontWeight: 700,
                          color: colors.secondary[900],
                          margin: 0,
                          marginBottom: spacing.xs,
                        }}>
                          #{idx + 1} - {saving.category}
                        </p>
                        <p style={{
                          fontSize: typography.body.fontSize,
                          color: colors.secondary[600],
                          margin: 0,
                        }}>
                          Gasto atual: <strong>{saving.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: typography.small.fontSize,
                          color: colors.secondary[500],
                          margin: 0,
                          marginBottom: spacing.xs,
                        }}>
                          Economia anual com
                        </p>
                        <p style={{
                          fontSize: typography.h3.fontSize,
                          fontWeight: 700,
                          color: colors.status.success,
                          margin: 0,
                        }}>
                          20% de redução
                        </p>
                      </div>
                    </div>

                    <div style={{
                      padding: spacing.md,
                      background: 'white',
                      borderRadius: borderRadius.lg,
                      textAlign: 'center',
                      border: `1px solid ${colors.status.success}40`,
                    }}>
                      <p style={{
                        fontSize: typography.small.fontSize,
                        color: colors.secondary[500],
                        margin: 0,
                        marginBottom: spacing.xs,
                      }}>
                        Você economizaria por ano:
                      </p>
                      <p style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: colors.status.success,
                        margin: 0,
                      }}>
                        {saving.savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
