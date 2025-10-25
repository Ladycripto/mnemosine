// Script para probar la integración completa
import { verifyDeployment } from './verify-deployment';

export const testCompleteIntegration = async () => {
  console.log('🧪 Probando integración completa de Mnemosine...\n');
  
  // 1. Verificar despliegue de Solana
  console.log('1️⃣ Verificando programa de Solana...');
  const solanaOk = await verifyDeployment();
  
  if (!solanaOk) {
    console.log('❌ Error: Programa de Solana no está desplegado correctamente');
    return false;
  }
  
  // 2. Verificar variables de entorno
  console.log('\n2️⃣ Verificando variables de entorno...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_PROJECT_ID',
    'NEXT_PUBLIC_SOLANA_RPC_URL',
    'NEXT_PUBLIC_SOLANA_PROGRAM_ID',
    'NEXT_PUBLIC_PINATA_API_KEY',
    'NEXT_PUBLIC_PINATA_SECRET_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Variables de entorno faltantes:', missingVars);
    console.log('📝 Crea un archivo .env.local con las variables necesarias');
    return false;
  }
  
  console.log('✅ Variables de entorno configuradas');
  
  // 3. Verificar configuración de Reown
  console.log('\n3️⃣ Verificando configuración de Reown...');
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  
  if (projectId === 'your-project-id-here') {
    console.log('⚠️  Project ID de Reown no configurado');
    console.log('📝 Obtén tu Project ID en: https://cloud.reown.com/');
  } else {
    console.log('✅ Project ID de Reown configurado');
  }
  
  // 4. Verificar configuración de Pinata
  console.log('\n4️⃣ Verificando configuración de Pinata...');
  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  
  if (pinataApiKey === 'your_pinata_api_key_here') {
    console.log('⚠️  Claves de Pinata no configuradas');
    console.log('📝 Obtén tus claves en: https://pinata.cloud/');
  } else {
    console.log('✅ Claves de Pinata configuradas');
  }
  
  console.log('\n🎉 ¡Integración verificada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Configura tu Project ID de Reown');
  console.log('2. Configura tus claves de Pinata');
  console.log('3. Ejecuta: npm run dev');
  console.log('4. Conecta tu wallet y prueba subir una imagen');
  
  return true;
};
