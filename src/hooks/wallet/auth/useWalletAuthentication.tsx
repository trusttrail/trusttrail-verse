
import { authenticateByWallet } from '@/utils/auth/walletAuth';
import { useToast } from '@/hooks/use-toast';

export const useWalletAuthentication = () => {
  const { toast } = useToast();

  const attemptSecureAuthentication = async (
    address: string,
    onSuccess: (address: string) => void,
    onFailure: (address: string, error?: string) => void
  ) => {
    try {
      console.log('🔐 Attempting secure authentication for wallet:', address);
      
      // Add timeout for authentication attempt
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 20000)
      );
      
      const authResult = await Promise.race([
        authenticateByWallet(address),
        timeoutPromise
      ]) as any;
      
      if (authResult.success) {
        console.log('✅ Secure authentication successful!');
        onSuccess(address);
        
        toast({
          title: "Welcome Back!",
          description: "Successfully signed in with your wallet.",
        });
        
        console.log('🎉 Secure authentication complete');
        return true;
        
      } else {
        console.warn('⚠️ Secure authentication failed:', authResult.error);
        onFailure(address, authResult.error);
        
        if (authResult.error?.includes('rate limit')) {
          console.log('Rate limit detected, authentication will retry automatically');
        } else {
          toast({
            title: "Authentication Notice",  
            description: "Wallet recognized. You may need to complete authentication manually if auto sign-in doesn't work.",
          });
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Secure authentication error:', error);
      onFailure(address, error instanceof Error ? error.message : 'Unknown error');
      
      if (error instanceof Error && error.message.includes('timeout')) {
        toast({
          title: "Connection Timeout",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication Error",
          description: "Please try connecting your wallet again.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  return {
    attemptSecureAuthentication,
  };
};
