
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
    logo: 'https://assets.coingecko.com/coins/images/12504/standard/uniswap-uni.png',
    rating: 4.8,
    reviewCount: 1247,
    category: 'dex',
    description: 'Leading decentralized exchange protocol on Ethereum',
    hasPendingReviews: false,
  },
  {
    id: 2,
    name: 'SushiSwap',
    logo: 'https://assets.coingecko.com/coins/images/12271/standard/512x512_Logo_no_chop.png',
    rating: 4.2,
    reviewCount: 534,
    category: 'dex',
    description: 'Community-driven DeFi exchange with yield farming',
    hasPendingReviews: false,
  },
  {
    id: 3,
    name: 'PancakeSwap',
    logo: 'https://assets.coingecko.com/coins/images/12632/standard/pancakeswap-cake-logo_%281%29.png',
    rating: 4.3,
    reviewCount: 892,
    category: 'dex',
    description: 'Leading DEX on BNB Smart Chain',
    hasPendingReviews: false,
  },
  
  // Centralized Exchanges
  {
    id: 4,
    name: 'Binance',
    logo: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png',
    rating: 4.5,
    reviewCount: 3421,
    category: 'cex',
    description: 'World\'s largest cryptocurrency exchange by trading volume',
    hasPendingReviews: false,
  },
  {
    id: 5,
    name: 'Coinbase',
    logo: 'https://assets.coingecko.com/coins/images/9956/standard/Badge_Coinbase.png',
    rating: 4.1,
    reviewCount: 2156,
    category: 'cex',
    description: 'Leading US-based cryptocurrency exchange',
    hasPendingReviews: false,
  },
  
  // DeFi Lending & Borrowing
  {
    id: 6,
    name: 'Aave',
    logo: 'https://assets.coingecko.com/coins/images/12645/standard/AAVE.png',
    rating: 4.6,
    reviewCount: 892,
    category: 'defi-lending',
    description: 'Decentralized lending and borrowing protocol',
    hasPendingReviews: false,
  },
  {
    id: 7,
    name: 'Compound',
    logo: 'https://assets.coingecko.com/coins/images/10775/standard/COMP.png',
    rating: 4.4,
    reviewCount: 675,
    category: 'defi-lending',
    description: 'Algorithmic money market protocol',
    hasPendingReviews: false,
  },
  {
    id: 8,
    name: 'MakerDAO',
    logo: 'https://assets.coingecko.com/coins/images/1364/standard/Mark_Maker.png',
    rating: 4.7,
    reviewCount: 789,
    category: 'defi-lending',
    description: 'Decentralized stablecoin protocol',
    hasPendingReviews: false,
  },
  
  // Layer 1 Blockchains
  {
    id: 9,
    name: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
    rating: 4.9,
    reviewCount: 5234,
    category: 'layer-1',
    description: 'Leading smart contract blockchain platform',
    hasPendingReviews: false,
  },
  {
    id: 10,
    name: 'Solana',
    logo: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png',
    rating: 4.6,
    reviewCount: 2341,
    category: 'layer-1',
    description: 'High-performance blockchain for DeFi and Web3',
    hasPendingReviews: false,
  },
  {
    id: 11,
    name: 'Cardano',
    logo: 'https://assets.coingecko.com/coins/images/975/standard/cardano.png',
    rating: 4.3,
    reviewCount: 1876,
    category: 'layer-1',
    description: 'Proof-of-stake blockchain platform',
    hasPendingReviews: false,
  },
  
  // Layer 2 Solutions
  {
    id: 12,
    name: 'Polygon',
    logo: 'https://assets.coingecko.com/coins/images/4713/standard/matic-token-icon.png',
    rating: 4.6,
    reviewCount: 1123,
    category: 'layer-2',
    description: 'Ethereum scaling and infrastructure development',
    hasPendingReviews: false,
  },
  {
    id: 13,
    name: 'Arbitrum',
    logo: 'https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg',
    rating: 4.5,
    reviewCount: 892,
    category: 'layer-2',
    description: 'Optimistic rollup scaling solution for Ethereum',
    hasPendingReviews: false,
  },
  {
    id: 31,
    name: 'Optimism',
    logo: 'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
    rating: 4.7,
    reviewCount: 1456,
    category: 'layer-2',
    description: 'Optimistic Ethereum L2 blockchain',
    hasPendingReviews: false,
  },
  
  // NFT Marketplaces
  {
    id: 14,
    name: 'OpenSea',
    logo: 'https://assets.coingecko.com/coins/images/24841/standard/YlGyLwG.png',
    rating: 4.2,
    reviewCount: 3456,
    category: 'nft-marketplace',
    description: 'Largest NFT marketplace for digital collectibles',
    hasPendingReviews: false,
  },
  {
    id: 15,
    name: 'Magic Eden',
    logo: 'https://assets.coingecko.com/coins/images/27804/standard/magiceden-logo.png',
    rating: 4.4,
    reviewCount: 1234,
    category: 'nft-marketplace',
    description: 'Leading NFT marketplace on Solana',
    hasPendingReviews: false,
  },
  
  // DAOs
  {
    id: 16,
    name: 'ApeCoin',
    logo: 'https://assets.coingecko.com/coins/images/24383/standard/apecoin.jpg',
    rating: 4.6,
    reviewCount: 567,
    category: 'dao',
    description: 'Decentralized governance token for APE ecosystem',
    hasPendingReviews: false,
  },
  {
    id: 17,
    name: 'Curve DAO Token',
    logo: 'https://assets.coingecko.com/coins/images/12124/standard/Curve.png',
    rating: 4.5,
    reviewCount: 423,
    category: 'dao',
    description: 'Governance token for Curve Finance protocol',
    hasPendingReviews: false,
  },
  
  // Memecoins
  {
    id: 18,
    name: 'Dogecoin',
    logo: 'https://assets.coingecko.com/coins/images/5/standard/dogecoin.png',
    rating: 4.1,
    reviewCount: 2345,
    category: 'memes',
    description: 'The original meme cryptocurrency',
    hasPendingReviews: false,
  },
  {
    id: 19,
    name: 'Shiba Inu',
    logo: 'https://assets.coingecko.com/coins/images/11939/standard/shiba.png',
    rating: 3.9,
    reviewCount: 1876,
    category: 'memes',
    description: 'Ethereum-based meme token with DeFi ecosystem',
    hasPendingReviews: false,
  },
  {
    id: 32,
    name: 'Pepe',
    logo: 'https://assets.coingecko.com/coins/images/29850/standard/pepe-token.jpeg',
    rating: 4.0,
    reviewCount: 1567,
    category: 'memes',
    description: 'Popular meme token on Ethereum',
    hasPendingReviews: false,
  },
  
  // AI & Analytics
  {
    id: 20,
    name: 'The Graph',
    logo: 'https://assets.coingecko.com/coins/images/13397/standard/Graph_Token.png',
    rating: 4.4,
    reviewCount: 687,
    category: 'ai-analytics',
    description: 'Decentralized protocol for indexing blockchain data',
    hasPendingReviews: false,
  },
  {
    id: 21,
    name: 'Chainlink',
    logo: 'https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png',
    rating: 4.9,
    reviewCount: 1567,
    category: 'oracle-network',
    description: 'Decentralized oracle network connecting blockchains to real-world data',
    hasPendingReviews: false,
  },
  
  // Real World Assets
  {
    id: 22,
    name: 'RealT',
    logo: 'https://assets.coingecko.com/coins/images/11201/standard/RealT_Logo_Clean.png',
    rating: 4.3,
    reviewCount: 234,
    category: 'real-world-assets',
    description: 'Tokenized real estate investment platform',
    hasPendingReviews: false,
  },
  {
    id: 23,
    name: 'Centrifuge',
    logo: 'https://assets.coingecko.com/coins/images/17106/standard/CENTRIFUGE.png',
    rating: 4.2,
    reviewCount: 156,
    category: 'real-world-assets',
    description: 'DeFi protocol for real-world asset financing',
    hasPendingReviews: false,
  },
  
  // Gaming
  {
    id: 24,
    name: 'Axie Infinity',
    logo: 'https://assets.coingecko.com/coins/images/13029/standard/axie_infinity_logo.png',
    rating: 4.0,
    reviewCount: 1234,
    category: 'gaming',
    description: 'NFT-based trading and battling game',
    hasPendingReviews: false,
  },
  {
    id: 25,
    name: 'The Sandbox',
    logo: 'https://assets.coingecko.com/coins/images/12129/standard/sandbox_logo.jpg',
    rating: 4.1,
    reviewCount: 892,
    category: 'gaming',
    description: 'Virtual world where players can build and monetize',
    hasPendingReviews: false,
  },
  
  // DeFi Tools & Newer Projects
  {
    id: 26,
    name: 'Pump.fun',
    logo: 'https://assets.coingecko.com/coins/images/67164/standard/pump.jpg',
    rating: 4.2,
    reviewCount: 234,
    category: 'defi-tools',
    description: 'Meme coin creation and trading platform on Solana',
    hasPendingReviews: false,
  },
  {
    id: 27,
    name: 'Abstract',
    logo: 'https://assets.coingecko.com/coins/images/68507/standard/linea-logo.jpeg',
    rating: 4.0,
    reviewCount: 156,
    category: 'layer-2',
    description: 'Zero-knowledge rollup for consumer crypto applications',
    hasPendingReviews: false,
  },
  {
    id: 28,
    name: 'Dreamstarter.xyz',
    logo: 'https://assets.coingecko.com/coins/images/12632/standard/pancakeswap-cake-logo_%281%29.png',
    rating: 3.8,
    reviewCount: 89,
    category: 'launchpad',
    description: 'Community-driven launchpad for Web3 projects',
    hasPendingReviews: false,
  },
  
  // Additional Popular Projects
  {
    id: 29,
    name: 'Avalanche',
    logo: 'https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png',
    rating: 4.5,
    reviewCount: 1456,
    category: 'layer-1',
    description: 'High-performance smart contracts platform',
    hasPendingReviews: false,
  },
  {
    id: 30,
    name: 'Polkadot',
    logo: 'https://assets.coingecko.com/coins/images/12171/standard/polkadot.png',
    rating: 4.4,
    reviewCount: 1234,
    category: 'layer-1',
    description: 'Multi-chain blockchain platform enabling interoperability',
    hasPendingReviews: false,
  },
  
  // Additional Major Cryptocurrencies
  {
    id: 33,
    name: 'Bitcoin',
    logo: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png',
    rating: 4.9,
    reviewCount: 8976,
    category: 'layer-1',
    description: 'The original cryptocurrency and digital store of value',
    hasPendingReviews: false,
  },
  {
    id: 34,
    name: 'Ripple',
    logo: 'https://assets.coingecko.com/coins/images/44/standard/xrp-symbol-white-128.png',
    rating: 4.2,
    reviewCount: 3456,
    category: 'layer-1',
    description: 'Digital payment protocol for fast cross-border transactions',
    hasPendingReviews: false,
  },
  {
    id: 35,
    name: 'Litecoin',
    logo: 'https://assets.coingecko.com/coins/images/2/standard/litecoin.png',
    rating: 4.3,
    reviewCount: 2134,
    category: 'layer-1',
    description: 'Peer-to-peer cryptocurrency based on Bitcoin',
    hasPendingReviews: false,
  },
];

