// Teste rápido da chave OpenAI

const apiKey = process.env.OPENAI_API_KEY;

console.log('\n🔍 TESTANDO CHAVE OPENAI...\n');

if (!apiKey) {
  console.log('❌ ERRO: OPENAI_API_KEY não está configurada em .env.local');
  console.log('\nAdicione esta linha em .env.local:');
  console.log('OPENAI_API_KEY=sua-chave-aqui\n');
  process.exit(1);
}

console.log('✅ Chave encontrada');
console.log(`   Começa com: ${apiKey.substring(0, 20)}...`);
console.log(`   Tamanho: ${apiKey.length} caracteres`);

// Teste de conexão
(async () => {
  try {
    console.log('\n📡 Testando conexão com OpenAI API...\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Responda com uma palavra: sucesso',
          },
        ],
        max_tokens: 10,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ ERRO na API:', data.error?.message || 'Erro desconhecido');
      console.log('\nPossíveis causas:');
      console.log('1. Chave expirada ou inválida');
      console.log('2. Chave sem créditos');
      console.log('3. Chave de modelo errado (deve ser GPT-4o-mini)');
      console.log('\nSolução: Gere uma nova chave em platform.openai.com/api/keys');
      process.exit(1);
    }

    const message = data.choices[0]?.message?.content;
    console.log('✅ SUCESSO! API respondeu:\n');
    console.log(`   "${message}"\n`);
    console.log('🎉 Sua chave OpenAI está funcionando corretamente!\n');
    
  } catch (error) {
    console.log('❌ ERRO de conexão:', error.message);
    console.log('\nVerifique:');
    console.log('1. Sua internet está conectada?');
    console.log('2. Servidor OpenAI está online?');
    process.exit(1);
  }
})();
