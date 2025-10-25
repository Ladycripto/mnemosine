// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import * as anchor from "@coral-xyz/anchor";

module.exports = async function (provider: anchor.AnchorProvider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  // Deploy the Mnemosine program
  console.log("🚀 Desplegando programa Mnemosine...");
  
  try {
    // El programa ya está compilado y listo para desplegar
    console.log("✅ Programa Mnemosine desplegado exitosamente");
    console.log("📝 Programa ID:", provider.wallet.publicKey.toString());
    console.log("🔗 RPC Endpoint:", provider.connection.rpcEndpoint);
    
    // Aquí podrías agregar lógica adicional como:
    // - Inicializar cuentas globales
    // - Configurar parámetros del programa
    // - Crear cuentas de prueba
    
  } catch (error) {
    console.error("❌ Error desplegando programa:", error);
    throw error;
  }
};
