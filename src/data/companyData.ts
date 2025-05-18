
// Extended companies data for demonstration
export const sampleCompanies = [
  { id: 1, name: "QuickSwap", category: "DeFi" },
  { id: 2, name: "OpenSea", category: "NFT Marketplaces" },
  { id: 3, name: "Axie Infinity", category: "Gaming" },
  { id: 4, name: "Uniswap", category: "DeFi" },
  { id: 5, name: "Twitter", category: "Social Media" },
  { id: 6, name: "Google", category: "Search" },
  { id: 7, name: "Airbnb", category: "Hospitality" },
  { id: 8, name: "Amazon", category: "E-commerce" },
  { id: 9, name: "Netflix", category: "Entertainment" },
  { id: 10, name: "Uber", category: "Transport" },
  { id: 11, name: "Binance", category: "Exchange" },
  { id: 12, name: "Coinbase", category: "Exchange" },
  { id: 13, name: "Aave", category: "Lending" },
  { id: 14, name: "Compound", category: "Lending" },
  { id: 15, name: "Spotify", category: "Entertainment" },
  { id: 16, name: "Apple", category: "Technology" },
  { id: 17, name: "Microsoft", category: "Technology" },
  { id: 18, name: "Facebook", category: "Social Media" },
  { id: 19, name: "LinkedIn", category: "Professional Network" },
  { id: 20, name: "Shopify", category: "E-commerce" }
];

// Generalized categories
export const categories = [
  { id: "defi", name: "DeFi" },
  { id: "nft", name: "NFT Marketplaces" },
  { id: "gaming", name: "Gaming" },
  { id: "dao", name: "DAOs" },
  { id: "infrastructure", name: "Infrastructure" },
  { id: "social", name: "Social Media" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "finance", name: "Finance" },
  { id: "search", name: "Search" },
  { id: "entertainment", name: "Entertainment" },
  { id: "transport", name: "Transport" },
  { id: "hospitality", name: "Hospitality" },
  { id: "saas", name: "SaaS" },
  { id: "exchange", name: "Exchange" },
  { id: "lending", name: "Lending" },
  { id: "technology", name: "Technology" },
  { id: "professional", name: "Professional Network" },
];

export type Company = typeof sampleCompanies[0];
export type Category = typeof categories[0];
