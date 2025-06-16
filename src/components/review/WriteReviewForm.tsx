
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Shield, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StarRating from "./StarRating";
import CategorySelector from "./CategorySelector";
import CompanySelector from "./CompanySelector";
import FileUpload from "./FileUpload";
import WalletConnect from "./WalletConnect";
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from '@/hooks/use-toast';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: Array<{ id: string; name: string; icon: string }>;
}

const WriteReviewForm = ({ isWalletConnected, connectWallet, categories }: WriteReviewFormProps) => {
  const { isAuthenticated } = useAuth();
  const { needsSignup, existingUser } = useWalletConnection();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company: '',
    category: '',
    title: '',
    content: '',
    rating: 0,
    proofFiles: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gitcoinVerified, setGitcoinVerified] = useState(false);

  // Mock companies for CompanySelector
  const mockCompanies = [
    { id: 1, name: "QuickSwap", category: "DeFi" },
    { id: 2, name: "OpenSea", category: "NFT" },
    { id: 3, name: "Uniswap", category: "DeFi" },
    { id: 4, name: "Axie Infinity", category: "Gaming" },
    { id: 5, name: "Binance", category: "Exchange" },
  ];

  const [filteredCompanies, setFilteredCompanies] = useState(mockCompanies);
  const [openCompanySelect, setOpenCompanySelect] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanySearch = (value: string) => {
    const filtered = mockCompanies.filter(company =>
      company.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const handleCompanySelect = (company: { id: number; name: string; category: string }) => {
    setFormData(prev => ({ 
      ...prev, 
      company: company.name,
      category: company.category 
    }));
  };

  const handleVerifyGitcoin = async () => {
    try {
      // Redirect to Gitcoin Passport
      window.open('https://app.passport.xyz/#/', '_blank');
      
      // For demo purposes, simulate verification after a delay
      setTimeout(() => {
        setGitcoinVerified(true);
        toast({
          title: "Gitcoin Passport Verified",
          description: "Your identity has been verified with Gitcoin Passport.",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify with Gitcoin Passport. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!gitcoinVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your identity with Gitcoin Passport first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulate review submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Review Submitted Successfully",
        description: "Your review has been submitted and you've earned $NOCAP tokens!",
      });

      // Reset form
      setFormData({
        company: '',
        category: '',
        title: '',
        content: '',
        rating: 0,
        proofFiles: [],
      });
      setGitcoinVerified(false);
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine authentication status display based on wallet connection state
  const getAuthStatus = () => {
    if (isAuthenticated) {
      return { text: "Wallet Connected", color: "text-emerald-600", icon: true };
    }
    
    if (isWalletConnected) {
      if (existingUser) {
        return { text: "Wallet Connected", color: "text-emerald-600", icon: true };
      }
      if (needsSignup) {
        return { text: "Sign Up Required", color: "text-orange-600", icon: false };
      }
    }
    
    return { text: "Connect Wallet Required", color: "text-gray-600", icon: false };
  };

  const authStatus = getAuthStatus();
  
  // For form validation, consider existing users as authenticated since they're auto-signing in
  const isEffectivelyAuthenticated = isAuthenticated || (isWalletConnected && existingUser);
  const isFormValid = formData.company && formData.category && formData.title && 
                     formData.content && formData.rating > 0 && 
                     isEffectivelyAuthenticated && isWalletConnected && gitcoinVerified;

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Write a Review</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Share your experience with the community. Your review will be verified on-chain and you'll earn $NOCAP tokens for contributing to the ecosystem.
        </p>
      </div>

      {/* Prerequisites Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="text-trustpurple-500" size={20} />
            Review Prerequisites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Wallet Connection</span>
                {authStatus.icon && <CheckCircle className="text-emerald-500" size={16} />}
              </div>
              {!isWalletConnected && (
                <Button size="sm" variant="outline" onClick={connectWallet}>
                  Connect Wallet
                </Button>
              )}
              {isWalletConnected && (
                <span className="text-sm text-emerald-600">Connected</span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Gitcoin Passport</span>
                {gitcoinVerified && <CheckCircle className="text-emerald-500" size={16} />}
              </div>
              <Button 
                size="sm" 
                variant={gitcoinVerified ? "outline" : "default"}
                onClick={handleVerifyGitcoin}
                disabled={!isWalletConnected}
              >
                {gitcoinVerified ? "Verified" : "Verify Identity"}
              </Button>
            </div>
          </div>

          {(!isEffectivelyAuthenticated || !isWalletConnected) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!isWalletConnected 
                  ? "Please connect your wallet to start writing your review."
                  : !isEffectivelyAuthenticated && needsSignup
                    ? "Please create an account to link your wallet and start writing reviews."
                    : "Please connect your wallet to write your review."
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company/Project *</Label>
                <CompanySelector
                  companyName={formData.company}
                  setCompanyName={(name) => handleInputChange('company', name)}
                  setCategory={(category) => handleInputChange('category', category)}
                  openCompanySelect={openCompanySelect}
                  setOpenCompanySelect={setOpenCompanySelect}
                  filteredCompanies={filteredCompanies}
                  handleCompanySearch={handleCompanySearch}
                  handleCompanySelect={handleCompanySelect}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <CategorySelector
                  category={formData.category}
                  setCategory={(category) => handleInputChange('category', category)}
                  categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                placeholder="Summarize your experience in a few words"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating *</Label>
              <StarRating
                rating={formData.rating}
                setRating={(rating) => handleInputChange('rating', rating)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Review Content *</Label>
              <Textarea
                id="content"
                placeholder="Share your detailed experience, what went well, what could be improved..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="min-h-[120px] text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label>Supporting Documents (Optional)</Label>
              <FileUpload
                selectedFiles={formData.proofFiles}
                setSelectedFiles={(files) => handleInputChange('proofFiles', files)}
                fileError={null}
                setFileError={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isSubmitting}
            className="w-full sm:w-auto min-w-48"
          >
            {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
          </Button>
          {!isFormValid && (
            <p className="text-sm text-muted-foreground text-center">
              Complete all requirements above to submit your review
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default WriteReviewForm;
