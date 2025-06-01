
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Star, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StarRating from "./StarRating";
import CategorySelector from "./CategorySelector";
import CompanySelector from "./CompanySelector";
import FileUpload from "./FileUpload";
import WalletConnectCard from "./WalletConnectCard";
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAuth } from '@/hooks/useAuth';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const WriteReviewForm = ({ isWalletConnected, connectWallet }: WriteReviewFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    isWalletConnected: walletConnected,
    walletAddress,
    connectWallet: walletConnect,
    connectWithWalletConnect,
    isMetaMaskAvailable
  } = useWalletConnection();

  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    rating: 0,
    title: '',
    review: '',
    pros: '',
    cons: '',
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  const handleCompanyChange = (company: string) => {
    setFormData(prev => ({
      ...prev,
      companyName: company
    }));
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.companyName || !formData.category || !formData.rating || !formData.title || !formData.review) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would submit the review to your backend
    console.log('Submitting review:', { ...formData, files, walletAddress, userId: user.id });
    
    toast({
      title: "Review Submitted!",
      description: "Thank you for your review. It will be verified and published soon.",
    });

    // Reset form
    setFormData({
      companyName: '',
      category: '',
      rating: 0,
      title: '',
      review: '',
      pros: '',
      cons: '',
    });
    setFiles([]);
  };

  // Show wallet connection card if wallet is not connected or user is not authenticated
  if (!walletConnected || !user) {
    return (
      <WalletConnectCard 
        isMetaMaskAvailable={isMetaMaskAvailable}
        connectWallet={walletConnect}
        connectWithWalletConnect={connectWithWalletConnect}
        isWalletConnected={walletConnected}
        walletAddress={walletAddress}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit size={20} />
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your experience and help others make informed decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company">Company/Project *</Label>
            <CompanySelector
              value={formData.companyName}
              onChange={handleCompanyChange}
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <CategorySelector
              value={formData.category}
              onChange={handleCategoryChange}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="lg"
            />
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Summarize your experience in one line"
              required
            />
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="review">Your Review *</Label>
            <Textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              placeholder="Share your detailed experience..."
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label htmlFor="pros">What did you like? (Optional)</Label>
            <Textarea
              id="pros"
              name="pros"
              value={formData.pros}
              onChange={handleInputChange}
              placeholder="List the positive aspects..."
              className="min-h-[80px]"
            />
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label htmlFor="cons">What could be improved? (Optional)</Label>
            <Textarea
              id="cons"
              name="cons"
              value={formData.cons}
              onChange={handleInputChange}
              placeholder="List areas for improvement..."
              className="min-h-[80px]"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Supporting Documents (Optional)</Label>
            <FileUpload onFileUpload={handleFileUpload} />
            {files.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600"
          >
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WriteReviewForm;
