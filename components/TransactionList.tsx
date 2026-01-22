'use client'

import { Transaction, deleteTransaction, updateTransaction } from '@/lib/database'
import { useState } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar, Tag, Edit2 } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Transaction>>({})
  const [editLoading, setEditLoading] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      setDeleteLoading(id)
      await deleteTransaction(id)
      setDeleteLoading(null)
      window.location.reload()
    }
  }

  const handleEditClick = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditFormData({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    })
  }

  const handleEditSave = async () => {
    if (!editingId) return
    setEditLoading(true)
    await updateTransaction(editingId, editFormData)
    setEditingId(null)
    setEditFormData({})
    setEditLoading(false)
    window.location.reload()
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

  // Get unique categories from transactions
  const getAvailableCategories = () => {
    const categories = new Set<string>()
    transactions.forEach((t) => {
      if (t.category) categories.add(t.category)
    })
    return Array.from(categories).sort()
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

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(transaction)}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: colors.primary[100],
                      border: `1px solid ${colors.primary[200]}`,
                      borderRadius: borderRadius.lg,
                      color: colors.primary[600],
                      cursor: 'pointer',
                      transition: transitions.normal,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.primary[200]
                      e.currentTarget.style.borderColor = colors.primary[300]
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.primary[100]
                      e.currentTarget.style.borderColor = colors.primary[200]
                    }}
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setEditingId(null)}
        >
          <div
            style={{
              backgroundColor: colors.background.light,
              borderRadius: borderRadius.xl,
              boxShadow: shadows.lg,
              padding: spacing.xl,
              maxWidth: '500px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: typography.h3.fontSize,
                fontWeight: 700,
                color: colors.secondary[900],
                margin: 0,
                marginBottom: spacing.lg,
              }}
            >
              ✏️ Editar Transação
            </h3>

            {/* Description */}
            <div style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[900],
                  marginBottom: spacing.xs,
                }}
              >
                Descrição
              </label>
              <input
                type="text"
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[900],
                  marginBottom: spacing.xs,
                }}
              >
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={editFormData.amount || ''}
                onChange={(e) => setEditFormData({ ...editFormData, amount: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[900],
                  marginBottom: spacing.xs,
                }}
              >
                Categoria
              </label>
              <select
                value={editFormData.category || ''}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  backgroundColor: colors.background.light,
                  color: colors.secondary[900],
                  cursor: 'pointer',
                }}
              >
                <option value="">Selecione uma categoria</option>
                {getAvailableCategories().map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[900],
                  marginBottom: spacing.xs,
                }}
              >
                Data
              </label>
              <input
                type="date"
                value={editFormData.date || ''}
                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.primary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                gap: spacing.md,
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setEditingId(null)}
                disabled={editLoading}
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  border: `1px solid ${colors.primary[200]}`,
                  background: colors.background.light,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.primary[600],
                  cursor: editLoading ? 'not-allowed' : 'pointer',
                  transition: transitions.normal,
                  opacity: editLoading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!editLoading) {
                    e.currentTarget.style.background = colors.primary[50]
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editLoading) {
                    e.currentTarget.style.background = colors.background.light
                  }
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  background: colors.primary[600],
                  border: 'none',
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: 'white',
                  cursor: editLoading ? 'not-allowed' : 'pointer',
                  transition: transitions.normal,
                  opacity: editLoading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!editLoading) {
                    e.currentTarget.style.background = colors.primary[700]
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editLoading) {
                    e.currentTarget.style.background = colors.primary[600]
                  }
                }}
              >
                {editLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}    </div>
  )
}