import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  onBack: () => void;
}

const ForgotPasswordForm = ({ email, setEmail, onBack }: ForgotPasswordFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      
      onBack();
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

  return (
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
            onClick={onBack}
            className="text-sm flex items-center gap-1"
            disabled={isLoading}
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
