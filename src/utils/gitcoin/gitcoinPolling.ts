
import { fetchGitcoinScore } from './gitcoinApi';
import { GitcoinPassportData } from '@/types/gitcoinPassport';

export const pollForPassportScore = async (
  walletAddress: string,
  passportWindow: Window,
  onSuccess: (data: GitcoinPassportData) => void,
  onError: (message: string) => void,
  savePassportData: (address: string, score: number) => GitcoinPassportData
): Promise<void> => {
  let attempts = 0;
  const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
  
  const checkScore = async () => {
    if (attempts >= maxAttempts) {
      onError("Please try refreshing your passport score manually once verification is complete.");
      return;
    }
    
    attempts++;
    console.log(`Checking for passport score (attempt ${attempts}/${maxAttempts})...`);
    
    // Check if window is still open
    if (passportWindow.closed) {
      console.log('Passport window closed, checking for score...');
      const score = await fetchGitcoinScore(walletAddress);
      
      if (score !== null && score > 0) {
        const data = savePassportData(walletAddress, score);
        onSuccess(data);
        return;
      }
    }
    
    // Continue polling if window is still open or no score found yet
    if (!passportWindow.closed || attempts < 5) {
      setTimeout(checkScore, 10000); // Check every 10 seconds
    } else {
      onError("No passport score detected. Please ensure you completed the verification process.");
    }
  };
  
  // Start checking after 15 seconds to give user time to complete verification
  setTimeout(checkScore, 15000);
};
