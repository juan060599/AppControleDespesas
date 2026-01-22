'use client'

import { useState } from 'react'
import { signUp } from '@/lib/database'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, UserPlus, CheckCircle, AlertCircle } from 'lucide-react'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password, name)

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-800 font-medium">
          Conta criada com sucesso! Redirecionando...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
          Nome Completo
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-3.5 w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition" />
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            placeholder="João Silva"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
          Email
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
          Senha
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            placeholder="••••••••"
          />
        </div>
        <p className="mt-2 text-xs text-gray-600 font-medium">Mínimo 6 caracteres para sua segurança</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105 active:scale-95"
      >
        <UserPlus className="w-5 h-5" />
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500 text-xs font-medium">JÁ TEM CONTA?</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        <Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition cursor-pointer">
          Entrar aqui
        </Link>
      </p>
    </form>
  )
}

