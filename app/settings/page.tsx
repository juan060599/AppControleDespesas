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
          .settings-main {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            padding: 12px;
            box-sizing: border-box;
            overflow: hidden;
          }

          @media (min-width: 480px) {
            .settings-main {
              padding: 16px;
            }
          }

          @media (min-width: 768px) {
            .settings-main {
              padding: 24px;
              max-width: 1200px;
              margin: 0 auto;
            }
          }

          .back-button {
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
            .back-button {
              font-size: 15px;
            }
          }

          .settings-title {
            font-size: 22px;
            font-weight: bold;
            margin: 0 0 16px 0;
            margin-bottom: 20px;
          }

          @media (min-width: 480px) {
            .settings-title {
              font-size: 28px;
              margin-bottom: 24px;
            }
          }

          @media (min-width: 768px) {
            .settings-title {
              font-size: 32px;
              margin-bottom: 32px;
            }
          }

          .settings-sections {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            width: 100%;
          }

          @media (min-width: 480px) {
            .settings-sections {
              gap: 20px;
            }
          }

          @media (min-width: 768px) {
            .settings-sections {
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
          }

          .settings-card {
            padding: 16px;
            background-color: #f5f5f5;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
            width: 100%;
            box-sizing: border-box;
          }

          @media (min-width: 480px) {
            .settings-card {
              padding: 20px;
            }
          }

          @media (min-width: 768px) {
            .settings-card {
              padding: 24px;
            }
          }

          .settings-card h3 {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 12px 0;
          }

          @media (min-width: 480px) {
            .settings-card h3 {
              font-size: 18px;
              margin-bottom: 16px;
            }
          }

          .settings-input, .settings-select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            margin-bottom: 12px;
          }

          @media (min-width: 480px) {
            .settings-input, .settings-select {
              font-size: 15px;
              padding: 14px;
              margin-bottom: 16px;
            }
          }

          .settings-button {
            width: 100%;
            padding: 12px;
            background-color: #ffa500;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          @media (min-width: 480px) {
            .settings-button {
              padding: 14px;
              font-size: 15px;
            }
          }

          .settings-label {
            font-size: 12px;
            font-weight: bold;
            display: block;
            margin-bottom: 6px;
            color: #333;
          }

          @media (min-width: 480px) {
            .settings-label {
              font-size: 13px;
              margin-bottom: 8px;
            }
          }

          .info-section {
            margin-bottom: 12px;
          }

          @media (min-width: 480px) {
            .info-section {
              margin-bottom: 16px;
            }
          }

          .info-label {
            font-size: 12px;
            color: #666;
            margin: 0 0 4px 0;
          }

          @media (min-width: 480px) {
            .info-label {
              font-size: 13px;
              margin-bottom: 6px;
            }
          }

          .info-value {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin: 0;
            word-break: break-all;
          }

          @media (min-width: 480px) {
            .info-value {
              font-size: 15px;
            }
          }

          .admin-section {
            background-color: #fff3cd;
            border-color: #ffc107;
          }

          .category-limits-wrapper {
            margin-top: 20px;
            width: 100%;
          }

          @media (min-width: 480px) {
            .category-limits-wrapper {
              margin-top: 24px;
            }
          }

          @media (min-width: 768px) {
            .category-limits-wrapper {
              margin-top: 32px;
            }
          }

          .danger-zone-wrapper {
            margin-top: 20px;
            width: 100%;
          }

          @media (min-width: 480px) {
            .danger-zone-wrapper {
              margin-top: 24px;
            }
          }

          @media (min-width: 768px) {
            .danger-zone-wrapper {
              margin-top: 32px;
            }
          }
        `}</style>

        <div className="settings-main">
          {/* Botão voltar */}
          <button
            onClick={() => router.back()}
            className="back-button"
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

          {/* Título */}
          <h1 className="settings-title" style={{ color: colors.secondary[900] }}>
            ⚙️ Configurações
          </h1>

          {/* Seções */}
          <div className="settings-sections">
            {/* API Key - Apenas para Admin */}
            {userRole === 'admin' && (
              <section style={{ gridColumn: 'span 1' }}>
                <ApiKeySettings />
              </section>
            )}

            {/* Informações da Conta */}
            <section className="settings-card" style={{ borderColor: colors.primary[100], backgroundColor: colors.background.light }}>
              <h3 style={{ color: colors.secondary[900] }}>
                👤 Informações da Conta
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="info-section">
                  <p className="info-label" style={{ color: colors.secondary[500] }}>
                    Email
                  </p>
                  <p className="info-value" style={{ color: colors.secondary[900] }}>
                    {user?.email}
                  </p>
                </div>
                <div className="info-section">
                  <p className="info-label" style={{ color: colors.secondary[500] }}>
                    Tipo de Usuário
                  </p>
                  <p className="info-value" style={{ color: userRole === 'admin' ? colors.status.warning : colors.status.success }}>
                    {userRole === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                  </p>
                </div>
                <div className="info-section">
                  <p className="info-label" style={{ color: colors.secondary[500] }}>
                    ID do Usuário
                  </p>
                  <p className="info-value" style={{ color: colors.secondary[700], fontFamily: 'monospace', fontSize: '12px' }}>
                    {user?.id}
                  </p>
                </div>
              </div>
            </section>

            {/* Painel Admin - Apenas para Admin */}
            {userRole === 'admin' && (
              <section className="settings-card admin-section" style={{ gridColumn: 'span 1' }}>
                <h3 style={{ color: colors.secondary[900] }}>
                  👑 Painel de Admin
                </h3>
                <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: colors.secondary[600] }}>
                  Altere o tipo de usuário (admin ou cliente) pelo email
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="settings-label">
                      Email do Usuário
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="usuario@example.com"
                      className="settings-input"
                    />
                  </div>

                  <div>
                    <label className="settings-label">
                      Novo Tipo
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as 'admin' | 'cliente')}
                      className="settings-select"
                    >
                      <option value="cliente">👤 Cliente</option>
                      <option value="admin">👑 Administrador</option>
                    </select>
                  </div>

                  <button
                    onClick={handleUpdateRole}
                    className="settings-button"
                    style={{
                      backgroundColor: colors.status.warning,
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
                    <p style={{ fontSize: '12px', margin: 0, color: updateMessage.includes('✅') ? colors.status.success : colors.status.error }}>
                      {updateMessage}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Category Limits Management */}
          <div className="category-limits-wrapper">
            <CategoryLimits 
              userId={user.id} 
              onLimitsUpdated={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>

          {/* Danger Zone */}
          <div className="danger-zone-wrapper">
            <DangerZone onDeleteSuccess={() => {
              setRefreshTrigger((prev) => prev + 1)
              setTimeout(() => {
                router.push('/dashboard')
              }, 1500)
            }} />
          </div>
        </div>
      </main>
    </div>
  )
}
