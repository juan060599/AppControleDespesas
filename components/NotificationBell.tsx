'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { colors } from '@/lib/designSystem'
import { getCategoryLimits, getCategorySpendingThisMonth, getCategorySpendingLastMonth, CategoryLimit } from '@/lib/database'

interface NotificationBellProps {
  userId: string
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const [limitsRes, thisMonthRes, lastMonthRes] = await Promise.all([
          getCategoryLimits(userId),
          getCategorySpendingThisMonth(userId),
          getCategorySpendingLastMonth(userId),
        ])

        const limits = limitsRes.data || []
        const thisMonth = (thisMonthRes.data || {}) as Record<string, number>
        const lastMonth = (lastMonthRes.data || {}) as Record<string, number>

        const newAlerts: any[] = []

        limits.forEach((limit: CategoryLimit) => {
          const current = thisMonth[limit.category] || 0
          const percentage = (current / limit.limit_amount) * 100
          const lastMonthSpend = lastMonth[limit.category] || 0

          if (current > limit.limit_amount) {
            newAlerts.push({
              id: `${limit.id}-exceeded`,
              type: 'limit_exceeded',
              category: limit.category,
              icon: '🚨',
              message: `Limite excedido em ${limit.category}`,
              details: `Gastou R$ ${current.toFixed(2)} de R$ ${limit.limit_amount.toFixed(2)}`,
              severity: 'high',
            })
          } else if (percentage >= 80) {
            newAlerts.push({
              id: `${limit.id}-approaching`,
              type: 'approaching_limit',
              category: limit.category,
              icon: '⚠️',
              message: `Próximo ao limite em ${limit.category}`,
              details: `${percentage.toFixed(0)}% do seu limite`,
              severity: 'medium',
            })
          }

          if (current > lastMonthSpend * 1.2 && lastMonthSpend > 0) {
            newAlerts.push({
              id: `${limit.id}-overspend`,
              type: 'overspending_vs_last_month',
              category: limit.category,
              icon: '📈',
              message: `Gastou mais em ${limit.category}`,
              details: `+${((current / lastMonthSpend - 1) * 100).toFixed(0)}% comparado ao mês anterior`,
              severity: 'low',
            })
          }
        })

        setAlerts(newAlerts)
      } catch (error) {
        console.error('Error loading alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAlerts()

    const interval = setInterval(loadAlerts, 60000)
    return () => clearInterval(interval)
  }, [userId])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <style>{`
        .notification-bell-button {
          position: relative;
          width: 36px;
          height: 36px;
          background-color: #f5f5f5;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        @media (min-width: 480px) {
          .notification-bell-button {
            width: 40px;
            height: 40px;
          }
        }

        .notification-bell-button:hover {
          background-color: #efefef;
        }

        .notification-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #ef5350;
          color: white;
          font-size: 10px;
          font-weight: bold;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          line-height: 1;
        }

        @media (min-width: 480px) {
          .notification-badge {
            top: -10px;
            right: -10px;
            font-size: 11px;
            width: 22px;
            height: 22px;
          }
        }

        .notification-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .notification-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-height: 80vh;
          background-color: white;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @media (min-width: 768px) {
          .notification-overlay {
            display: none;
          }

          .notification-panel {
            position: absolute;
            bottom: auto;
            top: calc(100% + 8px);
            left: auto;
            right: 0;
            width: 320px;
            max-height: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s ease;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        .notification-header {
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background-color: white;
          border-radius: 16px 16px 0 0;
        }

        @media (min-width: 480px) {
          .notification-header {
            padding: 18px;
          }
        }

        @media (min-width: 768px) {
          .notification-header {
            border-radius: 8px 8px 0 0;
          }
        }

        .notification-header-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }

        @media (min-width: 480px) {
          .notification-header-title {
            font-size: 17px;
          }
        }

        .notification-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .notification-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        @media (min-width: 480px) {
          .notification-list {
            padding: 14px;
          }
        }

        @media (min-width: 768px) {
          .notification-list {
            max-height: 300px;
          }
        }

        .notification-item {
          padding: 12px;
          margin-bottom: 8px;
          background-color: #f9f9f9;
          border-left: 4px solid #ffc107;
          border-radius: 6px;
          cursor: default;
        }

        @media (min-width: 480px) {
          .notification-item {
            padding: 14px;
            margin-bottom: 10px;
          }
        }

        .notification-item.severity-high {
          border-left-color: #ef5350;
          background-color: #ffebee;
        }

        .notification-item.severity-medium {
          border-left-color: #ffc107;
          background-color: #fffde7;
        }

        .notification-item.severity-low {
          border-left-color: #66bb6a;
          background-color: #f1f8e9;
        }

        .notification-item-icon {
          font-size: 20px;
          margin-right: 8px;
          display: inline-block;
        }

        .notification-item-message {
          font-size: 13px;
          font-weight: bold;
          color: #333;
          margin: 0 0 4px 0;
        }

        @media (min-width: 480px) {
          .notification-item-message {
            font-size: 14px;
            margin-bottom: 6px;
          }
        }

        .notification-item-details {
          font-size: 12px;
          color: #666;
          margin: 0;
        }

        @media (min-width: 480px) {
          .notification-item-details {
            font-size: 13px;
          }
        }

        .notification-empty {
          padding: 32px 16px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }

        @media (min-width: 480px) {
          .notification-empty {
            padding: 40px 20px;
            font-size: 15px;
          }
        }

        .notification-loading {
          padding: 24px;
          text-align: center;
          color: #999;
          font-size: 13px;
        }

        @media (min-width: 480px) {
          .notification-loading {
            padding: 28px;
            font-size: 14px;
          }
        }
      `}</style>

      <button
        className="notification-bell-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: colors.primary[500] }}
        title="Notificações"
      >
        <Bell size={18} />
        {alerts.length > 0 && (
          <div className="notification-badge">
            {alerts.length > 9 ? '9+' : alerts.length}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          {isMobile && (
            <div className="notification-overlay" onClick={handleOverlayClick} />
          )}

          <div className="notification-panel">
            <div className="notification-header">
              <h3 className="notification-header-title">🔔 Notificações</h3>
              <button
                className="notification-close-btn"
                onClick={() => setIsOpen(false)}
                title="Fechar notificações"
              >
                <X size={20} />
              </button>
            </div>

            <div className="notification-list">
              {isLoading ? (
                <div className="notification-loading">
                  Carregando notificações...
                </div>
              ) : alerts.length === 0 ? (
                <div className="notification-empty">
                  ✨ Nenhuma notificação no momento
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`notification-item severity-${alert.severity}`}
                  >
                    <span className="notification-item-icon">{alert.icon}</span>
                    <p className="notification-item-message">
                      {alert.message}
                    </p>
                    <p className="notification-item-details">
                      {alert.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
