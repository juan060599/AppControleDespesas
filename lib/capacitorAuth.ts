import { supabase } from './supabase'

let authInitialized = false

// Initialize Supabase session on Capacitor
export async function initializeCapacitorAuth() {
  if (authInitialized) {
    console.log('initializeCapacitorAuth: Already initialized')
    return
  }

  try {
    console.log('initializeCapacitorAuth: Starting...')
    
    // Set up auth state listener - this will help restore session automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('onAuthStateChange: Event -', event, 'Has session:', !!session)
      }
    )

    // Try to restore session from storage
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('initializeCapacitorAuth: Error restoring session -', error)
    } else {
      console.log('initializeCapacitorAuth: Session restored -', !!data?.session)
    }

    authInitialized = true
    console.log('initializeCapacitorAuth: Complete')
    
    return () => {
      subscription?.unsubscribe()
    }
  } catch (error) {
    console.error('initializeCapacitorAuth: Fatal error -', error)
    authInitialized = true
  }
}

// Ensure auth is set up before making requests
export async function ensureAuthenticated() {
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session
  } catch (error) {
    console.error('ensureAuthenticated: Error -', error)
    return null
  }
}

