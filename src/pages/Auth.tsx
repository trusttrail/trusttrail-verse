import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from '@/components/Header';
import { LogIn, UserPlus, Mail, Lock, Wallet, ArrowLeft, KeyRound } from 'lucide-react';
import VerificationTimer from '@/components/VerificationTimer';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { linkWalletToProfile } from '@/utils/authUtils';

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { walletAddress, isWalletConnected, needsSignup, existingUser } = useWalletConnection();
  const [isSignUp, setIsSignUp] = useState(needsSignup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Check if this is a password reset flow
  useEffect(() => {
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    
    if (type === 'recovery' && accessToken) {
      setShowPasswordReset(true);
    }
  }, [searchParams]);

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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated successfully",
        description: "Your password has been reset. You can now sign in with your new password.",
      });
      
      // Clear the URL parameters and redirect to sign in
      navigate('/auth', { replace: true });
      setShowPasswordReset(false);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast({
        title: "Password reset failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Attempting sign up with:', { email: email.toLowerCase().trim(), walletConnected: isWalletConnected, walletAddress });
    
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/review-portal`,
          data: {
            email_confirm: true,
            wallet_address: isWalletConnected ? walletAddress : null
          }
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      if (data.user && !data.session) {
        setIsEmailSent(true);
        setShowVerification(true);
        toast({
          title: "Verification email sent!",
          description: `We've sent a confirmation link to ${cleanEmail}. After verification, your ${isWalletConnected ? 'wallet will be automatically linked' : 'account will be ready'}.`,
        });
      } else if (data.session) {
        // Link wallet immediately if connected
        if (isWalletConnected && walletAddress) {
          await linkWalletToProfile(data.user.id, walletAddress);
        }
        toast({
          title: "Account created successfully!",
          description: "Welcome to TrustTrail!",
        });
      }
    } catch (error: any) {
      console.error('Sign up failed:', error);
      
      let errorMessage = "An error occurred during sign up";
      if (error.message?.includes('already registered')) {
        errorMessage = "This email is already registered. Try signing in instead.";
        setIsSignUp(false);
      } else if (error.message?.includes('invalid email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message?.includes('weak password')) {
        errorMessage = "Password is too weak. Please use at least 8 characters.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Attempting sign in with:', { email: email.toLowerCase().trim(), walletConnected: isWalletConnected, walletAddress });
    
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user && data.session) {
        if (data.user.email_confirmed_at) {
          // Link wallet if connected
          if (isWalletConnected && walletAddress) {
            await linkWalletToProfile(data.user.id, walletAddress);
            toast({
              title: "Welcome back!",
              description: "Your wallet has been linked to your account.",
            });
          } else {
            toast({
              title: "Welcome back!",
              description: "You've been signed in successfully.",
            });
          }
        } else {
          setShowVerification(true);
          toast({
            title: "Email verification required",
            description: "Please verify your email address to continue.",
          });
        }
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      
      let errorMessage = "Invalid email or password";
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the verification link before signing in.";
        setShowVerification(true);
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast({
        title: "Password reset failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <KeyRound size={20} />
                  Reset Your Password
                </CardTitle>
                <CardDescription>
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="flex items-center gap-2">
                      <Lock size={16} />
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      minLength={8}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="flex items-center gap-2">
                      <Lock size={16} />
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      minLength={8}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating Password...' : 'Update Password'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => navigate('/auth')}
                    className="text-sm flex items-center gap-1"
                    disabled={isLoading}
                  >
                    <ArrowLeft size={14} />
                    Back to sign in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Reset Password
                </CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm flex items-center gap-1"
                    disabled={isLoading}
                  >
                    <ArrowLeft size={14} />
                    Back to sign in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Verify Your Email
                </CardTitle>
                <CardDescription>
                  We've sent a verification link to your email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
                  <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Please check your email <strong>{email}</strong> and click the verification link to activate your account.
                  </p>
                  {isWalletConnected && (
                    <p className="text-xs text-green-600 mb-2">
                      ✓ Wallet {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)} will be automatically linked after verification
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Don't forget to check your spam/junk folder if you don't see the email in your inbox.
                  </p>
                </div>

                <VerificationTimer
                  initialTime={60}
                  onResend={handleResendVerification}
                  isLoading={isLoading}
                />

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => {
                      setShowVerification(false);
                      setIsEmailSent(false);
                    }}
                    className="text-sm"
                  >
                    Back to sign in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription>
                {isWalletConnected && (
                  <div className="flex items-center justify-center gap-2 mb-2 text-green-600">
                    <Wallet size={16} />
                    <span className="text-sm">
                      Wallet {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)} connected
                    </span>
                  </div>
                )}
                {isSignUp 
                  ? needsSignup 
                    ? 'Create your account to link this new wallet'
                    : 'Create your account to start writing reviews'
                  : existingUser
                    ? 'Sign in to continue with your existing account'
                    : 'Sign in to your account to continue'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isWalletConnected && (
                <div className="mb-4 p-4 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Wallet size={16} />
                    <span className="text-sm font-medium">Connect Wallet First</span>
                  </div>
                  <p className="text-xs text-orange-600">
                    Please connect your wallet using the button in the top navigation to link it with your account.
                  </p>
                </div>
              )}
              
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock size={16} />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    minLength={8}
                    disabled={isLoading}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                  />
                  {isSignUp && (
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                  disabled={isLoading}
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </Button>
              </div>

              {!isSignUp && (
                <div className="mt-2 text-center space-y-1">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    disabled={isLoading}
                  >
                    Forgot your password?
                  </Button>
                  <br />
                  <Button
                    variant="link"
                    onClick={() => setShowVerification(true)}
                    className="text-xs text-gray-500"
                    disabled={isLoading}
                  >
                    Didn't receive verification email?
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
