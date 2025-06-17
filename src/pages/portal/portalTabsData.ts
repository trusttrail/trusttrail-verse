import { 
  Home, 
  PenTool, 
  Grid3X3, 
  Building2, 
  Store, 
  Droplets, 
  Coins, 
  Shield, 
  BarChart3,
  User
} from "lucide-react";

// Export lucide tab icons as references, not JSX
export const categories = [
  { id: "defi", name: "DeFi", icon: "💰", count: 156 },
  { id: "nft", name: "NFT Marketplaces", icon: "🖼️", count: 89 },
  { id: "gaming", name: "Gaming", icon: "🎮", count: 124 },
  { id: "dao", name: "DAOs", icon: "🏛️", count: 67 },
  { id: "infrastructure", name: "Infrastructure", icon: "🏗️", count: 45 },
  { id: "social", name: "Social", icon: "👥", count: 38 },
  { id: "education", name: "Education", icon: "🎓", count: 25 },
  { id: "security", name: "Security", icon: "🛡️", count: 31 },
  { id: "exchange", name: "Exchanges", icon: "💱", count: 110 },
  { id: "staking", name: "Staking", icon: "🔒", count: 41 }
];

export const topCompanies = [
  { id: 1, name: "QuickSwap", logo: "/placeholder.svg", rating: 4.8, reviewCount: 156, category: "DeFi" },
  { id: 2, name: "OpenSea", logo: "/placeholder.svg", rating: 4.6, reviewCount: 213, category: "NFT" },
  { id: 3, name: "Axie Infinity", logo: "/placeholder.svg", rating: 4.5, reviewCount: 189, category: "Gaming" },
  { id: 4, name: "Uniswap", logo: "/placeholder.svg", rating: 4.7, reviewCount: 201, category: "DeFi" }
];

export const recentReviews = [
  { id: 1, companyName: "QuickSwap", reviewerAddress: "0x1234...5678", rating: 5, title: "Best DEX on Polygon", content: "QuickSwap offers the best trading experience I've had on Polygon. Low fees and high liquidity.", date: "2025-05-15", verified: true },
  { id: 2, companyName: "Axie Infinity", reviewerAddress: "0x8765...4321", rating: 4, title: "Fun gaming experience", content: "Axie Infinity has been a great gaming experience. The team is responsive and the community is active.", date: "2025-05-14", verified: true },
  { id: 3, companyName: "OpenSea", reviewerAddress: "0xabcd...ef12", rating: 3, title: "Good but needs improvements", content: "OpenSea has a good selection of NFTs, but the user interface could use some improvements.", date: "2025-05-13", verified: true }
];

// Removed deployment tab from the portal tabs
export const portalTabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "write-review", label: "Write Review", icon: PenTool },
  { id: "my-dashboard", label: "My Dashboard", icon: User },
  { id: "categories", label: "Categories", icon: Grid3X3 },
  { id: "businesses", label: "Businesses", icon: Building2 },
  { id: "nft-marketplace", label: "NFT Marketplace", icon: Store },
  { id: "liquidity", label: "Liquidity", icon: Droplets },
  { id: "staking", label: "Staking", icon: Coins },
  { id: "passport", label: "Passport", icon: Shield },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];
