-- Adicionar coluna merchant (nome do estabelecimento) à tabela de transações
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS merchant TEXT DEFAULT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant);
