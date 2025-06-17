
import { fetchGitcoinScore } from './gitcoinApi';
import { pollForPassportScore } from './gitcoinPolling';
import { GitcoinPassportData } from '@/types/gitcoinPassport';

export const openGitcoinPassportWindow = (): Window | null => {
  const passportUrl = `https://passport.gitcoin.co/?utm_source=trusttrail&utm_medium=webapp`;
  const passportWindow = window.open(passportUrl, 'gitcoin_passport', 'width=800,height=600,scrollbars=yes,resizable=yes');
  
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
    
    if (existingScore !== null && existingScore > 0) {
      // User already has a passport, just save the score
      const data = savePassportData(walletAddress, existingScore);
      onSuccess(data, `Your existing passport score (${existingScore}) has been successfully linked to your account.`);
      return true;
    }
    
    // Open Gitcoin Passport in new window for verification
    const passportWindow = openGitcoinPassportWindow();
    onOpenWindow();
    
    // Poll for score updates
    await pollForPassportScore(
      walletAddress,
      passportWindow,
      (data) => onSuccess(data, `Your passport score (${data.score}) has been successfully verified and linked to your account.`),
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
