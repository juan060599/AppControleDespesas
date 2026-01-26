import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function useAuthSession() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let retryCount = 0
    const maxRetries = 10
    const retryDelay = 200

    const loadSession = async () => {
      try {
        // Tenta obter a sessão com retry
        let session = null
        let lastError = null

        while (!session && retryCount < maxRetries) {
          try {
            const { data, error } = await supabase.auth.getSession()
            if (error) throw error
            session = data?.session
            if (session) break
          } catch (err) {
            lastError = err
            retryCount++
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay))
            }
          }
        }

        if (!isMounted) return

        if (!session?.user) {
          setUser(null)
          setError(null)
          return
        }

        setUser(session.user)
        setError(null)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          if (session?.user) {
            setUser(session.user)
            setError(null)
          } else {
            setUser(null)
          }
        }
      }
    )

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
