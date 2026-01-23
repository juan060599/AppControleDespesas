'use client'

import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  subtitle?: string
  backgroundColor?: string
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  backgroundColor = colors.primary[50]
}: StatCardProps) {
  return (
    <div style={{
      background: colors.background.light,
      borderRadius: borderRadius.xl,
      boxShadow: shadows.md,
      border: `1px solid ${colors.primary[100]}`,
      padding: 'clamp(12px, 3vw, 24px) clamp(12px, 2vw, 16px)',
      minHeight: 'clamp(100px, 25vw, 140px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: transitions.normal,
      cursor: 'pointer',
    } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.lg
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.md
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Background Accent */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: 'clamp(100px, 15vw, 120px)',
        height: 'clamp(100px, 15vw, 120px)',
        background: `radial-gradient(circle, ${backgroundColor}60 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
      }}></div>

      {/* Header with Icon and Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'clamp(8px, 1.5vw, 12px)',
        position: 'relative',
        zIndex: 1,
        gap: 'clamp(8px, 2vw, 12px)',
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontSize: 'clamp(11px, 1.5vw, 12px)',
            color: colors.secondary[500],
            fontWeight: 600,
            margin: 0,
            marginBottom: 'clamp(4px, 1vw, 6px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </p>
          {subtitle && (
            <p style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)',
              color: colors.secondary[400],
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{
          width: 'clamp(40px, 10vw, 48px)',
          height: 'clamp(40px, 10vw, 48px)',
          background: backgroundColor,
          borderRadius: borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {/* Value and Trend */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
        gap: 'clamp(8px, 2vw, 12px)',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 'clamp(18px, 5vw, 24px)',
            fontWeight: 700,
            color: colors.secondary[900],
            margin: 0,
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {value}
          </p>
        </div>

        {trend !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 6px)',
            padding: `clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 12px)`,
            background: trend > 0 ? colors.status.success + '15' : colors.status.error + '15',
            borderRadius: borderRadius.md,
            flexShrink: 0,
          }}>
            {trend > 0 ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.status.success} strokeWidth="2">
                <polyline points="23 6 13.46 15.54 8 10.09 1 17"></polyline>
                <polyline points="23 6 23 16 13 16"></polyline>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.status.error} strokeWidth="2">
                <polyline points="23 18 13.46 8.46 8 13.91 1 7"></polyline>
                <polyline points="23 18 23 8 13 8"></polyline>
              </svg>
            )}
            <span style={{
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              fontWeight: 600,
              color: trend > 0 ? colors.status.success : colors.status.error,
              whiteSpace: 'nowrap',
            }}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
