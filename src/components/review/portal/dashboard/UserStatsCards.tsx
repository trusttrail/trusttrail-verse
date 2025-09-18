
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Trophy, FileText, XCircle } from "lucide-react";

interface UserStats {
  totalReviews: number;
  verifiedReviews: number;
  rejectedReviews: number;
  totalRewards: number;
}

interface UserStatsCardsProps {
  userStats: UserStats;
}

const UserStatsCards = ({ userStats }: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{userStats.totalReviews}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
              <FileText className="text-blue-600 dark:text-blue-400" size={16} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved Reviews</p>
              <p className="text-2xl font-bold">{userStats.verifiedReviews}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
              <Trophy className="text-green-600 dark:text-green-400" size={16} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rejected Reviews</p>
              <p className="text-2xl font-bold">{userStats.rejectedReviews}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
              <XCircle className="text-red-600 dark:text-red-400" size={16} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">TRST Earned</p>
              <p className="text-2xl font-bold">{userStats.totalRewards}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
              <Coins className="text-purple-600 dark:text-purple-400" size={16} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsCards;
