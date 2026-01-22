'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Key, Check, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react'

export default function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Verificar se já tem chave salva
    const savedKey = localStorage.getItem('gemini_api_key')
    if (savedKey) {
      setIsConfigured(true)
      // Mostrar chave parcialmente mascarada
      const masked = savedKey.substring(0, 10) + '...' + savedKey.substring(savedKey.length - 5)
      setApiKey(masked)
    }
  }, [])

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira uma chave de API' })
      return
    }

    if (!apiKey.startsWith('AIzaSy')) {
      setMessage({ type: 'error', text: 'Chave inválida. Deve começar com "AIzaSy"' })
      return
    }

    setLoading(true)
    try {
      // Salvar no localStorage
      localStorage.setItem('gemini_api_key', apiKey)
      setIsConfigured(true)
      const masked = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5)
      setApiKey(masked)
      setMessage({ type: 'success', text: '✅ Chave API salva com sucesso!' })

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar chave' })
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (!apiKey.trim() || apiKey.includes('...')) {
      setMessage({ type: 'error', text: 'Por favor, insira a chave completa para testar' })
      return
    }

    setTesting(true)
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Test',
                },
              ],
            },
          ],
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Chave válida e funcionando!' })
      } else {
        const error = await response.json()
        setMessage({
          type: 'error',
          text: `❌ Erro: ${error.error?.message || 'Chave inválida'}`,
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      })
    } finally {
      setTesting(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('gemini_api_key')
    setApiKey('')
    setIsConfigured(false)
    setMessage({ type: 'info', text: 'Chave removida. Adicione uma nova chave para continuar.' })
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div
      style={{
        padding: spacing.lg,
        backgroundColor: colors.background.light,
        borderRadius: borderRadius.lg,
        border: `1px solid ${colors.primary[100]}`,
        maxWidth: '600px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
        <Key size={32} color={colors.primary[500]} />
        <div>
          <h3 style={{ ...typography.h3, margin: 0, color: colors.secondary[900] }}>
            🔑 Chave Google Gemini API
          </h3>
          <p style={{ ...typography.small, margin: `${spacing.xs} 0 0 0`, color: colors.secondary[500] }}>
            Configure sua chave para usar análise de extratos com IA
          </p>
        </div>
      </div>

      {/* Status */}
      {isConfigured && (
        <div
          style={{
            padding: spacing.md,
            backgroundColor: colors.status.success + '15',
            border: `1px solid ${colors.status.success}`,
            borderRadius: borderRadius.md,
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <Check size={20} color={colors.status.success} />
          <p style={{ ...typography.small, margin: 0, color: colors.status.success, fontWeight: 'bold' }}>
            Chave configurada e ativa
          </p>
        </div>
      )}

      {/* Input */}
      <div style={{ marginBottom: spacing.md }}>
        <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm, color: colors.secondary[900] }}>
          Sua Chave API
        </label>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            disabled={isConfigured && apiKey.includes('...')}
            style={{
              flex: 1,
              padding: `${spacing.sm} ${spacing.md}`,
              border: `2px solid ${colors.primary[200]}`,
              borderRadius: borderRadius.md,
              fontSize: '14px',
              fontFamily: 'monospace',
              backgroundColor: isConfigured && apiKey.includes('...') ? colors.primary[50] : colors.background.default,
              color: colors.secondary[900],
              transition: transitions.default,
            }}
            onFocus={(e) => {
              ;(e.target as HTMLInputElement).style.borderColor = colors.primary[500]
            }}
            onBlur={(e) => {
              ;(e.target as HTMLInputElement).style.borderColor = colors.primary[200]
            }}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            disabled={!apiKey || apiKey.includes('...')}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              backgroundColor: colors.primary[100],
              border: 'none',
              borderRadius: borderRadius.md,
              cursor: !apiKey || apiKey.includes('...') ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              opacity: !apiKey || apiKey.includes('...') ? 0.5 : 1,
            }}
          >
            {showKey ? <EyeOff size={20} color={colors.primary[500]} /> : <Eye size={20} color={colors.primary[500]} />}
          </button>
        </div>
        <p style={{ ...typography.small, margin: `${spacing.xs} 0 0 0`, color: colors.secondary[500] }}>
          🔒 Sua chave é armazenada localmente no seu navegador e nunca é enviada para nossos servidores.
        </p>
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
          <AlertCircle
            size={20}
            color={
              message.type === 'success'
                ? colors.status.success
                : message.type === 'error'
                  ? colors.status.error
                  : colors.primary[500]
            }
          />
          <p style={{ ...typography.small, margin: 0, color: colors.secondary[900] }}>
            {message.text}
          </p>
        </div>
      )}

      {/* Botões */}
      <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg }}>
        <button
          onClick={handleSave}
          disabled={loading || (isConfigured && apiKey.includes('...'))}
          style={{
            flex: 1,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: borderRadius.md,
            fontWeight: 'bold',
            cursor: loading || (isConfigured && apiKey.includes('...')) ? 'not-allowed' : 'pointer',
            opacity: loading || (isConfigured && apiKey.includes('...')) ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            transition: transitions.default,
          }}
          onMouseEnter={(e) => {
            if (!loading && !(isConfigured && apiKey.includes('...'))) {
              ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[600]
            }
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[500]
          }}
        >
          {loading && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Salvando...' : isConfigured && apiKey.includes('...') ? '✅ Salvo' : 'Salvar Chave'}
        </button>

        <button
          onClick={handleTest}
          disabled={testing || !apiKey}
          style={{
            flex: 1,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.status.success,
            color: 'white',
            border: 'none',
            borderRadius: borderRadius.md,
            fontWeight: 'bold',
            cursor: testing || !apiKey ? 'not-allowed' : 'pointer',
            opacity: testing || !apiKey ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            transition: transitions.default,
          }}
          onMouseEnter={(e) => {
            if (!testing && apiKey) {
              ;(e.target as HTMLButtonElement).style.backgroundColor = colors.status.success
            }
          }}
        >
          {testing && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
          {testing ? 'Testando...' : 'Testar Chave'}
        </button>
      </div>

      {isConfigured && (
        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.status.error + '20',
            color: colors.status.error,
            border: `1px solid ${colors.status.error}`,
            borderRadius: borderRadius.md,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: transitions.default,
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = colors.status.error + '30'
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = colors.status.error + '20'
          }}
        >
          🗑️ Remover Chave
        </button>
      )}

      {/* Instruções */}
      <div
        style={{
          marginTop: spacing.lg,
          padding: spacing.md,
          backgroundColor: colors.primary[50],
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.primary[200]}`,
        }}
      >
        <h4 style={{ ...typography.label, margin: `0 0 ${spacing.sm} 0`, color: colors.secondary[900] }}>
          📚 Como obter sua chave:
        </h4>
        <ol style={{ margin: 0, paddingLeft: spacing.md, color: colors.secondary[700] }}>
          <li style={{ marginBottom: spacing.xs }}>
            Acesse{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.primary[500], textDecoration: 'none', fontWeight: 'bold' }}
            >
              Google AI Studio
            </a>
          </li>
          <li style={{ marginBottom: spacing.xs }}>Clique em "Create API Key"</li>
          <li style={{ marginBottom: spacing.xs }}>Selecione "Create new project"</li>
          <li style={{ marginBottom: spacing.xs }}>Copie sua chave (começa com "AIzaSy")</li>
          <li>Cole aqui e clique em "Salvar Chave"</li>
        </ol>
      </div>
    </div>
  )
}
