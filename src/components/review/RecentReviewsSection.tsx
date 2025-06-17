import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReviewsHeader from './ReviewsHeader';
import ReviewsList from './ReviewsList';

interface DatabaseReview {
  id: string;
  company_name: string;
  category: string;
  title: string;
  content: string;
  rating: number;
  wallet_address: string;
  created_at: string;
  status: string;
}

interface RecentReviewsSectionProps {
  reviews: {
    id: number;
    companyName: string;
    reviewerAddress: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
    upvotes?: number;
    downvotes?: number;
    comments?: Array<{
      id: number;
      author: string;
      content: string;
      date: string;
    }>;
    gitcoinScore?: number;
    trustScore?: number;
    hasUserVoted?: boolean;
    userVoteType?: 'up' | 'down' | null;
  }[];
}

const RecentReviewsSection = ({ reviews }: RecentReviewsSectionProps) => {
  const [databaseReviews, setDatabaseReviews] = useState<DatabaseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        toast({
          title: "Refreshing Reviews",
          description: "Checking for newly approved reviews...",
        });
      } else {
        setLoading(true);
      }
      
      console.log('🔍 Fetching reviews from database...');
      
      const { data: allReviews, error: allError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('❌ Error fetching reviews:', allError);
        toast({
          title: "Error",
          description: "Failed to load reviews. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (allReviews) {
        console.log('✅ Fetched all reviews from database:', allReviews.length, allReviews);
        
        const statusBreakdown = allReviews.reduce((acc, review) => {
          acc[review.status] = (acc[review.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log('📊 Review status breakdown:', statusBreakdown);
        
        // Only show approved reviews
        const approvedReviews = allReviews.filter(r => r.status === 'approved');
        console.log('✅ Approved reviews to display:', approvedReviews.length);
        
        setDatabaseReviews(approvedReviews);
        
        if (forceRefresh) {
          if (approvedReviews.length > 0) {
            toast({
              title: "Reviews Updated",
              description: `Found ${approvedReviews.length} approved reviews. ${statusBreakdown.pending || 0} pending, ${statusBreakdown.rejected || 0} rejected.`,
            });
          } else {
            toast({
              title: "No Approved Reviews",
              description: `No approved reviews found. ${statusBreakdown.pending || 0} pending, ${statusBreakdown.rejected || 0} rejected.`,
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in fetchRecentReviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const shareReview = async (review: any) => {
    const shareData = {
      title: `Review: ${review.companyName} - ${review.title}`,
      text: `Check out this review of ${review.companyName}: ${review.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast({
          title: "Link Copied",
          description: "Review link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share Failed",
        description: "Could not share the review. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Convert database reviews to the expected format
  const convertedDatabaseReviews = databaseReviews.map((dbReview, index) => ({
    id: parseInt(dbReview.id.replace(/-/g, '').substring(0, 8), 16) || (Date.now() + index),
    companyName: dbReview.company_name,
    reviewerAddress: `${dbReview.wallet_address.substring(0, 6)}...${dbReview.wallet_address.substring(38)}`,
    rating: dbReview.rating,
    title: dbReview.title,
    content: dbReview.content,
    date: dbReview.created_at,
    verified: true,
    upvotes: Math.floor(Math.random() * 50) + 5,
    downvotes: Math.floor(Math.random() * 10) + 1,
    gitcoinScore: Math.floor(Math.random() * 40) + 60,
    trustScore: Math.floor(Math.random() * 3) + 7,
    comments: [
      {
        id: 1,
        author: "CryptoUser123",
        content: "Thanks for this detailed review! Very helpful.",
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        author: "BlockchainExplorer",
        content: "I had a similar experience with this company.",
        date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ].slice(0, Math.floor(Math.random() * 3)),
    shareReview: () => shareReview({
      companyName: dbReview.company_name,
      title: dbReview.title
    })
  }));

  // Combine database reviews with sample reviews
  const enhancedReviews = reviews.map(review => ({
    ...review,
    upvotes: review.upvotes || Math.floor(Math.random() * 50) + 5,
    downvotes: review.downvotes || Math.floor(Math.random() * 10) + 1,
    gitcoinScore: review.gitcoinScore || Math.floor(Math.random() * 40) + 60,
    trustScore: review.trustScore || Math.floor(Math.random() * 3) + 7,
    comments: review.comments || [],
    shareReview: () => shareReview(review)
  }));

  // Combine and sort all reviews by date
  const allReviews = [...convertedDatabaseReviews, ...enhancedReviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedReviews = showAll ? allReviews : allReviews.slice(0, 10);

  return (
    <section className="px-4 sm:px-6" data-testid="recent-reviews">
      <ReviewsHeader
        totalReviews={allReviews.length}
        showAll={showAll}
        loading={loading}
        refreshing={refreshing}
        onRefresh={() => fetchRecentReviews(true)}
        onToggleShowAll={() => setShowAll(!showAll)}
      />
      
      <ReviewsList
        reviews={displayedReviews}
        loading={loading}
        onShareReview={shareReview}
      />
    </section>
  );
};

export default RecentReviewsSection;
