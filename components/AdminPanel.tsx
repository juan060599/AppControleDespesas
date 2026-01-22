'use client'

import { useState } from 'react'
import { colors, spacing, typography, borderRadius, transitions } from '@/lib/designSystem'
import { Users, Shield, Settings, Copy, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function AdminPanel() {
  const [emailInput, setEmailInput] = useState('')
  const [selectedRole, setSelectedRole] = useState<'admin' | 'cliente'>('cliente')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const handleSetUserRole = async () => {
    if (!emailInput.trim()) {
      setMessage({ type: 'error', text: 'Digite o email do usuário' })
      return
    }

    setLoading(true)
    try {
      // Buscar user_id pelo email
      const emailResponse = await fetch('/api/get-user-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json()
        throw new Error(errorData.error || 'Usuário não encontrado')
      }

      const { userId } = await emailResponse.json()

      const response = await fetch('/api/set-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          role: selectedRole,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao atualizar role')
      }

      const data = await response.json()
      setMessage({ type: 'success', text: `✅ ${data.message}` })
      setEmailInput('')

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage({ type: 'error', text: `❌ ${errorMessage}` })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage({ type: 'success', text: '✅ Copiado para a área de transferência!' })
    setTimeout(() => setMessage(null), 2000)
  }

  return (
    <section
      style={{
        marginTop: spacing.xl,
        padding: spacing.lg,
        backgroundColor: colors.status.warning + '10',
        borderRadius: borderRadius.lg,
        border: `2px solid ${colors.status.warning}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
        <Shield size={32} color={colors.status.warning} />
        <div>
          <h2 style={{ ...typography.h2, margin: 0, color: colors.secondary[900] }}>
            👑 Painel Admin
          </h2>
          <p style={{ ...typography.small, margin: `${spacing.xs} 0 0 0`, color: colors.secondary[600] }}>
            Gerenciar usuários e configurações do sistema
          </p>
        </div>
      </div>

      {/* Mensagens */}
      {message && (
        <div
          style={{
            padding: spacing.md,
            backgroundColor:
              message.type === 'success'
                ? colors.status.success + '15'
                : message.type === 'error'
                  ? colors.status.error + '15'
                  : colors.primary[50],
            border: `1px solid ${
              message.type === 'success'
                ? colors.status.success
                : message.type === 'error'
                  ? colors.status.error
                  : colors.primary[200]
            }`,
            borderRadius: borderRadius.md,
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          {message.type === 'success' ? (
            <CheckCircle size={20} color={colors.status.success} />
          ) : (
            <AlertCircle size={20} color={message.type === 'error' ? colors.status.error : colors.primary[500]} />
          )}
          <p style={{ ...typography.small, margin: 0, color: colors.secondary[900] }}>
            {message.text}
          </p>
        </div>
      )}

      {/* Gerenciar Usuários */}
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.background.light,
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.primary[200]}`,
          marginBottom: spacing.lg,
        }}
      >
        <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[900] }}>
          <Users size={24} style={{ display: 'inline', marginRight: spacing.sm }} />
          Gerenciar Usuários
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {/* Input para Email do Usuário */}
          <div>
            <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm, color: colors.secondary[900] }}>
              Email do Usuário
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Digite o email do usuário"
              style={{
                width: '100%',
                padding: `${spacing.sm} ${spacing.md}`,
                border: `2px solid ${colors.primary[200]}`,
                borderRadius: borderRadius.md,
                fontSize: '14px',
                backgroundColor: colors.background.lighter,
                color: colors.secondary[900],
                transition: transitions.normal,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                ;(e.target as HTMLInputElement).style.borderColor = colors.primary[500]
              }}
              onBlur={(e) => {
                ;(e.target as HTMLInputElement).style.borderColor = colors.primary[200]
              }}
            />
          </div>

          {/* Seleção de Role */}
          <div>
            <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm, color: colors.secondary[900] }}>
              Tipo de Usuário
            </label>
            <div style={{ display: 'flex', gap: spacing.md }}>
              {(['cliente', 'admin'] as const).map((role) => (
                <label
                  key={role}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.sm} ${spacing.md}`,
                    backgroundColor: selectedRole === role ? colors.primary[100] : colors.background.lighter,
                    border: `2px solid ${selectedRole === role ? colors.primary[500] : colors.primary[200]}`,
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                    transition: transitions.normal,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRole !== role) {
                      ;(e.currentTarget as HTMLLabelElement).style.backgroundColor = colors.primary[50]
                    }
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLLabelElement).style.backgroundColor =
                      selectedRole === role ? colors.primary[100] : colors.background.lighter
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ ...typography.body, color: colors.secondary[900], fontWeight: selectedRole === role ? 'bold' : 'normal' }}>
                    {role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Botão de Ação */}
          <button
            onClick={handleSetUserRole}
            disabled={loading || !emailInput.trim()}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              backgroundColor: colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: borderRadius.md,
              fontWeight: 'bold',
              cursor: loading || !emailInput.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !emailInput.trim() ? 0.6 : 1,
              transition: transitions.normal,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
            }}
            onMouseEnter={(e) => {
              if (!loading && emailInput.trim()) {
                ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[600]
              }
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[500]
            }}
          >
            {loading ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span>Atualizar Role</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Informações de Configuração */}
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.primary[50],
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.primary[200]}`,
        }}
      >
        <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[900] }}>
          <Settings size={24} style={{ display: 'inline', marginRight: spacing.sm }} />
          Próximas Etapas
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <div
            style={{
              padding: spacing.md,
              backgroundColor: colors.background.light,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <p style={{ ...typography.label, margin: `0 0 ${spacing.xs} 0`, color: colors.secondary[900], fontWeight: 'bold' }}>
              1️⃣ Executar Script SQL no Supabase
            </p>
            <p style={{ ...typography.small, margin: 0, color: colors.secondary[700] }}>
              Execute o arquivo <code style={{ fontFamily: 'monospace', backgroundColor: colors.primary[100], padding: '2px 6px', borderRadius: '3px' }}>scripts/setup_user_roles.sql</code> para criar a tabela de roles.
            </p>
          </div>

          <div
            style={{
              padding: spacing.md,
              backgroundColor: colors.background.light,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <p style={{ ...typography.label, margin: `0 0 ${spacing.xs} 0`, color: colors.secondary[900], fontWeight: 'bold' }}>
              2️⃣ Promover seu Usuário a Admin
            </p>
            <p style={{ ...typography.small, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[700] }}>
              Cole seu UUID abaixo e clique "Atualizar Role" para se tornar administrador.
            </p>
            <button
              onClick={() => copyToClipboard('Seu UUID aqui')}
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                backgroundColor: colors.primary[100],
                color: colors.primary[600],
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: borderRadius.sm,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: transitions.normal,
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[200]
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[100]
              }}
            >
              <Copy size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Copiar UUID
            </button>
          </div>

          <div
            style={{
              padding: spacing.md,
              backgroundColor: colors.background.light,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <p style={{ ...typography.label, margin: `0 0 ${spacing.xs} 0`, color: colors.secondary[900], fontWeight: 'bold' }}>
              3️⃣ Chave Gemini Configurada
            </p>
            <p style={{ ...typography.small, margin: 0, color: colors.status.success, fontWeight: 'bold' }}>
              ✅ Sua chave API do Gemini já está armazenada no banco de dados.
            </p>
            <p style={{ ...typography.small, margin: `${spacing.xs} 0 0 0`, color: colors.secondary[700] }}>
              Todos os usuários usarão a mesma chave para análise de extratos.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
