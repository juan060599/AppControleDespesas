'use client'

import { useState } from 'react'
import { addTransaction } from '@/lib/database'
import { useRouter } from 'next/navigation'

const EXPENSE_CATEGORIES = ['Alimentação', 'Transporte', 'Habitação', 'Saúde', 'Educação', 'Lazer', 'Outros']
const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Investimentos', 'Outros']

interface TransactionFormProps {
  userId: string
  onSuccess?: () => void
}

export default function TransactionForm({ userId, onSuccess }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!description || !amount) {
      setError('Preencha todos os campos')
      return
    }

    setLoading(true)

    const { error: addError } = await addTransaction({
      user_id: userId,
      description,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Receita' : category,
      date,
    })

    if (addError) {
      setError(addError.message)
    } else {
      setDescription('')
      setAmount('')
      setCategory(EXPENSE_CATEGORIES[0])
      setDate(new Date().toISOString().split('T')[0])
      if (onSuccess) {
        onSuccess()
      }
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Adicionar Transação</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={type === 'expense'}
                onChange={(e) => {
                  setType('expense')
                  setCategory(EXPENSE_CATEGORIES[0])
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Despesa</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={(e) => {
                  setType('income')
                  setCategory(INCOME_CATEGORIES[0])
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Receita</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva a transação"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Valor (R$)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adicionando...' : 'Adicionar Transação'}
        </button>
      </form>
    </div>
  )
}
