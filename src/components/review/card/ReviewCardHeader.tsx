
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star, Share2 } from "lucide-react";

interface ReviewCardHeaderProps {
  title: string;
  rating: number;
  onShare: () => void;
}

const ReviewCardHeader = ({ title, rating, onShare }: ReviewCardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
      <h3 className="font-semibold text-base sm:text-lg pr-2">{title}</h3>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={`${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="opacity-50 group-hover:opacity-100 transition-opacity"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewCardHeader;
