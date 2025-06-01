
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { LogIn, UserPlus, ExternalLink } from 'lucide-react';

const Auth = () => {
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

  const handleSignUpRedirect = () => {
    window.location.href = 'https://ydvgnptdqnqxmueflhxq.supabase.co/auth/v1/authorize?redirect_to=https://trusttrail-verse.lovable.app/';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <UserPlus size={20} />
                Secure Sign-Up Required
              </CardTitle>
              <CardDescription>
                To proceed, please sign up and verify your email. You'll be redirected back automatically after verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={handleSignUpRedirect}
                className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500 flex items-center gap-2"
              >
                Continue to Sign Up
                <ExternalLink size={16} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
