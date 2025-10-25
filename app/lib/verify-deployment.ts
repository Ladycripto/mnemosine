// Script para verificar el despliegue en devnet
import { Connection, PublicKey } from '@solana/web3.js';

const PROGRAM_ID = '8WHFEQ7BdDhoKhdudmjnGwypsibeJjdRoTPgQg2AFrXH';
const RPC_URL = 'https://api.devnet.solana.com';

export const verifyDeployment = async () => {
  try {
    console.log('🔍 Verificando despliegue en devnet...');
    console.log('Program ID:', PROGRAM_ID);
    console.log('RPC URL:', RPC_URL);
    
    const connection = new Connection(RPC_URL, 'confirmed');
    const programId = new PublicKey(PROGRAM_ID);
    
    // Verificar que el programa existe
    const accountInfo = await connection.getAccountInfo(programId);
    
    if (accountInfo) {
      console.log('✅ Programa encontrado en devnet');
      console.log('📊 Datos del programa:');
      console.log('  - Owner:', accountInfo.owner.toString());
      console.log('  - Executable:', accountInfo.executable);
      console.log('  - Rent Epoch:', accountInfo.rentEpoch);
      console.log('  - Data Length:', accountInfo.data.length, 'bytes');
      
      // Verificar que es un programa ejecutable
      if (accountInfo.executable) {
        console.log('✅ El programa es ejecutable');
      } else {
        console.log('❌ El programa no es ejecutable');
      }
      
      return true;
    } else {
      console.log('❌ Programa no encontrado en devnet');
      return false;
    }
  } catch (error) {
    console.error('❌ Error verificando despliegue:', error);
    return false;
  }
};

export const getProgramInfo = async () => {
  try {
    const connection = new Connection(RPC_URL, 'confirmed');
    const programId = new PublicKey(PROGRAM_ID);
    
    // Obtener información detallada del programa
    const accountInfo = await connection.getAccountInfo(programId);
    
    if (accountInfo) {
      return {
        programId: PROGRAM_ID,
        owner: accountInfo.owner.toString(),
        executable: accountInfo.executable,
        dataLength: accountInfo.data.length,
        rentEpoch: accountInfo.rentEpoch,
        lamports: accountInfo.lamports,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo información del programa:', error);
    return null;
  }
};
