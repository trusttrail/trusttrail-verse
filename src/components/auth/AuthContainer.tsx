
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { linkWalletToProfile } from '@/utils/authUtils';
import PasswordResetForm from './PasswordResetForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import EmailVerificationView from './EmailVerificationView';
import AuthForm from './AuthForm';
import AuthUrlHandler from './AuthUrlHandler';

const AuthContainer = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { walletAddress, isWalletConnected, needsSignup, existingUser } = useWalletConnection();
  const [isSignUp, setIsSignUp] = useState(needsSignup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="max-w-md mx-auto">
      <AuthUrlHandler 
        setShowPasswordReset={setShowPasswordReset}
        setShowForgotPassword={setShowForgotPassword}
      />
      
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
  );
};

export default AuthContainer;
