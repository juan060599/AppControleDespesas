'use client'

import { Transaction, deleteTransaction } from '@/lib/database'
import { useState } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar, Tag } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      setDeleteLoading(id)
      await deleteTransaction(id)
      setDeleteLoading(null)
      window.location.reload()
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  return (
    <div style={{
      background: colors.background.light,
      borderRadius: borderRadius.xl,
      boxShadow: shadows.md,
      border: `1px solid ${colors.primary[100]}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: `${spacing.lg} ${spacing.xl}`,
        borderBottom: `1px solid ${colors.primary[100]}`,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
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
          <Calendar size={24} color={colors.primary[600]} />
        </div>
        <h2 style={{
          fontSize: typography.h3.fontSize,
          fontWeight: 700,
          color: colors.secondary[900],
          margin: 0,
        }}>
          Transações Recentes
        </h2>
      </div>

      {/* List */}
      <div>
        {transactions.length === 0 ? (
          <div style={{
            padding: spacing.xxl,
            textAlign: 'center',
            color: colors.secondary[400],
          }}>
            <p style={{
              fontSize: typography.body.fontSize,
              margin: 0,
            }}>
              Nenhuma transação registrada
            </p>
          </div>
        ) : (
          <div>
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: spacing.lg,
                  borderBottom: index < transactions.length - 1 ? `1px solid ${colors.secondary[100]}` : 'none',
                  transition: transitions.normal,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.secondary[50]
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.background.light
                }}
              >
                {/* Left Side - Icon and Details */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.lg,
                  flex: 1,
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: transaction.type === 'income' ? colors.status.success + '20' : colors.status.error + '20',
                    borderRadius: borderRadius.lg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={24} color={colors.status.success} />
                    ) : (
                      <ArrowDownLeft size={24} color={colors.status.error} />
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.secondary[900],
                      margin: 0,
                      marginBottom: spacing.xs,
                    }}>
                      {transaction.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: spacing.md,
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: typography.small.fontSize,
                        color: colors.secondary[500],
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                      }}>
                        <Tag size={14} />
                        {transaction.category}
                      </span>
                      <span style={{
                        fontSize: typography.small.fontSize,
                        color: colors.secondary[500],
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                      }}>
                        <Calendar size={14} />
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Amount and Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.lg,
                  marginLeft: spacing.lg,
                }}>
                  {/* Amount */}
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <p style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: transaction.type === 'income' ? colors.status.success : colors.status.error,
                      margin: 0,
                    }}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deleteLoading === transaction.id}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: colors.status.error + '15',
                      border: `1px solid ${colors.status.error}20`,
                      borderRadius: borderRadius.lg,
                      color: colors.status.error,
                      cursor: deleteLoading === transaction.id ? 'not-allowed' : 'pointer',
                      transition: transitions.normal,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      opacity: deleteLoading === transaction.id ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (deleteLoading !== transaction.id) {
                        e.currentTarget.style.background = colors.status.error + '25'
                        e.currentTarget.style.borderColor = colors.status.error + '40'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deleteLoading !== transaction.id) {
                        e.currentTarget.style.background = colors.status.error + '15'
                        e.currentTarget.style.borderColor = colors.status.error + '20'
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
