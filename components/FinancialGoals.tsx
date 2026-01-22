'use client'

import { useEffect, useState } from 'react'
import { getFinancialGoals, addFinancialGoal, deleteFinancialGoal, updateFinancialGoal, FinancialGoal } from '@/lib/database'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Plus, Trash2 } from 'lucide-react'

interface FinancialGoalsProps {
  userId: string
}

const GOAL_TYPES = {
  vacation: '✈️ Férias',
  emergency_fund: '🚨 Fundo de Emergência',
  debt_payoff: '💳 Pagar Dívida',
  investment: '📈 Investimento',
  purchase: '🛍️ Compra',
  other: '📌 Outro',
}

const GOAL_ICONS = {
  vacation: '✈️',
  emergency_fund: '🚨',
  debt_payoff: '💳',
  investment: '📈',
  purchase: '🛍️',
  other: '📌',
}

const GOAL_COLORS: Record<string, string> = {
  vacation: colors.status.success,
  emergency_fund: colors.status.warning,
  debt_payoff: colors.status.error,
  investment: colors.primary[500],
  purchase: colors.secondary[500],
  other: colors.secondary[400],
}

export default function FinancialGoals({ userId }: FinancialGoalsProps) {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    goal_type: 'investment' as const,
    target_date: '',
  })

  useEffect(() => {
    loadGoals()
  }, [userId])

  const loadGoals = async () => {
    try {
      const { data } = await getFinancialGoals(userId)
      setGoals(data || [])
    } catch (error) {
      console.error('Error loading financial goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.target_amount || !formData.target_date) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      await addFinancialGoal({
        user_id: userId,
        name: formData.name,
        description: formData.description || undefined,
        target_amount: parseFloat(formData.target_amount),
        current_amount: 0,
        goal_type: formData.goal_type,
        target_date: formData.target_date,
        icon: GOAL_ICONS[formData.goal_type] || '📌',
        color: GOAL_COLORS[formData.goal_type] || colors.secondary[400],
        is_active: true,
      })
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        goal_type: 'investment',
        target_date: '',
      })
      setIsAdding(false)
      loadGoals()
    } catch (error) {
      console.error('Error adding goal:', error)
      alert('Erro ao criar objetivo')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover este objetivo?')) return
    try {
      await deleteFinancialGoal(id)
      loadGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const handleUpdateProgress = async (goal: FinancialGoal, newAmount: number) => {
    if (newAmount < 0 || newAmount > goal.target_amount) {
      alert('Valor deve estar entre 0 e o valor alvo')
      return
    }
    try {
      await updateFinancialGoal(goal.id, { current_amount: newAmount })
      loadGoals()
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const getTotalSaved = () => goals.reduce((sum, g) => sum + g.current_amount, 0)
  const getTotalTarget = () => goals.reduce((sum, g) => sum + g.target_amount, 0)
  const getProgress = (goal: FinancialGoal) => (goal.current_amount / goal.target_amount) * 100

  return (
    <div
      style={{
        background: colors.background.light,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        border: `1px solid ${colors.secondary[100]}`,
        overflow: 'hidden',
      }}
    >
      {/* Header Premium */}
      <div
        style={{
          padding: spacing.lg,
          background: `linear-gradient(135deg, ${colors.secondary[50]} 0%, ${colors.secondary[100]} 100%)`,
          borderBottom: `1px solid ${colors.secondary[100]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: typography.h3.fontSize,
              fontWeight: 700,
              color: colors.secondary[900],
              margin: 0,
              marginBottom: spacing.xs,
            }}
          >
            🎯 Objetivos Financeiros
          </h3>
          <p
            style={{
              fontSize: typography.small.fontSize,
              color: colors.secondary[600],
              margin: 0,
            }}
          >
            Defina metas e acompanhe seu progresso
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{
            background: colors.secondary[600],
            border: 'none',
            color: 'white',
            padding: `${spacing.md} ${spacing.lg}`,
            borderRadius: borderRadius.lg,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            transition: transitions.normal,
            boxShadow: shadows.sm,
          }}
          onMouseOver={(e) => {
            (e.target as any).style.background = colors.secondary[700]
            ;(e.target as any).style.boxShadow = shadows.md
          }}
          onMouseOut={(e) => {
            (e.target as any).style.background = colors.secondary[600]
            ;(e.target as any).style.boxShadow = shadows.sm
          }}
        >
          <Plus size={18} />
          {isAdding ? 'Cancelar' : 'Adicionar'}
        </button>
      </div>

      {/* Form Section */}
      {isAdding && (
        <div
          style={{
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.secondary[100]}`,
            backgroundColor: colors.secondary[50],
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Nome do Objetivo
              </label>
              <input
                type="text"
                placeholder="Ex: Viagem para Paris"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.secondary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Tipo de Objetivo
              </label>
              <select
                value={formData.goal_type}
                onChange={(e) => setFormData({ ...formData, goal_type: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.secondary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  background: 'white',
                  cursor: 'pointer',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {Object.entries(GOAL_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Valor Alvo (R$)
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.secondary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.small.fontSize,
                  fontWeight: 600,
                  color: colors.secondary[700],
                  marginBottom: spacing.xs,
                }}
              >
                Data Alvo
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.secondary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.body.fontSize,
                  boxSizing: 'border-box',
                  transition: transitions.normal,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: spacing.md }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.small.fontSize,
                fontWeight: 600,
                color: colors.secondary[700],
                marginBottom: spacing.xs,
              }}
            >
              Descrição (opcional)
            </label>
            <textarea
              placeholder="Adicione detalhes sobre seu objetivo..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: spacing.md,
                border: `1px solid ${colors.secondary[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.body.fontSize,
                boxSizing: 'border-box',
                minHeight: '80px',
                fontFamily: 'inherit',
                transition: transitions.normal,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.secondary[400]
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary[100]}`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.secondary[200]
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: spacing.md }}>
            <button
              onClick={handleAdd}
              style={{
                background: colors.status.success,
                color: 'white',
                border: 'none',
                padding: `${spacing.md} ${spacing.xl}`,
                borderRadius: borderRadius.lg,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: typography.body.fontSize,
                transition: transitions.normal,
                boxShadow: shadows.sm,
                flex: 1,
              }}
              onMouseOver={(e) => {
                (e.target as any).style.background = colors.status.success + 'dd'
                ;(e.target as any).style.boxShadow = shadows.md
              }}
              onMouseOut={(e) => {
                (e.target as any).style.background = colors.status.success
                ;(e.target as any).style.boxShadow = shadows.sm
              }}
            >
              Criar Objetivo
            </button>
            <button
              onClick={() => setIsAdding(false)}
              style={{
                background: colors.secondary[100],
                color: colors.secondary[900],
                border: 'none',
                padding: `${spacing.md} ${spacing.xl}`,
                borderRadius: borderRadius.lg,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: typography.body.fontSize,
                transition: transitions.normal,
                flex: 1,
              }}
              onMouseOver={(e) => {
                (e.target as any).style.background = colors.secondary[200]
              }}
              onMouseOut={(e) => {
                (e.target as any).style.background = colors.secondary[100]
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: spacing.lg }}>
        {isLoading ? (
          <p style={{ textAlign: 'center', color: colors.secondary[500] }}>Carregando...</p>
        ) : goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: `${spacing.lg} 0` }}>
            <p style={{ color: colors.secondary[500], margin: 0, marginBottom: spacing.md, fontSize: '16px' }}>
              Nenhum objetivo definido
            </p>
            <p style={{ color: colors.secondary[400], fontSize: typography.small.fontSize, margin: 0 }}>
              Clique em "Adicionar" para criar seu primeiro objetivo
            </p>
          </div>
        ) : (
          <>
            {/* Goals Grid */}
            <div style={{ display: 'grid', gap: spacing.md, marginBottom: spacing.lg }}>
              {goals.map((goal) => {
                const progress = getProgress(goal)
                const progressColor = progress < 33 ? colors.status.error : progress < 66 ? colors.status.warning : colors.status.success

                return (
                  <div
                    key={goal.id}
                    style={{
                      padding: spacing.lg,
                      border: `2px solid ${GOAL_COLORS[goal.goal_type] || colors.secondary[100]}`,
                      borderRadius: borderRadius.lg,
                      background: colors.background.light,
                      transition: transitions.normal,
                    }}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as any).style.boxShadow = shadows.md
                      ;(e.currentTarget as any).style.background = colors.secondary[50]
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as any).style.boxShadow = 'none'
                      ;(e.currentTarget as any).style.background = colors.background.light
                    }}
                  >
                    {/* Goal Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: spacing.md,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                          <span style={{ fontSize: '24px' }}>{goal.icon}</span>
                          <h4
                            style={{
                              fontSize: typography.h4.fontSize,
                              fontWeight: 700,
                              color: colors.secondary[900],
                              margin: 0,
                            }}
                          >
                            {goal.name}
                          </h4>
                        </div>
                        {goal.description && (
                          <p
                            style={{
                              fontSize: typography.small.fontSize,
                              color: colors.secondary[500],
                              margin: 0,
                              marginLeft: '32px',
                            }}
                          >
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        style={{
                          background: colors.status.error + '15',
                          border: 'none',
                          color: colors.status.error,
                          padding: `${spacing.sm} ${spacing.md}`,
                          borderRadius: borderRadius.lg,
                          cursor: 'pointer',
                          transition: transitions.normal,
                        }}
                        onMouseOver={(e) => {
                          ;(e.target as any).style.background = colors.status.error + '25'
                        }}
                        onMouseOut={(e) => {
                          ;(e.target as any).style.background = colors.status.error + '15'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: spacing.md }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: spacing.xs,
                        }}
                      >
                        <span
                          style={{
                            fontSize: typography.small.fontSize,
                            fontWeight: 600,
                            color: colors.secondary[700],
                          }}
                        >
                          R$ {goal.current_amount.toFixed(2)} / R$ {goal.target_amount.toFixed(2)}
                        </span>
                        <span
                          style={{
                            fontSize: typography.small.fontSize,
                            fontWeight: 700,
                            color: progressColor,
                          }}
                        >
                          {Math.round(progress)}%
                        </span>
                      </div>

                      {/* Progress Bar Background */}
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          background: colors.secondary[100],
                          borderRadius: borderRadius.full,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Progress Fill */}
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(progress, 100)}%`,
                            background: progressColor,
                            borderRadius: borderRadius.full,
                            transition: `width ${transitions.normal}`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Progress Input */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: typography.small.fontSize,
                          fontWeight: 600,
                          color: colors.secondary[700],
                          marginBottom: spacing.xs,
                        }}
                      >
                        Atualizar Progresso
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={goal.target_amount}
                        step="100"
                        value={goal.current_amount}
                        onChange={(e) => handleUpdateProgress(goal, parseFloat(e.target.value))}
                        style={{
                          width: '100%',
                          cursor: 'pointer',
                          accentColor: GOAL_COLORS[goal.goal_type] || colors.secondary[400],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.md,
              }}
            >
              <div
                style={{
                  padding: spacing.lg,
                  background: colors.secondary[50],
                  borderRadius: borderRadius.lg,
                  border: `2px solid ${colors.secondary[200]}`,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: typography.small.fontSize,
                    color: colors.secondary[600],
                    margin: 0,
                    marginBottom: spacing.xs,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 600,
                  }}
                >
                  Já Acumulado
                </p>
                <p
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: colors.secondary[600],
                    margin: 0,
                  }}
                >
                  R$ {getTotalSaved().toFixed(2)}
                </p>
              </div>

              <div
                style={{
                  padding: spacing.lg,
                  background: colors.primary[50],
                  borderRadius: borderRadius.lg,
                  border: `2px solid ${colors.primary[200]}`,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: typography.small.fontSize,
                    color: colors.primary[600],
                    margin: 0,
                    marginBottom: spacing.xs,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 600,
                  }}
                >
                  Total em Metas
                </p>
                <p
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: colors.primary[600],
                    margin: 0,
                  }}
                >
                  R$ {getTotalTarget().toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
