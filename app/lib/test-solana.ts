// Script de prueba para verificar la integración de Solana
import { Connection, PublicKey } from '@solana/web3.js';

export const testSolanaConnection = async () => {
  try {
    console.log('🧪 Probando conexión a Solana...');
    
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'http://127.0.0.1:8899';
    const connection = new Connection(rpcUrl, 'confirmed');
    
    // Obtener información de la red
    const version = await connection.getVersion();
    console.log('✅ Conexión exitosa a Solana');
    console.log('📊 Versión de Solana:', version['solana-core']);
    
    // Verificar el programa
    const programId = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || '7Q811Ki9dNuqshsadARZAfLdHoDmUejkGAXbdDFAkVyw');
    const accountInfo = await connection.getAccountInfo(programId);
    
    if (accountInfo) {
      console.log('✅ Programa encontrado en la blockchain');
      console.log('📝 Tamaño del programa:', accountInfo.data.length, 'bytes');
    } else {
      console.log('⚠️  Programa no encontrado. Asegúrate de desplegarlo primero.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Solana:', error);
    return false;
  }
};

export const testPinataConnection = async () => {
  try {
    console.log('🧪 Probando conexión a Pinata...');
    
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
    
    if (!apiKey || !secretKey) {
      console.log('⚠️  Claves de Pinata no configuradas');
      return false;
    }
    
    // Probar la API de Pinata
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretKey,
      },
    });
    
    if (response.ok) {
      console.log('✅ Conexión exitosa a Pinata');
      return true;
    } else {
      console.log('❌ Error en la autenticación de Pinata');
      return false;
    }
  } catch (error) {
    console.error('❌ Error conectando a Pinata:', error);
    return false;
  }
};

export const runAllTests = async () => {
  console.log('🚀 Ejecutando todas las pruebas...\n');
  
  const solanaTest = await testSolanaConnection();
  console.log('');
  
  const pinataTest = await testPinataConnection();
  console.log('');
  
  if (solanaTest && pinataTest) {
    console.log('🎉 ¡Todas las pruebas pasaron! El sistema está listo.');
  } else {
    console.log('⚠️  Algunas pruebas fallaron. Revisa la configuración.');
  }
  
  return { solanaTest, pinataTest };
};
