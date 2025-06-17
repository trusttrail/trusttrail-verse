
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface GitcoinPassportData {
  address: string;
  score: number;
  verified: boolean;
  timestamp: number;
}

export const useGitcoinPassport = () => {
  const { user, isAuthenticated } = useAuth();
  const [passportData, setPassportData] = useState<GitcoinPassportData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [passportScore, setPassportScore] = useState(0);

  // Load passport data from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedData = localStorage.getItem(`gitcoin_passport_${user.id}`);
      if (storedData) {
        try {
          const parsed: GitcoinPassportData = JSON.parse(storedData);
          // Check if data is less than 24 hours old
          const isDataFresh = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
          if (isDataFresh) {
            setPassportData(parsed);
            setIsVerified(parsed.verified);
            setPassportScore(parsed.score);
          } else {
            // Clear stale data
            localStorage.removeItem(`gitcoin_passport_${user.id}`);
          }
        } catch (error) {
          console.error('Failed to parse stored passport data:', error);
          localStorage.removeItem(`gitcoin_passport_${user.id}`);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Clear passport data when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setPassportData(null);
      setIsVerified(false);
      setPassportScore(0);
    }
  }, [isAuthenticated]);

  const savePassportData = (address: string, score: number) => {
    if (!user) return;

    const data: GitcoinPassportData = {
      address,
      score,
      verified: true,
      timestamp: Date.now()
    };

    localStorage.setItem(`gitcoin_passport_${user.id}`, JSON.stringify(data));
    setPassportData(data);
    setIsVerified(true);
    setPassportScore(score);
  };

  const clearPassportData = () => {
    if (user) {
      localStorage.removeItem(`gitcoin_passport_${user.id}`);
    }
    setPassportData(null);
    setIsVerified(false);
    setPassportScore(0);
  };

  const verifyPassport = async (walletAddress: string) => {
    try {
      // Open Gitcoin Passport in new window
      const passportWindow = window.open('https://app.passport.xyz/#/', '_blank');
      
      // Simulate score capture after verification
      // In production, this would listen for postMessage or use Gitcoin's API
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
    verifyPassport,
    clearPassportData,
    savePassportData
  };
};
