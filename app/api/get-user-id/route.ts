import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas')
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Erro ao listar usuários:', error)
      return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 })
    }

    const user = users?.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ userId: user.id }, { status: 200 })
  } catch (error) {
    console.error('Erro no endpoint:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
