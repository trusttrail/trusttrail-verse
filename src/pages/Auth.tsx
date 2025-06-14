
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from '@/components/Header';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { linkWalletToProfile } from '@/utils/authUtils';
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

  // Check if this is a password reset flow
  useEffect(() => {
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    console.log('Auth page URL params:', { type, accessToken: !!accessToken, refreshToken: !!refreshToken });
    
    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('Password reset flow detected');
      setShowPasswordReset(true);
      
      // Set the session with the tokens from URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ data, error }) => {
        console.log('Session set result:', { data, error });
        if (error) {
          console.error('Error setting session:', error);
          toast({
            title: "Invalid reset link",
            description: "This password reset link is invalid or expired. Please request a new one.",
            variant: "destructive",
          });
          setShowPasswordReset(false);
          setShowForgotPassword(true);
        }
      });
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
      console.log('Auth page - Current session check:', { session, error });
      
      if (session?.user && session.user.email_confirmed_at) {
        console.log('User already authenticated and verified, redirecting to review portal');
        navigate('/review-portal');
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth page - Auth event:", event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        if (session.user.email_confirmed_at) {
          console.log('User signed in and verified');
          
          // Link wallet if connected
          if (isWalletConnected && walletAddress) {
            await linkWalletToProfile(session.user.id, walletAddress);
            toast({
              title: "Account Complete!",
              description: "Your wallet has been linked to your account.",
            });
          }
          
          navigate('/review-portal');
        } else {
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
  }, [navigate, toast, isWalletConnected, walletAddress]);

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
          emailRedirectTo: `${window.location.origin}/review-portal`
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
