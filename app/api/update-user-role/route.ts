import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email e role são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['admin', 'cliente'].includes(role)) {
      return NextResponse.json(
        { error: 'Role deve ser "admin" ou "cliente"' },
        { status: 400 }
      )
    }

    // Get all users from auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError || !users) {
      return NextResponse.json(
        { error: 'Erro ao buscar usuários' },
        { status: 500 }
      )
    }

    // Find user by email
    const user = users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Update user role
    const { data, error } = await supabase
      .from('user_roles')
      .upsert([
        {
          user_id: user.id,
          role: role,
        },
      ])
      .select()

    if (error) {
      console.error('Error updating role:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar role' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Role de ${email} atualizado para "${role}"`,
      data,
    })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
