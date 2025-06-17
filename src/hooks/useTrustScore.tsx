
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TrustScoreMetrics {
  upvotes: number;
  downvotes: number;
  comments: number;
  engagements: number;
  shares: number;
  reviewQuality: number;
  communityFeedback: number;
  timeActive: number;
}

interface TrustScoreData {
  score: number;
  level: string;
  metrics: TrustScoreMetrics;
  lastUpdated: number;
}

const TRUST_LEVELS = [
  { min: 0, max: 99, name: 'Newcomer', multiplier: 1.0 },
  { min: 100, max: 299, name: 'Contributor', multiplier: 1.1 },
  { min: 300, max: 599, name: 'Trusted', multiplier: 1.2 },
  { min: 600, max: 999, name: 'Expert', multiplier: 1.3 },
  { min: 1000, max: 1999, name: 'Authority', multiplier: 1.4 },
  { min: 2000, max: Infinity, name: 'Legend', multiplier: 1.5 }
];

export const useTrustScore = () => {
  const { user, isAuthenticated } = useAuth();
  const [trustScoreData, setTrustScoreData] = useState<TrustScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate trust score based on various metrics (hidden algorithm)
  const calculateTrustScore = (metrics: TrustScoreMetrics): number => {
    // Hidden scoring algorithm - users won't see these exact calculations
    const upvoteScore = metrics.upvotes * 5;
    const downvotePenalty = metrics.downvotes * -3;
    const commentBonus = metrics.comments * 2;
    const engagementBonus = metrics.engagements * 1.5;
    const shareBonus = metrics.shares * 3;
    const qualityBonus = metrics.reviewQuality * 10;
    const communityBonus = metrics.communityFeedback * 7;
    const timeBonus = Math.min(metrics.timeActive * 0.5, 50); // Cap at 50 points
    
    // Apply diminishing returns for very high values
    const rawScore = Math.max(0, 
      upvoteScore + 
      downvotePenalty + 
      commentBonus + 
      engagementBonus + 
      shareBonus + 
      qualityBonus + 
      communityBonus + 
      timeBonus
    );
    
    // Apply logarithmic scaling to prevent extreme scores
    return Math.floor(rawScore * Math.log(rawScore + 10) / Math.log(100));
  };

  const getTrustLevel = (score: number) => {
    return TRUST_LEVELS.find(level => score >= level.min && score <= level.max) || TRUST_LEVELS[0];
  };

  const updateTrustScore = (action: string, value: number = 1) => {
    if (!trustScoreData || !user) return;

    const updatedMetrics = { ...trustScoreData.metrics };
    
    switch (action) {
      case 'upvote':
        updatedMetrics.upvotes += value;
        break;
      case 'downvote':
        updatedMetrics.downvotes += value;
        break;
      case 'comment':
        updatedMetrics.comments += value;
        break;
      case 'engagement':
        updatedMetrics.engagements += value;
        break;
      case 'share':
        updatedMetrics.shares += value;
        break;
      case 'quality':
        updatedMetrics.reviewQuality += value;
        break;
      case 'community':
        updatedMetrics.communityFeedback += value;
        break;
    }

    const newScore = calculateTrustScore(updatedMetrics);
    const newLevel = getTrustLevel(newScore);

    const updatedData: TrustScoreData = {
      score: newScore,
      level: newLevel.name,
      metrics: updatedMetrics,
      lastUpdated: Date.now()
    };

    setTrustScoreData(updatedData);
    
    // Save to localStorage
    localStorage.setItem(`trust_score_${user.id}`, JSON.stringify(updatedData));
  };

  const getRewardMultiplier = (score: number): number => {
    const level = getTrustLevel(score);
    return level.multiplier;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoading(true);
      
      // Load existing trust score or initialize new one
      const stored = localStorage.getItem(`trust_score_${user.id}`);
      if (stored) {
        try {
          const parsed: TrustScoreData = JSON.parse(stored);
          setTrustScoreData(parsed);
        } catch (error) {
          console.error('Failed to parse stored trust score:', error);
        }
      }
      
      // Initialize with default values if no data exists
      if (!stored) {
        const initialMetrics: TrustScoreMetrics = {
          upvotes: 0,
          downvotes: 0,
          comments: 0,
          engagements: 0,
          shares: 0,
          reviewQuality: 0,
          communityFeedback: 0,
          timeActive: 1 // Start with 1 day
        };
        
        const initialData: TrustScoreData = {
          score: calculateTrustScore(initialMetrics),
          level: getTrustLevel(0).name,
          metrics: initialMetrics,
          lastUpdated: Date.now()
        };
        
        setTrustScoreData(initialData);
        localStorage.setItem(`trust_score_${user.id}`, JSON.stringify(initialData));
      }
      
      setIsLoading(false);
    } else {
      setTrustScoreData(null);
    }
  }, [isAuthenticated, user]);

  return {
    trustScoreData,
    isLoading,
    updateTrustScore,
    getRewardMultiplier,
    getTrustLevel: (score: number) => getTrustLevel(score).name
  };
};
