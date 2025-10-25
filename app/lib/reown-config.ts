import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'

// 1. Get projectId from https://dashboard.reown.com
// Usando un Project ID temporal para desarrollo
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5'

// 2. Create a metadata object - optional
export const metadata = {
  name: 'Mnemósine',
  description: 'Preserva tus recuerdos en la blockchain',
  url: 'https://mnemosine.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 3. Set up Solana Adapter
const solanaAdapter = new SolanaAdapter()

// 4. Create modal
export const appKit = createAppKit({
  adapters: [solanaAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
})
