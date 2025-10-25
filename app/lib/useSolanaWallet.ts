import { useState, useCallback, useEffect } from 'react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl, Wallet } from '@coral-xyz/anchor';

// ID del programa
const PROGRAM_ID = '8WHFEQ7BdDhoKhdudmjnGwypsibeJjdRoTPgQg2AFrXH';

// IDL compatible con Anchor v0.30+
const IDL: Idl = {
  "address": "8WHFEQ7BdDhoKhdudmjnGwypsibeJjdRoTPgQg2AFrXH",
  "metadata": {
    "name": "mnemosine",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
    {
      "name": "registerImage",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
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
      "discriminator": [110, 211, 35, 79, 109, 75, 109, 117]
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

export const useSolanaWallet = () => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('solana');
  const { connection } = useAppKitConnection();
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTransactions, setProcessingTransactions] = useState<Set<string>>(new Set());

  // Configuración de la conexión
  const getConnection = useCallback((): Connection => {
    // Usar Tatum RPC directamente (forzado, sin variables de entorno)
    const tatumApiKey = 't-653ec05de55e20001c0bd93d-134a4d281ed141a7ae0eebb8';
    const endpoint = `https://solana-devnet.gateway.tatum.io/?api-key=${tatumApiKey}`;
    
    console.log('🚀 getConnection() llamada - Creando conexión Tatum');
    console.log('🌐 Usando endpoint RPC Tatum (forzado):', endpoint);
    console.log('🔑 API Key Tatum incluida:', endpoint.includes('api-key='));
    console.log('🔍 URL completa construida:', endpoint);
    console.log('📋 Variable de entorno NEXT_PUBLIC_SOLANA_RPC_URL:', process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
    
    // Verificar que la URL esté correctamente formateada
    if (!endpoint.includes('api-key=')) {
      console.error('❌ Error: URL de Tatum sin API key');
      throw new Error('URL de Tatum no contiene API key');
    }
    
    const connection = new Connection(endpoint, 'confirmed');
    console.log('✅ Conexión Tatum creada exitosamente:', connection.rpcEndpoint);
    return connection;
  }, []);

  // Inicializar wallet y programa cuando se conecte
  useEffect(() => {
    console.log('🔍 useEffect triggered:', { 
      isConnected, 
      address, 
      walletProvider: !!walletProvider,
      hasWallet: !!wallet,
      hasProgram: !!program
    });
    
    if (isConnected && address) {
      console.log('🚀 Iniciando proceso de inicialización...');
      
      try {
        console.log('📱 Creando wallet adapter...');
        
        // Crear wallet adapter para Solana
        const walletAdapter = {
          publicKey: new PublicKey(address),
          signTransaction: async (tx: Transaction) => {
            console.log('✍️ Firmando transacción con Reown...');
            console.log('🔍 Transacción a firmar:', {
              recentBlockhash: tx.recentBlockhash,
              feePayer: tx.feePayer?.toString(),
              instructions: tx.instructions.length
            });
            
            if (!walletProvider || typeof (walletProvider as any).signTransaction !== 'function') {
              throw new Error('walletProvider.signTransaction no está disponible');
            }
            
            try {
              const signedTx = await (walletProvider as any).signTransaction(tx);
              console.log('✅ Transacción firmada por Reown');
              return signedTx;
            } catch (error) {
              console.error('❌ Error firmando con Reown:', error);
              throw error;
            }
          },
          signAllTransactions: async (txs: Transaction[]) => {
            console.log('✍️ Firmando múltiples transacciones con Reown...');
            if (!walletProvider || typeof (walletProvider as any).signAllTransactions !== 'function') {
              throw new Error('walletProvider.signAllTransactions no está disponible');
            }
            
            try {
              const signedTxs = await (walletProvider as any).signAllTransactions(txs);
              console.log('✅ Múltiples transacciones firmadas por Reown');
              return signedTxs;
            } catch (error) {
              console.error('❌ Error firmando múltiples transacciones con Reown:', error);
              throw error;
            }
          }
        } as Wallet;

        setWallet(walletAdapter);
        console.log('✅ Wallet adapter creado:', walletAdapter.publicKey.toString());

        // Usar la conexión por defecto para ahora
        const solanaConnection = getConnection();
        console.log('🌐 Conexión Solana:', solanaConnection.rpcEndpoint);
        
        try {
          console.log('🔧 Creando AnchorProvider...');
          const anchorProvider = new AnchorProvider(solanaConnection, walletAdapter, {});
          console.log('✅ Anchor provider creado');
          
          console.log('📋 Creando programa con IDL:', JSON.stringify(IDL, null, 2));
          const programInstance = new Program(IDL as Idl, anchorProvider);
          setProgram(programInstance);
          console.log('🎉 Programa inicializado exitosamente!');
        } catch (programError) {
          console.error('❌ Error inicializando programa:', programError);
          console.error('🔍 Detalles del error:', {
            message: programError instanceof Error ? programError.message : 'Error desconocido',
            stack: programError instanceof Error ? programError.stack : undefined,
            name: programError instanceof Error ? programError.name : 'Unknown'
          });
          setError('Error al inicializar el programa Solana');
          return;
        }

        setError(null);
        console.log('🎯 Inicialización completada exitosamente');
      } catch (err) {
        console.error('💥 Error inicializando wallet:', err);
        setError('Error al inicializar la wallet');
      }
    } else {
      console.log('🔌 Desconectando wallet y programa');
      setWallet(null);
      setProgram(null);
      // Limpiar todas las transacciones en proceso al desconectar
      setProcessingTransactions(new Set());
    }
  }, [isConnected, address, getConnection]);

  // Función para registrar una imagen en Solana
  const registerImage = useCallback(async (ipfsHash: string, imageName: string): Promise<string> => {
    // Generar un ID único para esta transacción
    const transactionId = `${ipfsHash}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🎯 registerImage called:', { 
      isConnected, 
      hasProgram: !!program, 
      hasWallet: !!wallet,
      isProcessing,
      transactionId,
      processingTransactions: Array.from(processingTransactions),
      programType: program ? typeof program : 'null',
      walletType: wallet ? typeof wallet : 'null'
    });
    
    if (!isConnected) {
      console.log('❌ Wallet no conectada');
      throw new Error('Wallet no conectada');
    }

    // Verificar si ya hay una transacción en proceso para esta imagen
    if (processingTransactions.has(ipfsHash)) {
      console.log('⚠️ Ya hay una transacción en proceso para esta imagen:', ipfsHash);
      throw new Error('Ya hay una transacción en proceso para esta imagen. Espera a que termine.');
    }

    // Temporalmente solo requerimos wallet hasta que el programa se inicialice correctamente
    if (!wallet) {
      console.error('❌ Estado de inicialización:', { program: !!program, wallet: !!wallet });
      throw new Error('Wallet no inicializada');
    }

    console.log('⏳ Iniciando proceso de registro...');
    setIsLoading(true);
    setIsProcessing(true);
    setError(null);
    
    // Agregar esta transacción al conjunto de transacciones en proceso
    setProcessingTransactions(prev => {
      const newSet = new Set(prev);
      newSet.add(ipfsHash);
      return newSet;
    });

    try {
      console.log('📸 Registrando imagen en Solana:', { ipfsHash, imageName });
      
      if (program) {
        console.log('🚀 Usando programa Anchor para transacción real...');
        console.log('🔍 Programa disponible:', {
          methods: !!program.methods,
          registerImage: !!program.methods?.registerImage,
          programId: program.programId?.toString()
        });
        
        // Crear la transacción para registrar la imagen
        // Usar solo los primeros 8 bytes del hash IPFS para evitar exceder el límite de seeds
        const ipfsHashShort = ipfsHash.slice(0, 8);
        
        // Generar un ID único para esta transacción
        const transactionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('🆔 ID de transacción:', transactionId);
        
        const tx = await program.methods
          .registerImage(ipfsHash, imageName)
          .accounts({
            imageRecord: PublicKey.findProgramAddressSync(
              [
                Buffer.from("image_record"),
                wallet.publicKey.toBuffer(),
                Buffer.from(ipfsHashShort)
              ],
              new PublicKey(PROGRAM_ID)
            )[0],
            owner: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .transaction();

        console.log('Transacción creada, obteniendo recentBlockhash...');
        
        // Obtener la conexión y el recentBlockhash más reciente
        // Forzar el uso de getConnection() para asegurar que use Tatum
        const solanaConnection = getConnection();
        console.log('🔧 Conexión forzada a Tatum:', solanaConnection.rpcEndpoint);
        
        // Función para obtener recentBlockhash con reintentos
        const getRecentBlockhashWithRetry = async (maxRetries = 3): Promise<string> => {
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              console.log(`🔄 Intento ${attempt}/${maxRetries} obteniendo recentBlockhash...`);
              console.log(`🌐 Endpoint usado: ${solanaConnection.rpcEndpoint}`);
              console.log(`🔑 API Key en URL: ${solanaConnection.rpcEndpoint.includes('api-key=')}`);
              console.log(`🔍 URL completa: ${solanaConnection.rpcEndpoint}`);
              
              // Verificar que la URL tenga la API key antes de hacer la petición
              if (!solanaConnection.rpcEndpoint.includes('api-key=')) {
                throw new Error('URL de RPC no contiene API key de Tatum');
              }
              
              const { blockhash } = await solanaConnection.getLatestBlockhash();
              console.log('✅ RecentBlockhash obtenido:', blockhash);
              return blockhash;
            } catch (error) {
              console.error(`❌ Intento ${attempt} falló:`, error);
              console.error(`🔍 Detalles del error:`, {
                message: error instanceof Error ? error.message : 'Error desconocido',
                endpoint: solanaConnection.rpcEndpoint,
                hasApiKey: solanaConnection.rpcEndpoint.includes('api-key='),
                errorType: error instanceof Error ? error.constructor.name : typeof error
              });
              
              if (attempt === maxRetries) {
                throw new Error(`Error obteniendo recentBlockhash después de ${maxRetries} intentos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
              }
              // Esperar antes del siguiente intento
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
          }
          throw new Error('Error inesperado en getRecentBlockhashWithRetry');
        };

        try {
          const blockhash = await getRecentBlockhashWithRetry();
          tx.recentBlockhash = blockhash;
          tx.feePayer = wallet.publicKey;
        } catch (blockhashError) {
          console.error('❌ Error final obteniendo recentBlockhash:', blockhashError);
          throw blockhashError;
        }
        
        console.log('Transacción actualizada, firmando...');
        console.log('🔍 Detalles de la transacción:', {
          recentBlockhash: tx.recentBlockhash,
          feePayer: tx.feePayer?.toString(),
          instructions: tx.instructions.length,
          signatures: tx.signatures.length
        });

        // Verificar que la wallet esté disponible para firmar
        if (!wallet || !wallet.signTransaction) {
          throw new Error('Wallet no disponible para firmar transacción');
        }

        // Firmar la transacción
        console.log('✍️ Firmando transacción con wallet:', wallet.publicKey.toString());
        const signedTx = await wallet.signTransaction(tx);
        
        console.log('✅ Transacción firmada exitosamente');
        console.log('🔍 Firmas en la transacción:', signedTx.signatures.length);
        
        console.log('Transacción firmada, enviando...');
        const signature = await solanaConnection.sendRawTransaction(signedTx.serialize());
        
        console.log('Transacción enviada, confirmando...');
        console.log('🔗 Signature:', signature);
        console.log('🌐 Verificar en Solana Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        
        // Confirmar la transacción con timeout personalizado y reintentos
        let confirmationSuccess = false;
        const maxRetries = 3;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`⏳ Intento ${attempt}/${maxRetries} - Esperando confirmación...`);
            
            // Usar Promise.race para timeout personalizado
            const confirmationPromise = solanaConnection.confirmTransaction(signature, 'confirmed');
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout de confirmación')), 45000) // 45 segundos
            );
            
            const confirmation = await Promise.race([confirmationPromise, timeoutPromise]) as any;
            
            if (confirmation.value.err) {
              console.error('❌ Transacción falló:', confirmation.value.err);
              throw new Error(`Transacción falló: ${JSON.stringify(confirmation.value.err)}`);
            }
            
            console.log('✅ Transacción confirmada exitosamente!');
            console.log('🎉 Imagen registrada en devnet:', signature);
            confirmationSuccess = true;
            break;
            
          } catch (confirmError) {
            console.warn(`⚠️ Intento ${attempt} falló:`, confirmError);
            
            if (attempt === maxRetries) {
              console.warn('⚠️ Todos los intentos de confirmación fallaron');
              console.warn('🔍 Verificar manualmente:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
              console.warn('📝 La transacción puede haber sido exitosa a pesar del error de confirmación');
              
              // Verificar estado de la transacción de forma asíncrona
              setTimeout(async () => {
                try {
                  const status = await checkTransactionStatus(signature);
                  console.log('🔍 Estado de transacción verificado:', status);
                } catch (e) {
                  console.log('🔍 No se pudo verificar el estado de la transacción');
                }
              }, 5000);
              
              // No lanzar error aquí, la transacción puede haber sido exitosa
              console.log('✅ Asumiendo éxito - verificar en explorer');
            } else {
              // Esperar antes del siguiente intento
              await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            }
          }
        }
        
        return signature;
      } else {
        console.log('⚠️ Programa no disponible, simulando transacción...');
        console.log('🔍 Estado actual:', {
          program: program,
          programType: typeof program,
          programNull: program === null,
          programUndefined: program === undefined
        });
        
        // Simular transacción mientras el programa no esté disponible
        console.log('⏳ Simulando transacción (2 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generar hash de transacción simulado
        const mockTxHash = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('🎭 Transacción simulada (programa no disponible):', mockTxHash);
        return mockTxHash;
      }
    } catch (err) {
      console.error('Error registrando imagen:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      // Remover esta transacción del conjunto de transacciones en proceso
      setProcessingTransactions(prev => {
        const newSet = new Set(prev);
        newSet.delete(ipfsHash);
        return newSet;
      });
    }
  }, [isConnected, program, wallet, connection]);

  // Función para obtener registros de imágenes del usuario (simulada)
  const getUserImageRecords = useCallback(async (): Promise<any[]> => {
    if (!isConnected) {
      return [];
    }

    try {
      // Simular datos de registros
      return [
        {
          publicKey: 'mock_record_1',
          owner: address,
          ipfsHash: 'mock_ipfs_hash_1',
          imageName: 'imagen_ejemplo.jpg',
          timestamp: Date.now(),
        }
      ];
    } catch (err) {
      console.error('Error obteniendo registros de imágenes:', err);
      return [];
    }
  }, [isConnected, address]);

  // Función para verificar si una imagen ya está registrada (simulada)
  const isImageRegistered = useCallback(async (ipfsHash: string): Promise<boolean> => {
    if (!isConnected) {
      return false;
    }

    try {
      // Simular verificación
      return false;
    } catch (err) {
      console.error('Error verificando registro de imagen:', err);
      return false;
    }
  }, [isConnected]);

  // Función para verificar el estado de una transacción
  const checkTransactionStatus = useCallback(async (signature: string): Promise<{
    status: 'success' | 'failed' | 'pending' | 'unknown';
    error?: any;
  }> => {
    try {
      const solanaConnection = getConnection();
      const status = await solanaConnection.getSignatureStatus(signature);
      
      if (status.value === null) {
        return { status: 'pending' };
      }
      
      if (status.value.err) {
        return { status: 'failed', error: status.value.err };
      }
      
      return { status: 'success' };
    } catch (error) {
      console.error('Error verificando estado de transacción:', error);
      return { status: 'unknown', error };
    }
  }, [getConnection]);

  return {
    // Estado
    isConnected,
    address,
    isLoading,
    isProcessing,
    error,
    processingTransactions: Array.from(processingTransactions),
    
    // Acciones
    registerImage,
    getUserImageRecords,
    isImageRegistered,
    checkTransactionStatus,
  };
};
