
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldOff } from 'lucide-react';

interface UsersManagementProps {
  isAdmin: boolean;
}

interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  created_at: string;
}

interface AdminUserRecord {
  id: string;
  user_id: string;
  is_active: boolean;
  granted_at: string;
  notes?: string;
}

interface CombinedUser {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  created_at: string;
  is_admin: boolean;
  admin_granted_at?: string;
  admin_notes?: string;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ isAdmin }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users and admin status
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async (): Promise<CombinedUser[]> => {
      console.log('Fetching all users and admin data...');
      
      // Get all auth users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        throw authError;
      }
      
      if (!authData?.users || !Array.isArray(authData.users)) {
        console.log('No auth users found');
        return [];
      }
      
      console.log('Auth users fetched:', authData.users.length);
      
      // Get all admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('is_active', true);
      
      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        // Continue without admin data
      }
      
      console.log('Admin users fetched:', adminUsers?.length || 0);
      
      // Combine the data
      const combinedUsers: CombinedUser[] = authData.users.map((authUser: any) => {
        const adminRecord = adminUsers?.find((admin: AdminUserRecord) => admin.user_id === authUser.id);
        
        return {
          id: authUser.id,
          email: authUser.email,
          email_confirmed_at: authUser.email_confirmed_at,
          last_sign_in_at: authUser.last_sign_in_at,
          created_at: authUser.created_at,
          is_admin: !!adminRecord,
          admin_granted_at: adminRecord?.granted_at,
          admin_notes: adminRecord?.notes
        };
      });
      
      console.log('Combined users:', combinedUsers.length);
      return combinedUsers;
    },
    enabled: !!isAdmin
  });

  // Toggle admin status mutation
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isCurrentlyAdmin }: { userId: string, isCurrentlyAdmin: boolean }) => {
      if (isCurrentlyAdmin) {
        // Remove admin status
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        // Add admin status
        const { error } = await supabase
          .from('admin_users')
          .insert({
            user_id: userId,
            is_active: true,
            notes: 'Admin status granted via admin dashboard'
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
      toast({
        title: "User Updated",
        description: "User admin status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Toggle admin error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user admin status.",
        variant: "destructive",
      });
    }
  });

  const handleToggleAdmin = (userId: string, isCurrentlyAdmin: boolean) => {
    toggleAdminMutation.mutate({ userId, isCurrentlyAdmin });
  };

  if (usersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustpurple-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        {!users || users.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Admin Status</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.email || 'No email'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_admin ? "default" : "secondary"}>
                        {user.is_admin ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                        {user.email_confirmed_at ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={user.is_admin ? "destructive" : "default"}
                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                        disabled={toggleAdminMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        {user.is_admin ? (
                          <>
                            <ShieldOff size={14} />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <Shield size={14} />
                            Make Admin
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
