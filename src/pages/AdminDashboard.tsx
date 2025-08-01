
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from '@/components/Header';
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { useAdminProfile } from '@/hooks/useAdminProfile';
import UsersManagement from '@/components/admin/UsersManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('users');
  const { data: profile, isLoading: profileLoading } = useAdminProfile();
  const { user, loading: authLoading } = useAuth();
  const { isWalletConnected, walletAddress, existingUser } = useWalletConnection();
  const navigate = useNavigate();

  console.log('AdminDashboard - Auth state:', { user: !!user, authLoading, profile, profileLoading });

  // Show loading while checking auth and profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trustpurple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
              <p className="text-muted-foreground mb-4">You need to be signed in to access the admin dashboard.</p>
              
              {isWalletConnected && existingUser && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-600 mb-2">
                    ✅ Your wallet ({walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}) is recognized as an existing user.
                  </p>
                  <p className="text-xs text-blue-500">
                    Automatic authentication is in progress. If it doesn't work, please refresh the page or try the manual sign-in option below.
                  </p>
                </div>
              )}
              
              <Button onClick={() => navigate('/auth')} className="w-full">
                Sign In Manually
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if user is not admin
  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground">You don't have admin privileges to access this page.</p>
              <p className="text-sm text-muted-foreground mt-2">Current user: {user.email}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and moderate reviews</p>
          <p className="text-sm text-muted-foreground">Logged in as: {user.email}</p>
          {isWalletConnected && (
            <p className="text-xs text-green-600">
              ✅ Wallet: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Users Management
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock size={16} />
              Pending Reviews
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle size={16} />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle size={16} />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManagement isAdmin={!!profile?.is_admin} />
          </TabsContent>

          <TabsContent value="pending">
            <ReviewsManagement status="pending" isAdmin={!!profile?.is_admin} />
          </TabsContent>

          <TabsContent value="approved">
            <ReviewsManagement status="approved" isAdmin={!!profile?.is_admin} />
          </TabsContent>

          <TabsContent value="rejected">
            <ReviewsManagement status="rejected" isAdmin={!!profile?.is_admin} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
