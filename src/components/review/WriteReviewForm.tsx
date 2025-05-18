
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, PlugZap, Upload, Search } from "lucide-react";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

// Sample companies data for demonstration
const sampleCompanies = [
  { id: 1, name: "QuickSwap", category: "DeFi - Web3" },
  { id: 2, name: "OpenSea", category: "NFT - Web3" },
  { id: 3, name: "Axie Infinity", category: "Gaming - Web3" },
  { id: 4, name: "Uniswap", category: "DeFi - Web3" },
  { id: 5, name: "Twitter", category: "Social Media - Web2" },
  { id: 6, name: "Google", category: "Search - Web2" },
  { id: 7, name: "Airbnb", category: "Hospitality - Web2" },
  { id: 8, name: "Amazon", category: "E-commerce - Web2" },
  { id: 9, name: "Netflix", category: "Entertainment - Web2" },
  { id: 10, name: "Uber", category: "Transport - Web2" },
];

// Extended categories including both Web2 and Web3
const extendedCategories = [
  { id: "defi", name: "DeFi - Web3" },
  { id: "nft", name: "NFT Marketplaces - Web3" },
  { id: "gaming", name: "Gaming - Web3" },
  { id: "dao", name: "DAOs - Web3" },
  { id: "infrastructure", name: "Infrastructure - Web3" },
  { id: "social", name: "Social - Web3" },
  { id: "ecommerce", name: "E-commerce - Web2" },
  { id: "finance", name: "Finance - Web2" },
  { id: "socialmedia", name: "Social Media - Web2" },
  { id: "search", name: "Search - Web2" },
  { id: "entertainment", name: "Entertainment - Web2" },
  { id: "transport", name: "Transport - Web2" },
  { id: "hospitality", name: "Hospitality - Web2" },
  { id: "saas", name: "SaaS - Web2" },
];

const WriteReviewForm = ({ isWalletConnected, connectWallet }: WriteReviewFormProps) => {
  const { toast } = useToast();
  const { isMetaMaskAvailable, connectWithWalletConnect } = useWalletConnection();
  const [companyName, setCompanyName] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCompanySelect, setOpenCompanySelect] = useState(false);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file type
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file format. Please upload PDF, PNG, JPEG, or JPG files only.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleCompanySelect = (company: { id: number; name: string; category: string }) => {
    setCompanyName(company.name);
    
    // Auto-set the category based on the company selection
    const categoryId = extendedCategories.find(
      cat => company.category.includes(cat.name)
    )?.id || "";
    
    if (categoryId) {
      setCategory(categoryId);
    }
    
    setOpenCompanySelect(false);
  };

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
    
    if (!companyName || !rating || !reviewTitle || !reviewContent || !category || !selectedFile) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields and upload proof of purchase.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate blockchain interaction
    setTimeout(() => {
      toast({
        title: "Review Pending Confirmation",
        description: "Waiting for wallet signature...",
      });
      
      // Simulate wallet signature request
      setTimeout(() => {
        toast({
          title: "Review Submitted",
          description: "Your review has been signed and submitted to the blockchain with status: Pending Review.",
        });
        
        // Reset form
        setCompanyName("");
        setRating(0);
        setReviewTitle("");
        setReviewContent("");
        setCategory("");
        setSelectedFile(null);
        setIsSubmitting(false);
        
        // In a real app, this would navigate the user back to the home page
        // navigate('/review-portal');
      }, 2000);
    }, 1500);
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
          <CardContent className="flex flex-col md:flex-row gap-3 justify-center">
            {isMetaMaskAvailable && (
              <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                <Wallet className="mr-2" size={18} />
                Connect with MetaMask
              </Button>
            )}
            <Button onClick={connectWithWalletConnect} variant={isMetaMaskAvailable ? "outline" : "default"} className={isMetaMaskAvailable ? "" : "bg-gradient-to-r from-trustpurple-500 to-trustblue-500"}>
              <PlugZap className="mr-2" size={18} />
              {isMetaMaskAvailable ? "Use WalletConnect" : "Connect Wallet"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">Company Name</label>
              <Popover open={openCompanySelect} onOpenChange={setOpenCompanySelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCompanySelect}
                    className="w-full justify-between"
                  >
                    {companyName ? companyName : "Select company..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search companies..." />
                    <CommandEmpty>No company found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {sampleCompanies.map((company) => (
                        <CommandItem
                          key={company.id}
                          onSelect={() => handleCompanySelect(company)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span>{company.name}</span>
                            <span className="text-xs text-muted-foreground">{company.category}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {extendedCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
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
            
            <div>
              <label htmlFor="proof" className="block text-sm font-medium mb-2">
                Proof of Purchase (Required)
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 hover:border-trustpurple-500 transition-colors">
                <input
                  type="file"
                  id="proof"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="proof" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-trustpurple-400 mb-2" />
                    <span className="font-medium mb-1">
                      {selectedFile ? selectedFile.name : "Click to upload file"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      PDF, PNG, JPG or JPEG (max. 5MB)
                    </span>
                  </div>
                </label>
              </div>
              {fileError && (
                <p className="text-destructive text-sm mt-2">{fileError}</p>
              )}
              {selectedFile && (
                <p className="text-green-600 text-sm mt-2">
                  File uploaded: {selectedFile.name}
                </p>
              )}
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

export default WriteReviewForm;
