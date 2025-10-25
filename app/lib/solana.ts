import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider';

// ID del programa (debe coincidir con el de Anchor.toml)
const PROGRAM_ID = new PublicKey('8WHFEQ7BdDhoKhdudmjnGwypsibeJjdRoTPgQg2AFrXH');

// IDL del programa (se generará automáticamente)
const IDL: Idl = {
  "address": "8WHFEQ7BdDhoKhdudmjnGwypsibeJjdRoTPgQg2AFrXH",
  "metadata": {
    "name": "mnemosine",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
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
      "discriminator": [110, 78, 93, 173, 155, 4, 147, 45]
    }
  ],
  "types": [
    {
      "name": "ImageRecord",
      "type": {
        "kind": "struct",
        "fields": [
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
    // TODO: Implementar cuando el IDL esté completamente configurado
    console.log('getUserImageRecords: Función temporalmente deshabilitada');
    return [];
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
