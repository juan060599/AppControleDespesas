-- Script para popular a tabela user_roles com os usuários existentes

-- Inserir teste@gmail.com.br como ADMIN
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'teste@gmail.com.br'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Inserir lucianaalves@gmail.com como CLIENTE
INSERT INTO user_roles (user_id, role)
SELECT id, 'cliente'
FROM auth.users
WHERE email = 'lucianaalves@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'cliente';

-- Inserir todos os outros usuários como CLIENTE (padrão)
INSERT INTO user_roles (user_id, role)
SELECT id, 'cliente'
FROM auth.users
WHERE id NOT IN (
  SELECT user_id FROM user_roles
)
ON CONFLICT (user_id) DO NOTHING;

-- Verificar resultado
SELECT 
  au.email,
  ur.role,
  ur.created_at
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
ORDER BY au.created_at DESC;
