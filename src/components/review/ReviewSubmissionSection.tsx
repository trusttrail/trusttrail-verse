
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewSubmissionSectionProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  isTransacting: boolean;
  isVerifying: boolean;
  filesLength: number;
  onSubmit: (e: React.FormEvent) => void;
}

const ReviewSubmissionSection = ({
  isFormValid,
  isSubmitting,
  isTransacting,
  isVerifying,
  filesLength,
  onSubmit,
}: ReviewSubmissionSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isSubmitting || isTransacting || isVerifying}
          className="w-full sm:w-auto min-w-48"
          onClick={onSubmit}
        >
          {isSubmitting || isTransacting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              {isTransacting ? 'Confirming Transaction...' : 'Submitting Review...'}
            </>
          ) : (
            'Submit Review to Blockchain'
          )}
        </Button>
        
        {!isFormValid && (
          <p className="text-sm text-muted-foreground text-center">
            Complete all requirements above to submit your review
          </p>
        )}
        
        {isFormValid && filesLength === 0 && (
          <p className="text-sm text-orange-600 text-center">
            Please upload at least one proof document for blockchain submission
          </p>
        )}
      </div>
      
      {isTransacting && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please confirm the transaction in your MetaMask wallet. A small POL fee will be required for the Polygon Amoy network.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReviewSubmissionSection;
