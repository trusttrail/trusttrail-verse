
import React from 'react';
import ReviewCard from "@/components/review/ReviewCard";

interface Review {
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
  attachments?: Array<{
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    url?: string;
  }>;
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
  shareReview?: () => void;
}

interface ReviewsListProps {
  reviews: Review[];
  loading: boolean;
  onShareReview: (review: Review) => void;
}

const ReviewsList = ({ reviews, loading, onShareReview }: ReviewsListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading recent reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No approved reviews found. Submit a review to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
