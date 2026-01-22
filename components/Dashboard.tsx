'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Transaction } from '@/lib/database'
import StatCard from './StatCard'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'

interface DashboardProps {
  transactions: Transaction[]
}

export default function Dashboard({ transactions }: DashboardProps) {
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([])
  const [incomeExpenseData, setIncomeExpenseData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
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

    // Calculate expenses by category
    const categoryMap: { [key: string]: number } = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
      })

    const expenseData = Object.entries(categoryMap).map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    setExpensesByCategory(expenseData)

    // Calculate income vs expense summary
    setIncomeExpenseData([
      { name: 'Receitas', value: income },
      { name: 'Despesas', value: expense },
    ])

    // Calculate monthly data
    const monthlyMap: { [key: string]: { income: number; expense: number } } = {}
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 }
      }
      if (t.type === 'income') {
        monthlyMap[month].income += t.amount
      } else {
        monthlyMap[month].expense += t.amount
      }
    })

    const monthlyArray = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      Receitas: data.income,
      Despesas: data.expense,
    }))
    setMonthlyData(monthlyArray)
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
        {/* Expenses by Category */}
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
              <PieChartIcon size={24} color={colors.primary[600]} />
            </div>
            <h2 style={{
              fontSize: typography.h3.fontSize,
              fontWeight: 700,
              color: colors.secondary[900],
              margin: 0,
            }}>
              Despesas por Categoria
            </h2>
          </div>

          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{
              color: colors.secondary[400],
              textAlign: 'center',
              padding: `${spacing.xl} 0`,
              margin: 0,
            }}>
              Nenhuma despesa registrada
            </p>
          )}
        </div>

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

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <div style={{
          background: colors.background.light,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.md,
          border: `1px solid ${colors.primary[100]}`,
          padding: spacing.xl,
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
              Tendência Mensal
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.secondary[200]} />
              <XAxis dataKey="month" stroke={colors.secondary[500]} />
              <YAxis stroke={colors.secondary[500]} />
              <Tooltip 
                formatter={(value: any) => `R$ ${value.toFixed(2)}`}
                contentStyle={{
                  background: colors.background.light,
                  border: `1px solid ${colors.secondary[200]}`,
                  borderRadius: borderRadius.lg,
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Receitas" 
                stroke={colors.status.success}
                strokeWidth={2}
                dot={{ fill: colors.status.success, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Despesas" 
                stroke={colors.status.error}
                strokeWidth={2}
                dot={{ fill: colors.status.error, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