// Network-specific crypto projects
const opSepoliaProjects: Company[] = [
  // Major OP ecosystem projects
  { id: 1001, name: "Velodrome", logo: "https://assets.coingecko.com/coins/images/25783/standard/velo.png", rating: 4.2, reviewCount: 89, category: "dex", description: "Leading DEX on Optimism" },
  { id: 1002, name: "Synthetix", logo: "https://assets.coingecko.com/coins/images/3406/standard/SNX.png", rating: 4.0, reviewCount: 156, category: "derivatives", description: "Synthetic assets protocol" },
  { id: 1003, name: "Lyra", logo: "https://assets.coingecko.com/coins/images/15284/standard/lyra_logo.png", rating: 4.1, reviewCount: 67, category: "derivatives", description: "Options trading protocol" },
  { id: 1004, name: "Beethoven X", logo: "https://assets.coingecko.com/coins/images/19158/standard/beets-icon-large.png", rating: 4.3, reviewCount: 45, category: "dex", description: "Balancer-based DEX" },
  { id: 1005, name: "Stargate Finance", logo: "https://assets.coingecko.com/coins/images/18834/standard/sgLogo.png", rating: 4.0, reviewCount: 134, category: "defi-tools", description: "Cross-chain bridge protocol" },
  { id: 1006, name: "Hop Protocol", logo: "https://assets.coingecko.com/coins/images/25445/standard/hop.png", rating: 3.9, reviewCount: 78, category: "defi-tools", description: "Layer 2 bridge" },
  { id: 1007, name: "Rubicon", logo: "https://assets.coingecko.com/coins/images/17045/standard/rubicon.png", rating: 4.2, reviewCount: 34, category: "dex", description: "Order book DEX" },
  { id: 1008, name: "Kwenta", logo: "https://assets.coingecko.com/coins/images/17241/standard/kwenta.png", rating: 4.1, reviewCount: 56, category: "derivatives", description: "Perpetual futures trading" },
  { id: 1009, name: "Thales", logo: "https://assets.coingecko.com/coins/images/18388/standard/thales_logo.jpg", rating: 3.8, reviewCount: 42, category: "derivatives", description: "Binary options market" },
  { id: 1010, name: "Perpetual Protocol", logo: "https://assets.coingecko.com/coins/images/12381/standard/60d18e06844a844ad75901a9_mark_only_03.png", rating: 4.0, reviewCount: 98, category: "derivatives", description: "Decentralized perpetual contracts" },
];

