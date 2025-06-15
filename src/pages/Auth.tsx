
import React from 'react';
import Header from '@/components/Header';
import AuthContainer from '@/components/auth/AuthContainer';

const Auth = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <AuthContainer />
      </div>
    </div>
  );
};

export default Auth;
