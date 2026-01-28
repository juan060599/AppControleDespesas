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

export async function getTransactionsByPeriod(
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })
  return { data, error }
}

export function getPeriodDates(period: 'current-month' | 'last-month' | 'last-3-months' | 'last-6-months' | 'last-year' | 'all-time') {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  
  let startDate: Date
  let endDate = new Date()
  
  switch (period) {
    case 'current-month':
      startDate = new Date(currentYear, currentMonth, 1)
      break
    case 'last-month':
      startDate = new Date(currentYear, currentMonth - 1, 1)
      endDate = new Date(currentYear, currentMonth, 0)
      break
    case 'last-3-months':
      startDate = new Date(currentYear, currentMonth - 3, 1)
      break
    case 'last-6-months':
      startDate = new Date(currentYear, currentMonth - 6, 1)
      break
    case 'last-year':
      startDate = new Date(currentYear - 1, currentMonth, 1)
      break
    case 'all-time':
      startDate = new Date(2020, 0, 1)
      break
    default:
      startDate = new Date(currentYear, currentMonth, 1)
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
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
  // Calculate subscription dates (30 days from now)
  const now = new Date()
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const { data, error } = await supabase
    .from('user_plans')
    .upsert([
      {
        user_id: userId,
        plan_name: planName,
        stripe_subscription_id: stripeSubscriptionId,
        active: true,
        subscription_start_date: now.toISOString(),
        subscription_end_date: endDate.toISOString(),
        auto_renew: true,
      },
    ])
    .select()
  return { data, error }
}

// User roles functions
export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return { role: data?.role || 'cliente', error }
}

export async function setUserRole(userId: string, role: 'admin' | 'cliente') {
  const { data, error } = await supabase
    .from('user_roles')
    .upsert([
      {
        user_id: userId,
        role: role,
      },
    ])
    .select()
  return { data, error }
}

export async function updateUserRoleByEmail(email: string, role: 'admin' | 'cliente') {
  // First, find the user by email
  const { data: authData } = await supabase.auth.admin.listUsers()
  const user = authData?.users?.find((u) => u.email === email)
  
  if (!user) {
    return { data: null, error: new Error('Usuário não encontrado') }
  }

  // Update the role
  const result = await setUserRole(user.id, role)
  return result
}

// API Keys functions
export async function getApiKey(keyName: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('key_value')
    .eq('key_name', keyName)
    .single()
  return { value: data?.key_value || '', error }
}

export async function getAllApiKeys() {
  const { data, error } = await supabase
    .from('api_keys')
    .select('key_name, key_value, description')
  return { data, error }
}

export async function updateApiKey(keyName: string, keyValue: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ key_value: keyValue, updated_at: new Date().toISOString() })
    .eq('key_name', keyName)
    .select()
  return { data, error }
}

// Category Limits functions
export interface CategoryLimit {
  id: string
  user_id: string
  category: string
  limit_amount: number
  created_at: string
  updated_at: string
}

export async function getCategoryLimits(userId: string) {
  const { data, error } = await supabase
    .from('category_limits')
    .select('*')
    .eq('user_id', userId)
    .order('category', { ascending: true })
  return { data, error }
}

export async function setCategoryLimit(userId: string, category: string, limitAmount: number) {
  // First try to find existing record
  const { data: existing } = await supabase
    .from('category_limits')
    .select('id')
    .eq('user_id', userId)
    .eq('category', category)
    .single()

  if (existing?.id) {
    // Update existing record
    const { data, error } = await supabase
      .from('category_limits')
      .update({
        limit_amount: limitAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
    return { data, error }
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('category_limits')
      .insert([
        {
          user_id: userId,
          category: category,
          limit_amount: limitAmount,
        },
      ])
      .select()
    return { data, error }
  }
}

export async function deleteCategoryLimit(id: string) {
  const { error } = await supabase
    .from('category_limits')
    .delete()
    .eq('id', id)
  return { error }
}

// Function to get spending by category for current month
export async function getCategorySpendingThisMonth(userId: string) {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('category, amount')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .gte('date', firstDayOfMonth)

  if (error || !data) {
    return { data: {}, error }
  }

  const categorySpending: { [key: string]: number } = {}
  data.forEach((t) => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
  })

  return { data: categorySpending, error: null }
}

// Function to get spending by category for previous month
export async function getCategorySpendingLastMonth(userId: string) {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstDayLastMonth = new Date(firstDayOfMonth.getTime() - 1)
  const lastMonthStart = new Date(firstDayLastMonth.getFullYear(), firstDayLastMonth.getMonth(), 1)
    .toISOString()
    .split('T')[0]
  const lastMonthEnd = firstDayOfMonth.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('category, amount')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .gte('date', lastMonthStart)
    .lt('date', lastMonthEnd)

  if (error || !data) {
    return { data: {}, error }
  }

  const categorySpending: { [key: string]: number } = {}
  data.forEach((t) => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
  })

  return { data: categorySpending, error: null }
}

// RECURRING EXPENSES
export interface RecurringExpense {
  id: string
  user_id: string
  description: string
  amount: number
  category: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  next_charge_date: string
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export async function getRecurringExpenses(userId: string) {
  const { data, error } = await supabase
    .from('recurring_expenses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('next_charge_date', { ascending: true })
  return { data, error }
}

export async function addRecurringExpense(expense: Omit<RecurringExpense, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('recurring_expenses')
    .insert([expense])
    .select()
  return { data, error }
}

export async function updateRecurringExpense(id: string, updates: Partial<RecurringExpense>) {
  const { data, error } = await supabase
    .from('recurring_expenses')
    .update(updates)
    .eq('id', id)
    .select()
  return { data, error }
}

export async function deleteRecurringExpense(id: string) {
  const { error } = await supabase
    .from('recurring_expenses')
    .delete()
    .eq('id', id)
  return { error }
}

// FINANCIAL GOALS
export interface FinancialGoal {
  id: string
  user_id: string
  name: string
  description?: string
  target_amount: number
  current_amount: number
  goal_type: 'vacation' | 'emergency_fund' | 'debt_payoff' | 'investment' | 'purchase' | 'other'
  target_date: string
  icon?: string
  color?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getFinancialGoals(userId: string) {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('target_date', { ascending: true })
  return { data, error }
}

export async function addFinancialGoal(goal: Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('financial_goals')
    .insert([goal])
    .select()
  return { data, error }
}

export async function updateFinancialGoal(id: string, updates: Partial<FinancialGoal>) {
  const { data, error } = await supabase
    .from('financial_goals')
    .update(updates)
    .eq('id', id)
    .select()
  return { data, error }
}

export async function deleteFinancialGoal(id: string) {
  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', id)
  return { error }
}