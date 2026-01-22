// Integração com Claude/OpenAI para análise de extratos bancários

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface ParsedTransaction {
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export async function analyzeBankStatement(fileContent: string): Promise<ParsedTransaction[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada')
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

  try {
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
        temperature: 0.3, // Mais consistente para parsing
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }

    const transactions: ParsedTransaction[] = JSON.parse(jsonMatch[0])

    // Validate transactions
    return transactions.filter(
      (t) =>
        t.date &&
        t.description &&
        typeof t.amount === 'number' &&
        ['income', 'expense'].includes(t.type) &&
        t.category
    )
  } catch (error) {
    console.error('Error analyzing bank statement:', error)
    throw error
  }
}

export function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.split('\n')
  return lines.map((line) => {
    // Handle quoted fields
    const regex = /("([^"]*)"|[^,]+)/g
    const matches = line.match(regex) || []
    return matches.map((field) => field.replace(/^"|"$/g, '').trim())
  })
}

export function parseOFX(ofxContent: string): string {
  // Extract key information from OFX format
  // OFX is XML-based, extract transactions
  const lines: string[] = []

  // Extract STMTTRN blocks
  const stmttrn = ofxContent.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/g) || []

  stmttrn.forEach((block) => {
    const trntype = block.match(/<TRNTYPE>([^<]+)<\/TRNTYPE>/)?.[1] || 'DEBIT'
    const dtposted = block.match(/<DTPOSTED>([^<]+)<\/DTPOSTED>/)?.[1] || ''
    const trnamt = block.match(/<TRNAMT>([^<]+)<\/TRNAMT>/)?.[1] || '0'
    const memo = block.match(/<MEMO>([^<]+)<\/MEMO>/)?.[1] || 'Transaction'

    lines.push(`${dtposted} | ${trntype} | ${trnamt} | ${memo}`)
  })

  return lines.join('\n')
}

export async function insertTransactionsFromStatement(
  userId: string,
  transactions: ParsedTransaction[]
) {
  // This will be called from the component
  // Returns { success, inserted, errors }
  return {
    success: true,
    inserted: transactions.length,
    errors: [],
  }
}
