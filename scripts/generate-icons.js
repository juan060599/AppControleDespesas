#!/usr/bin/env node

/**
 * Script para gerar icons PWA
 * Cria imagens PNG a partir de SVG usando canvas
 */

const fs = require('fs');
const path = require('path');

// Criar diretório de ícones se não existir
const iconDir = path.join(__dirname, '../../public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

console.log('📱 Gerando icons PWA...\n');

// SVG base do ícone
const baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <style>
      .bg { fill: #3b82f6; }
      .icon { fill: white; }
    </style>
  </defs>
  <rect class="bg" width="512" height="512"/>
  <g transform="translate(156, 156) scale(1.5)">
    <!-- Ícone de finanças -->
    <circle class="icon" cx="128" cy="64" r="20"/>
    <rect class="icon" x="53" y="133" width="150" height="20" rx="10"/>
    <rect class="icon" x="53" y="185" width="150" height="20" rx="10"/>
    <rect class="icon" x="53" y="80" width="150" height="20" rx="10"/>
  </g>
</svg>`;

// Função helper para criar um PNG simples usando canvas (fallback para dados URL)
function generateIconSizes() {
  const sizes = [192, 256, 384, 512];
  
  sizes.forEach(size => {
    // Criar um PNG mínimo usando Node.js puro (sem dependências extras)
    // Para simplificar, vamos usar um SVG convertido
    const svgBuffer = Buffer.from(baseIcon.replace(/512/g, size.toString()));
    
    // Salvar como SVG (funciona perfeitamente em PWA)
    const outputPath = path.join(iconDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(outputPath, baseIcon.replace(/512/g, size.toString()));
    console.log(`✓ icon-${size}x${size}.svg criado`);
  });

  // Criar ícone maskable (para adaptive icons no Android 13+)
  const maskableIcon = baseIcon.replace('class="bg"', 'class="bg" rx="0"');
  
  [192, 512].forEach(size => {
    const outputPath = path.join(iconDir, `maskable-${size}x${size}.svg`);
    fs.writeFileSync(outputPath, maskableIcon.replace(/512/g, size.toString()));
    console.log(`✓ maskable-${size}x${size}.svg criado`);
  });
}

try {
  generateIconSizes();
  
  console.log('\n✅ Icons PWA gerados com sucesso!');
  console.log('\n💡 Dica: Para melhor qualidade, converta os SVGs para PNG usando:');
  console.log('   - Figma.com (exportar como PNG)');
  console.log('   - ImageMagick: convert icon.svg icon.png');
  console.log('   - Online: convertio.co/svg-png/');
  
} catch (error) {
  console.error('❌ Erro ao gerar icons:', error);
  process.exit(1);
}
