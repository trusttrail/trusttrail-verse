import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from '@/components/Header';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { linkWalletToProfile, getAutoSignInData, clearAutoSignInData } from '@/utils/authUtils';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import EmailVerificationView from '@/components/auth/EmailVerificationView';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { walletAddress, isWalletConnected, needsSignup, existingUser } = useWalletConnection();
  const [isSignUp, setIsSignUp] = useState(needsSignup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Clear the auto sign-in data after showing the message
      clearAutoSignInData();
      
      // Set form to sign-in mode for existing users
      setIsSignUp(false);
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
  }, [searchParams, toast]);

  // Update signup mode based on wallet connection state
  useEffect(() => {
    if (needsSignup) {
      setIsSignUp(true);
    } else if (existingUser) {
      setIsSignUp(false);
    }
  }, [needsSignup, existingUser]);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Auth page - Current session check:', { session: !!session, error });
      
      if (session?.user && session.user.email_confirmed_at && !showPasswordReset) {
        console.log('User already authenticated and verified, redirecting to home');
        navigate('/');
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth page - Auth event:", event, !!session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        if (session.user.email_confirmed_at && !showPasswordReset) {
          console.log('User signed in and verified via normal auth flow');
          
          // Link wallet if connected
          if (isWalletConnected && walletAddress) {
            await linkWalletToProfile(session.user.id, walletAddress);
            toast({
              title: "Account Complete!",
              description: "Your wallet has been linked to your account.",
            });
          }
          
          // Navigate to home page for normal auth flows (not password reset)
          navigate('/');
        } else if (!session.user.email_confirmed_at) {
          console.log('User signed in but email not verified yet');
          setShowVerification(true);
          toast({
            title: "Email verification required",
            description: "Please check your email and verify your account to continue.",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, isWalletConnected, walletAddress, showPasswordReset]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend verification.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification email resent",
        description: "Please check your email for the new verification link.",
      });
    } catch (error: any) {
      console.error('Resend verification failed:', error);
      toast({
        title: "Failed to resend email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToAuth = () => {
    setShowPasswordReset(false);
    setShowForgotPassword(false);
    setShowVerification(false);
    setIsEmailSent(false);
    // Clear URL parameters when going back
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          {showPasswordReset && (
            <PasswordResetForm onBack={() => navigate('/auth')} />
          )}
          
          {showForgotPassword && !showPasswordReset && (
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
              onBack={() => setShowForgotPassword(false)}
            />
          )}
          
          {showVerification && !showPasswordReset && !showForgotPassword && (
            <EmailVerificationView
              email={email}
              walletAddress={walletAddress}
              isWalletConnected={isWalletConnected}
              onResend={handleResendVerification}
              onBack={handleBackToAuth}
              isLoading={isLoading}
            />
          )}
          
          {!showPasswordReset && !showForgotPassword && !showVerification && (
            <AuthForm
              isSignUp={isSignUp}
              setIsSignUp={setIsSignUp}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isWalletConnected={isWalletConnected}
              walletAddress={walletAddress}
              needsSignup={needsSignup}
              existingUser={existingUser}
              onShowForgotPassword={() => setShowForgotPassword(true)}
              onShowVerification={() => setShowVerification(true)}
              onEmailSent={() => setIsEmailSent(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
