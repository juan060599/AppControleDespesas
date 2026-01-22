'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/database'
import DashboardHeader from '@/components/DashboardHeader'
import ApiKeySettings from '@/components/ApiKeySettings'
import DangerZone from '@/components/DangerZone'
import { colors, spacing, typography } from '@/lib/designSystem'
import { ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
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

  const handleLogout = async () => {
    const confirmed = window.confirm('Tem certeza que deseja sair?')
    if (confirmed) {
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
          onClick={() => router.back()}
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
        <h1 style={{ ...typography.h1, margin: `0 0 ${spacing.lg} 0`, color: colors.secondary[900] }}>
          ⚙️ Configurações
        </h1>

        {/* Seções */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: spacing.xl,
          }}
        >
          {/* API Key */}
          <section>
            <ApiKeySettings />
          </section>

          {/* Informações da Conta */}
          <section
            style={{
              padding: spacing.lg,
              backgroundColor: colors.background.light,
              borderRadius: '12px',
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[900] }}>
              👤 Informações da Conta
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <div>
                <p style={{ ...typography.small, margin: 0, color: colors.secondary[500], marginBottom: spacing.xs }}>
                  Email
                </p>
                <p style={{ ...typography.body, margin: 0, color: colors.secondary[900], fontWeight: 'bold' }}>
                  {user?.email}
                </p>
              </div>
              <div>
                <p style={{ ...typography.small, margin: 0, color: colors.secondary[500], marginBottom: spacing.xs }}>
                  ID do Usuário
                </p>
                <p style={{ ...typography.small, margin: 0, color: colors.secondary[700], fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {user?.id}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Danger Zone */}
        <DangerZone onDeleteSuccess={() => {
          setRefreshTrigger(prev => prev + 1)
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        }} />
      </main>
    </div>
  )
}
