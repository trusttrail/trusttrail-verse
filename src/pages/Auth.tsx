import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { Eye, EyeOff, LogIn, UserPlus, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import VerificationTimer from '@/components/VerificationTimer';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeExpiryTime, setCodeExpiryTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user?.email_confirmed_at) {
        navigate('/review-portal');
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, session);
      
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        navigate('/review-portal');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (email: string, code: string) => {
    try {
      const response = await fetch('/functions/v1/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Fallback to console for development
      console.log(`Verification code for ${email}: ${code}`);
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        console.log('Attempting signup for:', email);
        
        // Generate verification code
        const code = generateVerificationCode();
        setGeneratedCode(code);
        
        // Set expiry time to 30 minutes from now
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 30);
        setCodeExpiryTime(expiryTime);
        
        // Store the code temporarily (in production, this should be stored securely on the backend)
        localStorage.setItem(`verification_code_${email}`, JSON.stringify({
          code,
          expiryTime: expiryTime.toISOString(),
          email
        }));
        
        // Send verification email
        await sendVerificationEmail(email, code);
        
        setShowVerificationForm(true);
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for a 6-digit verification code. The code is valid for 30 minutes.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Signed In",
          description: "Welcome back!",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setVerifyingCode(true);

    try {
      // Check stored verification code
      const storedData = localStorage.getItem(`verification_code_${email}`);
      if (!storedData) {
        throw new Error('No verification code found. Please request a new code.');
      }

      const { code: storedCode, expiryTime } = JSON.parse(storedData);
      const now = new Date();
      const expiry = new Date(expiryTime);

      if (now > expiry) {
        localStorage.removeItem(`verification_code_${email}`);
        throw new Error('Verification code has expired. Please request a new code.');
      }

      if (verificationCode !== storedCode) {
        throw new Error('Invalid verification code. Please try again.');
      }

      // Code is valid, proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Clean up stored code
      localStorage.removeItem(`verification_code_${email}`);
      
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully! Please sign in to continue.",
      });
      
      // Switch to sign in mode
      setIsSignUp(false);
      setShowVerificationForm(false);
      setVerificationCode('');
      
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setResendingCode(true);

    try {
      // Generate new verification code
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      // Set new expiry time
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 30);
      setCodeExpiryTime(expiryTime);
      
      // Store the new code
      localStorage.setItem(`verification_code_${email}`, JSON.stringify({
        code,
        expiryTime: expiryTime.toISOString(),
        email
      }));
      
      // Send new verification email
      await sendVerificationEmail(email, code);
      
      toast({
        title: "New Verification Code Sent",
        description: "A new verification code has been sent to your email. The code is valid for 30 minutes.",
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification code.",
        variant: "destructive",
      });
    } finally {
      setResendingCode(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {showVerificationForm ? (
                  <>
                    <CheckCircle size={20} />
                    Verify Your Email
                  </>
                ) : (
                  <>
                    {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {showVerificationForm
                  ? 'Enter the 6-digit verification code sent to your email'
                  : isSignUp 
                    ? 'Create an account to submit and manage your reviews'
                    : 'Sign in to your account to submit reviews'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showVerificationForm ? (
                <div className="space-y-6">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      We've sent a 6-digit verification code to <strong>{email}</strong>
                      <br />
                      <span className="text-sm">Code expires in 30 minutes</span>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 text-sm">
                      <strong>Email not arriving?</strong> Check your spam/junk folder. The email is sent from hellotrustrail@gmail.com.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="verification-code" className="block text-sm font-medium">
                        Verification Code
                      </label>
                      <div className="flex justify-center">
                        <InputOTP 
                          maxLength={6} 
                          value={verificationCode} 
                          onChange={setVerificationCode}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <Button
                      onClick={handleVerifyCode}
                      className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                      disabled={verifyingCode || verificationCode.length !== 6}
                    >
                      {verifyingCode ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <VerificationTimer
                      initialTime={90}
                      onResend={handleResendCode}
                      isLoading={resendingCode}
                    />

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setShowVerificationForm(false);
                          setVerificationCode('');
                        }}
                        className="text-sm"
                      >
                        Back to sign up
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </Button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setShowVerificationForm(false);
                      }}
                      className="text-sm"
                    >
                      {isSignUp 
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Sign up"
                      }
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
