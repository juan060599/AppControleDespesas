'use client'

import { useState, useEffect } from 'react'
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/lib/designSystem'
import { Upload, FileText, Loader, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import { parseCSV, parseOFX } from '@/lib/aiAnalysis'
import { addTransaction, getCurrentUser, getAnalysisUsage, incrementAnalysisUsage, getUserRole } from '@/lib/database'

interface BankStatementUploadProps {
  onTransactionsAdded?: () => void
}

interface ParsedTransaction {
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export default function BankStatementUpload({ onTransactionsAdded }: BankStatementUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([])
  const [inserting, setInserting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set())
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [analysisCount, setAnalysisCount] = useState(0)
  const [analysisLimit] = useState(2)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAnalysisUsage = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Verificar se é admin
        const { role } = await getUserRole(user.id)
        setIsAdmin(role === 'admin')

        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const { data } = await getAnalysisUsage(user.id, month)
        setAnalysisCount(data?.usage_count || 0)
      } catch (error) {
        console.error('Error checking analysis usage:', error)
      }
    }

    checkAnalysisUsage()
  }, [transactions])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setSuccess('')
      setTransactions([])
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Selecione um arquivo primeiro')
      return
    }

    // Verificar limite de análises (admin não tem limite)
    if (!isAdmin && analysisCount >= analysisLimit) {
      setError(`❌ Você atingiu o limite de ${analysisLimit} análises este mês. Adquira o plano Pro para análises ilimitadas!`)
      return
    }

    setLoading(true)
    setAnalyzing(true)
    setError('')

    try {
      const fileContent = await file.text()
      
      // Validate file type
      const fileName = file.name.toLowerCase()
      const isCSV = fileName.endsWith('.csv')
      const isOFX = fileName.endsWith('.ofx') || fileName.endsWith('.txt')
      const isPDF = fileName.endsWith('.pdf')

      if (!isCSV && !isOFX && !isPDF) {
        setError('Arquivo deve ser CSV, OFX ou PDF')
        setLoading(false)
        setAnalyzing(false)
        return
      }

      // Parse and prepare content
      let textToAnalyze = fileContent

      if (isCSV) {
        const parsed = parseCSV(fileContent)
        textToAnalyze = parsed.map((row) => row.join(' | ')).join('\n')
      } else if (isOFX) {
        textToAnalyze = parseOFX(fileContent)
      }

      // Call Gemini API route to analyze (chave será buscada do banco pela rota)
      const response = await fetch('/api/analyze-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileContent: textToAnalyze,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao analisar com IA')
      }

      const data = await response.json()
      const parsedTransactions = data.transactions

      if (parsedTransactions.length === 0) {
        setError('Nenhuma transação encontrada no arquivo')
        setLoading(false)
        setAnalyzing(false)
        return
      }

      // Increment analysis usage
      try {
        const user = await getCurrentUser()
        if (user) {
          const now = new Date()
          const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
          await incrementAnalysisUsage(user.id, month)
          setAnalysisCount(prev => prev + 1)
        }
      } catch (err) {
        console.error('Error incrementing analysis usage:', err)
      }

      setTransactions(parsedTransactions)
      setSelectedTransactions(new Set(Array.from({ length: parsedTransactions.length }, (_, i) => i)))
      setSuccess(`${parsedTransactions.length} transações encontradas!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar arquivo')
      console.error(err)
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }

  const handleInsertTransactions = async () => {
    if (selectedTransactions.size === 0) {
      setError('Selecione pelo menos uma transação')
      return
    }

    setInserting(true)
    setError('')

    try {
      const user = await getCurrentUser()
      if (!user) {
        setError('Usuário não autenticado')
        setInserting(false)
        return
      }

      let inserted = 0
      let failed = 0
      let skipped = 0

      // Insert selected transactions (filtered by type)
      for (const index of Array.from(selectedTransactions)) {
        const tx = transactions[index]

        // Filtrar por tipo selecionado
        if (filterType !== 'all' && tx.type !== filterType) {
          skipped++
          continue
        }

        try {
          const { error: addError } = await addTransaction({
            user_id: user.id,
            description: tx.description,
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            date: tx.date,
          })

          if (addError) {
            failed++
            console.error(`Erro inserindo transação: ${tx.description}`, addError)
          } else {
            inserted++
          }
        } catch (err) {
          failed++
          console.error(`Erro ao inserir: ${tx.description}`, err)
        }
      }

      setSuccess(
        `✅ ${inserted} transações inseridas com sucesso!${failed > 0 ? ` (${failed} falharam)` : ''}${skipped > 0 ? ` (${skipped} ignoradas pelo filtro)` : ''}`
      )

      // Reset form
      setTimeout(() => {
        setFile(null)
        setTransactions([])
        setSelectedTransactions(new Set())
        onTransactionsAdded?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao inserir transações')
    } finally {
      setInserting(false)
    }
  }

  const toggleTransaction = (index: number) => {
    const newSet = new Set(selectedTransactions)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setSelectedTransactions(newSet)
  }

  const toggleAll = () => {
    if (selectedTransactions.size === transactions.length) {
      setSelectedTransactions(new Set())
    } else {
      setSelectedTransactions(new Set(Array.from({ length: transactions.length }, (_, i) => i)))
    }
  }

  return (
    <div
      style={{
        background: colors.background.light,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        border: `1px solid ${colors.primary[100]}`,
        padding: 'clamp(12px, 3vw, 24px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'clamp(8px, 2vw, 16px)',
          marginBottom: 'clamp(12px, 2vw, 16px)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 'clamp(36px, 8vw, 44px)',
            height: 'clamp(36px, 8vw, 44px)',
            background: colors.primary[100],
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Upload size='clamp(18px, 4vw, 24px)' color={colors.primary[600]} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontSize: 'clamp(14px, 3.5vw, 20px)',
              fontWeight: 700,
              color: colors.secondary[900],
              margin: 0,
            }}
          >
            Importar Extrato Bancário
          </h2>
          <p
            style={{
              fontSize: 'clamp(12px, 2vw, 13px)',
              color: colors.secondary[500],
              margin: '4px 0 0 0',
            }}
          >
            IA analisa e lança automaticamente
          </p>
        </div>
        <div
          style={{
            padding: `clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)`,
            backgroundColor: analysisCount >= analysisLimit && analysisLimit !== 999999 ? colors.status.error + '15' : colors.primary[50],
            borderRadius: borderRadius.md,
            border: `1px solid ${analysisCount >= analysisLimit && analysisLimit !== 999999 ? colors.status.error : colors.primary[200]}`,
            textAlign: 'center',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <p style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', fontWeight: 600, margin: 0, color: colors.secondary[900] }}>
            {isAdmin ? '∞' : `${analysisCount}/${analysisLimit}`}
          </p>
          <p style={{
            fontSize: 'clamp(10px, 1.5vw, 11px)',
            margin: `2px 0 0 0`,
            color: isAdmin ? colors.status.success : (analysisCount >= analysisLimit ? colors.status.error : colors.secondary[500]),
          }}>
            {isAdmin ? '👑' : (analysisCount >= analysisLimit ? '❌' : '✓')}
          </p>
        </div>
      </div>

      {/* File Upload */}
      {transactions.length === 0 && (
        <div
          style={{
            marginBottom: 'clamp(12px, 2vw, 16px)',
          }}
        >
          <label
            style={{
              display: 'block',
              padding: 'clamp(12px, 3vw, 20px)',
              border: `2px dashed ${colors.primary[300]}`,
              borderRadius: borderRadius.lg,
              textAlign: 'center',
              cursor: 'pointer',
              transition: transitions.normal,
              background: colors.primary[50],
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.style.background = colors.primary[100]
              e.currentTarget.style.borderColor = colors.primary[500]
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.background = colors.primary[50]
              e.currentTarget.style.borderColor = colors.primary[300]
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.style.background = colors.primary[50]
              e.currentTarget.style.borderColor = colors.primary[300]
              const droppedFile = e.dataTransfer.files?.[0]
              if (droppedFile) {
                setFile(droppedFile)
                setError('')
              }
            }}
          >
            <FileText size='clamp(24px, 6vw, 32px)' color={colors.primary[500]} style={{ margin: '0 auto clamp(8px, 2vw, 12px)' }} />
            <p
              style={{
                fontSize: 'clamp(13px, 2.5vw, 16px)',
                fontWeight: 600,
                color: colors.secondary[900],
                margin: '0 0 4px 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file ? file.name : 'Arrastar ou clicar'}
            </p>
            <p
              style={{
                fontSize: 'clamp(11px, 1.8vw, 13px)',
                color: colors.secondary[500],
                margin: 0,
              }}
            >
              CSV, OFX ou PDF do seu banco
            </p>
            <input
              type="file"
              accept=".csv,.ofx,.txt,.pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </label>

          {file && (
            <div
              style={{
                display: 'flex',
                gap: 'clamp(8px, 2vw, 12px)',
                marginTop: 'clamp(12px, 2vw, 16px)',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleAnalyze}
                disabled={loading || !file}
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: `clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)`,
                  background: loading
                    ? colors.secondary[300]
                    : `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                  color: colors.background.light,
                  border: 'none',
                  borderRadius: borderRadius.lg,
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: transitions.normal,
                  boxShadow: loading ? 'none' : shadows.blue,
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(6px, 1vw, 8px)',
                }}
              >
                {loading && <Loader size='clamp(14px, 3vw, 18px)' style={{ animation: 'spin 1s linear infinite' }} />}
                {loading ? 'Analisando...' : 'Analisar'}
              </button>

              <button
                onClick={() => {
                  setFile(null)
                  setError('')
                  setSuccess('')
                }}
                style={{
                  padding: `clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)`,
                  background: colors.secondary[100],
                  color: colors.secondary[600],
                  border: `1px solid ${colors.secondary[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: transitions.normal,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.secondary[200]
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.secondary[100]
                }}
              >
                Limpar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: colors.status.error + '15',
            border: `1px solid ${colors.status.error}`,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.lg,
            color: colors.status.error,
            fontSize: typography.small.fontSize,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && transactions.length > 0 && (
        <div
          style={{
            background: colors.status.success + '15',
            border: `1px solid ${colors.status.success}`,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.lg,
            color: colors.status.success,
            fontSize: typography.small.fontSize,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Transactions List */}
      {transactions.length > 0 && (
        <div>
          {/* Filter Type */}
          <div
            style={{
              display: 'flex',
              gap: spacing.md,
              marginBottom: spacing.lg,
              padding: spacing.md,
              background: colors.primary[50],
              borderRadius: borderRadius.lg,
              alignItems: 'center',
            }}
          >
            <label style={{ ...typography.label, color: colors.secondary[900], margin: 0 }}>
              Importar:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                border: `1px solid ${colors.primary[300]}`,
                borderRadius: borderRadius.md,
                backgroundColor: colors.background.light,
                color: colors.secondary[900],
                fontSize: typography.small.fontSize,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <option value="all">Ambos (Despesas + Receitas)</option>
              <option value="expense">Apenas Despesas</option>
              <option value="income">Apenas Receitas</option>
            </select>
          </div>

          {/* Select All */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              padding: spacing.md,
              background: colors.secondary[50],
              borderRadius: borderRadius.lg,
              marginBottom: spacing.lg,
              cursor: 'pointer',
            }}
            onClick={() => toggleAll()}
          >
            <input
              type="checkbox"
              checked={selectedTransactions.size === transactions.length}
              onChange={() => {}}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                fontSize: typography.label.fontSize,
                fontWeight: 600,
                color: colors.secondary[900],
              }}
            >
              {selectedTransactions.size === transactions.length
                ? 'Desselecionar Tudo'
                : `Selecionar Tudo (${transactions.length})`}
            </span>
          </div>

          {/* Transactions */}
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: spacing.lg,
              border: `1px solid ${colors.secondary[200]}`,
              borderRadius: borderRadius.lg,
            }}
          >
            {transactions.map((tx, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: spacing.md,
                  borderBottom: index < transactions.length - 1 ? `1px solid ${colors.secondary[100]}` : 'none',
                  background: selectedTransactions.has(index) ? colors.primary[50] : colors.background.light,
                  cursor: 'pointer',
                  transition: transitions.normal,
                }}
                onClick={() => toggleTransaction(index)}
              >
                <input
                  type="checkbox"
                  checked={selectedTransactions.has(index)}
                  onChange={() => {}}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginRight: spacing.md,
                    cursor: 'pointer',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: typography.small.fontSize,
                      fontWeight: 600,
                      color: colors.secondary[900],
                      margin: '0 0 4px 0',
                    }}
                  >
                    {tx.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: spacing.md,
                      fontSize: typography.small.fontSize,
                      color: colors.secondary[500],
                    }}
                  >
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.category}</span>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    minWidth: '100px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: tx.type === 'income' ? colors.status.success : colors.status.error,
                      margin: 0,
                    }}
                  >
                    {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: colors.secondary[400],
                      margin: '2px 0 0 0',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tx.type === 'income' ? 'Receita' : 'Despesa'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Insert Button */}
          <button
            onClick={handleInsertTransactions}
            disabled={inserting || selectedTransactions.size === 0}
            style={{
              width: '100%',
              padding: `${spacing.md} ${spacing.lg}`,
              background: inserting
                ? colors.secondary[300]
                : `linear-gradient(135deg, ${colors.status.success} 0%, ${colors.status.success}dd 100%)`,
              color: colors.background.light,
              border: 'none',
              borderRadius: borderRadius.lg,
              fontSize: typography.label.fontSize,
              fontWeight: 600,
              cursor: inserting || selectedTransactions.size === 0 ? 'not-allowed' : 'pointer',
              transition: transitions.normal,
              boxShadow: inserting ? 'none' : shadows.blue,
              opacity: inserting || selectedTransactions.size === 0 ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
            }}
          >
            {inserting && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {inserting
              ? 'Inserindo...'
              : `Lançar ${selectedTransactions.size} Transações`}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
