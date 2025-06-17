
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Trophy, FileText, Star, Calendar, ArrowUpRight, XCircle } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserReview {
  id: string;
  company_name: string;
  category: string;
  title: string;
  rating: number;
  status: string;
  created_at: string;
  wallet_address: string;
  content: string;
}

interface UserStats {
  totalReviews: number;
  verifiedReviews: number;
  rejectedReviews: number;
  totalRewards: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const { tokenBalance, address } = useWeb3();
  const { toast } = useToast();
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalReviews: 0,
    verifiedReviews: 0,
    rejectedReviews: 0,
    totalRewards: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchUserData();
    }
  }, [address]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Try multiple approaches to find user reviews with case-insensitive matching
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .ilike('wallet_address', address)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user reviews:', error);
        toast({
          title: "Error",
          description: "Failed to fetch your reviews. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (reviews) {
        setUserReviews(reviews);
        
        // Calculate stats from actual database data
        const totalReviews = reviews.length;
        const verifiedReviews = reviews.filter(r => r.status === 'approved').length;
        const rejectedReviews = reviews.filter(r => r.status === 'rejected').length;
        
        // Calculate rewards: 10 $TRUST per verified review
        const totalRewards = verifiedReviews * 10;
        
        setUserStats({
          totalReviews,
          verifiedReviews,
          rejectedReviews,
          totalRewards
        });
      }
    } catch (error) {
      console.error('❌ Error in fetchUserData:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!address) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Dashboard</h2>
          <p className="text-muted-foreground">Track your reviews and rewards</p>
          <p className="text-sm text-muted-foreground mt-1">
            Connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUserData} variant="outline" size="sm" disabled={loading}>
            <ArrowUpRight className="h-4 w-4" />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{userStats.totalReviews}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                <FileText className="text-blue-600 dark:text-blue-400" size={16} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Reviews</p>
                <p className="text-2xl font-bold">{userStats.verifiedReviews}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <Trophy className="text-green-600 dark:text-green-400" size={16} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected Reviews</p>
                <p className="text-2xl font-bold">{userStats.rejectedReviews}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                <XCircle className="text-red-600 dark:text-red-400" size={16} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">$TRUST Earned</p>
                <p className="text-2xl font-bold">{userStats.totalRewards}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                <Coins className="text-purple-600 dark:text-purple-400" size={16} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Loading your reviews...</p>
            </div>
          ) : userReviews.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You haven't submitted any reviews yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start by writing your first review to earn $TRUST rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{review.company_name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {review.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(review.status)}>
                        {review.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium mb-2">{review.title}</p>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{review.content}</p>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      {review.rating}/5
                    </span>
                  </div>
                  
                  {review.status === 'approved' && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Coins className="h-4 w-4" />
                      <span>Reward earned: 10 $TRUST</span>
                    </div>
                  )}
                  
                  {review.status === 'rejected' && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>Review did not meet quality standards</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
