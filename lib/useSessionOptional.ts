import { useState, useEffect } from 'react'
import { getCurrentUser } from './database'

/**
 * Hook para carregar sessão do usuário SEM redirecionar para login
 * Use este hook quando quiser permitir acesso à página mesmo sem autenticação
 * Verifique a autenticação apenas quando necessário (ex: no checkout)
 */
export function useSessionOptional() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (err) {
        console.error('useSessionOptional: Error loading user -', err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  return { user, loading }
}
