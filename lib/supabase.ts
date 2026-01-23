import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Validate environment variables at runtime for server-side code
if (typeof window === 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
    console.warn('Warning: Supabase environment variables are not set. API calls will fail at runtime.')
  }
}
