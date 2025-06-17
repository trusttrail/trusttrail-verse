
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';

interface UseGitcoinHandlersProps {
  walletAddress: string | null;
  setGitcoinVerified: (verified: boolean) => void;
}

export const useGitcoinHandlers = ({
  walletAddress,
  setGitcoinVerified,
}: UseGitcoinHandlersProps) => {
  const { toast } = useToast();
  const { verifyPassport, refreshPassportScore } = useGitcoinPassport();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyGitcoin = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const success = await verifyPassport(walletAddress);
      if (success) {
        setGitcoinVerified(true);
      }
    } catch (error) {
      console.error('Gitcoin verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const success = await refreshPassportScore(walletAddress);
      if (success) {
        setGitcoinVerified(true);
      }
    } catch (error) {
      console.error('Gitcoin refresh error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    handleVerifyGitcoin,
    handleCheckVerification,
    isVerifying,
  };
};
