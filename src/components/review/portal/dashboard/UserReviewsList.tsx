
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, FileText, Coins, XCircle } from "lucide-react";

interface UserReview {
  id: string;
  company_name: string;
  category: string;
  title: string;
  rating: number;
  status: string;
  created_at: string;
  wallet_address: string;
  content: string;
}

interface UserReviewsListProps {
  reviews: UserReview[];
  loading: boolean;
}

const UserReviewsList = ({ reviews, loading }: UserReviewsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading your reviews...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">You haven't submitted any reviews yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by writing your first review to earn $TRUST rewards!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{review.company_name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {review.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(review.status)}>
                    {review.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm font-medium mb-2">{review.title}</p>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{review.content}</p>
              
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  {review.rating}/5
                </span>
              </div>
              
              {review.status === 'approved' && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Coins className="h-4 w-4" />
                  <span>Reward earned: 10 $TRUST</span>
                </div>
              )}
              
              {review.status === 'rejected' && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>Review did not meet quality standards</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserReviewsList;
