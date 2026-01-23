'use client'

import { LogOut, Settings, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { colors, shadows, borderRadius } from '@/lib/designSystem'
import { getCurrentUser } from '@/lib/database'

interface DashboardHeaderProps {
  userName: string
  onLogout: () => void
}

export default function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userId, setUserId] = useState<string>('')

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
      width: '100%',
    }}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .header-wrapper {
          width: 100%;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        @media (min-width: 480px) {
          .header-wrapper {
            padding: 14px 16px;
          }
        }

        @media (min-width: 768px) {
          .header-wrapper {
            padding: 16px 24px;
          }
        }

        /* Logo */
        .logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
        }

        @media (min-width: 480px) {
          .logo-text {
            font-size: 18px;
          }
        }

        /* Center - User Info */
        .user-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-width: 0;
        }

        .user-text {
          font-size: 12px;
          color: #374151;
          margin: 0;
          line-height: 1.3;
        }

        .user-text strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        @media (min-width: 480px) {
          .user-text {
            font-size: 13px;
          }
          .user-text strong {
            font-size: 14px;
          }
        }

        /* Right - Actions */
        .actions-section {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-shrink: 0;
        }

        @media (min-width: 480px) {
          .actions-section {
            gap: 8px;
          }
        }

        .action-button {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: none;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
          flex-shrink: 0;
        }

        .action-button:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .action-button svg {
          width: 18px;
          height: 18px;
        }

        @media (min-width: 480px) {
          .action-button {
            width: 40px;
            height: 40px;
          }
          .action-button svg {
            width: 20px;
            height: 20px;
          }
        }

        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          width: 100%;
          display: none;
          flex-direction: column;
          z-index: 50;
        }

        .mobile-menu.open {
          display: flex;
        }

        .menu-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
        }

        .menu-item:hover {
          background: #f9fafb;
        }

        .menu-item svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .menu-item.danger {
          color: #ef4444;
        }
      `}</style>

      <div className="header-wrapper">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
              <path d="M12 5v14m-7-7h14"></path>
            </svg>
          </div>
          <div className="logo-text">FinControl</div>
        </div>

        {/* User Info - Center */}
        <div className="user-section">
          <p className="user-text">
            <strong>Bem-vindo, {userName.split(' ')[0]}!</strong>
            Seus dados estão seguros
          </p>
        </div>

        {/* Actions - Right */}
        <div className="actions-section">
          {userId && <NotificationBell userId={userId} />}
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="action-button"
            title="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link href="/settings" className="menu-item">
          <Settings size={18} />
          Configurações
        </Link>
        <button
          onClick={handleLogout}
          className="menu-item danger"
          style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </header>
  )
}
