import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, UserPlus, Mail, Lock, Wallet } from 'lucide-react';
import { linkWalletToProfile } from '@/utils/authUtils';

interface AuthFormProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isWalletConnected: boolean;
  walletAddress: string;
  needsSignup: boolean;
  existingUser: any;
  onShowForgotPassword: () => void;
  onShowVerification: () => void;
  onEmailSent: () => void;
}

const AuthForm = ({
  isSignUp,
  setIsSignUp,
  email,
  setEmail,
  password,
  setPassword,
  isWalletConnected,
  walletAddress,
  needsSignup,
  existingUser,
  onShowForgotPassword,
  onShowVerification,
  onEmailSent
}: AuthFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
          // Email verification should redirect to home page
          emailRedirectTo: `${window.location.origin}/`,
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
        onEmailSent();
        onShowVerification();
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
          onShowVerification();
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
        onShowVerification();
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

  return (
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
              onClick={onShowForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              Forgot your password?
            </Button>
            <br />
            <Button
              variant="link"
              onClick={onShowVerification}
              className="text-xs text-gray-500"
              disabled={isLoading}
            >
              Didn't receive verification email?
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthForm;
