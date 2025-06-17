
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
  const maxAttempts = 60; // Poll for 10 minutes (60 * 10 seconds)
  
  const checkScore = async () => {
    attempts++;
    console.log(`Checking for passport score (attempt ${attempts}/${maxAttempts})...`);
    
    try {
      const score = await fetchGitcoinScore(walletAddress);
      
      if (score !== null && score > 0) {
        console.log('✅ Passport score detected:', score);
        const data = savePassportData(walletAddress, score);
        onSuccess(data);
        return;
      }
      
      // Check if window is closed
      if (passportWindow.closed) {
        console.log('Passport window closed, continuing to poll for score...');
        
        // Give user a bit more time after closing window
        if (attempts >= maxAttempts) {
          onError("No passport score detected. Please ensure you completed the verification process with stamps and try refreshing manually.");
          return;
        }
      }
      
      // Continue polling if we haven't reached max attempts
      if (attempts < maxAttempts) {
        setTimeout(checkScore, 10000); // Check every 10 seconds
      } else {
        onError("Verification timeout. Please ensure you completed the passport verification with stamps and try refreshing your score manually.");
      }
      
    } catch (error) {
      console.error('Error checking passport score:', error);
      if (attempts < maxAttempts) {
        setTimeout(checkScore, 10000);
      } else {
        onError("Failed to check passport score. Please try refreshing manually.");
      }
    }
  };
  
  // Start checking after 5 seconds to give user time to navigate
  setTimeout(checkScore, 5000);
};
