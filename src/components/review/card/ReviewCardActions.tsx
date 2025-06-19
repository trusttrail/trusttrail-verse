
import React from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageCircle, Flag } from "lucide-react";

interface ReviewCardActionsProps {
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  isWalletConnected: boolean;
  commentsCount: number;
  showComments: boolean;
  onVote: (voteType: 'up' | 'down') => void;
  onToggleComments: () => void;
  onFlag: () => void;
}

const ReviewCardActions = ({
  upvotes,
  downvotes,
  userVote,
  isWalletConnected,
  commentsCount,
  showComments,
  onVote,
  onToggleComments,
  onFlag
}: ReviewCardActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <Button
          variant={userVote === 'up' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onVote('up')}
          disabled={!isWalletConnected}
          className="flex items-center gap-1"
          title={!isWalletConnected ? "Connect wallet to vote" : ""}
        >
          <ThumbsUp size={14} />
          <span>{upvotes}</span>
        </Button>
        <Button
          variant={userVote === 'down' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => onVote('down')}
          disabled={!isWalletConnected}
          className="flex items-center gap-1"
          title={!isWalletConnected ? "Connect wallet to vote" : ""}
        >
          <ThumbsDown size={14} />
          <span>{downvotes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleComments}
          className="flex items-center gap-1"
        >
          <MessageCircle size={14} />
          <span className="hidden sm:inline">Comments</span>
          <span className="sm:hidden">({commentsCount})</span>
        </Button>
      </div>
      {isWalletConnected && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFlag}
          className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
        >
          <Flag size={14} />
          <span className="hidden sm:inline">Flag</span>
        </Button>
      )}
    </div>
  );
};

export default ReviewCardActions;
