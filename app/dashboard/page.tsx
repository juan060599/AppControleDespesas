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

        // Não redirecionar para signin - apenas carregar dados se houver usuário
        if (currentUser) {
          setUser(currentUser)

          const { data: transactionsData } = await getTransactions(currentUser.id)
          if (transactionsData) {
            setTransactions(transactionsData)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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
      paddingBottom: '20px',
      width: '100%',
      overflow: 'hidden',
    }}>
      <DashboardHeader userName={user.user_metadata?.name || user.email || 'Usuário'} onLogout={handleLogout} />

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '12px',
        boxSizing: 'border-box',
      } as React.CSSProperties}>
        <style>{`
          @media (min-width: 480px) {
            main {
              padding: 16px;
            }
          }
          @media (min-width: 768px) {
            main {
              padding: 24px;
            }
          }
        `}</style>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
          alignItems: 'start',
        } as React.CSSProperties}>
          {/* Left Column - Main Dashboard */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          } as React.CSSProperties}>
            {/* Dashboard Section */}
            <section>
              <Dashboard transactions={transactions} userId={user.id} onTransactionAdded={handleTransactionAdded} />
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
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: spacing.sm as any, color: colors.secondary[900], marginTop: spacing.md }}>
                ⚠️ Avisos
              </h2>
              <SpendingAlerts transactions={transactions} />
            </section>

            {/* Spending Suggestions Section */}
            <section>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: spacing.sm as any, color: colors.secondary[900], marginTop: spacing.md }}>
                💡 Sugestões
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
            position: 'static',
          } as React.CSSProperties}>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>
        </div>
      </main>
    </div>
  )
}
