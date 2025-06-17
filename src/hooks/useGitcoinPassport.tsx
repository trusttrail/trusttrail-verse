
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from '@/hooks/use-toast';
import { GitcoinPassportData, GitcoinPassportHook } from '@/types/gitcoinPassport';
import { 
  savePassportDataToStorage, 
  loadPassportDataFromStorage, 
  clearPassportDataFromStorage,
  checkIfDataIsStale 
} from '@/utils/gitcoin/gitcoinStorage';
import { fetchGitcoinScore } from '@/utils/gitcoin/gitcoinApi';
import { handlePassportVerification } from '@/utils/gitcoin/gitcoinVerification';

export const useGitcoinPassport = (): GitcoinPassportHook => {
  const { user, isAuthenticated } = useAuth();
  const { walletAddress, isWalletConnected } = useWalletConnection();
  const { toast } = useToast();
  const [passportData, setPassportData] = useState<GitcoinPassportData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [passportScore, setPassportScore] = useState(0);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Create a user identifier that works for both authenticated users and wallet-connected users
  const getUserId = () => {
    if (user?.id) return user.id;
    if (walletAddress) return `wallet_${walletAddress}`;
    return null;
  };

  // Load passport data from localStorage on mount
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      const storedData = loadPassportDataFromStorage(userId);
      if (storedData) {
        // Check if data is stale
        if (checkIfDataIsStale(storedData)) {
          setNeedsRefresh(true);
          toast({
            title: "Gitcoin Passport Update Available",
            description: "Your Gitcoin Passport score may be outdated. Please refresh for accurate scoring.",
            variant: "default",
          });
        }
        
        setPassportData(storedData);
        setIsVerified(storedData.verified);
        setPassportScore(storedData.score);
      }
    }
  }, [isAuthenticated, user, walletAddress, toast]);

  // Clear passport data when user logs out and wallet disconnects
  useEffect(() => {
    if (!isAuthenticated && !isWalletConnected) {
      setPassportData(null);
      setIsVerified(false);
      setPassportScore(0);
      setNeedsRefresh(false);
    }
  }, [isAuthenticated, isWalletConnected]);

  const savePassportData = (address: string, score: number): GitcoinPassportData => {
    const userId = getUserId();
    if (!userId) throw new Error('No user identifier available');

    const data = savePassportDataToStorage(userId, address, score);
    setPassportData(data);
    setIsVerified(true);
    setPassportScore(score);
    setNeedsRefresh(false);
    return data;
  };

  const refreshPassportScore = async (walletAddress: string): Promise<boolean> => {
    try {
      setIsVerifying(true);
      console.log('Refreshing Gitcoin Passport score...');
      
      const score = await fetchGitcoinScore(walletAddress);
      
      if (score !== null) {
        savePassportData(walletAddress, score);
        
        toast({
          title: "Passport Score Refreshed",
          description: `Updated score: ${score}. This will apply to all future reviews.`,
        });
        
        return true;
      } else {
        toast({
          title: "No Passport Found",
          description: "Please create a Gitcoin Passport first by visiting the verification link.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh Gitcoin Passport score:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh Gitcoin Passport score. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const clearPassportData = (): void => {
    const userId = getUserId();
    if (userId) {
      clearPassportDataFromStorage(userId);
    }
    setPassportData(null);
    setIsVerified(false);
    setPassportScore(0);
    setNeedsRefresh(false);
  };

  const verifyPassport = async (walletAddress: string): Promise<boolean> => {
    // Check if we have a valid user identifier (either authenticated user or wallet)
    const userId = getUserId();
    if (!userId) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet or sign in to verify your passport.",
        variant: "destructive",
      });
      return false;
    }

    setIsVerifying(true);
    console.log('Starting passport verification for wallet:', walletAddress, 'userId:', userId);
    
    return handlePassportVerification(
      walletAddress,
      savePassportData,
      (data, message) => {
        toast({
          title: "Gitcoin Passport Found!",
          description: message,
        });
        setIsVerifying(false);
      },
      (message) => {
        toast({
          title: "Verification Failed",
          description: message,
          variant: "destructive",
        });
        setIsVerifying(false);
      },
      () => {
        toast({
          title: "Gitcoin Passport Opened",
          description: "Complete your verification in the new window. Connect the same wallet address and complete your stamps. The page will automatically detect your score when ready.",
        });
      }
    );
  };

  return {
    passportData,
    isVerified,
    passportScore,
    needsRefresh,
    isVerifying,
    verifyPassport,
    refreshPassportScore,
    clearPassportData,
    savePassportData,
    fetchGitcoinScore
  };
};
