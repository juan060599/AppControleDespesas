import { supabase } from './supabase'
import { Capacitor } from '@capacitor/core'

// Initialize Supabase session on Capacitor
export async function initializeCapacitorAuth() {
  try {
    // Check if we're running on Capacitor
    if (!Capacitor.isNativePlatform()) {
      return
    }

    // Restore session from Supabase
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error restoring session:', error)
    }

    if (data?.session) {
      // Session already exists and is valid
      return data.session
    }
  } catch (error) {
    console.error('Error initializing Capacitor auth:', error)
  }
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
