import { useState, useEffect } from 'react'
import { getCurrentUser } from './database'

export function useAuthUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Wait a bit for session to be restored
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const currentUser = await getCurrentUser()
        
        if (mounted) {
          if (currentUser) {
            setUser(currentUser)
          } else {
            setError('No user found')
          }
          setLoading(false)
        }
      } catch (err) {
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
