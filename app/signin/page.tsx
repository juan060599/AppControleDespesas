'use client'

import SignInForm from '@/components/SignInForm'
import { PieChart } from 'lucide-react'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f0f5ff 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      {/* Main Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.1)',
          padding: '40px 32px',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          position: 'relative'
        }}>
          {/* Top Border Accent */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(to right, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '16px 16px 0 0'
          }}></div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '8px' }}>
            {/* Logo Circle */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                position: 'relative'
              }}>
                <PieChart color="white" size={40} />
              </div>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#003d99',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px'
            }}>
              FinControl
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '14px',
              color: '#4b5563',
              margin: '0 0 4px 0',
              fontWeight: '500'
            }}>
              Sua Gestão Financeira Inteligente
            </p>

            {/* Description */}
            <p style={{
              fontSize: '13px',
              color: '#7a8699',
              margin: '0'
            }}>
              Controle suas receitas e despesas com facilidade
            </p>
          </div>

          {/* Form */}
          <SignInForm />

          {/* Features */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#f0f5ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#3b82f6">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <p style={{
                fontSize: '12px',
                color: '#4b5563',
                margin: '0',
                fontWeight: '600'
              }}>
                Análise
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#f0f5ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#3b82f6">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p style={{
                fontSize: '12px',
                color: '#4b5563',
                margin: '0',
                fontWeight: '600'
              }}>
                Seguro
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#f0f5ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#3b82f6">
                  <path d="M10.5 1.5H5a2 2 0 00-2 2v3H2.5a1 1 0 000 2H3v2H2.5a1 1 0 000 2H3v2H2.5a1 1 0 000 2H3v3a2 2 0 002 2h5.5V1.5zM6 5a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1z" />
                </svg>
              </div>
              <p style={{
                fontSize: '12px',
                color: '#4b5563',
                margin: '0',
                fontWeight: '600'
              }}>
                Rápido
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#9ca3af">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Dados encriptados e seguros
          </p>
        </div>
      </div>
    </div>
  )
}
