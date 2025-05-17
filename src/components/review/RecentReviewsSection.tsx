
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
  }[];
}

const RecentReviewsSection = ({ reviews }: RecentReviewsSectionProps) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Recent Reviews</h3>
        <Button variant="link" className="text-trustpurple-400">
          View All Reviews
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">Latest blockchain-verified reviews from our community</p>
      <div className="space-y-6">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};

export default RecentReviewsSection;
