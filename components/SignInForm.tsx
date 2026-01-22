'use client'

import { useState } from 'react'
import { signIn } from '@/lib/database'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {error && (
        <div style={{
          borderRadius: '8px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          padding: '12px 16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <p style={{ fontSize: '14px', color: '#991b1b', margin: 0, fontWeight: '500' }}>
            {error}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Email
        </label>
        <div style={{ position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#9ca3af" style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            pointerEvents: 'none'
          }}>
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '12px',
              paddingTop: '10px',
              paddingBottom: '10px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              background: '#ffffff',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
              outlineStyle: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Senha
        </label>
        <div style={{ position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#9ca3af" style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            pointerEvents: 'none'
          }}>
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '12px',
              paddingTop: '10px',
              paddingBottom: '10px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              background: '#ffffff',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
              outlineStyle: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: loading ? 'rgba(59, 130, 246, 0.7)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.3s',
          boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
          opacity: loading ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            (e.target as HTMLElement).style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
            ;(e.target as HTMLElement).style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
            ;(e.target as HTMLElement).style.transform = 'translateY(0)'
          }
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM16.243 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM10 15a1 1 0 100 2v1a1 1 0 100-2v-1zM5.757 13.243a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM4 10a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zM4.343 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414L4.343 4.343z" />
        </svg>
        {loading ? 'Autenticando...' : 'Entrar'}
      </button>

      {/* Divider */}
      <div style={{
        position: 'relative',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        margin: '8px 0'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '1px',
          background: '#e5e7eb'
        }}></div>
        <div style={{
          position: 'relative',
          background: '#ffffff',
          paddingLeft: '12px',
          paddingRight: '12px',
          fontSize: '12px',
          color: '#9ca3af',
          fontWeight: '500',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          NÃO TEM CONTA?
        </div>
      </div>

      {/* Sign Up Link */}
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: '0' }}>
        <Link href="/signup" style={{
          color: '#3b82f6',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }} onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')} onMouseLeave={(e) => (e.currentTarget.style.color = '#3b82f6')}>
          Criar uma agora
        </Link>
      </p>
    </form>
  )
}
