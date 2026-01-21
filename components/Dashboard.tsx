'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Transaction } from '@/lib/database'

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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Receitas</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            R$ {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Despesas</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            R$ {totalExpense.toFixed(2)}
          </p>
        </div>
        <div className={`bg-white rounded-lg shadow p-6`}>
          <h3 className="text-gray-500 text-sm font-medium">Saldo</h3>
          <p className={`mt-2 text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Despesas por Categoria</h2>
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
            <p className="text-gray-500 text-center py-8">Nenhuma despesa registrada</p>
          )}
        </div>

        {/* Income vs Expense */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Receitas vs Despesas</h2>
          {incomeExpenseData.length > 0 && (incomeExpenseData[0].value > 0 || incomeExpenseData[1].value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sem dados</p>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tendência Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="Receitas" stroke="#10b981" />
              <Line type="monotone" dataKey="Despesas" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
