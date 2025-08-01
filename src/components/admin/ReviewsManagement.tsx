
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, CheckCircle, XCircle, Download } from 'lucide-react';
import { Review, ReviewStatus } from '@/types/admin';

interface ReviewsManagementProps {
  status: ReviewStatus;
  isAdmin: boolean;
}

const ReviewsManagement: React.FC<ReviewsManagementProps> = ({ status, isAdmin }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  // Fetch reviews based on status
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['admin-reviews', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!isAdmin && ['pending', 'approved', 'rejected'].includes(status)
  });

  // Update review status mutation
  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, status, notes }: { reviewId: string, status: ReviewStatus, notes?: string }) => {
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('reviews')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: session.session?.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reviewId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast({
        title: "Review Updated",
        description: "Review status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update review status.",
        variant: "destructive",
      });
    }
  });

  const handleApprove = (reviewId: string) => {
    updateReviewMutation.mutate({ 
      reviewId, 
      status: 'approved', 
      notes: adminNotes[reviewId] 
    });
  };

  const handleReject = (reviewId: string) => {
    updateReviewMutation.mutate({ 
      reviewId, 
      status: 'rejected', 
      notes: adminNotes[reviewId] 
    });
  };

  const downloadProofFile = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('review-proofs')
        .download(fileUrl);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download proof file.",
        variant: "destructive",
      });
    }
  };

  if (reviewsLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustpurple-500"></div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No {status} reviews found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {review.title}
                  <Badge variant={
                    review.status === 'approved' ? 'default' :
                    review.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {review.status}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.company_name} • {review.category}
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-right">
                <div>Submitted: {new Date(review.created_at).toLocaleDateString()}</div>
                <div>Wallet: {review.wallet_address.substring(0, 8)}...</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{review.content}</p>
            
            {review.proof_file_url && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadProofFile(review.proof_file_url!, review.proof_file_name!)}
                  className="flex items-center gap-2"
                >
                  <Download size={14} />
                  Download Proof: {review.proof_file_name}
                </Button>
              </div>
            )}

            {review.status === 'pending' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={`notes-${review.id}`} className="block text-sm font-medium mb-2">
                    Admin Notes (Optional)
                  </label>
                  <Textarea
                    id={`notes-${review.id}`}
                    placeholder="Add notes about this review..."
                    value={adminNotes[review.id] || ''}
                    onChange={(e) => setAdminNotes(prev => ({
                      ...prev,
                      [review.id]: e.target.value
                    }))}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(review.id)}
                    disabled={updateReviewMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(review.id)}
                    disabled={updateReviewMutation.isPending}
                    variant="destructive"
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}

            {review.admin_notes && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-1">Admin Notes:</h4>
                <p className="text-sm">{review.admin_notes}</p>
                {review.reviewed_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Reviewed on {new Date(review.reviewed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsManagement;
