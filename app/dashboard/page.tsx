'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getTransactions, signOut } from '@/lib/database'
import Dashboard from '@/components/Dashboard'
import DashboardHeader from '@/components/DashboardHeader'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import BankStatementUpload from '@/components/BankStatementUpload'
import SpendingAlerts from '@/components/SpendingAlerts'
import SpendingSuggestions from '@/components/SpendingSuggestions'
import CategoryLimitsTracker from '@/components/CategoryLimitsTracker'
import { Transaction } from '@/lib/database'
import { colors, spacing } from '@/lib/designSystem'

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
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background.gradient,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `3px solid ${colors.primary[200]}`,
            borderTop: `3px solid ${colors.primary[500]}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}></div>
          <p style={{
            fontSize: '16px',
            color: colors.secondary[600],
            fontWeight: 500,
          }}>
            Carregando seus dados...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background.lighter,
    }}>
      <DashboardHeader userName={user.user_metadata?.name || user.email || 'Usuário'} onLogout={handleLogout} />

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing.xl,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: spacing.xl,
          alignItems: 'start',
        }}>
          {/* Left Column - Main Dashboard */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xl,
          }}>
            {/* Dashboard Section */}
            <section>
              <Dashboard transactions={transactions} />
            </section>

            {/* Bank Statement Upload Section */}
            <section>
              <BankStatementUpload onTransactionsAdded={handleTransactionAdded} />
            </section>

            {/* Category Limits Tracker Section */}
            {user && (
              <section>
                <CategoryLimitsTracker userId={user.id} transactions={transactions} />
              </section>
            )}

            {/* Spending Alerts Section */}
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: spacing.md as any, color: colors.secondary[900] }}>
                ⚠️ Avisos e Alertas
              </h2>
              <SpendingAlerts transactions={transactions} />
            </section>

            {/* Spending Suggestions Section */}
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: spacing.md as any, color: colors.secondary[900] }}>
                💡 Sugestões de Economia
              </h2>
              <SpendingSuggestions transactions={transactions} />
            </section>

            {/* Transactions List Section */}
            <section>
              <TransactionList transactions={transactions} />
            </section>
          </div>

          {/* Right Column - Transaction Form */}
          <div style={{
            position: 'sticky',
            top: `calc(64px + ${spacing.xl})`,
          }}>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>
        </div>
      </main>
    </div>
  )
}
