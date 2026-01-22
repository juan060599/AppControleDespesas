-- Tabela para armazenar chaves de API
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name VARCHAR(255) NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(key_name);

-- Inserir as chaves padrão
INSERT INTO api_keys (key_name, key_value, description) 
VALUES 
  ('STRIPE_PUBLIC_KEY', 'pk_test_51Ss1eKKMF5dTadBUtJhH3LluwFOSDsQvLCVCqCYJp0PsrD6h35ygx48AR2Vvd8jmgVYWhVV0DWMBd8lOcjCm3ORP00KvmKBT3D', 'Stripe Publishable Key'),
  ('STRIPE_SECRET_KEY', 'sk_test_51Ss1eKKMF5dTadBUKXWhhY27XgDZ9BXNZ0pF6OAw6wjtSo9kZI1f8V8X0K70mf86SMUh4L4UA39AebODJkMQX7Cs00ZhHQlkhw', 'Stripe Secret Key'),
  ('GEMINI_API_KEY', 'AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M', 'Google Gemini API Key - Chave principal do servidor')
ON CONFLICT (key_name) DO NOTHING;
