
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

export const DeploymentTester: React.FC = () => {
  const { web3Service, isConnected, address } = useWeb3();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  
  const [testReview, setTestReview] = useState({
    companyName: 'Test Company Ltd',
    category: 'Technology',
    rating: 5,
    content: 'This is a test review for deployment verification.',
    proofNote: 'Test proof documentation'
  });

  const runDeploymentTests = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to run tests.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const results: any[] = [];

    try {
      // Test 1: Check contract addresses
      results.push({
        test: "Contract Addresses",
        status: "running",
        details: "Checking if contracts are deployed..."
      });
      setTestResults([...results]);

      const contractAddresses = web3Service.getContractAddresses();
      const hasValidAddresses = contractAddresses.reviewPlatform !== '0x0000000000000000000000000000000000000000';
      
      results[0] = {
        test: "Contract Addresses",
        status: hasValidAddresses ? "success" : "failed",
        details: hasValidAddresses 
          ? `Reviews: ${contractAddresses.reviewPlatform}, Token: ${contractAddresses.rewardToken}`
          : "Contract addresses not updated after deployment"
      };
      setTestResults([...results]);

      if (!hasValidAddresses) {
        throw new Error("Contracts not deployed or addresses not updated");
      }

      // Test 2: Check token balance reading
      results.push({
        test: "Token Balance",
        status: "running",
        details: "Reading token balance..."
      });
      setTestResults([...results]);

      try {
        const balance = await web3Service.getTokenBalance(address);
        results[1] = {
          test: "Token Balance",
          status: "success",
          details: `Current balance: ${parseFloat(balance).toFixed(4)} TRUST tokens`
        };
      } catch (error) {
        results[1] = {
          test: "Token Balance",
          status: "failed",
          details: `Failed to read token balance: ${error}`
        };
      }
      setTestResults([...results]);

      // Test 3: Submit test review
      results.push({
        test: "Review Submission",
        status: "running",
        details: "Submitting test review..."
      });
      setTestResults([...results]);

      try {
        const reviewData = {
          companyName: testReview.companyName,
          category: testReview.category,
          ipfsHash: `QmTest${Date.now()}`, // Mock IPFS hash
          proofIpfsHash: `QmProof${Date.now()}`, // Mock proof hash
          rating: testReview.rating
        };

        const txHash = await web3Service.submitReview(reviewData);
        results[2] = {
          test: "Review Submission",
          status: "success",
          details: `Review submitted! Transaction: ${txHash}`
        };
        
        toast({
          title: "Test Review Submitted",
          description: "Check the blockchain explorer for confirmation.",
        });
      } catch (error) {
        results[2] = {
          test: "Review Submission",
          status: "failed",
          details: `Failed to submit review: ${error}`
        };
      }
      setTestResults([...results]);

      // Test 4: Network detection
      results.push({
        test: "Network Detection",
        status: "success",
        details: `Connected to: ${web3Service.getCurrentNetwork()}`
      });
      setTestResults([...results]);

    } catch (error) {
      console.error('Deployment test failed:', error);
      toast({
        title: "Test Failed",
        description: `Deployment test encountered an error: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      failed: "destructive",
      running: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Deployment Testing Suite
          </CardTitle>
          <CardDescription>
            Test your deployed smart contracts to ensure everything is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Test Company Name</label>
              <Input
                value={testReview.companyName}
                onChange={(e) => setTestReview({...testReview, companyName: e.target.value})}
                placeholder="Enter company name for test"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Test Category</label>
              <Input
                value={testReview.category}
                onChange={(e) => setTestReview({...testReview, category: e.target.value})}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Test Review Content</label>
            <Textarea
              value={testReview.content}
              onChange={(e) => setTestReview({...testReview, content: e.target.value})}
              placeholder="Enter test review content"
              rows={3}
            />
          </div>

          <Button
            onClick={runDeploymentTests}
            disabled={!isConnected || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Running Tests..." : "Run Deployment Tests"}
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results from your deployment testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeploymentTester;
