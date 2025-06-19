
import React from 'react';
import { CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardFooterProps {
  reviewerAddress: string;
  trustScore?: number;
  date: string;
}

const ReviewCardFooter = ({ reviewerAddress, trustScore, date }: ReviewCardFooterProps) => {
  const formatAddress = (address: string) => {
    if (address.includes('...')) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <CardFooter className="pt-2 pb-4 px-3 sm:px-6 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>by {formatAddress(reviewerAddress)}</span>
        {trustScore !== undefined && (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
            Trust: {trustScore}/100
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
      </div>
    </CardFooter>
  );
};

export default ReviewCardFooter;
