import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail } = await request.json()

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'userId e userEmail são obrigatórios' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY não configurada')
      return NextResponse.json(
        { error: 'Erro de configuração no servidor' },
        { status: 500 }
      )
    }

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: {
        userId: userId,
      },
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'FinControl Pro - 5 Análises Mensais',
              description: '5 análises de extratos com IA por mês',
            },
            unit_amount: 1990, // 19.90 em centavos
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        userId: userId,
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Falha ao gerar URL de checkout' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: `Erro ao criar sessão de checkout: ${errorMessage}` },
      { status: 500 }
    )
  }
}
