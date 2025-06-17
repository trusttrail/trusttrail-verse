
import React, { useState } from 'react';
import { useRecentReviews } from '@/hooks/useRecentReviews';
import { useReviewSharing } from '@/utils/reviewSharing';
import { convertDatabaseReviews, enhanceReviews } from '@/utils/reviewConverter';
import ReviewsHeader from './ReviewsHeader';
import ReviewsList from './ReviewsList';

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
  const [showAll, setShowAll] = useState(false);
  const { databaseReviews, loading, refreshing, fetchRecentReviews } = useRecentReviews();
  const { shareReview } = useReviewSharing();

  // Convert database reviews to the expected format
  const convertedDatabaseReviews = convertDatabaseReviews(databaseReviews, shareReview);

  // Combine database reviews with sample reviews
  const enhancedReviews = enhanceReviews(reviews, shareReview);

  // Combine and sort all reviews by date
  const allReviews = [...convertedDatabaseReviews, ...enhancedReviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Cap to 5 recent reviews by default, show all when showAll is true
  const displayedReviews = showAll ? allReviews : allReviews.slice(0, 5);

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
