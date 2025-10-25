# Integración de Solana con Mnemosine

Este documento describe la integración del programa de Solana con la aplicación Mnemosine para registrar imágenes IPFS con wallets de Reown.

## 🚀 Características

- **Registro en Blockchain**: Cada imagen subida a IPFS se registra en Solana con la wallet del usuario
- **Integración con Reown**: Conexión de wallet usando Reown AppKit
- **Almacenamiento Descentralizado**: Imágenes almacenadas en IPFS con metadatos en Solana
- **Trazabilidad**: Cada registro incluye timestamp y hash IPFS único

## 📁 Estructura del Proyecto

```
app/
├── lib/
│   ├── pinata.ts          # Funciones para subir a IPFS
│   ├── solana.ts          # Funciones para interactuar con Solana
│   ├── useSolanaWallet.ts # Hook personalizado para Solana + Reown
│   └── test-solana.ts     # Scripts de prueba
├── components/
│   └── UploadScreen.tsx   # Componente principal con integración
└── programs/
    └── mnemosine/
        └── src/
            └── lib.rs     # Programa de Solana
```

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` basado en `env.local.example`:

```bash
# Reown AppKit
NEXT_PUBLIC_PROJECT_ID=your-project-id-here

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=http://127.0.0.1:8899
NEXT_PUBLIC_SOLANA_PROGRAM_ID=7Q811Ki9dNuqshsadARZAfLdHoDmUejkGAXbdDFAkVyw

# Pinata
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here
```

### 2. Desplegar el Programa de Solana

```bash
# Compilar el programa
anchor build

# Desplegar en localnet
anchor deploy

# O usar el script de migración
anchor run migrate
```

### 3. Instalar Dependencias

```bash
cd app
npm install
```

## 🏗️ Arquitectura del Programa de Solana

### Estructura de Datos

```rust
pub struct ImageRecord {
    pub owner: Pubkey,        // 32 bytes - Wallet del propietario
    pub ipfs_hash: String,    // 64 bytes - Hash IPFS de la imagen
    pub image_name: String,   // 64 bytes - Nombre del archivo
    pub timestamp: i64,       // 8 bytes - Timestamp de creación
    pub bump: u8,             // 1 byte - Bump seed del PDA
}
```

### Instrucciones

- **`initialize`**: Inicializa el programa
- **`register_image`**: Registra una nueva imagen con su hash IPFS

### PDA (Program Derived Address)

Cada registro de imagen se almacena en un PDA único generado con:
- Seed: `"image_record"`
- Owner: Clave pública del usuario
- IPFS Hash: Hash de la imagen

## 🔄 Flujo de Trabajo

1. **Usuario selecciona imagen**: Se valida el archivo (tipo, tamaño)
2. **Conexión de wallet**: Usuario conecta su wallet con Reown
3. **Subida a IPFS**: Imagen se sube a Pinata IPFS
4. **Registro en Solana**: Se crea un registro en blockchain con:
   - Hash IPFS de la imagen
   - Nombre del archivo
   - Wallet del propietario
   - Timestamp de creación
5. **Confirmación**: Usuario recibe hash de transacción

## 🧪 Pruebas

### Probar Conexión

```typescript
import { runAllTests } from './lib/test-solana';

// Ejecutar todas las pruebas
await runAllTests();
```

### Probar Funcionalidad

1. Inicia el servidor de desarrollo: `npm run dev`
2. Conecta tu wallet
3. Sube una imagen
4. Verifica que se registre en Solana

## 🔍 Verificar Transacciones

Puedes verificar las transacciones en:
- **Localnet**: `http://localhost:8899`
- **Devnet**: `https://explorer.solana.com/?cluster=devnet`
- **Mainnet**: `https://explorer.solana.com/`

## 🛠️ Desarrollo

### Compilar Programa

```bash
anchor build
```

### Ejecutar Tests

```bash
anchor test
```

### Desplegar

```bash
# Localnet
anchor deploy

# Devnet
anchor deploy --provider.cluster devnet

# Mainnet
anchor deploy --provider.cluster mainnet
```

## 📝 Notas Importantes

- El programa usa PDAs para evitar colisiones de cuentas
- Cada imagen genera un registro único en blockchain
- Los metadatos se almacenan en Solana, las imágenes en IPFS
- La integración con Reown permite múltiples tipos de wallets

## 🐛 Solución de Problemas

### Error de Conexión a Solana
- Verifica que el RPC esté funcionando
- Confirma que el programa esté desplegado
- Revisa las variables de entorno

### Error de Wallet
- Asegúrate de que Reown esté configurado correctamente
- Verifica que el Project ID sea válido
- Confirma que la wallet esté conectada

### Error de IPFS
- Verifica las claves de Pinata
- Confirma que el archivo sea válido
- Revisa la conexión a internet

## 🔮 Próximos Pasos

- [ ] Implementar consulta de registros por usuario
- [ ] Agregar paginación para listas grandes
- [ ] Implementar filtros por fecha/tipo
- [ ] Agregar metadatos adicionales (tags, categorías)
- [ ] Implementar sistema de permisos
- [ ] Agregar notificaciones push
