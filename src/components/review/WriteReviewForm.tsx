import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import StarRating from './StarRating';
import FileUpload from './FileUpload';
import CompanySelector from './CompanySelector';
import CategorySelector from './CategorySelector';
import WalletConnectCard from './WalletConnectCard';
import { sampleCompanies, categories, Company } from '@/data/companyData';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

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
  const [filteredCompanies, setFilteredCompanies] = useState(sampleCompanies);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  console.log("WriteReviewForm render - companyName:", companyName);
  console.log("WriteReviewForm render - filteredCompanies:", filteredCompanies.length);

  const handleCompanySelect = (company: Company) => {
    console.log("handleCompanySelect called with:", company);
    setCompanyName(company.name);
    
    // Auto-set the category based on the company selection
    const categoryId = categories.find(
      cat => company.category.includes(cat.name) || cat.name.includes(company.category)
    )?.id || "";
    
    if (categoryId) {
      setCategory(categoryId);
    }
    
    setOpenCompanySelect(false);
  };

  const handleCompanySearch = (value: string) => {
    console.log("Company search value:", value);
    
    // Filter companies based on input
    if (value.trim()) {
      const filtered = sampleCompanies.filter(company => 
        company.name.toLowerCase().includes(value.toLowerCase()) ||
        company.category.toLowerCase().includes(value.toLowerCase())
      );
      console.log("Filtered companies:", filtered);
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(sampleCompanies);
    }
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
        setFilteredCompanies(sampleCompanies);
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
        <WalletConnectCard 
          isMetaMaskAvailable={isMetaMaskAvailable}
          connectWallet={connectWallet}
          connectWithWalletConnect={connectWithWalletConnect}
        />
      ) : (
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="space-y-4">
            <CompanySelector
              companyName={companyName}
              setCompanyName={setCompanyName}
              setCategory={setCategory}
              openCompanySelect={openCompanySelect}
              setOpenCompanySelect={setOpenCompanySelect}
              filteredCompanies={filteredCompanies}
              handleCompanySearch={handleCompanySearch}
              handleCompanySelect={handleCompanySelect}
            />
            
            <CategorySelector
              category={category}
              setCategory={setCategory}
              categories={categories}
            />
            
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <StarRating rating={rating} setRating={setRating} />
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
            
            <FileUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              fileError={fileError}
              setFileError={setFileError}
            />
            
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
