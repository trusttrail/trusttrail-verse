
export interface Web3Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export const web3Categories: Web3Category[] = [
  {
    id: "dex",
    name: "Decentralized Exchange (DEX)",
    icon: "🔄",
    count: 156,
    description: "Automated market makers and decentralized trading protocols"
  },
  {
    id: "cex", 
    name: "Centralized Exchange (CEX)",
    icon: "🏦",
    count: 89,
    description: "Traditional cryptocurrency exchanges with KYC"
  },
  {
    id: "defi-lending",
    name: "DeFi Lending",
    icon: "💰",
    count: 124,
    description: "Decentralized lending and borrowing protocols"
  },
  {
    id: "layer1",
    name: "Layer 1 (L1)",
    icon: "⛓️",
    count: 67,
    description: "Base blockchain networks and protocols"
  },
  {
    id: "layer2",
    name: "Layer 2 (L2)", 
    icon: "🚀",
    count: 45,
    description: "Scaling solutions and sidechains"
  },
  {
    id: "nft-marketplace",
    name: "NFT Marketplace",
    icon: "🖼️",
    count: 38,
    description: "Platforms for trading digital collectibles"
  },
  {
    id: "dao",
    name: "DAO",
    icon: "🏛️",
    count: 25,
    description: "Decentralized autonomous organizations"
  },
  {
    id: "memes",
    name: "Memes",
    icon: "🐕",
    count: 110,
    description: "Meme-based cryptocurrencies and tokens"
  },
  {
    id: "ai-analytics",
    name: "AI & Analytics",
    icon: "🤖",
    count: 31,
    description: "AI-powered blockchain tools and analytics"
  },
  {
    id: "oracle",
    name: "Oracle Network",
    icon: "🔮",
    count: 41,
    description: "Decentralized data feed providers"
  },
  {
    id: "rwa",
    name: "Real World Assets",
    icon: "🏠",
    count: 28,
    description: "Tokenization of physical and traditional assets"
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    count: 156,
    description: "Blockchain-based games and gaming platforms"
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: "🏗️",
    count: 89,
    description: "Developer tools and blockchain infrastructure"
  },
  {
    id: "yield-farming",
    name: "Yield Farming",
    icon: "🌾",
    count: 76,
    description: "Liquidity mining and yield optimization protocols"
  },
  {
    id: "derivatives",
    name: "Derivatives",
    icon: "📈",
    count: 54,
    description: "Synthetic assets and derivative trading platforms"
  },
  {
    id: "launchpad",
    name: "Launchpad",
    icon: "🚀",
    count: 42,
    description: "Token launch and fundraising platforms"
  },
  {
    id: "privacy",
    name: "Privacy",
    icon: "🛡️",
    count: 33,
    description: "Privacy-focused cryptocurrencies and protocols"
  },
  {
    id: "stablecoin",
    name: "Stablecoin",
    icon: "💵",
    count: 67,
    description: "Price-stable cryptocurrencies"
  },
  {
    id: "defi-tools",
    name: "DeFi Tools",
    icon: "🔧",
    count: 98,
    description: "Tools and utilities for DeFi ecosystem"
  },
  {
    id: "social",
    name: "Social",
    icon: "👥",
    count: 45,
    description: "Decentralized social networks and platforms"
  }
];
