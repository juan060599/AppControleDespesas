'use client'

import { useEffect, useState, ReactNode } from 'react'
import { initializeCapacitorAuth } from '@/lib/capacitorAuth'
import { supabase } from '@/lib/supabase'

interface AuthInitializerProps {
  children: ReactNode
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        console.log('AuthInitializer: Starting auth initialization...')
        
        // Initialize auth
        await initializeCapacitorAuth()
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('AuthInitializer: Auth state changed -', event, !!session)
          }
        )

        // Mark as ready
        setReady(true)
        console.log('AuthInitializer: Ready')

        return () => {
          subscription?.unsubscribe()
        }
      } catch (error) {
        console.error('AuthInitializer: Failed to initialize:', error)
        setReady(true) // Still mark as ready even if there's an error
      }
    }

    init()
  }, [])

  // Still render children even if not ready, to avoid blank screen
  return <>{children}</>
}
