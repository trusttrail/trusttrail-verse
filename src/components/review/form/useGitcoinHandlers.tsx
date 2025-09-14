
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
    console.log('🔐 ================= GITCOIN VERIFICATION STARTED ===============');
    console.log('🔐 Wallet address:', walletAddress);
    console.log('🔐 MetaMask available:', !!window.ethereum);
    console.log('🔐 Current URL:', window.location.href);
    
    if (!walletAddress) {
      console.error('❌ GITCOIN VERIFICATION FAILED - NO WALLET');
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    console.log('🔐 Starting verification process...');
    
    try {
      console.log('🔐 Calling verifyPassport...');
      const success = await verifyPassport(walletAddress);
      console.log('🔐 Verification result:', success);
      
      if (success) {
        console.log('✅ Gitcoin verification successful');
        setGitcoinVerified(true);
      } else {
        console.log('❌ Gitcoin verification failed');
      }
    } catch (error) {
      console.error('❌ =============== GITCOIN VERIFICATION ERROR ================');
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error details:', error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('❌ =========================================================');
    } finally {
      console.log('🔄 GITCOIN VERIFICATION CLEANUP');
      setIsVerifying(false);
    }
  };

  const handleCheckVerification = async () => {
    console.log('🔄 =============== GITCOIN REFRESH STARTED ================');
    console.log('🔄 Wallet address:', walletAddress);
    console.log('🔄 Current timestamp:', new Date().toISOString());
    
    if (!walletAddress) {
      console.error('❌ GITCOIN REFRESH FAILED - NO WALLET');
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    console.log('🔄 Starting refresh process...');
    
    try {
      console.log('🔄 Calling refreshPassportScore...');
      const success = await refreshPassportScore(walletAddress);
      console.log('🔄 Refresh result:', success);
      
      if (success) {
        console.log('✅ Gitcoin refresh successful');
        setGitcoinVerified(true);
      } else {
        console.log('❌ Gitcoin refresh failed');
      }
    } catch (error) {
      console.error('❌ ================ GITCOIN REFRESH ERROR =================');
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error details:', error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('❌ =========================================================');
    } finally {
      console.log('🔄 GITCOIN REFRESH CLEANUP');
      setIsVerifying(false);
    }
  };

  return {
    handleVerifyGitcoin,
    handleCheckVerification,
    isVerifying,
  };
};
