
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface VerificationTimerProps {
  initialTime: number;
  onResend: () => void;
  isLoading?: boolean;
}

const VerificationTimer = ({ initialTime, onResend, isLoading = false }: VerificationTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    setTimeLeft(initialTime);
    setCanResend(false);
    onResend();
  };

  return (
    <div className="text-center">
      {!canResend ? (
        <div className="text-sm text-gray-600">
          <p>Didn't receive the code?</p>
          <p className="font-mono text-lg text-blue-600 mt-1">
            Resend available in {formatTime(timeLeft)}
          </p>
        </div>
      ) : (
        <Button
          type="button"
          variant="link"
          onClick={handleResend}
          disabled={isLoading}
          className="text-sm"
        >
          {isLoading ? 'Sending...' : 'Resend verification code'}
        </Button>
      )}
    </div>
  );
};

export default VerificationTimer;
