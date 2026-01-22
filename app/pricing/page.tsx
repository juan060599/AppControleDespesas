'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/database'
import DashboardHeader from '@/components/DashboardHeader'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Check, Loader, ArrowLeft } from 'lucide-react'

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/signin')
          return
        }
        setUser(currentUser)
      } catch (error) {
        router.push('/signin')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleCheckout = async () => {
    setProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setProcessing(false)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.')
      setProcessing(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      const { signOut } = await import('@/lib/database')
      await signOut()
      router.push('/signin')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.background.lighter }}>
        <DashboardHeader userName={user?.email || 'Usuário'} onLogout={handleLogout} />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: spacing.xl }}>
          <p style={{ color: colors.secondary[500], textAlign: 'center' }}>Carregando...</p>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.background.lighter }}>
      <DashboardHeader userName={user?.email || 'Usuário'} onLogout={handleLogout} />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: spacing.xl }}>
        {/* Botão voltar */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: 'transparent',
            border: `1px solid ${colors.primary[200]}`,
            borderRadius: '6px',
            cursor: 'pointer',
            color: colors.primary[500],
            fontWeight: 'bold',
            marginBottom: spacing.lg,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[50]
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
          }}
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
          <h1 style={{ ...typography.h1, color: colors.secondary[900], marginBottom: spacing.md }}>
            💳 Planos FinControl
          </h1>
          <p style={{ ...typography.body, color: colors.secondary[500], margin: 0 }}>
            Desbloqueie análises ilimitadas com IA
          </p>
        </div>

        {/* Plans Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: spacing.xl,
            marginBottom: spacing.xxl,
          }}
        >
          {/* Free Plan */}
          <div
            style={{
              padding: spacing.xl,
              backgroundColor: colors.background.light,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.secondary[200]}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, margin: `0 0 ${spacing.sm} 0`, color: colors.secondary[900] }}>
                🆓 Plano Gratuito
              </h2>
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[500] }}>
                Perfeito para começar
              </p>
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <div style={{ ...typography.h3, color: colors.primary[500], margin: `0 0 ${spacing.xs} 0` }}>
                Grátis
              </div>
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[500] }}>
                Para sempre
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, marginBottom: spacing.lg }}>
              {[
                '✓ Lançar transações manualmente',
                '× Análise com IA (limitada)',
                '× Sugestões de economia',
                '× Alertas de despesas',
              ].map((feature, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: `${spacing.sm} 0`,
                    color: feature.startsWith('×') ? colors.secondary[400] : colors.secondary[700],
                    fontSize: typography.small.fontSize,
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>

            <button
              disabled
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                backgroundColor: colors.secondary[200],
                color: colors.secondary[500],
                border: 'none',
                borderRadius: borderRadius.md,
                fontWeight: 'bold',
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
            >
              Seu plano atual
            </button>
          </div>

          {/* Pro Plan */}
          <div
            style={{
              padding: spacing.xl,
              backgroundColor: colors.background.light,
              borderRadius: borderRadius.lg,
              border: `2px solid ${colors.primary[500]}`,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: shadows.blue,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -16,
                right: 20,
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                color: 'white',
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                fontSize: typography.small.fontSize,
                fontWeight: 'bold',
              }}
            >
              ⭐ POPULAR
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, margin: `0 0 ${spacing.sm} 0`, color: colors.secondary[900] }}>
                🚀 Plano Pro
              </h2>
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[500] }}>
                Máximo potencial
              </p>
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <div style={{ ...typography.h3, color: colors.primary[500], margin: `0 0 ${spacing.xs} 0` }}>
                R$ 19,90
              </div>
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[500] }}>
                por mês (5 análises)
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, marginBottom: spacing.lg }}>
              {[
                '✓ Lançar transações manualmente',
                '✓ 5 análises com IA por mês',
                '✓ Sugestões de economia',
                '✓ Alertas de despesas',
                '✓ Planejamento de orçamento',
              ].map((feature, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: `${spacing.sm} 0`,
                    color: colors.secondary[700],
                    fontSize: typography.small.fontSize,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                  }}
                >
                  <Check size={16} color={colors.primary[500]} />
                  {feature.replace('✓ ', '')}
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={processing}
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                background: processing
                  ? colors.secondary[300]
                  : `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.md,
                fontWeight: 'bold',
                cursor: processing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                transition: transitions.default,
                opacity: processing ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!processing) {
                  ;(e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'
                  ;(e.target as HTMLButtonElement).style.boxShadow = shadows.lg
                }
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLButtonElement).style.boxShadow = 'none'
              }}
            >
              {processing && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              {processing ? 'Processando...' : 'Começar Agora'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: spacing.xl,
            backgroundColor: colors.background.light,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.secondary[200]}`,
          }}
        >
          <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.lg} 0`, color: colors.secondary[900] }}>
            ❓ Perguntas Frequentes
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div>
              <p style={{ ...typography.label, margin: `0 0 ${spacing.sm} 0`, color: colors.secondary[900] }}>
                Como funciona o limite de 5 análises?
              </p>
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>
                Você pode fazer até 5 análises de extratos com IA por mês. Após atingir o limite, aguarde o mês seguinte.
              </p>
            </div>

            <div>
              <p style={{ ...typography.label, margin: `0 0 ${spacing.sm} 0`, color: colors.secondary[900] }}>
                Posso usar o plano gratuito?
              </p>
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>
                Sim! O plano gratuito permite lançar transações manualmente. O plano Pro desbloqueada análises com IA.
              </p>
            </div>

            <div>
              <p style={{ ...typography.label, margin: `0 0 ${spacing.sm} 0`, color: colors.secondary[900] }}>
                Posso cancelar a qualquer momento?
              </p>
              <p style={{ ...typography.small, margin: 0, color: colors.secondary[600] }}>
                Sim! Você pode cancelar sua assinatura a qualquer momento sem compromisso.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors.status.error + '15',
              border: `1px solid ${colors.status.error}`,
              borderRadius: borderRadius.md,
              color: colors.status.error,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}
      </main>
    </div>
  )
}
