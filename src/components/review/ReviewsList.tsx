
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
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
        <div key={review.id} className="relative group">
          <ReviewCard review={review} />
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShareReview(review)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
