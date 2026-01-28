import { useEffect, useState } from 'react'
import { getAnalysisUsage, getCurrentUser, getUserRole, getUserPlan } from '@/lib/database'

export function useAnalysisLimit() {
  const [analysisCount, setAnalysisCount] = useState(0)
  const [analysisLimit, setAnalysisLimit] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [canAnalyze, setCanAnalyze] = useState(false)
  const [hasActivePlan, setHasActivePlan] = useState(false)

  useEffect(() => {
    const checkAnalysisLimit = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          setCanAnalyze(false)
          setIsLoading(false)
          return
        }

        // Check if user is admin (unlimited analyses)
        const { role } = await getUserRole(user.id)
        if (role === 'admin') {
          setAnalysisLimit(999999) // Unlimited for admins
          setAnalysisCount(0)
          setCanAnalyze(true)
          setHasActivePlan(true)
          setIsLoading(false)
          return
        }

        // Check if user has active monthly subscription
        const { data: planData } = await getUserPlan(user.id)
        
        let limit = 5 // Default: 5 analyses per month for free users
        let count = 0
        let isActivePlan = false
        
        if (planData && planData.active && planData.plan_name === 'pro') {
          // Check if subscription is still valid
          const now = new Date()
          const endDate = new Date(planData.subscription_end_date)
          
          if (now < endDate) {
            // Subscription is active and valid - unlimited analyses
            limit = 999999
            count = 0
            isActivePlan = true
          } else {
            // Subscription expired - fall back to free tier
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
            const { data: usageData } = await getAnalysisUsage(user.id, currentMonth)
            count = usageData?.usage_count || 0
            isActivePlan = false
          }
        } else {
          // Free user - check usage
          const now = new Date()
          const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
          const { data: usageData } = await getAnalysisUsage(user.id, month)
          count = usageData?.usage_count || 0
          isActivePlan = false
        }

        setAnalysisLimit(limit)
        setAnalysisCount(count)
        setCanAnalyze(count < limit)
        setHasActivePlan(isActivePlan)
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
    hasActivePlan,
  }
}
