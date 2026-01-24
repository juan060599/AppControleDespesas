'use client'

import { useEffect } from 'react'
import { initializeCapacitorAuth } from '@/lib/capacitorAuth'

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeCapacitorAuth()
  }, [])

  return <>{children}</>
}
