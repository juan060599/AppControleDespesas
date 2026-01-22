'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut, getUserRole, setUserRole } from '@/lib/database'
import DashboardHeader from '@/components/DashboardHeader'
import ApiKeySettings from '@/components/ApiKeySettings'
import DangerZone from '@/components/DangerZone'
import CategoryLimits from '@/components/CategoryLimits'
import { colors, spacing, typography } from '@/lib/designSystem'
import { ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRoleState] = useState<'admin' | 'cliente'>('cliente')
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'cliente'>('cliente')
  const [updateMessage, setUpdateMessage] = useState('')
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

        // Carregar role do usuário
        const { role } = await getUserRole(currentUser.id)
        setUserRoleState(role as 'admin' | 'cliente')
      } catch (error) {
        router.push('/signin')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router, refreshTrigger])

  const handleLogout = async () => {
    const confirmed = window.confirm('Tem certeza que deseja sair?')
    if (confirmed) {
      await signOut()
      router.push('/signin')
    }
  }

  const handleUpdateRole = async () => {
    if (!userEmail.trim()) {
      setUpdateMessage('❌ Por favor, insira um email')
      return
    }

    try {
      setUpdateMessage('⏳ Atualizando...')
      
      // Get user by email using Supabase admin API
      const { data: { users }, error: listError } = await (window as any).supabase.auth.admin?.listUsers?.() || { data: { users: [] }, error: null }
      
      if (!users || users.length === 0) {
        // Fallback: use a function approach to find user
        // Since we can't directly access admin API from client, we'll need to create an API route
        const response = await fetch('/api/update-user-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, role: newRole }),
        })

        const result = await response.json()
        
        if (!response.ok) {
          setUpdateMessage(`❌ ${result.error || 'Erro ao atualizar'}`)
          return
        }

        setUpdateMessage(`✅ Role de ${userEmail} atualizado para "${newRole}"`)
        setUserEmail('')
        setNewRole('cliente')
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (error) {
      setUpdateMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`)
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
          {/* API Key - Apenas para Admin */}
          {userRole === 'admin' && (
            <section>
              <ApiKeySettings />
            </section>
          )}

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
                  Tipo de Usuário
                </p>
                <p style={{ ...typography.body, margin: 0, color: userRole === 'admin' ? colors.status.warning : colors.status.success, fontWeight: 'bold' }}>
                  {userRole === 'admin' ? '👑 Administrador' : '👤 Cliente'}
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

          {/* Painel Admin - Apenas para Admin */}
          {userRole === 'admin' && (
            <section
              style={{
                padding: spacing.lg,
                backgroundColor: colors.status.warning + '15',
                borderRadius: '12px',
                border: `1px solid ${colors.status.warning}`,
              }}
            >
              <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[900] }}>
                👑 Painel de Admin
              </h3>
              <p style={{ ...typography.small, margin: `0 0 ${spacing.md} 0`, color: colors.secondary[600] }}>
                Altere o tipo de usuário (admin ou cliente) pelo email
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div>
                  <label style={{ ...typography.small, color: colors.secondary[700], fontWeight: 'bold', display: 'block', marginBottom: spacing.xs }}>
                    Email do Usuário
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="usuario@example.com"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `1px solid ${colors.primary[200]}`,
                      borderRadius: '6px',
                      fontSize: typography.body.fontSize,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ ...typography.small, color: colors.secondary[700], fontWeight: 'bold', display: 'block', marginBottom: spacing.xs }}>
                    Novo Tipo
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'cliente')}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `1px solid ${colors.primary[200]}`,
                      borderRadius: '6px',
                      fontSize: typography.body.fontSize,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="cliente">👤 Cliente</option>
                    <option value="admin">👑 Administrador</option>
                  </select>
                </div>

                <button
                  onClick={handleUpdateRole}
                  style={{
                    padding: spacing.md,
                    backgroundColor: colors.status.warning,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.target as HTMLButtonElement).style.opacity = '0.9'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.target as HTMLButtonElement).style.opacity = '1'
                  }}
                >
                  Atualizar Tipo de Usuário
                </button>

                {updateMessage && (
                  <p style={{ ...typography.small, margin: 0, color: updateMessage.includes('✅') ? colors.status.success : colors.status.error }}>
                    {updateMessage}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Category Limits Management */}
        <div style={{ marginTop: spacing.xl }}>
          <CategoryLimits 
            userId={user.id} 
            onLimitsUpdated={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </div>

        {/* Danger Zone */}
        <DangerZone onDeleteSuccess={() => {
          setRefreshTrigger((prev) => prev + 1)
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        }} />
      </main>
    </div>
  )
}
