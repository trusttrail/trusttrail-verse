import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

interface ReviewCardCommentsProps {
  comments?: Comment[];
  showComments: boolean;
  isWalletConnected: boolean;
  newComment: string;
  isSubmittingComment: boolean;
  onCommentChange: (value: string) => void;
  onSubmitComment: () => void;
}

const ReviewCardComments = ({
  comments,
  showComments,
  isWalletConnected,
  newComment,
  isSubmittingComment,
  onCommentChange,
  onSubmitComment
}: ReviewCardCommentsProps) => {
  if (!showComments) {
    return null;
  }

  return (
    <div className="border-t pt-4 space-y-3">
      {/* Existing Comments */}
      {comments && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
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
            onChange={(e) => onCommentChange(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={onSubmitComment}
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
  );
};

export default ReviewCardComments;
