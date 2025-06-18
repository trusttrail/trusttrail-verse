
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UserDashboardHeader from './dashboard/UserDashboardHeader';
import UserStatsCards from './dashboard/UserStatsCards';
import UserReviewsList from './dashboard/UserReviewsList';
import UserActivity from './passport/UserActivity';

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
  const { isWalletConnected, walletAddress } = useWalletConnection();
  const { isVerified } = useGitcoinPassport();
  const { toast } = useToast();
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalReviews: 0,
    verifiedReviews: 0,
    rejectedReviews: 0,
    totalRewards: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock user activity stats for the new components
  const [activityStats] = useState({
    reviewsGiven: 12,
    topUpvotedReview: "Amazing DeFi experience with QuickSwap",
    nocapEarned: 245.78,
    reputationScore: 8.5
  });

  useEffect(() => {
    if (walletAddress) {
      fetchUserData();
    }
  }, [walletAddress]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Try multiple approaches to find user reviews with case-insensitive matching
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .ilike('wallet_address', walletAddress)
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

  if (!isWalletConnected || !walletAddress) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardHeader 
        address={walletAddress}
        onRefresh={fetchUserData}
        loading={loading}
      />

      <UserStatsCards userStats={userStats} />

      <UserReviewsList reviews={userReviews} loading={loading} />

      {/* Include activity overview from passport tab */}
      <UserActivity 
        userStats={activityStats}
        isVerified={isVerified}
      />
    </div>
  );
};

export default UserDashboard;
