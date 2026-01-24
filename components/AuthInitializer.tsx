'use client'

import { useEffect, ReactNode } from 'react'
import { initializeCapacitorAuth } from '@/lib/capacitorAuth'

interface AuthInitializerProps {
  children: ReactNode
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  useEffect(() => {
    // Initialize auth immediately when app loads
    const init = async () => {
      try {
        await initializeCapacitorAuth()
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      }
    }

    init()
  }, [])

  return <>{children}</>
}
