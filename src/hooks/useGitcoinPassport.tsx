
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  const { toast } = useToast();
  const [passportData, setPassportData] = useState<GitcoinPassportData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [passportScore, setPassportScore] = useState(0);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load passport data from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedData = loadPassportDataFromStorage(user.id);
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
  }, [isAuthenticated, user, toast]);

  // Clear passport data when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setPassportData(null);
      setIsVerified(false);
      setPassportScore(0);
      setNeedsRefresh(false);
    }
  }, [isAuthenticated]);

  const savePassportData = (address: string, score: number): GitcoinPassportData => {
    if (!user) throw new Error('User not authenticated');

    const data = savePassportDataToStorage(user.id, address, score);
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
    if (user) {
      clearPassportDataFromStorage(user.id);
    }
    setPassportData(null);
    setIsVerified(false);
    setPassportScore(0);
    setNeedsRefresh(false);
  };

  const verifyPassport = async (walletAddress: string): Promise<boolean> => {
    setIsVerifying(true);
    
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
          description: "Complete your verification in the new window. The page will automatically detect your score when ready.",
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
