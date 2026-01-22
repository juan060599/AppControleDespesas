'use client'

import SignUpForm from '@/components/SignUpForm'
import { UserPlus } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl"></div>

          {/* Header Section */}
          <div className="text-center mb-8 pt-4">
            {/* Icon with background */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              FinControl
            </h1>
            <p className="text-gray-600 text-sm font-medium mb-1">
              Crie Sua Conta
            </p>
            <p className="text-gray-500 text-xs">
              Comece a gerenciar suas finanças hoje mesmo
            </p>
          </div>

          {/* Sign Up Form */}
          <SignUpForm />

          {/* Features Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-semibold">Análise</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-semibold">Seguro</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.5 1.5H5a2 2 0 00-2 2v3H2.5a1 1 0 000 2H3v2H2.5a1 1 0 000 2H3v2H2.5a1 1 0 000 2H3v3a2 2 0 002 2h5.5V1.5zM6 5a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-semibold">Rápido</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Dados encriptados e seguros
          </p>
        </div>
      </div>
    </div>
  )
}
