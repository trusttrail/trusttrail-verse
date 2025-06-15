
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

interface ProfileData {
  id: string;
  wallet_address: string | null;
  is_admin: boolean;
  created_at: string;
}

interface AdminUser extends ProfileData {
  email?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  auth_created_at?: string;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ isAdmin }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users with their profiles
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      console.log('Fetching admin users data...');
      
      // Get all profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      console.log('Profiles fetched:', profiles);
      
      // Ensure profiles is an array and handle null case
      if (!profiles || !Array.isArray(profiles)) {
        console.log('No profiles found or invalid data structure');
        return [];
      }
      
      // Get auth users data
      const { data: authData } = await supabase.auth.admin.listUsers();
      console.log('Auth data fetched:', authData);
      
      // Map profiles to AdminUser type
      const combinedUsers: AdminUser[] = profiles.map((profile: ProfileData) => {
        const authUser = authData?.users?.find(user => user.id === profile.id);
        return {
          id: profile.id,
          wallet_address: profile.wallet_address,
          is_admin: profile.is_admin,
          created_at: profile.created_at,
          email: authUser?.email,
          email_confirmed_at: authUser?.email_confirmed_at,
          last_sign_in_at: authUser?.last_sign_in_at,
          auth_created_at: authUser?.created_at
        };
      });
      
      console.log('Combined users:', combinedUsers);
      return combinedUsers;
    },
    enabled: !!isAdmin
  });

  // Toggle admin status mutation
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string, isAdmin: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isAdmin })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
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
    toggleAdminMutation.mutate({ userId, isAdmin: isCurrentlyAdmin });
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
                  <TableHead>Wallet Address</TableHead>
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
                      {user.wallet_address ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {user.wallet_address.substring(0, 8)}...{user.wallet_address.substring(user.wallet_address.length - 6)}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">No wallet</span>
                      )}
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
                      {user.auth_created_at 
                        ? new Date(user.auth_created_at).toLocaleDateString()
                        : new Date(user.created_at).toLocaleDateString()
                      }
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
