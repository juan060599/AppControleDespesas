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
      padding: spacing.xl,
      minHeight: '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: transitions.normal,
      cursor: 'pointer',
      ':hover': {
        boxShadow: shadows.lg,
        transform: 'translateY(-2px)',
      }
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
        width: '120px',
        height: '120px',
        background: `radial-gradient(circle, ${backgroundColor}60 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
      }}></div>

      {/* Header with Icon and Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
        position: 'relative',
        zIndex: 1,
      }}>
        <div>
          <p style={{
            fontSize: typography.small.fontSize,
            color: colors.secondary[500],
            fontWeight: 600,
            margin: 0,
            marginBottom: spacing.xs,
          }}>
            {title}
          </p>
          {subtitle && (
            <p style={{
              fontSize: '11px',
              color: colors.secondary[400],
              margin: 0,
            }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{
          width: '48px',
          height: '48px',
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
      }}>
        <div>
          <p style={{
            fontSize: '28px',
            fontWeight: 700,
            color: colors.secondary[900],
            margin: 0,
            lineHeight: '1.2',
          }}>
            {value}
          </p>
        </div>

        {trend !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            padding: `${spacing.xs} ${spacing.md}`,
            background: trend > 0 ? colors.status.success + '15' : colors.status.error + '15',
            borderRadius: borderRadius.md,
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
              fontSize: '12px',
              fontWeight: 600,
              color: trend > 0 ? colors.status.success : colors.status.error,
            }}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
