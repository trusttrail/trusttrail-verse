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
  {
    id: 1,
    name: 'Uniswap',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    rating: 4.8,
    reviewCount: 1247,
    category: 'DeFi Exchange',
    description: 'Leading decentralized exchange protocol',
    hasPendingReviews: false,
  },
  {
    id: 2,
    name: 'Aave',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    rating: 4.6,
    reviewCount: 892,
    category: 'DeFi Lending',
    description: 'Decentralized lending and borrowing protocol',
    hasPendingReviews: true,
  },
  {
    id: 3,
    name: 'Compound',
    logo: 'https://cryptologos.cc/logos/compound-comp-logo.png',
    rating: 4.4,
    reviewCount: 675,
    category: 'DeFi Lending',
    description: 'Algorithmic money market protocol',
    hasPendingReviews: false,
  },
  {
    id: 4,
    name: 'SushiSwap',
    logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
    rating: 4.2,
    reviewCount: 534,
    category: 'DeFi Exchange',
    description: 'Community-driven DeFi exchange',
    hasPendingReviews: false,
  },
  {
    id: 5,
    name: 'Curve Finance',
    logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
    rating: 4.5,
    reviewCount: 423,
    category: 'DeFi Exchange',
    description: 'Automated market maker for stablecoins',
    hasPendingReviews: false,
  },
  {
    id: 6,
    name: 'MakerDAO',
    logo: 'https://cryptologos.cc/logos/maker-mkr-logo.png',
    rating: 4.7,
    reviewCount: 789,
    category: 'DeFi Lending',
    description: 'Decentralized autonomous organization',
    hasPendingReviews: true,
  },
  {
    id: 7,
    name: 'Synthetix',
    logo: 'https://cryptologos.cc/logos/synthetix-snx-logo.png',
    rating: 4.1,
    reviewCount: 267,
    category: 'DeFi Derivatives',
    description: 'Decentralized synthetic asset protocol',
    hasPendingReviews: false,
  },
  {
    id: 8,
    name: '1inch',
    logo: 'https://cryptologos.cc/logos/1inch-1inch-logo.png',
    rating: 4.3,
    reviewCount: 456,
    category: 'DeFi Aggregator',
    description: 'DEX aggregator and liquidity protocol',
    hasPendingReviews: false,
  },
  {
    id: 9,
    name: 'Yearn Finance',
    logo: 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.png',
    rating: 4.0,
    reviewCount: 312,
    category: 'DeFi Yield',
    description: 'Yield farming optimization protocol',
    hasPendingReviews: false,
  },
  {
    id: 10,
    name: 'Balancer',
    logo: 'https://cryptologos.cc/logos/balancer-bal-logo.png',
    rating: 4.2,
    reviewCount: 298,
    category: 'DeFi Exchange',
    description: 'Automated portfolio manager and liquidity provider',
    hasPendingReviews: false,
  },
  {
    id: 11,
    name: 'Chainlink',
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    rating: 4.9,
    reviewCount: 1567,
    category: 'Oracle Network',
    description: 'Decentralized oracle network',
    hasPendingReviews: false,
  },
  {
    id: 12,
    name: 'Polygon',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    rating: 4.6,
    reviewCount: 1123,
    category: 'Layer 2',
    description: 'Ethereum scaling and infrastructure',
    hasPendingReviews: true,
  }
];

export const sampleCategories = [
  {
    id: 1,
    name: 'DeFi Exchange',
  },
  {
    id: 2,
    name: 'DeFi Lending',
  },
  {
    id: 3,
    name: 'DeFi Derivatives',
  },
  {
    id: 4,
    name: 'DeFi Aggregator',
  },
  {
    id: 5,
    name: 'DeFi Yield',
  },
  {
    id: 6,
    name: 'Oracle Network',
  },
  {
    id: 7,
    name: 'Layer 2',
  },
];
