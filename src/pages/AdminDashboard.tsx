
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from '@/components/Header';
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { useAdminProfile } from '@/hooks/useAdminProfile';
import UsersManagement from '@/components/admin/UsersManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import { ReviewStatus } from '@/types/admin';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('pending');
  const { data: profile } = useAdminProfile();

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground">You don't have admin privileges to access this page.</p>
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
