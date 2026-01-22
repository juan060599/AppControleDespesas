#!/usr/bin/env node

/**
 * Script para gerar APK do FinControl
 * 
 * Uso: npm run build:apk
 * ou: node scripts/build-apk.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 ${description}...`);
    const proc = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} concluído!\n`);
        resolve();
      } else {
        console.error(`❌ Erro ao executar: ${description}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', (error) => {
      console.error(`❌ Erro ao executar comando:`, error);
      reject(error);
    });
  });
}

async function buildAPK() {
  try {
    console.log(`
╔════════════════════════════════════════════╗
║     FinControl - Build APK Android         ║
║                                            ║
║  Certifique-se que tem Java 11+ instalado  ║
║  E Android SDK configurado                 ║
╚════════════════════════════════════════════╝
    `);

    // 1. Build Next.js para produção (output static)
    await runCommand('npm', ['run', 'build'], 'Build Next.js');

    // 2. Copiar arquivos estáticos para capacitor
    console.log('\n📂 Copiando arquivos para Capacitor...');
    // Se estiver usando output: 'export', o Next.js gera em ./out
    // Caso contrário, usar ./.next/static

    // 3. Inicializar Capacitor se não existir
    const androidPath = path.join(projectRoot, 'android');
    if (!fs.existsSync(androidPath)) {
      console.log('\n⚙️ Inicializando Capacitor Android...');
      await runCommand('npx', ['capacitor', 'add', 'android'], 'Adicionar plataforma Android');
    }

    // 4. Sincronizar projeto
    await runCommand('npx', ['capacitor', 'sync', 'android'], 'Sincronizar com Capacitor');

    // 5. Build do APK
    await runCommand('npx', ['capacitor', 'build', 'android', '--release'], 'Build APK de release');

    console.log(`
╔════════════════════════════════════════════╗
║        ✅ APK GERADO COM SUCESSO!          ║
╚════════════════════════════════════════════╝

📍 Localização do APK:
   android/app/build/outputs/apk/release/
   
📦 Arquivo: app-release.apk

🚀 Próximos passos:
   1. Transferir APK para o celular
   2. Habilitar "Instalar de fontes desconhecidas"
   3. Abrir o APK no celular para instalar

📚 Documentação:
   - https://capacitorjs.com/docs/getting-started
   - https://developer.android.com/studio
    `);

  } catch (error) {
    console.error('❌ Erro durante o build do APK:', error.message);
    process.exit(1);
  }
}

buildAPK();
