
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import ReviewCardHeader from './card/ReviewCardHeader';
import ReviewCardContent from './card/ReviewCardContent';
import ReviewCardAttachments from './card/ReviewCardAttachments';
import ReviewCardActions from './card/ReviewCardActions';
import ReviewCardComments from './card/ReviewCardComments';
import ReviewCardFooter from './card/ReviewCardFooter';

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
    attachments?: Array<{
      id: string;
      filename: string;
      fileType: string;
      fileSize: number;
      url?: string;
    }>;
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
      if (userVote === voteType) {
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
        if (userVote) {
          if (userVote === 'up') {
            setLocalUpvotes(prev => prev - 1);
            setLocalDownvotes(prev => prev + 1);
          } else {
            setLocalDownvotes(prev => prev - 1);
            setLocalUpvotes(prev => prev + 1);
          }
        } else {
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
        <ReviewCardHeader
          title={review.title}
          rating={review.rating}
          onShare={handleShare}
        />
        
        <ReviewCardContent
          companyName={review.companyName}
          content={review.content}
          verified={review.verified}
          gitcoinScore={review.gitcoinScore}
        />

        <ReviewCardAttachments attachments={review.attachments} />

        <ReviewCardActions
          upvotes={localUpvotes}
          downvotes={localDownvotes}
          userVote={userVote}
          isWalletConnected={isWalletConnected}
          commentsCount={review.comments?.length || 0}
          showComments={showComments}
          onVote={handleVote}
          onToggleComments={() => setShowComments(!showComments)}
          onFlag={handleFlag}
        />

        <ReviewCardComments
          comments={review.comments}
          showComments={showComments}
          isWalletConnected={isWalletConnected}
          newComment={newComment}
          isSubmittingComment={isSubmittingComment}
          onCommentChange={setNewComment}
          onSubmitComment={handleSubmitComment}
        />
      </CardContent>
      
      <ReviewCardFooter
        reviewerAddress={review.reviewerAddress}
        trustScore={review.trustScore}
        date={review.date}
      />
    </Card>
  );
};

export default ReviewCard;
