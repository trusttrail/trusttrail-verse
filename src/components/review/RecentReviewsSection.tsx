
import React from 'react';
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/review/ReviewCard";

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
  // Enhanced sample data with voting and comments
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
    ].slice(0, Math.floor(Math.random() * 3)) // Random number of comments (0-2)
  }));

  return (
    <section className="px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Recent Reviews</h3>
          <p className="text-muted-foreground text-sm mt-1 hidden sm:block">
            Latest blockchain-verified reviews from our community
          </p>
        </div>
        <Button variant="link" className="text-trustpurple-400 self-start sm:self-center">
          View All Reviews
        </Button>
      </div>
      <p className="text-muted-foreground mb-6 text-sm sm:hidden">
        Latest blockchain-verified reviews from our community
      </p>
      <div className="space-y-4 sm:space-y-6">
        {enhancedReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};

export default RecentReviewsSection;
