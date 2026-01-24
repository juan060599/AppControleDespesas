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
          // Give a small delay to ensure session is loaded
          setTimeout(() => {
            router.push('/signin')
          }, 500)
          return
        }
        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
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
      <div style={{ minHeight: '100vh', background: colors.background.lighter, width: '100%', overflow: 'hidden' }}>
        <DashboardHeader userName={user?.email || 'Usuário'} onLogout={handleLogout} />
        <main style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '12px', boxSizing: 'border-box' }}>
          <style>{`
            @media (min-width: 480px) {
              main {
                padding: 16px;
              }
            }
            @media (min-width: 768px) {
              main {
                padding: 24px;
                max-width: 1200px;
              }
            }
          `}</style>
          <p style={{ color: colors.secondary[500], textAlign: 'center' }}>Carregando...</p>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.background.lighter, width: '100%', overflow: 'hidden' }}>
      <DashboardHeader userName={user?.email || 'Usuário'} onLogout={handleLogout} />

      <main style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '12px', boxSizing: 'border-box' }}>
        <style>{`
          .pricing-main {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            padding: 12px;
            box-sizing: border-box;
            overflow: hidden;
          }

          @media (min-width: 480px) {
            .pricing-main {
              padding: 16px;
            }
          }

          @media (min-width: 768px) {
            .pricing-main {
              padding: 24px;
              max-width: 1200px;
              margin: 0 auto;
            }
          }

          .pricing-back-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background-color: transparent;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 16px;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          @media (min-width: 480px) {
            .pricing-back-button {
              font-size: 15px;
            }
          }

          .pricing-header {
            text-align: center;
            margin-bottom: 24px;
          }

          .pricing-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 8px 0;
          }

          @media (min-width: 480px) {
            .pricing-title {
              font-size: 28px;
            }
          }

          @media (min-width: 768px) {
            .pricing-title {
              font-size: 32px;
              margin-bottom: 12px;
            }
          }

          .pricing-subtitle {
            font-size: 14px;
            margin: 0;
            color: #666;
          }

          @media (min-width: 480px) {
            .pricing-subtitle {
              font-size: 15px;
            }
          }

          .pricing-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 24px;
            width: 100%;
          }

          @media (min-width: 480px) {
            .pricing-cards {
              gap: 20px;
            }
          }

          @media (min-width: 768px) {
            .pricing-cards {
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
              margin-bottom: 32px;
            }
          }

          .pricing-card {
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            position: relative;
            box-sizing: border-box;
          }

          @media (min-width: 480px) {
            .pricing-card {
              padding: 24px;
            }
          }

          @media (min-width: 768px) {
            .pricing-card {
              padding: 28px;
            }
          }

          .pricing-popular {
            border: 2px solid #007bff;
            border-top: 20px solid #007bff;
          }

          .pricing-badge {
            position: absolute;
            top: -14px;
            right: 12px;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
          }

          @media (min-width: 480px) {
            .pricing-badge {
              font-size: 13px;
              top: -16px;
              right: 16px;
            }
          }

          .pricing-plan-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 4px 0;
          }

          @media (min-width: 480px) {
            .pricing-plan-title {
              font-size: 20px;
              margin-bottom: 6px;
            }
          }

          .pricing-plan-desc {
            font-size: 12px;
            margin: 0 0 12px 0;
            color: #666;
          }

          @media (min-width: 480px) {
            .pricing-plan-desc {
              font-size: 13px;
              margin-bottom: 16px;
            }
          }

          .pricing-price {
            font-size: 20px;
            font-weight: bold;
            color: #007bff;
            margin: 0 0 4px 0;
          }

          @media (min-width: 480px) {
            .pricing-price {
              font-size: 24px;
              margin-bottom: 6px;
            }
          }

          .pricing-price-desc {
            font-size: 12px;
            margin: 0 0 16px 0;
            color: #666;
          }

          @media (min-width: 480px) {
            .pricing-price-desc {
              font-size: 13px;
              margin-bottom: 20px;
            }
          }

          .pricing-features {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            margin-bottom: 16px;
          }

          @media (min-width: 480px) {
            .pricing-features {
              margin-bottom: 20px;
            }
          }

          .pricing-features li {
            padding: 8px 0;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          @media (min-width: 480px) {
            .pricing-features li {
              font-size: 14px;
              padding: 10px 0;
            }
          }

          .pricing-button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          @media (min-width: 480px) {
            .pricing-button {
              padding: 14px;
              font-size: 15px;
            }
          }

          .pricing-button-disabled {
            background-color: #e0e0e0;
            color: #999;
            cursor: not-allowed;
            opacity: 0.6;
          }

          .pricing-button-active {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
          }

          .pricing-faq {
            max-width: 100%;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
          }

          @media (min-width: 480px) {
            .pricing-faq {
              padding: 24px;
              max-width: 800px;
              margin: 0 auto;
            }
          }

          @media (min-width: 768px) {
            .pricing-faq {
              padding: 28px;
            }
          }

          .pricing-faq-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 16px 0;
          }

          @media (min-width: 480px) {
            .pricing-faq-title {
              font-size: 20px;
              margin-bottom: 20px;
            }
          }

          .pricing-faq-item {
            margin-bottom: 16px;
          }

          @media (min-width: 480px) {
            .pricing-faq-item {
              margin-bottom: 20px;
            }
          }

          .pricing-faq-question {
            font-size: 14px;
            font-weight: bold;
            margin: 0 0 6px 0;
            color: #333;
          }

          @media (min-width: 480px) {
            .pricing-faq-question {
              font-size: 15px;
              margin-bottom: 8px;
            }
          }

          .pricing-faq-answer {
            font-size: 13px;
            margin: 0;
            color: #666;
          }

          @media (min-width: 480px) {
            .pricing-faq-answer {
              font-size: 14px;
            }
          }

          .pricing-error {
            margin-top: 16px;
            padding: 12px;
            background-color: #ffebee;
            border: 1px solid #ef5350;
            border-radius: 6px;
            color: #ef5350;
            text-align: center;
            font-size: 13px;
          }

          @media (min-width: 480px) {
            .pricing-error {
              margin-top: 20px;
              padding: 16px;
              font-size: 14px;
            }
          }

          .pricing-disabled-text {
            color: #999;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="pricing-main">
          {/* Botão voltar */}
          <button
            onClick={() => router.push('/dashboard')}
            className="pricing-back-button"
            style={{
              color: colors.primary[500],
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLButtonElement).style.backgroundColor = colors.primary[50]
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          {/* Header */}
          <div className="pricing-header">
            <h1 className="pricing-title" style={{ color: colors.secondary[900] }}>
              💳 Planos FinControl
            </h1>
            <p className="pricing-subtitle" style={{ color: colors.secondary[500] }}>
              Desbloqueie análises ilimitadas com IA
            </p>
          </div>

          {/* Plans Container */}
          <div className="pricing-cards">
            {/* Free Plan */}
            <div className="pricing-card" style={{ borderColor: colors.secondary[200] }}>
              <div>
                <h2 className="pricing-plan-title" style={{ color: colors.secondary[900] }}>
                  🆓 Plano Gratuito
                </h2>
                <p className="pricing-plan-desc" style={{ color: colors.secondary[500] }}>
                  Perfeito para começar
                </p>

                <div className="pricing-price">Grátis</div>
                <p className="pricing-price-desc" style={{ color: colors.secondary[500] }}>
                  Para sempre
                </p>

                <ul className="pricing-features">
                  {[
                    '✓ Lançar transações manualmente',
                    '× Análise com IA (limitada)',
                    '× Sugestões de economia',
                    '× Alertas de despesas',
                  ].map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: feature.startsWith('×') ? '#ccc' : colors.secondary[700],
                      }}
                    >
                      {feature.startsWith('×') ? '✕' : '✓'} {feature.replace('✓ ', '').replace('× ', '')}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled
                className="pricing-button pricing-button-disabled"
                style={{
                  backgroundColor: colors.secondary[200],
                  color: colors.secondary[500],
                }}
              >
                Seu plano atual
              </button>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card pricing-popular" style={{ borderColor: colors.primary[500] }}>
              <div className="pricing-badge">⭐ POPULAR</div>

              <div>
                <h2 className="pricing-plan-title" style={{ color: colors.secondary[900] }}>
                  🚀 Plano Pro
                </h2>
                <p className="pricing-plan-desc" style={{ color: colors.secondary[500] }}>
                  Máximo potencial
                </p>

                <div className="pricing-price" style={{ color: colors.primary[500] }}>
                  R$ 19,90
                </div>
                <p className="pricing-price-desc" style={{ color: colors.secondary[500] }}>
                  por mês (5 análises)
                </p>

                <ul className="pricing-features">
                  {[
                    '✓ Lançar transações manualmente',
                    '✓ 5 análises com IA por mês',
                    '✓ Sugestões de economia',
                    '✓ Alertas de despesas',
                    '✓ Planejamento de orçamento',
                  ].map((feature, idx) => (
                    <li key={idx} style={{ color: colors.secondary[700] }}>
                      <Check size={14} color={colors.primary[500]} />
                      {feature.replace('✓ ', '')}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing}
                className={`pricing-button ${processing ? 'pricing-button-disabled' : 'pricing-button-active'}`}
                style={
                  processing
                    ? { backgroundColor: colors.secondary[300], color: colors.secondary[500], cursor: 'not-allowed', opacity: 0.6 }
                    : { background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`, color: 'white' }
                }
                onMouseEnter={(e) => {
                  if (!processing) {
                    ;(e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'
                    ;(e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  ;(e.target as HTMLButtonElement).style.transform = 'translateY(0)'
                  ;(e.target as HTMLButtonElement).style.boxShadow = 'none'
                }}
              >
                {processing && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {processing ? 'Processando...' : 'Começar Agora'}
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pricing-faq">
            <h3 className="pricing-faq-title" style={{ color: colors.secondary[900] }}>
              ❓ Perguntas Frequentes
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="pricing-faq-item">
                <p className="pricing-faq-question" style={{ color: colors.secondary[900] }}>
                  Como funciona o limite de 5 análises?
                </p>
                <p className="pricing-faq-answer" style={{ color: colors.secondary[600] }}>
                  Você pode fazer até 5 análises de extratos com IA por mês. Após atingir o limite, aguarde o mês seguinte.
                </p>
              </div>

              <div className="pricing-faq-item">
                <p className="pricing-faq-question" style={{ color: colors.secondary[900] }}>
                  Posso usar o plano gratuito?
                </p>
                <p className="pricing-faq-answer" style={{ color: colors.secondary[600] }}>
                  Sim! O plano gratuito permite lançar transações manualmente. O plano Pro desbloqueada análises com IA.
                </p>
              </div>

              <div className="pricing-faq-item">
                <p className="pricing-faq-question" style={{ color: colors.secondary[900] }}>
                  Posso cancelar a qualquer momento?
                </p>
                <p className="pricing-faq-answer" style={{ color: colors.secondary[600] }}>
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem compromisso.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="pricing-error">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
