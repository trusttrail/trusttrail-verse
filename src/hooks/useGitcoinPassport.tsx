
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface GitcoinPassportData {
  address: string;
  score: number;
  verified: boolean;
  timestamp: number;
  lastRefresh: number;
}

export const useGitcoinPassport = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [passportData, setPassportData] = useState<GitcoinPassportData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [passportScore, setPassportScore] = useState(0);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Check if passport data is stale (older than 7 days)
  const checkIfDataIsStale = (data: GitcoinPassportData): boolean => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return data.lastRefresh < sevenDaysAgo;
  };

  // Load passport data from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedData = localStorage.getItem(`gitcoin_passport_${user.id}`);
      if (storedData) {
        try {
          const parsed: GitcoinPassportData = JSON.parse(storedData);
          
          // Check if data is stale
          if (checkIfDataIsStale(parsed)) {
            setNeedsRefresh(true);
            toast({
              title: "Gitcoin Passport Update Available",
              description: "Your Gitcoin Passport score may be outdated. Please refresh for accurate scoring.",
              variant: "default",
            });
          }
          
          setPassportData(parsed);
          setIsVerified(parsed.verified);
          setPassportScore(parsed.score);
        } catch (error) {
          console.error('Failed to parse stored passport data:', error);
          localStorage.removeItem(`gitcoin_passport_${user.id}`);
        }
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

  const savePassportData = (address: string, score: number) => {
    if (!user) return;

    const data: GitcoinPassportData = {
      address,
      score,
      verified: true,
      timestamp: Date.now(),
      lastRefresh: Date.now()
    };

    localStorage.setItem(`gitcoin_passport_${user.id}`, JSON.stringify(data));
    setPassportData(data);
    setIsVerified(true);
    setPassportScore(score);
    setNeedsRefresh(false);
  };

  const refreshPassportScore = async (walletAddress: string) => {
    try {
      // Simulate fetching updated score from Gitcoin
      const simulatedScore = Math.floor(Math.random() * 50) + 50; // Score between 50-100
      savePassportData(walletAddress, simulatedScore);
      
      toast({
        title: "Passport Score Refreshed",
        description: `Updated score: ${simulatedScore}. This will apply to all future reviews.`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to refresh Gitcoin Passport score:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh Gitcoin Passport score. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearPassportData = () => {
    if (user) {
      localStorage.removeItem(`gitcoin_passport_${user.id}`);
    }
    setPassportData(null);
    setIsVerified(false);
    setPassportScore(0);
    setNeedsRefresh(false);
  };

  const verifyPassport = async (walletAddress: string) => {
    try {
      // Open Gitcoin Passport in new window
      const passportWindow = window.open('https://app.passport.xyz/#/', '_blank');
      
      // Simulate score capture after verification
      setTimeout(() => {
        const simulatedScore = Math.floor(Math.random() * 50) + 50; // Score between 50-100
        savePassportData(walletAddress, simulatedScore);
        
        // Close the passport window if still open
        if (passportWindow && !passportWindow.closed) {
          passportWindow.close();
        }
      }, 5000);

      return true;
    } catch (error) {
      console.error('Failed to verify Gitcoin Passport:', error);
      return false;
    }
  };

  return {
    passportData,
    isVerified,
    passportScore,
    needsRefresh,
    verifyPassport,
    refreshPassportScore,
    clearPassportData,
    savePassportData
  };
};
