
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ReviewProps {
  review: {
    id: number;
    companyName: string;
    reviewerAddress: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
  }
}

const ReviewCard = ({ review }: ReviewProps) => {
  const formatAddress = (address: string) => {
    if (address.includes('...')) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className="hover:border-trustpurple-500/30 transition-colors">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{review.title}</h3>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`${
                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <span className="text-sm text-trustpurple-400 font-medium mr-2">{review.companyName}</span>
          {review.verified && (
            <div className="flex items-center text-xs text-emerald-600">
              <CheckCircle size={12} className="mr-1" />
              Verified Review
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground">{review.content}</p>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 border-t flex justify-between items-center text-xs text-muted-foreground">
        <div>
          by {formatAddress(review.reviewerAddress)}
        </div>
        <div>
          {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
