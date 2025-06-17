
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BarChart3, Star, TrendingUp } from "lucide-react";

interface UserStats {
  reviewsGiven: number;
  topUpvotedReview: string;
  nocapEarned: number;
  reputationScore: number;
}

interface UserActivityProps {
  userStats: UserStats;
  isVerified: boolean;
}

const UserActivity = ({ userStats, isVerified }: UserActivityProps) => {
  if (!isVerified) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-yellow-500" size={20} />
            Top Upvoted Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium mb-2">{userStats.topUpvotedReview}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500" />
                5/5 Rating
              </span>
              <span>42 Upvotes</span>
              <span>QuickSwap</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">This Month's Reviews</span>
            <span className="font-semibold">8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Avg. Rating Given</span>
            <span className="font-semibold">4.2/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Community Impact</span>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-green-500" />
              <span className="font-semibold text-green-600">High</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivity;