const polygonAmoyProjects: Company[] = [
  // Major Polygon ecosystem projects  
  { id: 2001, name: "QuickSwap", logo: "https://assets.coingecko.com/coins/images/13970/standard/1_pOU6pBMEmiL-ZJVb0CYRjQ.png", rating: 4.3, reviewCount: 245, category: "dex", description: "Leading Polygon DEX" },
  { id: 2002, name: "Aave (Polygon)", logo: "https://assets.coingecko.com/coins/images/12645/standard/AAVE.png", rating: 4.5, reviewCount: 567, category: "defi-lending", description: "Leading lending protocol on Polygon" },
  { id: 2003, name: "Polymarket", logo: "https://assets.coingecko.com/coins/images/31949/standard/polymarket.png", rating: 4.1, reviewCount: 189, category: "derivatives", description: "Prediction markets" },
  { id: 2004, name: "Balancer (Polygon)", logo: "https://assets.coingecko.com/coins/images/11683/standard/Balancer.png", rating: 4.2, reviewCount: 234, category: "dex", description: "Automated portfolio manager" },
  { id: 2005, name: "Gains Network", logo: "https://assets.coingecko.com/coins/images/13703/standard/gns_logo.jpg", rating: 4.0, reviewCount: 145, category: "derivatives", description: "Decentralized leverage trading" },
  { id: 2006, name: "Mai Finance", logo: "https://assets.coingecko.com/coins/images/15264/standard/mimatic-red.png", rating: 3.9, reviewCount: 67, category: "defi-lending", description: "Over-collateralized stablecoin" },
  { id: 2007, name: "DodoEx", logo: "https://assets.coingecko.com/coins/images/12651/standard/dodo_logo.png", rating: 3.8, reviewCount: 89, category: "dex", description: "Proactive market maker" },
  { id: 2008, name: "Dfyn Network", logo: "https://assets.coingecko.com/coins/images/14758/standard/dfyn.png", rating: 3.7, reviewCount: 56, category: "dex", description: "Multi-chain DEX" },
  { id: 2009, name: "Klima DAO", logo: "https://assets.coingecko.com/coins/images/17741/standard/klima.png", rating: 3.6, reviewCount: 78, category: "dao", description: "Carbon-backed currency" },
  { id: 2010, name: "PolyBridge", logo: "https://assets.coingecko.com/coins/images/4713/standard/matic-token-icon.png", rating: 4.0, reviewCount: 123, category: "defi-tools", description: "Cross-chain bridge" },
];

