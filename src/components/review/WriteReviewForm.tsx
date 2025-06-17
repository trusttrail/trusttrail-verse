
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Shield, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StarRating from "./StarRating";
import CategorySelector from "./Category Selector";
import CompanySelector from "./CompanySelector";
import FileUpload from "./FileUpload";
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useToast } from '@/hooks/use-toast';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: Array<{ id: string; name: string; icon: string }>;
}

const WriteReviewForm = ({ isWalletConnected, connectWallet, categories }: WriteReviewFormProps) => {
  const { isAuthenticated } = useAuth();
  const { needsSignup, existingUser, walletAddress } = useWalletConnection();
  const { isVerified: gitcoinVerified, passportScore, verifyPassport } = useGitcoinPassport();
  const { toast } = useToast();
  
  const {
    formData,
    files,
    setFiles,
    fileError,
    setFileError,
    openCompanySelect,
    setOpenCompanySelect,
    filteredCompanies,
    handleInputChange,
    handleRatingChange,
    handleCategoryChange,
    handleCompanyChange,
    handleCompanySearch,
    handleCompanySelect,
    resetForm,
  } = useReviewForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyGitcoin = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    const success = await verifyPassport(walletAddress);
    
    if (success) {
      toast({
        title: "Verification Started",
        description: "Complete verification in the opened window.",
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "Failed to start verification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      resetForm();
      
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
  const isFormValid = formData.companyName && formData.category && formData.title && 
                     formData.review && formData.rating > 0 && 
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
                {gitcoinVerified && passportScore > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Score: {passportScore}
                  </Badge>
                )}
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

          {!isWalletConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Connect your wallet to start writing your review.
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
                  companyName={formData.companyName}
                  setCompanyName={handleCompanyChange}
                  setCategory={handleCategoryChange}
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
                  setCategory={handleCategoryChange}
                  categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Summarize your experience in a few words"
                value={formData.title}
                onChange={handleInputChange}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating *</Label>
              <StarRating
                rating={formData.rating}
                setRating={handleRatingChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Review Content *</Label>
              <Textarea
                id="review"
                name="review"
                placeholder="Share your detailed experience, what went well, what could be improved..."
                value={formData.review}
                onChange={handleInputChange}
                className="min-h-[120px] text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label>Supporting Documents (Optional)</Label>
              <FileUpload
                selectedFiles={files}
                setSelectedFiles={setFiles}
                fileError={fileError}
                setFileError={setFileError}
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
