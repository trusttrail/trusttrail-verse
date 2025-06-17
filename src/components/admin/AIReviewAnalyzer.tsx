
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, Shield, AlertTriangle, CheckCircle, 
  TrendingUp, Users, Eye, BarChart3 
} from "lucide-react";

interface ReviewAnalysis {
  reviewId: string;
  content: string;
  author: string;
  company: string;
  aiScore: number;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
  status: 'safe' | 'suspicious' | 'high-risk';
}

const AIReviewAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<ReviewAnalysis[]>([]);

  // Mock AI analysis function - in production, this would call your AI service
  const analyzeReviews = async () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults: ReviewAnalysis[] = [
      {
        reviewId: "rev_001",
        content: "Amazing platform, really love using it daily for my crypto needs...",
        author: "0x1234...5678",
        company: "QuickSwap",
        aiScore: 85,
        riskFactors: ["Generic language patterns", "Limited specific details"],
        recommendations: ["Request additional verification", "Cross-check with other reviews"],
        confidence: 78,
        status: 'suspicious'
      },
      {
        reviewId: "rev_002", 
        content: "I've been using QuickSwap for 6 months for LP farming. The UI is intuitive and gas fees are consistently low. Had one issue with slippage during high volatility but support resolved it quickly...",
        author: "0x9876...4321",
        company: "Quick Swap",
        aiScore: 94,
        riskFactors: [],
        recommendations: ["Approve review", "Consider featuring as quality example"],
        confidence: 92,
        status: 'safe'
      },
      {
        reviewId: "rev_003",
        content: "Best exchange ever! 10/10 would recommend to everyone! Amazing amazing amazing!!!",
        author: "0xabcd...ef12",
        company: "Generic Exchange",
        aiScore: 23,
        riskFactors: ["Excessive enthusiasm", "Repetitive language", "Lack of specifics", "Generic praise"],
        recommendations: ["Reject review", "Flag user for manual review", "Check for bot activity"],
        confidence: 96,
        status: 'high-risk'
      }
    ];
    
    setResults(mockResults);
    setAnalyzing(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'high-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'safe': return <CheckCircle className="text-green-500" size={16} />;
      case 'suspicious': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'high-risk': return <Shield className="text-red-500" size={16} />;
      default: return <Eye className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="text-blue-500" size={24} />
            AI-Powered Review Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                Our AI system analyzes review content, user behavior patterns, and linguistic markers to detect potentially fake or suspicious reviews. This reduces manual review workload by up to 80%.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <BarChart3 className="mx-auto text-blue-500 mb-2" size={32} />
                <p className="font-semibold">94.2%</p>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="mx-auto text-green-500 mb-2" size={32} />
                <p className="font-semibold">80%</p>
                <p className="text-sm text-muted-foreground">Workload Reduction</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Users className="mx-auto text-purple-500 mb-2" size={32} />
                <p className="font-semibold">1,247</p>
                <p className="text-sm text-muted-foreground">Reviews Analyzed</p>
              </div>
            </div>
            
            <Button 
              onClick={analyzeReviews} 
              disabled={analyzing}
              className="w-full"
            >
              {analyzing ? 'Analyzing Reviews...' : 'Run AI Analysis'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.reviewId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Review #{result.reviewId}</span>
                      {getStatusIcon(result.status)}
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      AI Score: {result.aiScore}/100
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p><strong>Company:</strong> {result.company}</p>
                    <p><strong>Author:</strong> {result.author}</p>
                    <p className="mt-2"><strong>Content:</strong> {result.content}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm mb-1">Confidence Level</p>
                      <Progress value={result.confidence} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{result.confidence}% confident</p>
                    </div>
                  </div>
                  
                  {result.riskFactors.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Risk Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {result.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-sm mb-2">AI Recommendations:</p>
                    <ul className="text-sm space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
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

export default AIReviewAnalyzer;
