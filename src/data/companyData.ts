
export interface Company {
  id: number;
  name: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  hasPendingReviews?: boolean;
}

export const cryptoLogos = [
  'bitcoin', 'ethereum', 'cardano', 'litecoin', 'ripple',
  'dogecoin', 'polkadot', 'solana', 'binance-coin', 'tether',
  'xrp', 'usd-coin', 'bnb', 'hex', 'tron',
  'avalanche', 'matic-network', 'shiba-inu', 'dai', 'wrapped-bitcoin',
  'chainlink', 'uniswap', 'terra-luna', 'algorand', 'monero',
  'ethereum-classic', 'stellar', 'vechain', 'filecoin', 'eos'
];

export const sampleCompanies = [
  // Decentralized Exchanges (DEXs)
  {
    id: 1,
    name: 'Uniswap',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    rating: 4.8,
    reviewCount: 1247,
    category: 'Decentralized Exchange (DEX)',
    description: 'Leading decentralized exchange protocol on Ethereum',
    hasPendingReviews: false,
  },
  {
    id: 2,
    name: 'SushiSwap',
    logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
    rating: 4.2,
    reviewCount: 534,
    category: 'Decentralized Exchange (DEX)',
    description: 'Community-driven DeFi exchange with yield farming',
    hasPendingReviews: false,
  },
  {
    id: 3,
    name: 'PancakeSwap',
    logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png',
    rating: 4.3,
    reviewCount: 892,
    category: 'Decentralized Exchange (DEX)',
    description: 'Leading DEX on BNB Smart Chain',
    hasPendingReviews: false,
  },
  
  // Centralized Exchanges
  {
    id: 4,
    name: 'Binance',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    rating: 4.5,
    reviewCount: 3421,
    category: 'Centralized Exchange (CEX)',
    description: 'World\'s largest cryptocurrency exchange by trading volume',
    hasPendingReviews: false,
  },
  {
    id: 5,
    name: 'Coinbase',
    logo: 'https://cryptologos.cc/logos/coinbase-coin-logo.png',
    rating: 4.1,
    reviewCount: 2156,
    category: 'Centralized Exchange (CEX)',
    description: 'Leading US-based cryptocurrency exchange',
    hasPendingReviews: false,
  },
  
  // DeFi Lending & Borrowing
  {
    id: 6,
    name: 'Aave',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    rating: 4.6,
    reviewCount: 892,
    category: 'DeFi Lending',
    description: 'Decentralized lending and borrowing protocol',
    hasPendingReviews: false,
  },
  {
    id: 7,
    name: 'Compound',
    logo: 'https://cryptologos.cc/logos/compound-comp-logo.png',
    rating: 4.4,
    reviewCount: 675,
    category: 'DeFi Lending',
    description: 'Algorithmic money market protocol',
    hasPendingReviews: false,
  },
  {
    id: 8,
    name: 'MakerDAO',
    logo: 'https://cryptologos.cc/logos/maker-mkr-logo.png',
    rating: 4.7,
    reviewCount: 789,
    category: 'DeFi Lending',
    description: 'Decentralized stablecoin protocol',
    hasPendingReviews: false,
  },
  
  // Layer 1 Blockchains
  {
    id: 9,
    name: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    rating: 4.9,
    reviewCount: 5234,
    category: 'Layer 1 (L1)',
    description: 'Leading smart contract blockchain platform',
    hasPendingReviews: false,
  },
  {
    id: 10,
    name: 'Solana',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    rating: 4.6,
    reviewCount: 2341,
    category: 'Layer 1 (L1)',
    description: 'High-performance blockchain for DeFi and Web3',
    hasPendingReviews: false,
  },
  {
    id: 11,
    name: 'Cardano',
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    rating: 4.3,
    reviewCount: 1876,
    category: 'Layer 1 (L1)',
    description: 'Proof-of-stake blockchain platform',
    hasPendingReviews: false,
  },
  
  // Layer 2 Solutions
  {
    id: 12,
    name: 'Polygon',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    rating: 4.6,
    reviewCount: 1123,
    category: 'Layer 2 (L2)',
    description: 'Ethereum scaling and infrastructure development',
    hasPendingReviews: false,
  },
  {
    id: 13,
    name: 'Arbitrum',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    rating: 4.5,
    reviewCount: 892,
    category: 'Layer 2 (L2)',
    description: 'Optimistic rollup scaling solution for Ethereum',
    hasPendingReviews: false,
  },
  
  // NFT Marketplaces
  {
    id: 14,
    name: 'OpenSea',
    logo: 'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png',
    rating: 4.2,
    reviewCount: 3456,
    category: 'NFT Marketplace',
    description: 'Largest NFT marketplace for digital collectibles',
    hasPendingReviews: false,
  },
  {
    id: 15,
    name: 'Magic Eden',
    logo: 'https://pbs.twimg.com/profile_images/1618229467932237824/Noc7MqQ6_400x400.jpg',
    rating: 4.4,
    reviewCount: 1234,
    category: 'NFT Marketplace',
    description: 'Leading NFT marketplace on Solana',
    hasPendingReviews: false,
  },
  
  // DAOs
  {
    id: 16,
    name: 'Uniswap DAO',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    rating: 4.6,
    reviewCount: 567,
    category: 'DAO',
    description: 'Decentralized governance for Uniswap protocol',
    hasPendingReviews: false,
  },
  {
    id: 17,
    name: 'Curve DAO',
    logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
    rating: 4.5,
    reviewCount: 423,
    category: 'DAO',
    description: 'Governance token for Curve Finance protocol',
    hasPendingReviews: false,
  },
  
  // Memecoins
  {
    id: 18,
    name: 'Dogecoin',
    logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    rating: 4.1,
    reviewCount: 2345,
    category: 'Memes',
    description: 'The original meme cryptocurrency',
    hasPendingReviews: false,
  },
  {
    id: 19,
    name: 'Shiba Inu',
    logo: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
    rating: 3.9,
    reviewCount: 1876,
    category: 'Memes',
    description: 'Ethereum-based meme token with DeFi ecosystem',
    hasPendingReviews: false,
  },
  
  // AI & Analytics
  {
    id: 20,
    name: 'The Graph',
    logo: 'https://cryptologos.cc/logos/the-graph-grt-logo.png',
    rating: 4.4,
    reviewCount: 687,
    category: 'AI & Analytics',
    description: 'Decentralized protocol for indexing blockchain data',
    hasPendingReviews: false,
  },
  {
    id: 21,
    name: 'Chainlink',
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    rating: 4.9,
    reviewCount: 1567,
    category: 'Oracle Network',
    description: 'Decentralized oracle network connecting blockchains to real-world data',
    hasPendingReviews: false,
  },
  
  // Newer/Unlisted Projects
  {
    id: 22,
    name: 'Pump.fun',
    logo: '/placeholder.svg',
    rating: 4.2,
    reviewCount: 234,
    category: 'DeFi Tools',
    description: 'Meme coin creation and trading platform on Solana',
    hasPendingReviews: false,
  },
  {
    id: 23,
    name: 'Abstract',
    logo: '/placeholder.svg',
    rating: 4.0,
    reviewCount: 156,
    category: 'Layer 2 (L2)',
    description: 'Zero-knowledge rollup for consumer crypto applications',
    hasPendingReviews: false,
  },
  {
    id: 24,
    name: 'Dreamstarter.xyz',
    logo: '/placeholder.svg',
    rating: 3.8,
    reviewCount: 89,
    category: 'Launchpad',
    description: 'Community-driven launchpad for Web3 projects',
    hasPendingReviews: false,
  }
];

export const sampleCategories = [
  {
    id: 1,
    name: 'Decentralized Exchange (DEX)',
  },
  {
    id: 2,
    name: 'Centralized Exchange (CEX)',
  },
  {
    id: 3,
    name: 'DeFi Lending',
  },
  {
    id: 4,
    name: 'Layer 1 (L1)',
  },
  {
    id: 5,
    name: 'Layer 2 (L2)',
  },
  {
    id: 6,
    name: 'NFT Marketplace',
  },
  {
    id: 7,
    name: 'DAO',
  },
  {
    id: 8,
    name: 'Memes',
  },
  {
    id: 9,
    name: 'AI & Analytics',
  },
  {
    id: 10,
    name: 'Oracle Network',
  },
  {
    id: 11,
    name: 'DeFi Tools',
  },
  {
    id: 12,
    name: 'Launchpad',
  },
];
