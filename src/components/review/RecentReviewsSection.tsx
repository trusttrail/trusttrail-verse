
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/review/ReviewCard";
import { supabase } from '@/integrations/supabase/client';

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

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved') // Only show approved reviews
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent reviews:', error);
        return;
      }

      if (data) {
        setDatabaseReviews(data);
      }
    } catch (error) {
      console.error('Error in fetchRecentReviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert database reviews to the expected format
  const convertedDatabaseReviews = databaseReviews.map((dbReview) => ({
    id: parseInt(dbReview.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 10000),
    companyName: dbReview.company_name,
    reviewerAddress: `${dbReview.wallet_address.substring(0, 6)}...${dbReview.wallet_address.substring(38)}`,
    rating: dbReview.rating,
    title: dbReview.title,
    content: dbReview.content,
    date: dbReview.created_at,
    verified: true, // Approved reviews are considered verified
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
    ].slice(0, Math.floor(Math.random() * 3))
  }));

  // Combine database reviews with sample reviews
  const enhancedReviews = reviews.map(review => ({
    ...review,
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
    ].slice(0, Math.floor(Math.random() * 3))
  }));

  // Combine and sort all reviews by date
  const allReviews = [...convertedDatabaseReviews, ...enhancedReviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10); // Show only the 10 most recent

  return (
    <section className="px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Recent Reviews</h3>
          <p className="text-muted-foreground text-sm mt-1 hidden sm:block">
            Latest blockchain-verified reviews from our community
          </p>
        </div>
        <Button variant="link" className="text-trustpurple-400 self-start sm:self-center" onClick={fetchRecentReviews}>
          View All Reviews
        </Button>
      </div>
      <p className="text-muted-foreground mb-6 text-sm sm:hidden">
        Latest blockchain-verified reviews from our community
      </p>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading recent reviews...</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {allReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentReviewsSection;
