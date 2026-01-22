'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Transaction } from '@/lib/database'
import StatCard from './StatCard'
import { colors, spacing, typography, shadows, borderRadius } from '@/lib/designSystem'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface DashboardProps {
  transactions: Transaction[]
}

export default function Dashboard({ transactions }: DashboardProps) {
  const [incomeExpenseData, setIncomeExpenseData] = useState<any[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    // Calculate totals
    let income = 0
    let expense = 0

    transactions.forEach((t) => {
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
  }, [transactions])

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div style={{ padding: `${spacing.lg} 0` }}>
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
    </div>
  )
}