// Get companies filtered by network for better UX
export const getCompaniesForNetwork = (network: string) => {
  const baseCompanies = sampleCompanies.filter(c => !c.id.toString().startsWith('1') && !c.id.toString().startsWith('2'));
  
  switch (network) {
    case 'opSepolia':
      return [...baseCompanies, ...opSepoliaProjects];
    case 'amoy':
      return [...baseCompanies, ...polygonAmoyProjects];
    default:
      return [...baseCompanies, ...opSepoliaProjects, ...polygonAmoyProjects];
  }
};

export const getAllCompanies = () => [...sampleCompanies, ...opSepoliaProjects, ...polygonAmoyProjects];

export const sampleCategories = [
  {
    id: 'dex',
    name: 'Decentralized Exchange (DEX)',
  },
  {
    id: 'cex',
    name: 'Centralized Exchange (CEX)',
  },
  {
    id: 'defi-lending',
    name: 'DeFi Lending',
  },
  {
    id: 'layer-1',
    name: 'Layer 1 (L1)',
  },
  {
    id: 'layer-2',
    name: 'Layer 2 (L2)',
  },
  {
    id: 'nft-marketplace',
    name: 'NFT Marketplace',
  },
  {
    id: 'dao',
    name: 'DAO',
  },
  {
    id: 'memes',
    name: 'Memes',
  },
  {
    id: 'ai-analytics',
    name: 'AI & Analytics',
  },
  {
    id: 'oracle-network',
    name: 'Oracle Network',
  },
  {
    id: 'defi-tools',
    name: 'DeFi Tools',
  },
  {
    id: 'launchpad',
    name: 'Launchpad',
  },
  {
    id: 'real-world-assets',
    name: 'Real World Assets',
  },
  {
    id: 'gaming',
    name: 'Gaming',
  },
];
