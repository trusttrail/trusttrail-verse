import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Shield, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StarRating from "./StarRating";
import CategorySelector from "./CategorySelector";
import CompanySelector from "./CompanySelector";
import FileUpload from "./FileUpload";
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Transaction } from '@/hooks/useWeb3Transaction';
import { useTrustScore } from '@/hooks/useTrustScore';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: Array<{ id: string; name: string; icon?: string }>;
}

const WriteReviewForm = ({ isWalletConnected, connectWallet, categories }: WriteReviewFormProps) => {
  const { isAuthenticated } = useAuth();
  const { needsSignup, existingUser, walletAddress } = useWalletConnection();
  const { 
    isVerified: gitcoinVerified, 
    passportScore, 
    needsRefresh,
    isVerifying,
    verifyPassport, 
    refreshPassportScore 
  } = useGitcoinPassport();
  const { toast } = useToast();
  const { submitReviewTransaction, isTransacting } = useWeb3Transaction();
  const { trustScoreData, updateTrustScore } = useTrustScore();
  
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

    await verifyPassport(walletAddress);
  };

  const handleRefreshGitcoin = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    await refreshPassportScore(walletAddress);
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
      
      // Submit transaction to blockchain
      const txHash = await submitReviewTransaction(formData);
      
      if (txHash) {
        // Update trust score for successful review submission
        updateTrustScore('quality', 1);
        
        toast({
          title: "Review Submitted Successfully! 🎉",
          description: "Your review has been submitted to the blockchain and you've earned $NOCAP tokens!",
        });

        // Reset form
        resetForm();
      }
      
    } catch (error) {
      console.error('Review submission error:', error);
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
        {trustScoreData && (
          <div className="mt-4 flex justify-center">
            <Badge variant="secondary" className="px-3 py-1">
              Trust Score: {trustScoreData.score} ({trustScoreData.level})
            </Badge>
          </div>
        )}
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
                {isVerifying && <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />}
                {gitcoinVerified && !isVerifying && <CheckCircle className="text-emerald-500" size={16} />}
                {gitcoinVerified && passportScore > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Score: {passportScore}
                  </Badge>
                )}
                {needsRefresh && (
                  <Badge variant="outline" className="ml-2 text-xs text-orange-600">
                    Needs Refresh
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {needsRefresh && gitcoinVerified && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleRefreshGitcoin}
                    disabled={!isWalletConnected || isVerifying}
                  >
                    <RefreshCw size={14} className={isVerifying ? 'animate-spin' : ''} />
                    {isVerifying ? 'Refreshing...' : 'Refresh'}
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant={gitcoinVerified ? "outline" : "default"}
                  onClick={handleVerifyGitcoin}
                  disabled={!isWalletConnected || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                      Verifying...
                    </>
                  ) : gitcoinVerified ? (
                    "Verified"
                  ) : (
                    "Verify Identity"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Verification Status Alerts */}
          {isVerifying && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <strong>Verification in progress:</strong> Complete your verification in the Gitcoin Passport window. 
                We'll automatically detect your score when ready. This may take a few minutes.
              </AlertDescription>
            </Alert>
          )}

          {needsRefresh && gitcoinVerified && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Score Update Available:</strong> Your Gitcoin Passport score may be outdated. 
                Please refresh to ensure accurate scoring for your reviews.
              </AlertDescription>
            </Alert>
          )}

          {!isWalletConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Connect your wallet to start writing your review.
              </AlertDescription>
            </Alert>
          )}

          {isWalletConnected && !gitcoinVerified && !isVerifying && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Gitcoin Passport Required:</strong> Complete identity verification to submit reviews and earn rewards. 
                Click "Verify Identity" to open Gitcoin Passport, connect your wallet, and complete the verification process.
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
              <Label>Supporting Documents (Required for Blockchain Submission)</Label>
              <FileUpload
                selectedFiles={files}
                setSelectedFiles={setFiles}
                fileError={fileError}
                setFileError={setFileError}
              />
              <p className="text-xs text-muted-foreground">
                Upload proof documents to support your review. This will be stored on IPFS and linked to your blockchain transaction.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isSubmitting || isTransacting || isVerifying}
            className="w-full sm:w-auto min-w-48"
          >
            {isSubmitting || isTransacting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {isTransacting ? 'Confirming Transaction...' : 'Submitting Review...'}
              </>
            ) : (
              'Submit Review to Blockchain'
            )}
          </Button>
          
          {!isFormValid && (
            <p className="text-sm text-muted-foreground text-center">
              Complete all requirements above to submit your review
            </p>
          )}
          
          {isFormValid && files.length === 0 && (
            <p className="text-sm text-orange-600 text-center">
              Please upload at least one proof document for blockchain submission
            </p>
          )}
        </div>
        
        {isTransacting && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please confirm the transaction in your MetaMask wallet. A small POL fee will be required for the Polygon Amoy network.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
};

export default WriteReviewForm;
