
import { fetchGitcoinScore } from './gitcoinApi';
import { pollForPassportScore } from './gitcoinPolling';
import { GitcoinPassportData } from '@/types/gitcoinPassport';

export const openGitcoinPassportWindow = (): Window | null => {
  // Direct users to the scorer page where they can connect wallet and build score
  const passportUrl = `https://passport.gitcoin.co/#/dashboard`;
  const passportWindow = window.open(
    passportUrl, 
    'gitcoin_passport', 
    'width=1200,height=800,scrollbars=yes,resizable=yes,location=yes'
  );
  
  if (!passportWindow) {
    throw new Error('Failed to open passport window - popup may be blocked. Please enable popups for this site and try again.');
  }
  
  return passportWindow;
};

export const handlePassportVerification = async (
  walletAddress: string,
  savePassportData: (address: string, score: number) => GitcoinPassportData,
  onSuccess: (data: GitcoinPassportData, message: string) => void,
  onError: (message: string) => void,
  onOpenWindow: () => void
): Promise<boolean> => {
  try {
    console.log('Starting Gitcoin Passport verification for:', walletAddress);
    
    // First, check if user already has a score
    const existingScore = await fetchGitcoinScore(walletAddress);
    console.log('Existing score check result:', existingScore);
    
    if (existingScore !== null && existingScore > 0) {
      // User already has a positive passport score, just save it
      const data = savePassportData(walletAddress, existingScore);
      onSuccess(data, `Your existing passport score (${existingScore.toFixed(2)}) has been successfully synced to your account.`);
      return true;
    }
    
    // Open Gitcoin Passport in new window for verification or to view current status
    const passportWindow = openGitcoinPassportWindow();
    onOpenWindow();
    
    // Poll for score updates - this will capture any score including 0
    await pollForPassportScore(
      walletAddress,
      passportWindow,
      (data) => {
        const scoreMessage = data.score > 0 
          ? `Your passport score (${data.score.toFixed(2)}) has been successfully synced to your account.`
          : `Your passport has been synced to your account with a score of ${data.score.toFixed(2)}. You can improve your score by adding more stamps in Gitcoin Passport.`;
        onSuccess(data, scoreMessage);
      },
      onError,
      savePassportData
    );
    
    return true;
    
  } catch (error) {
    console.error('Failed to verify Gitcoin Passport:', error);
    let errorMessage = "Failed to start verification process.";
    
    if (error instanceof Error) {
      if (error.message.includes('popup')) {
        errorMessage = "Popup blocked. Please enable popups for this site and try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    onError(errorMessage);
    return false;
  }
};

// New function specifically for refreshing passport score
export const handlePassportRefresh = async (
  walletAddress: string,
  savePassportData: (address: string, score: number) => GitcoinPassportData,
  onSuccess: (data: GitcoinPassportData, message: string) => void,
  onError: (message: string) => void,
  onOpenWindow: () => void
): Promise<boolean> => {
  try {
    console.log('Refreshing Gitcoin Passport score for:', walletAddress);
    
    // Always open the Gitcoin Passport window for refresh
    const passportWindow = openGitcoinPassportWindow();
    onOpenWindow();
    
    // Poll for updated score
    await pollForPassportScore(
      walletAddress,
      passportWindow,
      (data) => {
        const scoreMessage = `Your passport score has been updated to ${data.score.toFixed(2)}.`;
        onSuccess(data, scoreMessage);
      },
      onError,
      savePassportData
    );
    
    return true;
    
  } catch (error) {
    console.error('Failed to refresh Gitcoin Passport:', error);
    let errorMessage = "Failed to refresh passport score.";
    
    if (error instanceof Error) {
      if (error.message.includes('popup')) {
        errorMessage = "Popup blocked. Please enable popups for this site and try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    onError(errorMessage);
    return false;
  }
};
