
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
  let windowClosed = false;
  let lastKnownScore: number | null = null;
  
  // Monitor window close event
  const checkWindowClosed = () => {
    if (passportWindow.closed && !windowClosed) {
      windowClosed = true;
      console.log('Passport window closed by user');
      
      // Give a short delay after window close to capture final score
      setTimeout(async () => {
        try {
          const finalScore = await fetchGitcoinScore(walletAddress);
          if (finalScore !== null) {
            console.log('Final score captured after window close:', finalScore);
            const data = savePassportData(walletAddress, finalScore);
            onSuccess(data);
          } else if (lastKnownScore !== null) {
            console.log('Using last known score after window close:', lastKnownScore);
            const data = savePassportData(walletAddress, lastKnownScore);
            onSuccess(data);
          } else {
            // Even if score is 0 or null, we should save it
            console.log('No score found, saving score of 0');
            const data = savePassportData(walletAddress, 0);
            onSuccess(data);
          }
        } catch (error) {
          console.error('Error capturing final score:', error);
          // Save score of 0 if there's an error
          const data = savePassportData(walletAddress, 0);
          onSuccess(data);
        }
      }, 3000); // Wait 3 seconds after window close
      
      return;
    }
  };
  
  const checkScore = async () => {
    attempts++;
    console.log(`Checking for passport score (attempt ${attempts}/${maxAttempts})...`);
    
    // Check if window is closed first
    checkWindowClosed();
    if (windowClosed) return;
    
    try {
      const score = await fetchGitcoinScore(walletAddress);
      console.log('Current score from API:', score);
      
      if (score !== null) {
        lastKnownScore = score;
        
        // If we have a score > 0, immediately sync it
        if (score > 0) {
          console.log('✅ Passport score detected:', score);
          const data = savePassportData(walletAddress, score);
          onSuccess(data);
          return;
        }
      }
      
      // Continue polling if we haven't reached max attempts and window is still open
      if (attempts < maxAttempts && !passportWindow.closed) {
        setTimeout(checkScore, 10000); // Check every 10 seconds
      } else if (attempts >= maxAttempts) {
        // Timeout reached - save whatever score we have
        console.log('Polling timeout reached');
        const finalScore = lastKnownScore !== null ? lastKnownScore : 0;
        console.log('Saving final score due to timeout:', finalScore);
        const data = savePassportData(walletAddress, finalScore);
        onSuccess(data);
      }
      
    } catch (error) {
      console.error('Error checking passport score:', error);
      if (attempts < maxAttempts && !passportWindow.closed) {
        setTimeout(checkScore, 10000);
      } else {
        // On final error, save score of 0
        console.log('Saving score of 0 due to error');
        const data = savePassportData(walletAddress, 0);
        onSuccess(data);
      }
    }
  };
  
  // Start checking immediately to capture existing score
  setTimeout(checkScore, 2000); // Start after 2 seconds
};
