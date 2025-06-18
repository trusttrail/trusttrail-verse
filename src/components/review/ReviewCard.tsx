import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, ThumbsUp, ThumbsDown, MessageCircle, Flag, Shield, Share2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

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
    upvotes?: number;
    downvotes?: number;
    comments?: Array<{
      id: number;
      author: string;
      content: string;
      date: string;
    }>;
    gitcoinScore?: number;
    trustScore?: number;
    hasUserVoted?: boolean;
    userVoteType?: 'up' | 'down' | null;
    shareReview?: () => void;
  }
}

const ReviewCard = ({ review }: ReviewProps) => {
  const { isAuthenticated } = useAuth();
  const { address } = useWeb3();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(review.upvotes || 0);
  const [localDownvotes, setLocalDownvotes] = useState(review.downvotes || 0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(review.userVoteType || null);

  const isWalletConnected = !!address;

  const formatAddress = (address: string) => {
    if (address.includes('...')) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const requireWalletConnection = (action: string) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: `Please connect your wallet to ${action}.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!requireWalletConnection("vote on reviews")) return;

    try {
      // Simulate voting logic - in real app, this would call an API
      if (userVote === voteType) {
        // Remove vote
        if (voteType === 'up') {
          setLocalUpvotes(prev => prev - 1);
        } else {
          setLocalDownvotes(prev => prev - 1);
        }
        setUserVote(null);
        toast({
          title: "Vote Removed",
          description: `Your ${voteType}vote has been removed.`,
        });
      } else {
        // Add or change vote
        if (userVote) {
          // Change existing vote
          if (userVote === 'up') {
            setLocalUpvotes(prev => prev - 1);
            setLocalDownvotes(prev => prev + 1);
          } else {
            setLocalDownvotes(prev => prev - 1);
            setLocalUpvotes(prev => prev + 1);
          }
        } else {
          // New vote
          if (voteType === 'up') {
            setLocalUpvotes(prev => prev + 1);
          } else {
            setLocalDownvotes(prev => prev + 1);
          }
        }
        setUserVote(voteType);
        toast({
          title: "Vote Recorded",
          description: `Your ${voteType}vote has been recorded.`,
        });
      }
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!requireWalletConnection("comment on reviews")) return;

    if (!newComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmittingComment(true);
      // Simulate comment submission - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      });
      setNewComment('');
    } catch (error) {
      toast({
        title: "Comment Failed",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleFlag = async () => {
    if (!requireWalletConnection("flag reviews")) return;

    toast({
      title: "Review Flagged",
      description: "This review has been flagged for moderation review.",
    });
  };

  const handleShare = async () => {
    if (review.shareReview) {
      review.shareReview();
    } else {
      const shareData = {
        title: `Review: ${review.companyName} - ${review.title}`,
        text: `Check out this review of ${review.companyName}: ${review.title}`,
        url: window.location.href
      };

      try {
        if (navigator.share && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
          toast({
            title: "Link Copied",
            description: "Review link copied to clipboard!",
          });
        }
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Could not share the review.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="hover:border-trustpurple-500/30 transition-colors group">
      <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
          <h3 className="font-semibold text-base sm:text-lg pr-2">{review.title}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={`${
                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="opacity-50 group-hover:opacity-100 transition-opacity"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-2">
          <span className="text-sm text-trustpurple-400 font-medium">{review.companyName}</span>
          <div className="flex items-center gap-2 flex-wrap">
            {review.verified && (
              <div className="flex items-center text-xs text-emerald-600">
                <CheckCircle size={12} className="mr-1" />
                <span className="hidden sm:inline">Verified Review</span>
                <span className="sm:hidden">Verified</span>
              </div>
            )}
            {review.gitcoinScore !== undefined && (
              <div className="flex items-center text-xs text-blue-600">
                <Shield size={12} className="mr-1" />
                <span>Gitcoin: {review.gitcoinScore.toFixed(1)}/100</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{review.content}</p>

        {/* Voting and Actions - Only for wallet-connected users */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant={userVote === 'up' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleVote('up')}
              disabled={!isWalletConnected}
              className="flex items-center gap-1"
              title={!isWalletConnected ? "Connect wallet to vote" : ""}
            >
              <ThumbsUp size={14} />
              <span>{localUpvotes}</span>
            </Button>
            <Button
              variant={userVote === 'down' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => handleVote('down')}
              disabled={!isWalletConnected}
              className="flex items-center gap-1"
              title={!isWalletConnected ? "Connect wallet to vote" : ""}
            >
              <ThumbsDown size={14} />
              <span>{localDownvotes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1"
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">Comments</span>
              <span className="sm:hidden">({review.comments?.length || 0})</span>
            </Button>
          </div>
          {isWalletConnected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFlag}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
            >
              <Flag size={14} />
              <span className="hidden sm:inline">Flag</span>
            </Button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t pt-4 space-y-3">
            {/* Existing Comments */}
            {review.comments && review.comments.length > 0 && (
              <div className="space-y-3">
                {review.comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment - Only for wallet-connected users */}
            {isWalletConnected ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={isSubmittingComment || !newComment.trim()}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 border-2 border-dashed border-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to interact with reviews and add comments
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 px-3 sm:px-6 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>by {formatAddress(review.reviewerAddress)}</span>
          {review.trustScore !== undefined && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
              Trust: {review.trustScore}/100
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>{formatDistanceToNow(new Date(review.date), { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
