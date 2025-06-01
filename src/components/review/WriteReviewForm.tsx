
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WalletConnectCard from "./WalletConnectCard";
import ReviewFormFields from "./ReviewFormFields";
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAuth } from '@/hooks/useAuth';
import { useReviewForm } from '@/hooks/useReviewForm';
import { validateReviewForm } from '@/utils/formValidation';
import { submitReview } from '@/utils/formSubmission';

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

  const {
    formData,
    files,
    setFiles,
    fileError,
    setFileError,
    openCompanySelect,
    setOpenCompanySelect,
    mockCategories,
    filteredCompanies,
    handleInputChange,
    handleRatingChange,
    handleCategoryChange,
    handleCompanyChange,
    handleCompanySearch,
    handleCompanySelect,
    resetForm,
  } = useReviewForm();

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

    const validationError = validateReviewForm(formData);
    if (validationError) {
      toast({
        title: "Missing Information",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      await submitReview(formData, files, walletAddress, user.id);
      
      toast({
        title: "Review Submitted!",
        description: "Thank you for your review. It will be verified and published soon.",
      });

      resetForm();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    }
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
          <ReviewFormFields
            formData={formData}
            files={files}
            setFiles={setFiles}
            fileError={fileError}
            setFileError={setFileError}
            openCompanySelect={openCompanySelect}
            setOpenCompanySelect={setOpenCompanySelect}
            mockCategories={mockCategories}
            filteredCompanies={filteredCompanies}
            handleInputChange={handleInputChange}
            handleRatingChange={handleRatingChange}
            handleCategoryChange={handleCategoryChange}
            handleCompanyChange={handleCompanyChange}
            handleCompanySearch={handleCompanySearch}
            handleCompanySelect={handleCompanySelect}
          />

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
