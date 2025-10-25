import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider';

// ID del programa (debe coincidir con el de Anchor.toml)
const PROGRAM_ID = new PublicKey('8WHFEQ7BdDhoKhdudmjnGwypsibeJjdRoTPgQg2AFrXH');

// IDL del programa (se generará automáticamente)
const IDL: Idl = {
  "version": "0.1.0",
  "name": "mnemosine",
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [],
      "args": []
    },
    {
      "name": "registerImage",
      "discriminator": [102, 6, 61, 18, 1, 218, 35, 209],
      "accounts": [
        {
          "name": "imageRecord",
          "writable": true,
          "signer": false
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "writable": false,
          "signer": false
        }
      ],
      "args": [
        {
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "name": "imageName",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ImageRecord",
      "discriminator": [110, 78, 93, 173, 155, 4, 147, 45],
      "data": [
        {
          "name": "owner",
          "type": "pubkey"
        },
        {
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "name": "imageName",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "i64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ]
};

// Configuración de la conexión
const getConnection = (): Connection => {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'http://127.0.0.1:8899';
  return new Connection(endpoint, 'confirmed');
};

// Función para obtener el programa
export const getProgram = (wallet: Wallet): Program => {
  const connection = getConnection();
  const provider = new AnchorProvider(connection, wallet, {});
  return new Program(IDL as Idl, provider);
};

// Función para registrar una imagen en Solana
export const registerImageOnSolana = async (
  wallet: Wallet,
  ipfsHash: string,
  imageName: string
): Promise<string> => {
  try {
    console.log('Registrando imagen en Solana...', { ipfsHash, imageName });
    
    const program = getProgram(wallet);
    const owner = wallet.publicKey;
    
    // Generar la dirección del PDA para el registro de imagen
    const [imageRecordPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('image_record'), owner.toBuffer(), Buffer.from(ipfsHash)],
      program.programId
    );
    
    console.log('PDA generado:', imageRecordPDA.toString());
    
    // Crear la transacción
    const tx = await program.methods
      .registerImage(ipfsHash, imageName)
      .accounts({
        imageRecord: imageRecordPDA,
        owner: owner,
        systemProgram: PublicKey.default,
      })
      .rpc();
    
    console.log('Transacción enviada:', tx);
    return tx;
  } catch (error) {
    console.error('Error registrando imagen en Solana:', error);
    throw new Error('Error al registrar imagen en Solana');
  }
};

// Función para obtener registros de imágenes de un usuario
export const getUserImageRecords = async (wallet: Wallet): Promise<any[]> => {
  try {
    const program = getProgram(wallet);
    const owner = wallet.publicKey;
    
      // Obtener todas las cuentas ImageRecord del usuario
      const imageRecords = await program.account.imageRecord.all([
        {
          memcmp: {
            offset: 8, // Saltar el discriminador
            bytes: owner.toBase58(),
          },
        },
      ]);
      
      return imageRecords.map((record: any) => ({
        publicKey: record.publicKey.toString(),
        owner: record.account.owner.toString(),
        ipfsHash: record.account.ipfsHash,
        imageName: record.account.imageName,
        timestamp: record.account.timestamp,
      }));
  } catch (error) {
    console.error('Error obteniendo registros de imágenes:', error);
    return [];
  }
};

// Función para verificar si una imagen ya está registrada
export const isImageRegistered = async (
  wallet: Wallet,
  ipfsHash: string
): Promise<boolean> => {
  try {
    const program = getProgram(wallet);
    const owner = wallet.publicKey;
    
    const [imageRecordPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('image_record'), owner.toBuffer(), Buffer.from(ipfsHash)],
      program.programId
    );
    
    const accountInfo = await program.provider.connection.getAccountInfo(imageRecordPDA);
    return accountInfo !== null;
  } catch (error) {
    console.error('Error verificando registro de imagen:', error);
    return false;
  }
};

// Función para obtener la URL de la imagen IPFS
export const getImageIPFSUrl = (ipfsHash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
};
