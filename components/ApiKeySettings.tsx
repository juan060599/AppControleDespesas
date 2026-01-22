'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, transitions } from '@/lib/designSystem'
import { Key, Check, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react'
import { getAllApiKeys, updateApiKey } from '@/lib/database'

interface ApiKeyData {
  key_name: string
  key_value: string
  description: string
}

export default function ApiKeySettings() {
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      setLoading(true)
      const { data, error } = await getAllApiKeys()
      if (error) {
        setMessage({ type: 'error', text: 'Erro ao carregar chaves de API' })
        return
      }
      if (data) {
        setApiKeys(data)
        // Initialize edit values with current values
        const initialValues: { [key: string]: string } = {}
        data.forEach((key) => {
          initialValues[key.key_name] = key.key_value
        })
        setEditValues(initialValues)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar chaves' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveKey = async (keyName: string) => {
    const newValue = editValues[keyName]

    if (!newValue || !newValue.trim()) {
      setMessage({ type: 'error', text: 'Chave não pode ser vazia' })
      return
    }

    // Validações específicas
    if (keyName === 'GEMINI_API_KEY' && !newValue.startsWith('AIzaSy')) {
      setMessage({ type: 'error', text: 'Chave Gemini inválida. Deve começar com "AIzaSy"' })
      return
    }

    if (keyName === 'STRIPE_PUBLIC_KEY' && !newValue.startsWith('pk_')) {
      setMessage({ type: 'error', text: 'Chave Stripe pública inválida. Deve começar com "pk_"' })
      return
    }

    if (keyName === 'STRIPE_SECRET_KEY' && !newValue.startsWith('sk_')) {
      setMessage({ type: 'error', text: 'Chave Stripe secreta inválida. Deve começar com "sk_"' })
      return
    }

    setSaving(true)
    try {
      const { error } = await updateApiKey(keyName, newValue)
      if (error) {
        setMessage({ type: 'error', text: `Erro ao salvar ${keyName}` })
        return
      }

      // Update local state
      setApiKeys(
        apiKeys.map((key) => (key.key_name === keyName ? { ...key, key_value: newValue } : key))
      )

      setMessage({ type: 'success', text: `✅ ${keyName} salva com sucesso!` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar chave' })
    } finally {
      setSaving(false)
    }
  }

  const toggleShowKey = (keyName: string) => {
    setShowKeys({
      ...showKeys,
      [keyName]: !showKeys[keyName],
    })
  }

  if (loading) {
    return (
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.background.light,
          borderRadius: '12px',
          border: `1px solid ${colors.primary[100]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.md,
        }}
      >
        <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ margin: 0, color: colors.secondary[600] }}>Carregando chaves...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <section
      style={{
        padding: spacing.lg,
        backgroundColor: colors.background.light,
        borderRadius: '12px',
        border: `1px solid ${colors.primary[100]}`,
      }}
    >
      <h3
        style={{
          ...typography.h3,
          margin: `0 0 ${spacing.md} 0`,
          color: colors.secondary[900],
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Key size={24} />
        Chaves de API
      </h3>

      {message && (
        <div
          style={{
            padding: spacing.md,
            marginBottom: spacing.md,
            backgroundColor:
              message.type === 'success'
                ? colors.status.success + '15'
                : message.type === 'error'
                  ? colors.status.error + '15'
                  : colors.status.info + '15',
            border: `1px solid ${
              message.type === 'success'
                ? colors.status.success
                : message.type === 'error'
                  ? colors.status.error
                  : colors.status.info
            }`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            color:
              message.type === 'success'
                ? colors.status.success
                : message.type === 'error'
                  ? colors.status.error
                  : colors.status.info,
          }}
        >
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <p style={{ margin: 0, ...typography.small }}>{message.text}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
        {apiKeys.map((keyData) => (
          <div
            key={keyData.key_name}
            style={{
              padding: spacing.md,
              backgroundColor: colors.background.lighter,
              borderRadius: '8px',
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <label
              style={{
                ...typography.small,
                color: colors.secondary[700],
                fontWeight: 'bold',
                display: 'block',
                marginBottom: spacing.xs,
              }}
            >
              {keyData.key_name}
            </label>
            <p
              style={{
                ...typography.small,
                margin: `0 0 ${spacing.md} 0`,
                color: colors.secondary[500],
              }}
            >
              {keyData.description}
            </p>

            <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type={showKeys[keyData.key_name] ? 'text' : 'password'}
                  value={editValues[keyData.key_name] || ''}
                  onChange={(e) => setEditValues({ ...editValues, [keyData.key_name]: e.target.value })}
                  placeholder={`Insira sua ${keyData.key_name}`}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    paddingRight: spacing.xl + 24,
                    border: `1px solid ${colors.primary[200]}`,
                    borderRadius: '6px',
                    fontSize: typography.body.fontSize,
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={() => toggleShowKey(keyData.key_name)}
                  style={{
                    position: 'absolute',
                    right: spacing.sm,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.primary[500],
                    padding: spacing.xs,
                  }}
                >
                  {showKeys[keyData.key_name] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                onClick={() => handleSaveKey(keyData.key_name)}
                disabled={saving}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  backgroundColor: colors.primary[500],
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                  transition: transitions.normal,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  whiteSpace: 'nowrap',
                }}
              >
                {saving ? (
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Check size={16} />
                )}
                Salvar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instruções */}
      <div
        style={{
          marginTop: spacing.lg,
          padding: spacing.md,
          backgroundColor: colors.status.info + '15',
          borderRadius: '8px',
          border: `1px solid ${colors.status.info}`,
        }}
      >
        <p
          style={{
            ...typography.small,
            margin: `0 0 ${spacing.sm} 0`,
            color: colors.secondary[700],
            fontWeight: 'bold',
          }}
        >
          ℹ️ Como obter suas chaves:
        </p>
        <ul style={{ margin: 0, paddingLeft: spacing.lg, color: colors.secondary[600] }}>
          <li style={{ marginBottom: spacing.xs }}>
            <strong>Gemini API:</strong> Vá a{' '}
            <a
              href="https://ai.google.dev/tutorials/setup"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.primary[500], textDecoration: 'underline' }}
            >
              Google AI Studio
            </a>
          </li>
          <li style={{ marginBottom: spacing.xs }}>
            <strong>Stripe:</strong> Vá a{' '}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.primary[500], textDecoration: 'underline' }}
            >
              Dashboard Stripe
            </a>
          </li>
          <li>Copie a chave e cole no campo acima, depois clique em "Salvar"</li>
        </ul>
      </div>
    </section>
  )
}
