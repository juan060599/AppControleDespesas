import { useState, useEffect } from 'react'
import { getCurrentUser } from './database'
import { Capacitor } from '@capacitor/core'

export function useAuthUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let retries = 0
    const maxRetries = 5

    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('useAuthUser: Starting to load user...')
        
        // On native platforms, wait longer for session to be restored
        if (Capacitor.isNativePlatform()) {
          console.log('useAuthUser: Running on native platform')
          
          // Try multiple times as the session might need time to restore
          while (retries < maxRetries && mounted) {
            console.log('useAuthUser: Attempt', retries + 1)
            
            const currentUser = await getCurrentUser()
            
            if (currentUser) {
              console.log('useAuthUser: User found!')
              setUser(currentUser)
              setLoading(false)
              return
            }
            
            retries++
            if (retries < maxRetries) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 800))
            }
          }
        } else {
          // Web platform
          const currentUser = await getCurrentUser()
          if (currentUser) {
            console.log('useAuthUser: User found (web)!')
            setUser(currentUser)
            setLoading(false)
            return
          }
        }
        
        console.log('useAuthUser: No user found after retries')
        setError('No user found')
        setLoading(false)
      } catch (err) {
        console.error('useAuthUser: Error -', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [])

  return { user, loading, error }
}
