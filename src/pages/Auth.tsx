
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { LogIn, UserPlus, Mail, Lock, Clock } from 'lucide-react';
import VerificationTimer from '@/components/VerificationTimer';

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth page - Auth event:", event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        if (session.user.email_confirmed_at) {
          console.log('User signed in and verified, redirecting to review portal');
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
  }, [navigate, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Attempting sign up with:', { email: email.toLowerCase().trim() });
    
    try {
      // Clean the email address
      const cleanEmail = email.toLowerCase().trim();
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/review-portal`,
          data: {
            email_confirm: true
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
          description: `We've sent a confirmation link to ${cleanEmail}. Please check your email (including spam folder) and click the link to verify your account.`,
        });
      } else if (data.session) {
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
    
    console.log('Attempting sign in with:', { email: email.toLowerCase().trim() });
    
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
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
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
                {isSignUp 
                  ? 'Create your account to start writing reviews' 
                  : 'Sign in to your account to continue'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                <div className="mt-2 text-center">
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
