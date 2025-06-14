
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ExternalLink, AlertCircle } from "lucide-react";
import { useWeb3 } from '@/hooks/useWeb3';

interface TransactionStatusProps {
  txHash: string;
  title: string;
  description: string;
  onComplete?: () => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  txHash,
  title,
  description,
  onComplete
}) => {
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const { web3Service } = useWeb3();

  useEffect(() => {
    const checkTransaction = async () => {
      try {
        // This is a simplified check - in a real implementation,
        // you'd poll the blockchain for transaction status
        setTimeout(() => {
          setStatus('confirmed');
          if (onComplete) {
            onComplete();
          }
        }, 3000); // Simulate 3 second confirmation time
      } catch (error) {
        console.error('Transaction failed:', error);
        setStatus('failed');
      }
    };

    if (txHash) {
      checkTransaction();
    }
  }, [txHash, onComplete]);

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500 animate-spin" />;
      case 'confirmed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending...';
      case 'confirmed':
        return 'Transaction Confirmed!';
      case 'failed':
        return 'Transaction Failed';
      default:
        return 'Processing...';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{getStatusText()}</span>
        </div>
        
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">Transaction Hash:</p>
          <p className="text-sm font-mono break-all">{txHash}</p>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(web3Service.getExplorerUrl(txHash), '_blank')}
        >
          <ExternalLink size={16} className="mr-2" />
          View on Polygonscan
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionStatus;
