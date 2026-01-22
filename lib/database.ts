import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
}

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  limit: number
  month: string
  created_at: string
}

export interface AnalysisUsage {
  id: string
  user_id: string
  month: string // YYYY-MM format
  usage_count: number
  created_at: string
  updated_at: string
}

// Auth functions
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.user
}

// Transactions functions
export async function addTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
  return { data, error }
}

export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  return { data, error }
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
  return { data, error }
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  return { error }
}

export async function deleteAllTransactions(userId: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId)
  return { error }
}

// Budgets functions
export async function addBudget(budget: Omit<Budget, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('budgets')
    .insert([budget])
    .select()
  return { data, error }
}

export async function getBudgets(userId: string) {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export async function updateBudget(id: string, updates: Partial<Budget>) {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select()
  return { data, error }
}

export async function deleteBudget(id: string) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
  return { error }
}
// Analysis Usage functions
export async function getAnalysisUsage(userId: string, month: string) {
  const { data, error } = await supabase
    .from('analysis_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .single()
  return { data, error }
}

export async function incrementAnalysisUsage(userId: string, month: string) {
  // First try to get existing record
  const { data: existing, error: getError } = await supabase
    .from('analysis_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .single()

  if (getError && getError.code === 'PGRST116') {
    // Record doesn't exist, create it
    const { data, error } = await supabase
      .from('analysis_usage')
      .insert([
        {
          user_id: userId,
          month: month,
          usage_count: 1,
        },
      ])
      .select()
    return { data, error }
  }

  if (getError) return { data: null, error: getError }

  // Record exists, increment it
  const { data, error } = await supabase
    .from('analysis_usage')
    .update({ usage_count: (existing?.usage_count || 0) + 1 })
    .eq('user_id', userId)
    .eq('month', month)
    .select()
  return { data, error }
}

export async function getUserPlan(userId: string) {
  const { data, error } = await supabase
    .from('user_plans')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function setUserPlan(userId: string, planName: string, stripeSubscriptionId: string) {
  const { data, error } = await supabase
    .from('user_plans')
    .upsert([
      {
        user_id: userId,
        plan_name: planName,
        stripe_subscription_id: stripeSubscriptionId,
        active: true,
      },
    ])
    .select()
  return { data, error }
}