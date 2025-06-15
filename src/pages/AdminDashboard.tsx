import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Star, CheckCircle, XCircle, Clock, Eye, Download, Users, Shield, ShieldOff } from 'lucide-react';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  // Check if user is admin
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch reviews based on status
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['admin-reviews', activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.is_admin && ['pending', 'approved', 'rejected'].includes(activeTab)
  });

  // Fetch all users with their profiles
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      // Get auth users data
      const { data: authData } = await supabase.auth.admin.listUsers();
      
      // Combine the data
      const combinedUsers = profiles.map(profile => {
        const authUser = authData?.users?.find(user => user.id === profile.id);
        return {
          ...profile,
          email: authUser?.email,
          email_confirmed_at: authUser?.email_confirmed_at,
          last_sign_in_at: authUser?.last_sign_in_at,
          auth_created_at: authUser?.created_at
        };
      });
      
      return combinedUsers;
    },
    enabled: !!profile?.is_admin && activeTab === 'users'
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

  // Update review status mutation
  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, status, notes }: { reviewId: string, status: ReviewStatus, notes?: string }) => {
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('reviews')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: session.session?.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reviewId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast({
        title: "Review Updated",
        description: "Review status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update review status.",
        variant: "destructive",
      });
    }
  });

  const handleApprove = (reviewId: string) => {
    updateReviewMutation.mutate({ 
      reviewId, 
      status: 'approved', 
      notes: adminNotes[reviewId] 
    });
  };

  const handleReject = (reviewId: string) => {
    updateReviewMutation.mutate({ 
      reviewId, 
      status: 'rejected', 
      notes: adminNotes[reviewId] 
    });
  };

  const handleToggleAdmin = (userId: string, isAdmin: boolean) => {
    toggleAdminMutation.mutate({ userId, isAdmin });
  };

  const downloadProofFile = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('review-proofs')
        .download(fileUrl);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download proof file.",
        variant: "destructive",
      });
    }
  };

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
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustpurple-500"></div>
                  </div>
                ) : users?.length === 0 ? (
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
                        {users?.map((user) => (
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
          </TabsContent>

          {/* Reviews tabs remain the same */}
          {['pending', 'approved', 'rejected'].map((status) => (
            <TabsContent key={status} value={status}>
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustpurple-500"></div>
                </div>
              ) : reviews?.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No {status} reviews found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {reviews?.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {review.title}
                              <Badge variant={
                                review.status === 'approved' ? 'default' :
                                review.status === 'rejected' ? 'destructive' : 'secondary'
                              }>
                                {review.status}
                              </Badge>
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.company_name} • {review.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground text-right">
                            <div>Submitted: {new Date(review.created_at).toLocaleDateString()}</div>
                            <div>Wallet: {review.wallet_address.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{review.content}</p>
                        
                        {review.proof_file_url && (
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadProofFile(review.proof_file_url!, review.proof_file_name!)}
                              className="flex items-center gap-2"
                            >
                              <Download size={14} />
                              Download Proof: {review.proof_file_name}
                            </Button>
                          </div>
                        )}

                        {review.status === 'pending' && (
                          <div className="space-y-4">
                            <div>
                              <label htmlFor={`notes-${review.id}`} className="block text-sm font-medium mb-2">
                                Admin Notes (Optional)
                              </label>
                              <Textarea
                                id={`notes-${review.id}`}
                                placeholder="Add notes about this review..."
                                value={adminNotes[review.id] || ''}
                                onChange={(e) => setAdminNotes(prev => ({
                                  ...prev,
                                  [review.id]: e.target.value
                                }))}
                                rows={2}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprove(review.id)}
                                disabled={updateReviewMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle size={16} className="mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleReject(review.id)}
                                disabled={updateReviewMutation.isPending}
                                variant="destructive"
                              >
                                <XCircle size={16} className="mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}

                        {review.admin_notes && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <h4 className="font-medium text-sm mb-1">Admin Notes:</h4>
                            <p className="text-sm">{review.admin_notes}</p>
                            {review.reviewed_at && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Reviewed on {new Date(review.reviewed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
