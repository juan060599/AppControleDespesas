'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getTransactions, signOut } from '@/lib/database'
import Dashboard from '@/components/Dashboard'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import { Transaction } from '@/lib/database'
import { LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push('/signin')
          return
        }

        setUser(currentUser)

        const { data: transactionsData } = await getTransactions(currentUser.id)
        if (transactionsData) {
          setTransactions(transactionsData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push('/signin')
  }

  const handleTransactionAdded = async () => {
    if (user) {
      const { data: transactionsData } = await getTransactions(user.id)
      if (transactionsData) {
        setTransactions(transactionsData)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Controle de Despesas</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">Bem-vindo, {user.email}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Dashboard Section */}
          <section>
            <Dashboard transactions={transactions} />
          </section>

          {/* Transaction Form */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TransactionForm userId={user.id} onSuccess={handleTransactionAdded} />

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Informações Úteis</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">Total de Transações</p>
                    <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Receitas</p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {transactions
                        .filter((t) => t.type === 'income')
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Despesas</p>
                    <p className="text-xl font-bold text-red-600">
                      R$ {transactions
                        .filter((t) => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transaction List */}
          <section>
            <TransactionList transactions={transactions} />
          </section>
        </div>
      </main>
    </div>
  )
}
