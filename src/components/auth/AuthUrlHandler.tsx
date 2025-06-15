
import { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getAutoSignInData, clearAutoSignInData } from '@/utils/authUtils';

interface AuthUrlHandlerProps {
  setShowPasswordReset: (show: boolean) => void;
  setShowForgotPassword: (show: boolean) => void;
}

const AuthUrlHandler = ({ setShowPasswordReset, setShowForgotPassword }: AuthUrlHandlerProps) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check for wallet recognition on page load
  useEffect(() => {
    const walletRecognized = searchParams.get('wallet_recognized') === 'true';
    const recognizedWallet = localStorage.getItem('recognized_wallet');
    
    if (walletRecognized && recognizedWallet) {
      console.log('Wallet recognition detected:', recognizedWallet);
      
      toast({
        title: "Wallet Recognized!",
        description: `Your wallet ${recognizedWallet.substring(0, 6)}...${recognizedWallet.substring(recognizedWallet.length - 4)} is linked to an existing account. Please sign in to continue.`,
      });
      
      // Clear the recognition data
      localStorage.removeItem('recognized_wallet');
    }
  }, [searchParams, toast]);

  // Check for auto sign-in on page load
  useEffect(() => {
    const autoSignInData = getAutoSignInData();
    const isAutoSignIn = searchParams.get('auto_signin') === 'true';
    
    if (autoSignInData && isAutoSignIn) {
      console.log('Auto sign-in detected for wallet:', autoSignInData.walletAddress);
      
      toast({
        title: "Auto Sign-In",
        description: "Your wallet has been recognized. You can now sign in with any email/password associated with this wallet.",
      });
      
      clearAutoSignInData();
    }
  }, [searchParams, toast]);

  // Check URL parameters for password reset or email verification
  useEffect(() => {
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    // Also check hash parameters as Supabase uses those for auth callbacks
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashType = hashParams.get('type');
    const hashAccessToken = hashParams.get('access_token');
    const hashRefreshToken = hashParams.get('refresh_token');
    const hashError = hashParams.get('error');
    const hashErrorDescription = hashParams.get('error_description');
    
    console.log('Auth page URL analysis:', { 
      queryType: type,
      hashType: hashType,
      hasQueryTokens: !!(accessToken && refreshToken),
      hasHashTokens: !!(hashAccessToken && hashRefreshToken),
      error: error || hashError,
      fullURL: window.location.href
    });

    // Handle error cases first
    if (error || hashError) {
      console.error('Auth error from URL:', error || hashError, errorDescription || hashErrorDescription);
      toast({
        title: "Authentication Error",
        description: (errorDescription || hashErrorDescription) || (error || hashError),
        variant: "destructive",
      });
      return;
    }

    // Handle password recovery flow (type=recovery in either query or hash)
    const isPasswordReset = type === 'recovery' || hashType === 'recovery';
    const tokens = {
      access_token: accessToken || hashAccessToken,
      refresh_token: refreshToken || hashRefreshToken
    };

    if (isPasswordReset) {
      console.log('Password reset flow detected', { hasTokens: !!(tokens.access_token && tokens.refresh_token) });
      setShowPasswordReset(true);
      
      if (tokens.access_token && tokens.refresh_token) {
        console.log('Setting session for password reset');
        supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error setting session for password reset:', error);
            toast({
              title: "Invalid reset link",
              description: "This password reset link is invalid or expired. Please request a new one.",
              variant: "destructive",
            });
            setShowPasswordReset(false);
            setShowForgotPassword(true);
          } else {
            console.log('Password reset session set successfully');
          }
        });
      } else {
        console.log('Password reset without tokens - showing error');
        toast({
          title: "Invalid reset link",
          description: "This password reset link is missing required information. Please request a new one.",
          variant: "destructive",
        });
        setShowPasswordReset(false);
        setShowForgotPassword(true);
      }
    }
  }, [searchParams, toast, setShowPasswordReset, setShowForgotPassword]);

  return null; // This component only handles side effects
};

export default AuthUrlHandler;
