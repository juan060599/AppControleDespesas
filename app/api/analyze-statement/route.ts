import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface ParsedTransaction {
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY não configurada no servidor' },
        { status: 500 }
      )
    }

    const { fileContent } = await request.json()

    if (!fileContent) {
      return NextResponse.json(
        { error: 'Arquivo não enviado' },
        { status: 400 }
      )
    }

    const prompt = `Analise este extrato bancário e extraia TODAS as transações.
  
Para cada transação, identifique:
- Data (formato: YYYY-MM-DD)
- Descrição da transação
- Valor numérico (apenas números, sem símbolos)
- Tipo: 'income' para receitas/créditos ou 'expense' para despesas/débitos
- Categoria: Classifique em: Alimentação, Transporte, Habitação, Saúde, Educação, Lazer, Salário, Investimentos ou Outros

Retorne em formato JSON válido como um array de objetos:
[
  {
    "date": "2024-01-15",
    "description": "Descrição clara",
    "amount": 150.50,
    "type": "expense",
    "category": "Alimentação"
  }
]

IMPORTANTE: 
- Retorne APENAS o array JSON, sem explicações
- Se for depósito/transferência recebida = income
- Se for débito/pagamento = expense
- A descrição deve ser clara e resumida
- O amount deve ser sempre positivo (tipo define se é entrada ou saída)

Extrato:
${fileContent}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: `OpenAI error: ${error.error?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'Nenhuma resposta da IA' },
        { status: 500 }
      )
    }

    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'IA não retornou JSON válido' },
        { status: 500 }
      )
    }

    const transactions: ParsedTransaction[] = JSON.parse(jsonMatch[0])

    // Validate transactions
    const validated = transactions.filter((t) => {
      return (
        t.date &&
        t.description &&
        typeof t.amount === 'number' &&
        (t.type === 'income' || t.type === 'expense') &&
        t.category
      )
    })

    return NextResponse.json({ transactions: validated })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
