import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Search, Grid3X3, Building, Award, Globe, Wallet, LogOut, Edit, MessageSquare } from "lucide-react";
import ReviewCard from "@/components/review/ReviewCard";
import CategoryCard from "@/components/review/CategoryCard";
import CompanyCard from "@/components/review/CompanyCard";
import NetworkSelector from "@/components/review/NetworkSelector";
import WalletConnect from "@/components/review/WalletConnect";
import { useTheme } from '@/hooks/useTheme';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const ReviewPortal = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentNetwork, setCurrentNetwork] = useState<string>("polygon");
  const [activeTab, setActiveTab] = useState<string>("portal");

  // Mock data for demonstration
  const categories = [
    { id: "defi", name: "DeFi", icon: "💰", count: 156 },
    { id: "nft", name: "NFT Marketplaces", icon: "🖼️", count: 89 },
    { id: "gaming", name: "Gaming", icon: "🎮", count: 124 },
    { id: "dao", name: "DAOs", icon: "🏛️", count: 67 },
    { id: "infrastructure", name: "Infrastructure", icon: "🏗️", count: 45 },
    { id: "social", name: "Social", icon: "👥", count: 38 }
  ];

  const topCompanies = [
    { id: 1, name: "QuickSwap", logo: "/placeholder.svg", rating: 4.8, reviewCount: 156, category: "DeFi" },
    { id: 2, name: "OpenSea", logo: "/placeholder.svg", rating: 4.6, reviewCount: 213, category: "NFT" },
    { id: 3, name: "Axie Infinity", logo: "/placeholder.svg", rating: 4.5, reviewCount: 189, category: "Gaming" },
    { id: 4, name: "Uniswap", logo: "/placeholder.svg", rating: 4.7, reviewCount: 201, category: "DeFi" }
  ];

  const recentReviews = [
    { 
      id: 1, 
      companyName: "QuickSwap", 
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
      reviewerAddress: "0xabcd...ef12", 
      rating: 3, 
      title: "Good but needs improvements",
      content: "OpenSea has a good selection of NFTs, but the user interface could use some improvements.",
      date: "2025-05-13",
      verified: true
    }
  ];

  // Check if MetaMask is installed
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask browser extension to connect your wallet.",
          variant: "destructive",
        });
        return;
      }

      // Check if already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
  };

  // Connect wallet handler
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask browser extension to connect your wallet.",
          variant: "destructive",
        });
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });

        // Check network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Polygon Mainnet: 0x89
        if (chainId !== '0x89') {
          toast({
            title: "Wrong Network",
            description: "Please switch to Polygon network in your MetaMask wallet.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Disconnect wallet handler
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // Network change handler
  const handleNetworkChange = (network: string) => {
    if (network !== "polygon") {
      toast({
        title: "Network Not Supported",
        description: `${network.charAt(0).toUpperCase() + network.slice(1)} network is not supported yet. Please switch to Polygon.`,
        variant: "destructive",
      });
      return;
    }
    setCurrentNetwork(network);
    toast({
      title: "Network Changed",
      description: `Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} network.`,
    });
  };

  // Listen for account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setIsWalletConnected(false);
        setWalletAddress("");
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      } else if (accounts[0] !== walletAddress) {
        // User switched accounts
        setWalletAddress(accounts[0]);
        toast({
          title: "Account Changed",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });
      }
    };

    const handleChainChanged = (chainId: string) => {
      // Polygon Mainnet: 0x89
      if (chainId !== '0x89') {
        toast({
          title: "Wrong Network",
          description: "Please switch to Polygon network in your MetaMask wallet.",
          variant: "destructive",
        });
      } else {
        setCurrentNetwork("polygon");
        toast({
          title: "Network Changed",
          description: "Connected to Polygon network.",
        });
      }
    };

    // Check if wallet is connected when component mounts
    checkIfWalletIsConnected();

    // Set up event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletAddress, toast]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16">
        {/* Main Tabs */}
        <Tabs defaultValue="portal" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">
              TrustTrail Review Portal
            </h1>
            <div className="flex items-center gap-4">
              <TabsList className="hidden md:flex">
                <TabsTrigger value="write-review" className="flex items-center gap-1.5">
                  <Edit size={16} />
                  <span className="hidden sm:inline">Write a Review</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-1.5">
                  <Grid3X3 size={16} />
                  <span className="hidden sm:inline">Categories</span>
                </TabsTrigger>
                <TabsTrigger value="businesses" className="flex items-center gap-1.5">
                  <Building size={16} />
                  <span className="hidden sm:inline">For Businesses</span>
                </TabsTrigger>
                <TabsTrigger value="stake" className="flex items-center gap-1.5">
                  <Award size={16} />
                  <span className="hidden sm:inline">Stake Rewards</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <NetworkSelector 
                  currentNetwork={currentNetwork} 
                  onChange={handleNetworkChange} 
                />
                
                <WalletConnect 
                  isConnected={isWalletConnected}
                  address={walletAddress}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <TabsList className="w-full mb-6 md:hidden">
            <TabsTrigger value="write-review" className="flex items-center gap-1.5">
              <Edit size={16} />
              <span>Write</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1.5">
              <Grid3X3 size={16} />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center gap-1.5">
              <Building size={16} />
              <span>Business</span>
            </TabsTrigger>
            <TabsTrigger value="stake" className="flex items-center gap-1.5">
              <Award size={16} />
              <span>Stake</span>
            </TabsTrigger>
          </TabsList>

          {/* Portal Content (Default Tab) */}
          <TabsContent value="portal" className="space-y-10">
            {/* Hero Section */}
            <section className="mb-10">
              <div className="bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10 rounded-xl p-6 md:p-10">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Trusted Reviews Backed by Blockchain</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  Verify the authenticity of reviews with blockchain-based signatures. No more fake reviews.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    onClick={() => setActiveTab("write-review")}
                    size="lg" 
                    className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600"
                  >
                    <Edit className="mr-2" size={18} />
                    Write a Review
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("categories")}
                    variant="outline" 
                    size="lg" 
                    className="border-trustpurple-500 text-trustpurple-400 hover:bg-trustpurple-500/10"
                  >
                    <Search className="mr-2" size={18} />
                    Explore Companies
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Search Section */}
            <section className="mb-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input 
                  placeholder="Search for a company or category..." 
                  className="pl-10 h-12 text-lg" 
                />
              </div>
            </section>
            
            {/* Categories Section */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4">Main Categories</h3>
              <p className="text-muted-foreground mb-6">Browse reviews by category to find what you're looking for</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>
            
            {/* Top Companies Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Top Rated Companies</h3>
                <Button variant="link" className="text-trustpurple-400">
                  View All
                </Button>
              </div>
              <p className="text-muted-foreground mb-6">Companies with the highest review scores and verification</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topCompanies.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
            
            {/* Recent Reviews Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Recent Reviews</h3>
                <Button variant="link" className="text-trustpurple-400">
                  View All Reviews
                </Button>
              </div>
              <p className="text-muted-foreground mb-6">Latest blockchain-verified reviews from our community</p>
              <div className="space-y-6">
                {recentReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Write Review Tab */}
          <TabsContent value="write-review">
            <WriteReviewForm isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoriesView categories={categories} />
          </TabsContent>

          {/* For Businesses Tab */}
          <TabsContent value="businesses">
            <BusinessesView />
          </TabsContent>

          {/* Stake Rewards Tab */}
          <TabsContent value="stake">
            <StakeRewardsView isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

// Write Review Form Component
const WriteReviewForm = ({ isWalletConnected, connectWallet }: { isWalletConnected: boolean, connectWallet: () => void }) => {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to submit a review.",
        variant: "destructive",
      });
      return;
    }
    
    if (!companyName || !rating || !reviewTitle || !reviewContent || !category) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate blockchain interaction
    setTimeout(() => {
      toast({
        title: "Review Submitted",
        description: "Your review has been signed and submitted to the blockchain.",
      });
      
      // Reset form
      setCompanyName("");
      setRating(0);
      setReviewTitle("");
      setReviewContent("");
      setCategory("");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Write a Verified Review</h2>
      <p className="text-muted-foreground mb-6">Your review will be signed with your wallet and stored on the blockchain</p>
      
      {!isWalletConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection Required</CardTitle>
            <CardDescription>
              Connect your wallet to sign and submit your review to the blockchain.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
              <Wallet className="mr-2" size={18} />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                id="company"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFT Marketplaces</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="dao">DAOs</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Review Title</label>
              <Input
                id="title"
                placeholder="Summarize your experience"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">Review Content</label>
              <Textarea
                id="content"
                placeholder="Share your experience in detail"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing with wallet..." : "Submit Verified Review"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Your review will be signed with your wallet address and permanently stored on the blockchain
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// Categories View Component
const CategoriesView = ({ categories }: { categories: any[] }) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">All Categories</h2>
      <p className="text-muted-foreground mb-6">Browse reviews by category to find what you're looking for</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <div className="text-3xl">{category.icon}</div>
              </div>
              <CardDescription>{category.count} companies</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse {category.name}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// For Businesses View Component
const BusinessesView = () => {
  const { toast } = useToast();
  
  const handleContact = () => {
    toast({
      title: "Request Submitted",
      description: "Thank you for your interest. Our team will contact you soon.",
    });
  };
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">For Businesses</h2>
      <p className="text-muted-foreground mb-8">Leverage blockchain-verified reviews to build trust with your customers</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Award className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Build Credibility</CardTitle>
            <CardDescription>Showcase verified reviews to build trust with potential customers</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <MessageSquare className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Gather Feedback</CardTitle>
            <CardDescription>Collect authentic feedback from real users with wallet verification</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Globe className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Web3 Presence</CardTitle>
            <CardDescription>Strengthen your presence in the Web3 ecosystem with transparent reviews</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10">
        <CardHeader>
          <CardTitle className="text-2xl">Claim Your Business Profile</CardTitle>
          <CardDescription className="text-lg">Take control of your company's reviews and build trust with the Web3 community</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="business-name" className="block text-sm font-medium mb-2">Business Name</label>
              <Input id="business-name" placeholder="Enter your business name" />
            </div>
            <div>
              <label htmlFor="business-category" className="block text-sm font-medium mb-2">Business Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFT Marketplaces</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Contact Name</label>
              <Input id="contact-name" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleContact} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full">
                Request Business Verification
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Stake Rewards View Component
const StakeRewardsView = ({ isWalletConnected, connectWallet }: { isWalletConnected: boolean, connectWallet: () => void }) => {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  
  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to stake $NOCAP tokens.",
        variant: "destructive",
      });
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      });
      return;
    }
    
    setIsStaking(true);
    
    // Simulate staking process
    setTimeout(() => {
      toast({
        title: "Staking Successful",
        description: `You have staked ${stakeAmount} $NOCAP tokens.`,
      });
      
      setStakeAmount("");
      setIsStaking(false);
    }, 2000);
  };
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Stake $NOCAP for Rewards</h2>
      <p className="text-muted-foreground mb-8">Earn rewards by staking your $NOCAP tokens and supporting the TrustTrail ecosystem</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Staking Benefits</CardTitle>
              <CardDescription>Earn rewards and gain privileges by staking $NOCAP tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <Award className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Earn APY</h4>
                    <p className="text-sm text-muted-foreground">Earn up to 15% APY on your staked $NOCAP tokens</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <Star className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Review Boost</h4>
                    <p className="text-sm text-muted-foreground">Your reviews gain more visibility and weight in the ecosystem</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <MessageSquare className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Priority Support</h4>
                    <p className="text-sm text-muted-foreground">Get priority support and access to exclusive features</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <Building className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Governance Rights</h4>
                    <p className="text-sm text-muted-foreground">Participate in ecosystem governance decisions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10 p-4 rounded-lg">
                <h4 className="font-semibold flex items-center">
                  <Star className="mr-2 text-trustpurple-500" size={20} />
                  Current Staking Stats
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Staked</p>
                    <p className="font-semibold text-lg">4,253,689 $NOCAP</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current APY</p>
                    <p className="font-semibold text-lg text-green-500">15.2%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stakers</p>
                    <p className="font-semibold text-lg">1,837</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Stake $NOCAP</CardTitle>
              <CardDescription>Stake your tokens to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {!isWalletConnected ? (
                <div className="text-center py-6">
                  <p className="mb-4 text-muted-foreground">Connect your wallet to start staking</p>
                  <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                    <Wallet className="mr-2" size={18} />
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleStake} className="space-y-6">
                  <div>
                    <label htmlFor="stake-amount" className="block text-sm font-medium mb-2">Amount to Stake</label>
                    <div className="relative">
                      <Input
                        id="stake-amount"
                        type="number"
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="pr-16"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-sm text-muted-foreground">$NOCAP</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Balance:</span>
                    <span>1,000 $NOCAP</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Staking Period</span>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-6">
                    <span>Estimated APY</span>
                    <span className="text-green-500 font-medium">15.2%</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
                    disabled={isStaking}
                  >
                    {isStaking ? "Staking..." : "Stake Tokens"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewPortal;
