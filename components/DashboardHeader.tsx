'use client'

import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { LogOut, Menu, X, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { getCurrentUser } from '@/lib/database'

interface DashboardHeaderProps {
  userName: string
  onLogout: () => void
}

export default function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Get user ID for notifications
  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      onLogout()
    }
  }

  return (
    <header style={{
      background: colors.background.light,
      borderBottom: `1px solid ${colors.primary[100]}`,
      boxShadow: shadows.sm,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: transitions.normal,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: `${spacing.lg} ${spacing.xl}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          textDecoration: 'none',
          color: colors.secondary[900],
          cursor: 'pointer',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadows.blue,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
              <path d="M12 5v14m-7-7h14"></path>
            </svg>
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: colors.secondary[900],
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            FinControl
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xl,
        }}>
          {/* User Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
          }}>
            <div style={{
              textAlign: 'right',
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 600,
                color: colors.secondary[900],
                margin: 0,
              }}>
                Bem-vindo, {userName}!
              </p>
              <p style={{
                fontSize: '12px',
                color: colors.secondary[500],
                margin: 0,
                marginTop: '2px',
              }}>
                Seus dados estão seguros
              </p>
            </div>

            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: colors.background.light,
              boxShadow: shadows.md,
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Pricing Button */}
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `10px ${spacing.md}`,
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                border: 'none',
                borderRadius: borderRadius.lg,
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: transitions.normal,
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLButtonElement).style.boxShadow = shadows.lg
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLButtonElement).style.boxShadow = 'none'
              }}
            >
              💳 Planos
            </button>
          </Link>

          {/* Notification Bell */}
          {userId && <NotificationBell userId={userId} />}

          {/* Settings Button */}
          <Link href="/settings" style={{ textDecoration: 'none' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `10px ${spacing.md}`,
                background: colors.primary[50],
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: borderRadius.lg,
                color: colors.primary[600],
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: transitions.normal,
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.background = colors.primary[100]
                ;(e.target as HTMLButtonElement).style.borderColor = colors.primary[300]
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.background = colors.primary[50]
                ;(e.target as HTMLButtonElement).style.borderColor = colors.primary[200]
              }}
            >
              <Settings size={16} />
              <span>Configurações</span>
            </button>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `10px ${spacing.md}`,
              background: colors.primary[50],
              border: `1px solid ${colors.primary[200]}`,
              borderRadius: borderRadius.lg,
              color: colors.primary[600],
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: transitions.normal,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary[100]
              e.currentTarget.style.borderColor = colors.primary[300]
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.primary[50]
              e.currentTarget.style.borderColor = colors.primary[200]
            }}
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: spacing.md,
            color: colors.secondary[600],
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = colors.secondary[900]}
          onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary[600]}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          display: 'none',
          padding: `${spacing.md} ${spacing.xl}`,
          borderTop: `1px solid ${colors.primary[100]}`,
          gap: spacing.md,
          flexDirection: 'column',
        }}>
          <p style={{
            fontSize: '14px',
            color: colors.secondary[600],
            margin: `${spacing.sm} 0`,
          }}>
            {userName}
          </p>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              background: colors.status.error,
              color: colors.background.light,
              border: 'none',
              borderRadius: borderRadius.lg,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>
      )}
    </header>
  )
}
