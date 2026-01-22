import { NextRequest, NextResponse } from 'next/server'
import { setUserRole, getCurrentUser } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId e role são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['admin', 'cliente'].includes(role)) {
      return NextResponse.json(
        { error: 'Role deve ser "admin" ou "cliente"' },
        { status: 400 }
      )
    }

    // Opcional: Validar que quem está fazendo a requisição é admin
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { data, error } = await setUserRole(userId, role)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar role: ${error}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: `Usuário ${userId} definido como ${role}`,
      data 
    })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
