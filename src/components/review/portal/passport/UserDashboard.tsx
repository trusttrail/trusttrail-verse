
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Coins, Trophy, Shield } from "lucide-react";

interface UserStats {
  reviewsGiven: number;
  nocapEarned: number;
  reputationScore: number;
}

interface UserDashboardProps {
  userStats: UserStats;
  passportScore: number;
  isVerified: boolean;
}

const UserDashboard = ({ userStats, passportScore, isVerified }: UserDashboardProps) => {
  if (!isVerified) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reviews Given</p>
              <p className="text-2xl font-bold">{userStats.reviewsGiven}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              <Star className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">$NOCAP Earned</p>
              <p className="text-2xl font-bold">{userStats.nocapEarned}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <Coins className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reputation Score</p>
              <p className="text-2xl font-bold">{userStats.reputationScore}/10</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
              <Trophy className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Passport Score</p>
              <p className="text-2xl font-bold">{passportScore}/100</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
              <Shield className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
