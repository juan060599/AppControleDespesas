import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY

interface ParsedTransaction {
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export async function POST(request: NextRequest) {
  try {
    const { fileContent, apiKey } = await request.json()

    // Use API key from request or fallback to environment variable
    const key = apiKey || GEMINI_API_KEY

    if (!key) {
      return NextResponse.json(
        { error: 'Chave Gemini API não configurada. Vá para Configurações e adicione sua chave.' },
        { status: 400 }
      )
    }

    if (!fileContent) {
      return NextResponse.json(
        { error: 'Arquivo não enviado' },
        { status: 400 }
      )
    }

    const prompt = `Extraia TODAS as transações. Responda APENAS com JSON válido, sem markdown, sem explicações.

[{"date":"2026-01-02","description":"Pix recebido","amount":24.00,"type":"income","category":"Outros"},{"date":"2026-01-05","description":"Compra débito","amount":31.90,"type":"expense","category":"Alimentação"}]

Extrato:
${fileContent}`

    const response = await fetch(
        
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 32000,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API Error:', error)
      return NextResponse.json(
        { error: `Gemini error: ${error.error?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      return NextResponse.json(
        { error: 'Nenhuma resposta da IA' },
        { status: 500 }
      )
    }

    // Parse JSON response - remove markdown code blocks if present
    let jsonContent = content
    
    // Remove ```json ... ``` or ``` ... ``` blocks
    jsonContent = jsonContent.replace(/```[\s\S]*?```/g, '').trim()
    // Also remove standalone ``` markers
    jsonContent = jsonContent.replace(/```/g, '').trim()
    
    // Find JSON array
    const arrayStart = jsonContent.indexOf('[')
    const arrayEnd = jsonContent.lastIndexOf(']')
    
    if (arrayStart === -1) {
      console.error('No array found in Gemini response:', content.substring(0, 200))
      return NextResponse.json(
        { error: 'IA não retornou array JSON' },
        { status: 500 }
      )
    }

    let jsonString = jsonContent.substring(arrayStart, arrayEnd === -1 ? undefined : arrayEnd + 1)
    
    // Try to fix incomplete JSON
    if (arrayEnd === -1 || !jsonString.endsWith(']')) {
      // JSON parece estar truncado, tentar adicionar ] se necessário
      if (!jsonString.endsWith(']')) {
        jsonString += ']'
      }
    }
    
    let transactions: ParsedTransaction[] = []
    try {
      transactions = JSON.parse(jsonString)
    } catch (parseError) {
      // Tentar remover últimas transações incompletas
      const lastBrace = jsonString.lastIndexOf('}')
      if (lastBrace > 0) {
        try {
          const fixedString = jsonString.substring(0, lastBrace + 1) + ']'
          transactions = JSON.parse(fixedString)
          console.log('JSON reparado removendo transação incompleta')
        } catch {
          console.error('JSON Parse Error (even after fix):', parseError, 'Content:', jsonString.substring(0, 300))
          return NextResponse.json(
            { error: 'Erro ao fazer parse do JSON' },
            { status: 500 }
          )
        }
      } else {
        console.error('JSON Parse Error:', parseError, 'Content:', jsonString.substring(0, 300))
        return NextResponse.json(
          { error: 'Erro ao fazer parse do JSON' },
          { status: 500 }
        )
      }
    }

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
