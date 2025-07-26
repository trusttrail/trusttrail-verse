
import { 
  Home, 
  PenTool, 
  Grid3X3, 
  Building2, 
  Store, 
  Coins,
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
  { 
    id: 1, 
    name: "QuickSwap", 
    logo: "https://pbs.twimg.com/profile_images/1673628171051331584/5Wf5ZMcF_400x400.jpg", 
    rating: 4.8, 
    reviewCount: 156, 
    category: "DeFi" 
  },
  { 
    id: 2, 
    name: "OpenSea", 
    logo: "https://pbs.twimg.com/profile_images/1560719020905521152/8KHPoIV-_400x400.jpg", 
    rating: 4.6, 
    reviewCount: 213, 
    category: "NFT" 
  },
  { 
    id: 3, 
    name: "Axie Infinity", 
    logo: "https://pbs.twimg.com/profile_images/1598680199088066560/9J0QZQFX_400x400.png", 
    rating: 4.5, 
    reviewCount: 189, 
    category: "Gaming" 
  },
  { 
    id: 4, 
    name: "Uniswap", 
    logo: "https://pbs.twimg.com/profile_images/1692919071088746496/fWpUdRws_400x400.jpg", 
    rating: 4.7, 
    reviewCount: 201, 
    category: "DeFi" 
  }
];

export const recentReviews = [
  { 
    id: 1, 
    companyName: "QuickSwap", 
    companyLogo: "https://pbs.twimg.com/profile_images/1673628171051331584/5Wf5ZMcF_400x400.jpg",
    reviewerAddress: "0x1234...5678", 
    rating: 5, 
    title: "Best DEX on Polygon", 
    content: "QuickSwap offers the best trading experience I've had on Polygon. Low fees and high liquidity.", 
    date: "2025-05-15", 
    verified: true 
  },
  { 
    id: 2, 
    companyName: "Axie Infinity", 
    companyLogo: "https://pbs.twimg.com/profile_images/1598680199088066560/9J0QZQFX_400x400.png",
    reviewerAddress: "0x8765...4321", 
    rating: 4, 
    title: "Fun gaming experience", 
    content: "Axie Infinity has been a great gaming experience. The team is responsive and the community is active.", 
    date: "2025-05-14", 
    verified: true 
  },
  { 
    id: 3, 
    companyName: "OpenSea", 
    companyLogo: "https://pbs.twimg.com/profile_images/1560719020905521152/8KHPoIV-_400x400.jpg",
    reviewerAddress: "0xabcd...ef12", 
    rating: 3, 
    title: "Good but needs improvements", 
    content: "OpenSea has a good selection of NFTs, but the user interface could use some improvements.", 
    date: "2025-05-13", 
    verified: true 
  }
];

// Removed Gitcoin Passport tab from the portal tabs
export const portalTabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "write-review", label: "Write Review", icon: PenTool },
  { id: "my-dashboard", label: "My Dashboard", icon: User },
  { id: "categories", label: "Categories", icon: Grid3X3 },
  { id: "businesses", label: "Businesses", icon: Building2 },
  { id: "nft-marketplace", label: "NFT Marketplace", icon: Store },
  { id: "staking", label: "Staking", icon: Coins },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];
