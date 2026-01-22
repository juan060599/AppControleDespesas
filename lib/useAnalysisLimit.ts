import { useEffect, useState } from 'react'
import { getAnalysisUsage, getCurrentUser } from '@/lib/database'

export function useAnalysisLimit() {
  const [analysisCount, setAnalysisCount] = useState(0)
  const [analysisLimit, setAnalysisLimit] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [canAnalyze, setCanAnalyze] = useState(false)

  useEffect(() => {
    const checkAnalysisLimit = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          setCanAnalyze(false)
          setIsLoading(false)
          return
        }

        // Get current month in YYYY-MM format
        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

        const { data } = await getAnalysisUsage(user.id, month)

        // Default: 5 analyses per month for free users
        const limit = 5
        const count = data?.usage_count || 0

        setAnalysisLimit(limit)
        setAnalysisCount(count)
        setCanAnalyze(count < limit)
      } catch (error) {
        console.error('Error checking analysis limit:', error)
        setCanAnalyze(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAnalysisLimit()
  }, [])

  return {
    analysisCount,
    analysisLimit,
    canAnalyze,
    isLoading,
    remaining: Math.max(0, analysisLimit - analysisCount),
  }
}
