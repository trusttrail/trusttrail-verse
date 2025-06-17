
import { useToast } from '@/hooks/use-toast';

export const useReviewSharing = () => {
  const { toast } = useToast();

  const shareReview = async (review: { companyName: string; title: string }) => {
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
      console.error('Error sharing:', error);
      toast({
        title: "Share Failed",
        description: "Could not share the review. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { shareReview };
};
