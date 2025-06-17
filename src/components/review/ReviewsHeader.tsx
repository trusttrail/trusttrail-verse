
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";

interface ReviewsHeaderProps {
  totalReviews: number;
  showAll: boolean;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onToggleShowAll: () => void;
}

const ReviewsHeader = ({
  totalReviews,
  showAll,
  loading,
  refreshing,
  onRefresh,
  onToggleShowAll,
}: ReviewsHeaderProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Recent Reviews</h3>
          <p className="text-muted-foreground text-sm mt-1 hidden sm:block">
            Latest AI-approved reviews from our community ({totalReviews} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={loading || refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleShowAll}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {showAll ? 'Show Recent Only' : `View All Reviews (${totalReviews})`}
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm sm:hidden">
        Latest AI-approved reviews from our community ({totalReviews} total)
      </p>
    </>
  );
};

export default ReviewsHeader;
