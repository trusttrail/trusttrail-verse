import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink, Eye, RefreshCw } from "lucide-react";
import ReviewCard from "@/components/review/ReviewCard";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      
      // First, let's check all reviews to see their status
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
        
        // Log status breakdown for debugging
        const statusBreakdown = allReviews.reduce((acc, review) => {
          acc[review.status] = (acc[review.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log('📊 Review status breakdown:', statusBreakdown);
        
        // Show only approved reviews in Recent Reviews
        const approvedReviews = allReviews.filter(r => r.status === 'approved');
        console.log('✅ Approved reviews to display:', approvedReviews.length);
        
        setDatabaseReviews(approvedReviews);
        
        if (forceRefresh && approvedReviews.length > 0) {
          toast({
            title: "Reviews Updated",
            description: `Found ${approvedReviews.length} approved reviews.`,
          });
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
    verified: true, // All approved reviews are verified
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Recent Reviews</h3>
          <p className="text-muted-foreground text-sm mt-1 hidden sm:block">
            Latest AI-approved reviews from our community ({allReviews.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchRecentReviews(true)}
            disabled={loading || refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {showAll ? 'Show Recent Only' : `View All Reviews (${allReviews.length})`}
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm sm:hidden">
        Latest AI-approved reviews from our community ({allReviews.length} total)
      </p>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading recent reviews...</p>
        </div>
      ) : allReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No approved reviews found. Submit a review to get started!</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {displayedReviews.map(review => (
            <div key={review.id} className="relative group">
              <ReviewCard review={review} />
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => shareReview(review)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentReviewsSection;
