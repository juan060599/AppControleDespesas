'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Transaction, getPeriodDates } from '@/lib/database'
import StatCard from './StatCard'
import RecurringExpenses from './RecurringExpenses'
import FinancialGoals from './FinancialGoals'
import Insights from './Insights'
import TransactionForm from './TransactionForm'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { TrendingUp, TrendingDown, BarChart3, Plus } from 'lucide-react'

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
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const { startDate, endDate } = getPeriodDates(selectedPeriod)
    const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate)
    setFilteredTransactions(filtered)

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
    setIncomeExpenseData([
      { name: 'Receitas', value: income },
      { name: 'Despesas', value: expense },
    ])
  }, [transactions, selectedPeriod])

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <style>{`
        .dashboard-container {
          width: 100%;
          padding: 12px;
        }
        
        @media (min-width: 480px) {
          .dashboard-container {
            padding: 16px;
          }
        }
        
        @media (min-width: 768px) {
          .dashboard-container {
            padding: 24px;
          }
        }

        /* Quick Transaction Form */
        .quick-transaction-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        @media (min-width: 480px) {
          .quick-transaction-section {
            padding: 20px;
            margin-bottom: 20px;
          }
        }

        @media (min-width: 768px) {
          .quick-transaction-section {
            padding: 24px;
            margin-bottom: 24px;
          }
        }

        .transaction-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (min-width: 480px) {
          .transaction-title {
            font-size: 18px;
            margin-bottom: 16px;
          }
        }

        /* Pricing Banner */
        .pricing-banner {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        @media (min-width: 480px) {
          .pricing-banner {
            padding: 20px;
            margin-bottom: 20px;
            gap: 16px;
          }
        }

        @media (min-width: 768px) {
          .pricing-banner {
            padding: 24px;
            margin-bottom: 24px;
            gap: 20px;
          }
        }

        .pricing-content {
          flex: 1;
        }

        .pricing-title {
          font-size: 16px;
          font-weight: 700;
          color: #92400e;
          margin: 0 0 4px 0;
        }

        @media (min-width: 480px) {
          .pricing-title {
            font-size: 17px;
            margin-bottom: 6px;
          }
        }

        .pricing-description {
          font-size: 13px;
          color: #b45309;
          margin: 0;
        }

        @media (min-width: 480px) {
          .pricing-description {
            font-size: 14px;
          }
        }

        .pricing-button {
          background: white;
          color: #f59e0b;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        @media (min-width: 480px) {
          .pricing-button {
            padding: 10px 20px;
            font-size: 14px;
          }
        }

        .pricing-button:hover {
          background: #fef3c7;
          transform: translateY(-2px);
        }

        /* Period Filter */
        .period-filter {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 20px;
          margin-top: 16px;
        }

        .period-filter button {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 36px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .period-filter button:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .period-filter button.active {
          background: #f0f5ff;
          border: 2px solid #2563eb;
          color: #2563eb;
          font-weight: 600;
        }

        @media (min-width: 480px) {
          .period-filter button {
            padding: 8px 12px;
            font-size: 12px;
          }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        @media (min-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
        }

        /* Chart Section */
        .chart-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e0ebff;
          padding: 16px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .chart-section {
            padding: 20px;
            margin-bottom: 24px;
          }
        }

        .chart-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .chart-icon {
          width: 44px;
          height: 44px;
          background: #e0ebff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        @media (min-width: 768px) {
          .chart-title {
            font-size: 24px;
          }
        }

        .chart-container {
          width: 100%;
          height: 200px;
        }

        @media (min-width: 480px) {
          .chart-container {
            height: 250px;
          }
        }

        @media (min-width: 768px) {
          .chart-container {
            height: 300px;
          }
        }

        /* Tabs */
        .tabs-container {
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        @media (min-width: 768px) {
          .tabs-container {
            margin-bottom: 24px;
          }
        }

        .tab-button {
          padding: 12px 16px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        @media (min-width: 480px) {
          .tab-button {
            padding: 14px 20px;
            font-size: 15px;
          }
        }

        .tab-button.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
          font-weight: 700;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }

        /* Transaction Form Modal */
        .transaction-form-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .transaction-form-modal {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-height: 90vh;
          background: white;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
          z-index: 50;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @media (min-width: 768px) {
          .transaction-form-overlay {
            background: rgba(0, 0, 0, 0.3);
          }

          .transaction-form-modal {
            position: absolute;
            bottom: auto;
            max-height: none;
            width: auto;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s ease;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        .transaction-form-header {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          border-radius: 16px 16px 0 0;
          z-index: 1;
        }

        @media (min-width: 480px) {
          .transaction-form-header {
            padding: 20px;
          }
        }

        .transaction-form-content {
          padding: 16px;
        }

        @media (min-width: 480px) {
          .transaction-form-content {
            padding: 20px;
          }
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          font-size: 24px;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Quick Transaction Form Button */}
        <div className="quick-transaction-section">
          <h3 className="transaction-title">
            <Plus size={20} />
            Nova Transação
          </h3>
          <button
            onClick={() => setShowTransactionForm(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px dashed rgba(255, 255, 255, 0.5)',
              color: 'white',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }}
          >
            + Adicionar Transação
          </button>
        </div>

        {/* Pricing Banner */}
        <div className="pricing-banner">
          <div className="pricing-content">
            <h4 className="pricing-title">💳 Plano Pro Disponível</h4>
            <p className="pricing-description">
              Desbloqueie análises com IA e sugestões de economia
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="pricing-button"
          >
            Ver Planos
          </button>
        </div>
        {/* Period Filter */}
        {activeTab === 'overview' && (
          <div className="period-filter">
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              📅 Período:
            </span>
            {Object.entries(PERIOD_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedPeriod(key as PeriodType)}
                className={`${selectedPeriod === key ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Stats Cards Grid */}
        <div className="stats-grid">
          <StatCard
            title="Receitas"
            value={`R$ ${totalIncome.toFixed(2)}`}
            icon={<TrendingUp size={24} color="#10b981" />}
            backgroundColor="#d1fae520"
            trend={5}
            subtitle="Última semana"
          />
          <StatCard
            title="Despesas"
            value={`R$ ${totalExpense.toFixed(2)}`}
            icon={<TrendingDown size={24} color="#ef4444" />}
            backgroundColor="#fee2e220"
            trend={-3}
            subtitle="Última semana"
          />
          <StatCard
            title="Saldo"
            value={`R$ ${balance.toFixed(2)}`}
            icon={<BarChart3 size={24} color="#2563eb" />}
            backgroundColor="#dbeafe"
            subtitle="Disponível"
            trend={balance > 0 ? 8 : -2}
          />
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <div className="chart-icon">
              <BarChart3 size={20} color="#2563eb" />
            </div>
            <h2 className="chart-title">Receitas vs Despesas</h2>
          </div>

          {incomeExpenseData.length > 0 && (incomeExpenseData[0].value > 0 || incomeExpenseData[1].value > 0) ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    formatter={(value: any) => `R$ ${value.toFixed(2)}`}
                    contentStyle={{
                      background: '#ffffff',
                      border: `1px solid #e5e7eb`,
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{
              color: '#9ca3af',
              textAlign: 'center',
              padding: '32px 0',
              margin: 0,
              fontSize: '14px',
            }}>
              Sem dados
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          >
            📊 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          >
            💡 Insights
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="features-grid">
            <RecurringExpenses userId={userId} />
            <FinancialGoals userId={userId} />
          </div>
        )}

        {activeTab === 'insights' && (
          <Insights userId={userId} allTransactions={transactions} />
        )}

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <>
            <div
              className="transaction-form-overlay"
              onClick={() => setShowTransactionForm(false)}
            />
            <div className="transaction-form-modal">
              <div className="transaction-form-header">
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                  ➕ Adicionar Transação
                </h3>
                <button
                  className="close-button"
                  onClick={() => setShowTransactionForm(false)}
                  title="Fechar"
                >
                  ✕
                </button>
              </div>
              <div className="transaction-form-content">
                <TransactionForm
                  onTransactionAdded={() => {
                    setShowTransactionForm(false)
                    setRefreshTrigger(prev => prev + 1)
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
