# 📖 Guia de Uso - Controle de Despesas

## Começando

### 1. Criar Conta
1. Acesse a página de registro (`/signup`)
2. Preencha os campos:
   - **Nome**: Seu nome completo
   - **Email**: Email válido
   - **Senha**: Mínimo 6 caracteres
3. Clique em "Criar conta"
4. Redirecionará para a página de login automaticamente

### 2. Fazer Login
1. Acesse a página de login (`/signin`)
2. Preencha os campos:
   - **Email**: Seu email cadastrado
   - **Senha**: Sua senha
3. Clique em "Entrar"
4. Será redirecionado para o Dashboard

## Usando o Dashboard

### 📊 Visualizando Informações

O dashboard mostra:
- **Receitas**: Total de todas as receitas
- **Despesas**: Total de todas as despesas
- **Saldo**: Receitas - Despesas
- **Gráfico de Despesas por Categoria**: Visualiza como você gasta por categoria
- **Gráfico de Receitas vs Despesas**: Comparação visual entre ganhos e gastos
- **Tendência Mensal**: Evolução mês a mês do seu fluxo de caixa

### ➕ Adicionando Transações

1. Preencha o formulário "Adicionar Transação" (lado esquerdo):
   - **Tipo**: Escolha "Despesa" ou "Receita"
   - **Descrição**: Descreva a transação (ex: "Almoço", "Salário")
   - **Valor**: O valor em reais
   - **Categoria**: Selecione a categoria apropriada
   - **Data**: A data da transação (padrão: hoje)

2. Clique em "Adicionar Transação"

3. A transação aparecerá:
   - Na lista de transações recentes
   - Nos gráficos do dashboard

### 📝 Editando Transações

1. Localize a transação na "Lista de Transações Recentes"
2. Clique no ícone de lápis (✏️)
3. Modifique os dados conforme necessário
4. Clique em "Salvar" ou "Cancelar"

### 🗑️ Deletando Transações

1. Localize a transação na "Lista de Transações Recentes"
2. Clique no ícone de lixeira (🗑️)
3. Confirme a exclusão no diálogo que aparecer

## 💡 Dicas Úteis

### Categorias Recomendadas

**Para Despesas:**
- **Alimentação**: Supermercado, restaurantes, delivery
- **Transporte**: Combustível, uber, ônibus, táxi
- **Habitação**: Aluguel, condomínio, água, luz, internet
- **Saúde**: Farmácia, médico, dentista, academia
- **Educação**: Cursos, livros, mensalidade escolar
- **Lazer**: Cinema, viagens, jogos, hobbies
- **Outros**: Qualquer coisa que não se encaixe

**Para Receitas:**
- **Salário**: Seu salário mensal
- **Freelance**: Trabalhos pontuais/freelance
- **Investimentos**: Juros, dividendos, retorno de investimentos
- **Outros**: Bonus, presentes em dinheiro, etc

### Análise de Gastos

1. **Veja o gráfico de Pizza**: Identifique qual categoria consome mais dinheiro
2. **Acompanhe a tendência**: Use o gráfico de linha para ver se está gastando mais/menos cada mês
3. **Compare receita vs despesa**: Certifique-se de que está recebendo mais do que gastando

### Planejamento

1. Defina um limite mental por categoria
2. Monitore suas despesas regularmente
3. Ajuste seus gastos conforme necessário
4. Procure economizar em categorias com maior gasto

## 🔒 Segurança

- Seus dados são criptografados no Supabase
- Apenas você pode ver suas transações
- Faça logout quando terminar para proteger sua conta
- Não compartilhe sua senha

## 🆘 Problemas Comuns

### Transação não aparece
- Verifique se preencheu todos os campos
- Atualize a página (F5)
- Verifique se está logado na conta correta

### Não consigo fazer login
- Confirme que a conta foi criada
- Verifique se o email está correto
- Resete sua senha se necessário

### Gráficos não aparecem
- Você precisa ter pelo menos uma transação
- Aguarde alguns segundos para o gráfico carregar
- Atualize a página

### Valores aparecem incorretos
- Verifique se usou ponto (.) e não vírgula (,) nos valores
- Confirme o tipo de transação (receita vs despesa)

## 📲 Acessando de Diferentes Dispositivos

A aplicação é responsiva e funciona em:
- 💻 Desktop (recomendado)
- 📱 Tablet
- 📱 Celular

Use as credenciais de login para acessar sua conta em qualquer dispositivo.

## 🔄 Sincronização de Dados

Todos os seus dados são sincronizados em tempo real através do Supabase. 
Se você:
- Acessar de outro dispositivo
- Abrir em outra aba
- Atualizar a página

Os dados estarão sempre sincronizados!

## 📊 Exportando Dados

**Recurso em desenvolvimento:**
Num futuro próximo, você poderá:
- Exportar transações em CSV
- Gerar relatórios em PDF
- Baixar dados históricos

---

**Precisa de ajuda?** Verifique o arquivo README.md ou entre em contato.
