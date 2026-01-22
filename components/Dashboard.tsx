'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Transaction, getPeriodDates } from '@/lib/database'
import StatCard from './StatCard'
import RecurringExpenses from './RecurringExpenses'
import FinancialGoals from './FinancialGoals'
import Insights from './Insights'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface DashboardProps {
  transactions: Transaction[]
  userId: string
}

type TabType = 'overview' | 'insights'
type PeriodType = 'current-month' | 'last-month' | 'last-3-months' | 'last-6-months' | 'last-year' | 'all-time'

const PERIOD_LABELS: Record<PeriodType, string> = {
  'current-month': 'Este Mês',
  'last-month': 'Mês Passado',
  'last-3-months': 'Últimos 3 Meses',
  'last-6-months': 'Últimos 6 Meses',
  'last-year': 'Último Ano',
  'all-time': 'Desde o Início',
}

export default function Dashboard({ transactions, userId }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('current-month')
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [incomeExpenseData, setIncomeExpenseData] = useState<any[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    // Get period dates
    const { startDate, endDate } = getPeriodDates(selectedPeriod)
    
    // Filter transactions by period
    const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate)
    setFilteredTransactions(filtered)

    // Calculate totals
    let income = 0
    let expense = 0

    filtered.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount
      } else {
        expense += t.amount
      }
    })

    setTotalIncome(income)
    setTotalExpense(expense)
    setBalance(income - expense)

    // Calculate income vs expense summary
    setIncomeExpenseData([
      { name: 'Receitas', value: income },
      { name: 'Despesas', value: expense },
    ])
  }, [transactions, selectedPeriod])

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div style={{ padding: `${spacing.lg} 0` }}>
      {/* Period Filter - Only visible in Overview tab */}
      {activeTab === 'overview' && (
        <div style={{
          marginBottom: spacing.xl,
          display: 'flex',
          gap: spacing.md,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            color: colors.secondary[700],
          }}>
            📅 Período:
          </span>
          {Object.entries(PERIOD_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedPeriod(key as PeriodType)}
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
      )}

      {/* Stats Cards Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: spacing.lg,
        marginBottom: spacing.xxl,
      }}>
        <StatCard
          title="Receitas"
          value={`R$ ${totalIncome.toFixed(2)}`}
          icon={<TrendingUp size={24} color={colors.status.success} />}
          backgroundColor={colors.status.success + '20'}
          trend={5}
          subtitle="Última semana"
        />
        <StatCard
          title="Despesas"
          value={`R$ ${totalExpense.toFixed(2)}`}
          icon={<TrendingDown size={24} color={colors.status.error} />}
          backgroundColor={colors.status.error + '20'}
          trend={-3}
          subtitle="Última semana"
        />
        <StatCard
          title="Saldo"
          value={`R$ ${balance.toFixed(2)}`}
          icon={<BarChart3 size={24} color={colors.primary[600]} />}
          backgroundColor={colors.primary[100]}
          subtitle="Disponível"
          trend={balance > 0 ? 8 : -2}
        />
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: spacing.lg,
        marginBottom: spacing.xxl,
      }}>
        {/* Income vs Expense */}
        <div style={{
          ...{
            background: colors.background.light,
            borderRadius: borderRadius.xl,
            boxShadow: shadows.md,
            border: `1px solid ${colors.primary[100]}`,
            padding: spacing.xl,
          } as React.CSSProperties
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            marginBottom: spacing.lg,
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: colors.primary[100],
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BarChart3 size={24} color={colors.primary[600]} />
            </div>
            <h2 style={{
              fontSize: typography.h3.fontSize,
              fontWeight: 700,
              color: colors.secondary[900],
              margin: 0,
            }}>
              Receitas vs Despesas
            </h2>
          </div>

          {incomeExpenseData.length > 0 && (incomeExpenseData[0].value > 0 || incomeExpenseData[1].value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.secondary[200]} />
                <XAxis dataKey="name" stroke={colors.secondary[500]} />
                <YAxis stroke={colors.secondary[500]} />
                <Tooltip 
                  formatter={(value: any) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{
                    background: colors.background.light,
                    border: `1px solid ${colors.secondary[200]}`,
                    borderRadius: borderRadius.lg,
                  }}
                />
                <Bar dataKey="value" fill={colors.primary[500]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{
              color: colors.secondary[400],
              textAlign: 'center',
              padding: `${spacing.xl} 0`,
              margin: 0,
            }}>
              Sem dados
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: `2px solid ${colors.secondary[200]}`,
        display: 'flex',
        gap: spacing.lg,
        marginBottom: spacing.xl,
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            background: 'none',
            border: 'none',
            fontSize: typography.h4.fontSize,
            fontWeight: activeTab === 'overview' ? 700 : 500,
            color: activeTab === 'overview' ? colors.primary[600] : colors.secondary[500],
            cursor: 'pointer',
            borderBottom: activeTab === 'overview' ? `3px solid ${colors.primary[600]}` : 'none',
            marginBottom: '-2px',
            transition: `all ${transitions.normal}`,
          }}
        >
          📊 Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            background: 'none',
            border: 'none',
            fontSize: typography.h4.fontSize,
            fontWeight: activeTab === 'insights' ? 700 : 500,
            color: activeTab === 'insights' ? colors.primary[600] : colors.secondary[500],
            cursor: 'pointer',
            borderBottom: activeTab === 'insights' ? `3px solid ${colors.primary[600]}` : 'none',
            marginBottom: '-2px',
            transition: `all ${transitions.normal}`,
          }}
        >
          💡 Insights
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <>
          {/* Features Section: Recurring Expenses & Financial Goals */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: spacing.lg,
            marginBottom: spacing.xxl,
          }}>
            <RecurringExpenses userId={userId} />
            <FinancialGoals userId={userId} />
          </div>
        </>
      )}

      {activeTab === 'insights' && (
        <Insights userId={userId} allTransactions={transactions} />
      )}
    </div>
  )
}
