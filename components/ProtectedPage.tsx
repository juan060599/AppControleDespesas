'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUser } from '@/lib/useAuthUser'

interface ProtectedPageProps {
  children: (user: any) => ReactNode
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const router = useRouter()
  const { user, loading, error } = useAuthUser()

  useEffect(() => {
    if (!loading && (!user || error)) {
      console.log('ProtectedPage: Redirecting to signin. User:', !!user, 'Error:', error)
      // Delay redirect to give time for auth to finalize
      const timer = setTimeout(() => {
        router.push('/signin')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [user, loading, error, router])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f0f5ff 0%, #ffffff 100%)',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666',
        }}>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || error) {
    return null
  }

  return <>{children(user)}</>
}
