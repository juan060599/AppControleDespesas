import { supabase } from './supabase'
import { Capacitor } from '@capacitor/core'

let authInitialized = false
let sessionRestored = false
let authPromise: Promise<void> | null = null

// Initialize Supabase session on Capacitor
export async function initializeCapacitorAuth() {
  if (authPromise) {
    return authPromise
  }

  authPromise = (async () => {
    try {
      if (authInitialized) {
        return
      }

      // Subscribe to auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          sessionRestored = true
          console.log('Auth state changed:', event, !!session)
        }
      )

      // Try to restore session
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error restoring session:', error)
      } else if (data?.session) {
        sessionRestored = true
        console.log('Session restored successfully')
      }

      authInitialized = true
      
      // Cleanup
      subscription?.unsubscribe()
    } catch (error) {
      console.error('Error initializing Capacitor auth:', error)
      authInitialized = true
    }
  })()

  await authPromise
}

// Wait for auth to be initialized and then get the current user
export async function waitForAuthAndGetUser(maxWaitMs = 5000) {
  // Initialize auth if not done yet
  await initializeCapacitorAuth()

  const startTime = Date.now()
  
  // Wait for session to be restored
  while (Date.now() - startTime < maxWaitMs) {
    const { data } = await supabase.auth.getSession()
    
    if (data?.session?.user) {
      console.log('User found after waiting:', data.session.user.id)
      return data.session.user
    }
    
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Final attempt to refresh
  try {
    const { data: refreshed } = await supabase.auth.refreshSession()
    if (refreshed?.session?.user) {
      console.log('User found after refresh:', refreshed.session.user.id)
      return refreshed.session.user
    }
  } catch (error) {
    console.error('Error refreshing session:', error)
  }
  
  console.log('No user found after waiting')
  return null
}

// Ensure auth is set up before making requests
export async function ensureAuthenticated() {
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session
  } catch (error) {
    console.error('Error checking authentication:', error)
    return null
  }
}

