'use client'

import { useState, useEffect } from 'react'
import { addTransaction, getCurrentUser } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

const EXPENSE_CATEGORIES = ['Alimentação', 'Transporte', 'Habitação', 'Saúde', 'Educação', 'Lazer', 'Outros']
const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Investimentos', 'Outros']

interface TransactionFormProps {
  onTransactionAdded?: () => void
}

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser()
      if (user) {
        setUserId(user.id)
      }
    }
    loadUser()
  }, [])

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!description || !amount || !userId) {
      setError('Preencha todos os campos')
      console.error('[TransactionForm] Campos obrigatórios:', { description, amount, userId })
      return
    }

    setLoading(true)
    console.log('[TransactionForm] Adicionando transação:', { userId, description, amount, type, category })

    const { error: addError } = await addTransaction({
      user_id: userId,
      description,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Receita' : category,
      date,
    })

    if (addError) {
      console.error('[TransactionForm] Erro ao adicionar:', addError)
      setError(addError.message)
    } else {
      console.log('[TransactionForm] Transação adicionada com sucesso')
      setDescription('')
      setAmount('')
      setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0])
      setDate(new Date().toISOString().split('T')[0])
      onTransactionAdded?.()
    }

    setLoading(false)
  }

  return (
    <div style={{
      background: colors.background.light,
      borderRadius: borderRadius.xl,
      boxShadow: shadows.md,
      border: `1px solid ${colors.primary[100]}`,
      padding: `${spacing.lg} ${spacing.md}`,
      height: 'fit-content',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: colors.primary[100],
          borderRadius: borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Plus size={20} color={colors.primary[600]} />
        </div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: colors.secondary[900],
          margin: 0,
        }}>
          Adicionar Transação
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Type Selection */}
        <div style={{ marginBottom: spacing.md }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.sm,
          }}>
            {/* Despesa Button */}
            <button
              type="button"
              onClick={() => {
                setType('expense')
                setCategory(EXPENSE_CATEGORIES[0])
              }}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: type === 'expense' ? colors.status.error + '20' : colors.secondary[100],
                border: type === 'expense' ? `2px solid ${colors.status.error}` : `1px solid ${colors.secondary[200]}`,
                borderRadius: borderRadius.lg,
                color: type === 'expense' ? colors.status.error : colors.secondary[600],
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: transitions.normal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
              }}
              onMouseEnter={(e) => {
                if (type !== 'expense') {
                  e.currentTarget.style.background = colors.secondary[200]
                }
              }}
              onMouseLeave={(e) => {
                if (type !== 'expense') {
                  e.currentTarget.style.background = colors.secondary[100]
                }
              }}
            >
              <ArrowDownLeft size={16} />
              Despesa
            </button>

            {/* Receita Button */}
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategory(INCOME_CATEGORIES[0])
              }}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: type === 'income' ? colors.status.success + '20' : colors.secondary[100],
                border: type === 'income' ? `2px solid ${colors.status.success}` : `1px solid ${colors.secondary[200]}`,
                borderRadius: borderRadius.lg,
                color: type === 'income' ? colors.status.success : colors.secondary[600],
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: transitions.normal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
              }}
              onMouseEnter={(e) => {
                if (type !== 'income') {
                  e.currentTarget.style.background = colors.secondary[200]
                }
              }}
              onMouseLeave={(e) => {
                if (type !== 'income') {
                  e.currentTarget.style.background = colors.secondary[100]
                }
              }}
            >
              <ArrowUpRight size={16} />
              Receita
            </button>
          </div>
        </div>

        {/* Description Input */}
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: colors.secondary[900],
            marginBottom: spacing.xs,
          }}>
            Descrição
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'expense' ? 'Ex: Café' : 'Ex: Salário'}
              style={{
                width: '100%',
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: '14px',
                border: `1px solid ${colors.secondary[200]}`,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.background.light,
                fontFamily: 'inherit',
                transition: transitions.normal,
                boxSizing: 'border-box',
              } as React.CSSProperties}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary[500]
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.secondary[200]
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        {/* Amount Input */}
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: colors.secondary[900],
            marginBottom: spacing.xs,
          }}>
            Valor (R$)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: '14px',
              border: `1px solid ${colors.secondary[200]}`,
              borderRadius: borderRadius.lg,
              backgroundColor: colors.background.light,
              fontFamily: 'inherit',
              transition: transitions.normal,
              boxSizing: 'border-box',
            } as React.CSSProperties}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary[500]
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.secondary[200]
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Category Select */}
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: colors.secondary[900],
            marginBottom: spacing.xs,
          }}>
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: '14px',
              border: `1px solid ${colors.secondary[200]}`,
              borderRadius: borderRadius.lg,
              backgroundColor: colors.background.light,
              color: colors.secondary[900],
              fontFamily: 'inherit',
              transition: transitions.normal,
              cursor: 'pointer',
              boxSizing: 'border-box',
            } as React.CSSProperties}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary[500]
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.secondary[200]
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: colors.secondary[900],
            marginBottom: spacing.sm,
          }}>
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: `${spacing.md} ${spacing.md}`,
              fontSize: typography.body.fontSize,
              border: `1px solid ${colors.secondary[200]}`,
              borderRadius: borderRadius.lg,
              backgroundColor: colors.background.light,
              color: colors.secondary[900],
              fontFamily: 'inherit',
              transition: transitions.normal,
              cursor: 'pointer',
              boxSizing: 'border-box',
            } as React.CSSProperties}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary[500]
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.secondary[200]
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: colors.status.error + '15',
            border: `1px solid ${colors.status.error}`,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.lg,
            color: colors.status.error,
            fontSize: typography.small.fontSize,
            fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            background: loading
              ? colors.secondary[300]
              : `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
            color: colors.background.light,
            border: 'none',
            borderRadius: borderRadius.lg,
            fontSize: typography.label.fontSize,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: transitions.normal,
            boxShadow: loading ? 'none' : shadows.blue,
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = shadows.lg
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = shadows.blue
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          {loading ? 'Adicionando...' : 'Adicionar Transação'}
        </button>
      </form>
    </div>
  )
}
