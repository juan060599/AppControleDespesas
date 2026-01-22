-- Script para adicionar sistema de roles (Admin/Cliente)

-- Criar tabela de perfil de usuários
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Inserir você como admin (substitua o UUID pela sua ID real)
-- Esta é uma template, você pode rodar depois com seu user_id
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('YOUR_USER_ID_HERE', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Adicionar função para obter role do usuário
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT role INTO role FROM user_roles WHERE user_id = $1;
  RETURN COALESCE(role, 'cliente');
END;
$$ LANGUAGE plpgsql;

-- Adicionar função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM user_roles WHERE user_id = $1) = 'admin';
END;
$$ LANGUAGE plpgsql;
