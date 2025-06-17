
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface UserDashboardHeaderProps {
  address: string;
  onRefresh: () => void;
  loading: boolean;
}

const UserDashboardHeader = ({ address, onRefresh, loading }: UserDashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">My Dashboard</h2>
        <p className="text-muted-foreground">Track your reviews and rewards</p>
        <p className="text-sm text-muted-foreground mt-1">
          Connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onRefresh} variant="outline" size="sm" disabled={loading}>
          <ArrowUpRight className="h-4 w-4" />
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default UserDashboardHeader;
