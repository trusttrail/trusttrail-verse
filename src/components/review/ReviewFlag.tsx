
import React, { useState } from 'react';
import { Flag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ReviewFlagProps {
  reviewId: string;
  onFlag?: (reviewI: string, reason: string, details: string) => void;
}

const FLAG_REASONS = [
  { value: 'spam', label: 'Spam or Promotional Content' },
  { value: 'harassment', label: 'Harassment or Bullying' },
  { value: 'hate_speech', label: 'Hate Speech or Discrimination' },
  { value: 'illegal', label: 'Promotion of Illegal Activities' },
  { value: 'personal_attack', label: 'Personal Attack or Doxxing' },
  { value: 'misinformation', label: 'False or Misleading Information' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'other', label: 'Other Violation' }
];

const ReviewFlag: React.FC<ReviewFlagProps> = ({ reviewId, onFlag }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFlag = async () => {
    if (!selectedReason) {
      toast({
        title: "Please Select a Reason",
        description: "You must select a reason for flagging this review.",
        variant: "destructive",
      });
      return;
    }

    if (selectedReason === 'other' && !details.trim()) {
      toast({
        title: "Please Provide Details",
        description: "Please provide details for 'Other Violation'.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // In production, this would send to AI/ML moderation system first
      console.log('Flagging review:', {
        reviewId,
        reason: selectedReason,
        details: details.trim(),
        timestamp: Date.now()
      });
      
      // Simulate AI/ML review process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the parent callback if provided
      if (onFlag) {
        onFlag(reviewId, selectedReason, details.trim());
      }
      
      toast({
        title: "Review Flagged Successfully",
        description: "Thank you for reporting. Our AI moderation system will review this content.",
      });
      
      // Reset form and close dialog
      setSelectedReason('');
      setDetails('');
      setIsOpen(false);
      
    } catch (error) {
      console.error('Failed to flag review:', error);
      toast({
        title: "Failed to Flag Review",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
        >
          <Flag size={16} />
          Flag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle size={20} />
            Flag Review
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please select the reason for flagging this review. All reports are first processed by our AI moderation system.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for flagging *</label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {FLAG_REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Additional Details {selectedReason === 'other' && '*'}
            </label>
            <Textarea
              placeholder="Provide additional context for your report..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFlag}
              disabled={isSubmitting || !selectedReason}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewFlag;
