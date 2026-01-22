'use client'

import { useState } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Trash2, AlertTriangle, Loader } from 'lucide-react'
import { deleteAllTransactions, getCurrentUser } from '@/lib/database'

interface DangerZoneProps {
  onDeleteSuccess?: () => void
}

export default function DangerZone({ onDeleteSuccess }: DangerZoneProps) {
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDeleteAll = async () => {
    if (confirmText !== 'DELETAR TUDO') {
      setMessage({ type: 'error', text: 'Digite "DELETAR TUDO" para confirmar' })
      return
    }

    setDeleting(true)
    try {
      const user = await getCurrentUser()
      if (!user) {
        setMessage({ type: 'error', text: 'Usuário não autenticado' })
        setDeleting(false)
        return
      }

      const { error } = await deleteAllTransactions(user.id)
      if (error) {
        setMessage({ type: 'error', text: `Erro ao deletar: ${error.message}` })
      } else {
        setMessage({ type: 'success', text: '✅ Todos os lançamentos foram deletados!' })
        setShowConfirm(false)
        setConfirmText('')
        setTimeout(() => {
          onDeleteSuccess?.()
        }, 1500)
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Erro: ${err instanceof Error ? err.message : 'Desconhecido'}` })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      style={{
        padding: spacing.lg,
        backgroundColor: colors.status.error + '10',
        border: `2px solid ${colors.status.error}`,
        borderRadius: borderRadius.lg,
        marginTop: spacing.xl,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
        <AlertTriangle size={32} color={colors.status.error} />
        <div>
          <h3 style={{ ...typography.h3, margin: 0, color: colors.status.error }}>
            ⚠️ Zona de Perigo
          </h3>
          <p style={{ ...typography.small, margin: `${spacing.xs} 0 0 0`, color: colors.secondary[600] }}>
            Ações irreversíveis - tenha cuidado!
          </p>
        </div>
      </div>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: colors.status.error,
            color: 'white',
            border: 'none',
            borderRadius: borderRadius.md,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            transition: transitions.default,
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = colors.status.error
            ;(e.target as HTMLButtonElement).style.opacity = '0.9'
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = colors.status.error
            ;(e.target as HTMLButtonElement).style.opacity = '1'
          }}
        >
          <Trash2 size={20} />
          Deletar Todos os Lançamentos
        </button>
      ) : (
        <div
          style={{
            padding: spacing.lg,
            backgroundColor: 'white',
            border: `1px solid ${colors.status.error}`,
            borderRadius: borderRadius.md,
          }}
        >
          <p style={{ ...typography.body, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[900], fontWeight: 'bold' }}>
            ⚠️ Esta ação é IRREVERSÍVEL!
          </p>
          <p style={{ ...typography.small, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[600] }}>
            Todos os seus lançamentos serão deletados permanentemente. Digite <strong>"DELETAR TUDO"</strong> para confirmar:
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder='Digite "DELETAR TUDO"'
            style={{
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              border: `2px solid ${colors.status.error}`,
              borderRadius: borderRadius.md,
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: spacing.md,
              color: colors.secondary[900],
            }}
          />

          {message && (
            <div
              style={{
                padding: spacing.md,
                backgroundColor:
                  message.type === 'error' ? colors.status.error + '15' : colors.status.success + '15',
                border: `1px solid ${
                  message.type === 'error' ? colors.status.error : colors.status.success
                }`,
                borderRadius: borderRadius.md,
                marginBottom: spacing.md,
              }}
            >
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[900] }}>
                {message.text}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: spacing.md }}>
            <button
              onClick={handleDeleteAll}
              disabled={deleting || confirmText !== 'DELETAR TUDO'}
              style={{
                flex: 1,
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: confirmText === 'DELETAR TUDO' ? colors.status.error : colors.secondary[200],
                color: confirmText === 'DELETAR TUDO' ? 'white' : colors.secondary[600],
                border: 'none',
                borderRadius: borderRadius.md,
                fontWeight: 'bold',
                cursor: deleting || confirmText !== 'DELETAR TUDO' ? 'not-allowed' : 'pointer',
                opacity: deleting || confirmText !== 'DELETAR TUDO' ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                transition: transitions.default,
              }}
            >
              {deleting && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              {deleting ? 'Deletando...' : 'Confirmar Exclusão'}
            </button>

            <button
              onClick={() => {
                setShowConfirm(false)
                setConfirmText('')
                setMessage(null)
              }}
              disabled={deleting}
              style={{
                flex: 1,
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: colors.primary[100],
                color: colors.primary[600],
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: borderRadius.md,
                fontWeight: 'bold',
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.6 : 1,
                transition: transitions.default,
              }}
              onMouseEnter={(e) => {
                if (!deleting) {
                  ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[50]
                }
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[100]
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
