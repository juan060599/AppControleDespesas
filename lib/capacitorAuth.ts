import { supabase } from './supabase'
import { Capacitor } from '@capacitor/core'

let authInitialized = false
let authPromise: Promise<boolean> | null = null

// Initialize Supabase session on Capacitor
export async function initializeCapacitorAuth() {
  if (authInitialized && authPromise) {
    return authPromise
  }

  authPromise = (async () => {
    try {
      // Restore session from Supabase
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error restoring session:', error)
        return false
      }

      authInitialized = true
      return !!data?.session
    } catch (error) {
      console.error('Error initializing Capacitor auth:', error)
      return false
    }
  })()

  return authPromise
}

// Wait for auth to be initialized and then get the current user
export async function waitForAuthAndGetUser(maxWaitMs = 3000) {
  const startTime = Date.now()
  
  // Initialize auth if not done yet
  await initializeCapacitorAuth()
  
  // Try to get user, with retries
  while (Date.now() - startTime < maxWaitMs) {
    const { data } = await supabase.auth.getSession()
    
    if (data?.session?.user) {
      return data.session.user
    }
    
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
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

