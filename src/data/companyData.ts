
// Expanded and updated companies data: includes Web3 and crypto trending projects as of 2025.

export const sampleCompanies = [
  // Exchanges (CeFi & DEX)
  { id: 1, name: "Binance", category: "Exchange" },
  { id: 2, name: "Coinbase", category: "Exchange" },
  { id: 3, name: "Kraken", category: "Exchange" },
  { id: 4, name: "OKX", category: "Exchange" },
  { id: 5, name: "KuCoin", category: "Exchange" },
  { id: 6, name: "Bybit", category: "Exchange" },
  { id: 7, name: "Gate.io", category: "Exchange" },
  { id: 8, name: "dYdX", category: "DEX" },
  { id: 9, name: "Uniswap", category: "DEX" },
  { id: 10, name: "PancakeSwap", category: "DEX" },
  { id: 11, name: "SushiSwap", category: "DEX" },
  { id: 12, name: "QuickSwap", category: "DEX" },
  { id: 13, name: "Curve Finance", category: "DEX" },
  { id: 14, name: "Balancer", category: "DEX" },
  { id: 15, name: "1inch", category: "DEX" },
  { id: 16, name: "Bancor", category: "DEX" },
  { id: 17, name: "Jupiter", category: "DEX" },
  { id: 18, name: "Raydium", category: "DEX" },
  { id: 19, name: "Maverick", category: "DEX" },

  // L2s & Infrastructure
  { id: 20, name: "Polygon", category: "L2 & Infrastructure" },
  { id: 21, name: "Arbitrum", category: "L2 & Infrastructure" },
  { id: 22, name: "Optimism", category: "L2 & Infrastructure" },
  { id: 23, name: "Base", category: "L2 & Infrastructure" },
  { id: 24, name: "Blast", category: "L2 & Infrastructure" },
  { id: 25, name: "Linea", category: "L2 & Infrastructure" },
  { id: 26, name: "Scroll", category: "L2 & Infrastructure" },
  { id: 27, name: "Mantle", category: "L2 & Infrastructure" },
  { id: 28, name: "ZkSync", category: "L2 & Infrastructure" },
  { id: 29, name: "Immutable X", category: "L2 & Infrastructure" },
  { id: 30, name: "Celestia", category: "L2 & Infrastructure" },

  // Wallets
  { id: 31, name: "MetaMask", category: "Wallet" },
  { id: 32, name: "Trust Wallet", category: "Wallet" },
  { id: 33, name: "Phantom", category: "Wallet" },
  { id: 34, name: "OKX Wallet", category: "Wallet" },
  { id: 35, name: "Rainbow", category: "Wallet" },
  { id: 36, name: "Keplr", category: "Wallet" },
  { id: 37, name: "XDEFI", category: "Wallet" },
  { id: 38, name: "Safe (Gnosis Safe)", category: "Wallet" },

  // NFT Marketplaces
  { id: 39, name: "OpenSea", category: "NFT Marketplaces" },
  { id: 40, name: "Blur", category: "NFT Marketplaces" },
  { id: 41, name: "Magic Eden", category: "NFT Marketplaces" },
  { id: 42, name: "Tensor", category: "NFT Marketplaces" },
  { id: 43, name: "SuperRare", category: "NFT Marketplaces" },
  { id: 44, name: "Foundation", category: "NFT Marketplaces" },
  { id: 45, name: "Rarible", category: "NFT Marketplaces" },

  // Gaming & Metaverse
  { id: 46, name: "Axie Infinity", category: "Gaming" },
  { id: 47, name: "The Sandbox", category: "Gaming" },
  { id: 48, name: "Decentraland", category: "Gaming" },
  { id: 49, name: "Gala Games", category: "Gaming" },
  { id: 50, name: "YGG", category: "Gaming" },
  { id: 51, name: "Pixels", category: "Gaming" },

  // Socials
  { id: 52, name: "Farcaster", category: "Socials" },
  { id: 53, name: "Friend.tech", category: "Socials" },
  { id: 54, name: "Lens Protocol", category: "Socials" },
  { id: 55, name: "CyberConnect", category: "Socials" },
  { id: 56, name: "Mastodon", category: "Socials" },

  // Restaking & Staking
  { id: 57, name: "EigenLayer", category: "Restaking" },
  { id: 58, name: "EtherFi", category: "Restaking" },
  { id: 59, name: "Renzo", category: "Restaking" },
  { id: 60, name: "Karak", category: "Restaking" },
  { id: 61, name: "Lido", category: "Staking" },
  { id: 62, name: "Rocket Pool", category: "Staking" },
  { id: 63, name: "Ethena", category: "Staking" },

  // Memecoins/Community coins
  { id: 64, name: "Dogecoin", category: "Memecoins" },
  { id: 65, name: "Shiba Inu", category: "Memecoins" },
  { id: 66, name: "Pepe", category: "Memecoins" },
  { id: 67, name: "Book of Meme (BOME)", category: "Memecoins" },
  { id: 68, name: "Wen Mew", category: "Memecoins" },

  // AI & Analytics
  { id: 69, name: "Kaito", category: "AI/Analytics" },
  { id: 70, name: "Arkham Intelligence", category: "AI/Analytics" },
  { id: 71, name: "Dune Analytics", category: "AI/Analytics" },
  { id: 72, name: "Nansen", category: "AI/Analytics" },
  { id: 73, name: "Messari", category: "AI/Analytics" },
  { id: 74, name: "Flipside Crypto", category: "AI/Analytics" },
  { id: 75, name: "The Graph", category: "AI/Analytics" },

  // DeFi Lending/Borrowing & Derivatives
  { id: 76, name: "Aave", category: "DeFi Lending" },
  { id: 77, name: "Compound", category: "DeFi Lending" },
  { id: 78, name: "MakerDAO", category: "DeFi Lending" },
  { id: 79, name: "Liquity", category: "DeFi Lending" },
  { id: 80, name: "Pendle", category: "DeFi Derivatives" },
  { id: 81, name: "Ribbon Finance", category: "DeFi Derivatives" },
  { id: 82, name: "GMX", category: "DeFi Perpetuals" },
  { id: 83, name: "dYdX (Perps)", category: "DeFi Perpetuals" },

  // Bridges
  { id: 84, name: "Wormhole", category: "Bridges" },
  { id: 85, name: "LayerZero", category: "Bridges" },
  { id: 86, name: "Synapse", category: "Bridges" },
  { id: 87, name: "Stargate", category: "Bridges" },
  { id: 88, name: "Portal Token Bridge", category: "Bridges" },

  // Security & Oracles
  { id: 89, name: "Chainlink", category: "Oracles" },
  { id: 90, name: "Pyth", category: "Oracles" },
  { id: 91, name: "OpenZeppelin", category: "Security" },
  { id: 92, name: "CertiK", category: "Security" },

  // Cross-chain and Interoperability
  { id: 93, name: "Cosmos", category: "Interoperability" },
  { id: 94, name: "Polkadot", category: "Interoperability" },
  { id: 95, name: "Avalanche", category: "Interoperability" },

  // ZK & Privacy
  { id: 96, name: "Aztec", category: "ZK/Privacy" },
  { id: 97, name: "zkSync", category: "ZK/Privacy" },

  // Storage
  { id: 98, name: "Arweave", category: "Storage" },
  { id: 99, name: "Filecoin", category: "Storage" },
  { id: 100, name: "IPFS", category: "Storage" },

  // Trending/Experimental
  { id: 101, name: "Berachain", category: "L1s" },
  { id: 102, name: "Monad", category: "L1s" },
  { id: 103, name: "ZetaChain", category: "L1s" },
  { id: 104, name: "Saga", category: "L1s" }
];

export const categories = [
  { id: "exchange", name: "Centralized Exchanges" },
  { id: "dex", name: "DEXs" },
  { id: "l2", name: "L2 & Infrastructure" },
  { id: "wallet", name: "Wallets" },
  { id: "nftmarketplace", name: "NFT Marketplaces" },
  { id: "gaming", name: "Gaming" },
  { id: "socials", name: "Socials" },
  { id: "restaking", name: "Restaking" },
  { id: "staking", name: "Staking" },
  { id: "memecoins", name: "Memecoins" },
  { id: "ai_analytics", name: "AI & Analytics" },
  { id: "defilending", name: "DeFi Lending" },
  { id: "defiderivative", name: "DeFi Derivatives" },
  { id: "defiperpetuals", name: "DeFi Perpetuals" },
  { id: "bridges", name: "Bridges" },
  { id: "oracles", name: "Oracles" },
  { id: "security", name: "Security" },
  { id: "interoperability", name: "Interoperability" },
  { id: "zkprivacy", name: "ZK/Privacy" },
  { id: "storage", name: "Storage" },
  { id: "l1s", name: "Layer 1s" }
];

export type Company = typeof sampleCompanies[0];
export type Category = typeof categories[0];
