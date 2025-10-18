# 🌿 Mnemósine Frontend

Una aplicación web moderna para preservar recuerdos digitales, desarrollada con Next.js 14, TypeScript y TailwindCSS.

## ✨ Características

- **Interfaz minimalista y emocional** con animaciones suaves
- **Subida de imágenes** con validación (PNG/JPG, máximo 5MB)
- **Cálculo de hash SHA-256** usando la API nativa del navegador
- **Integración con Reown AppKit** para conexión de wallets Solana
- **Conexión de wallet** con Phantom y autenticación social/email
- **Flujo completo** sin necesidad de backend o blockchain
- **Diseño responsive** y accesible
- **Animaciones fluidas** con Framer Motion

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en [Reown Cloud](https://cloud.reown.com/) para obtener Project ID

### Instalación
```bash
# Instalar dependencias
npm install
# o
yarn install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local y agregar tu NEXT_PUBLIC_PROJECT_ID

# Ejecutar en modo desarrollo
npm run dev
# o
yarn dev
```

### Abrir en el navegador
Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 🎯 Flujo de la Aplicación

1. **Pantalla de Inicio**: Presentación de Mnemósine con botón de acceso
2. **Subir Recuerdo**: 
   - Selección de imagen (drag & drop o click)
   - Escritura de historia/anécdota
   - Cálculo automático de hash SHA-256
3. **Pantalla de Éxito**: Confirmación con detalles del recuerdo guardado

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **Crypto API** - Cálculo de hash SHA-256
- **Reown AppKit** - Conexión de wallets Solana
- **Solana Adapter** - Integración con blockchain Solana

## 📁 Estructura del Proyecto

```
app/
├── app/
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx          # Layout principal con AppKitProvider
│   └── page.tsx            # Página principal con control de flujo
├── components/
│   ├── Card.tsx            # Componente contenedor base
│   ├── HomeScreen.tsx      # Pantalla de inicio con wallet
│   ├── UploadScreen.tsx    # Pantalla de subida con wallet
│   ├── SuccessScreen.tsx   # Pantalla de éxito
│   ├── WalletButton.tsx    # Botón de conexión de wallet
│   └── WalletStatus.tsx    # Estado de la wallet
├── lib/
│   └── appkit-config.ts    # Configuración de Reown AppKit
├── package.json            # Dependencias y scripts
├── tailwind.config.js      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── README.md              # Documentación completa
```

## 🎨 Diseño

- **Paleta de colores**: Tonos cálidos y crema
- **Tipografía**: Inter (Google Fonts)
- **Animaciones**: Transiciones suaves entre pantallas
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar versión de producción
- `npm run lint` - Verificar código con ESLint

## 📝 Notas

- La aplicación funciona completamente en el cliente (client-side)
- No requiere conexión a blockchain ni wallets
- Las imágenes se procesan solo en memoria
- El hash SHA-256 se calcula usando la API nativa del navegador

---

> ✨ *Mnemósine — Donde los recuerdos viven para siempre.*
