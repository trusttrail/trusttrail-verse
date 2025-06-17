
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
  gitcoinScore: number;
}

interface TrustScoreData {
  score: number;
  level: string;
  metrics: TrustScoreMetrics;
  lastUpdated: number;
}

const TRUST_LEVELS = [
  { min: 0, max: 19, name: 'Newcomer', multiplier: 1.0 },
  { min: 20, max: 39, name: 'Contributor', multiplier: 1.1 },
  { min: 40, max: 59, name: 'Trusted', multiplier: 1.2 },
  { min: 60, max: 79, name: 'Expert', multiplier: 1.3 },
  { min: 80, max: 94, name: 'Authority', multiplier: 1.4 },
  { min: 95, max: 100, name: 'Legend', multiplier: 1.5 }
];

export const useTrustScore = () => {
  const { user, isAuthenticated } = useAuth();
  const [trustScoreData, setTrustScoreData] = useState<TrustScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced trust score calculation (Reddit-style karma system, 0-100 scale)
  const calculateTrustScore = (metrics: TrustScoreMetrics): number => {
    // Vote-based score (Reddit algorithm approach)
    const totalVotes = metrics.upvotes + metrics.downvotes;
    let voteScore = 0;
    
    if (totalVotes > 0) {
      const ratio = metrics.upvotes / totalVotes;
      const confidence = Math.min(totalVotes / 50, 1); // Confidence builds with more votes
      voteScore = (ratio * 2 - 1) * confidence * 30; // -30 to +30 range
    }
    
    // Engagement and quality bonuses
    const commentBonus = Math.log(metrics.comments + 1) * 8; // Logarithmic scaling
    const engagementBonus = Math.log(metrics.engagements + 1) * 5;
    const shareBonus = Math.log(metrics.shares + 1) * 6;
    const qualityBonus = Math.min(metrics.reviewQuality * 0.8, 15);
    const communityBonus = Math.min(metrics.communityFeedback * 0.6, 12);
    
    // Time active bonus (experience)
    const timeBonus = Math.min(Math.log(metrics.timeActive + 1) * 3, 10);
    
    // Gitcoin verification bonus
    const gitcoinBonus = Math.min(metrics.gitcoinScore * 0.15, 15);
    
    // Base score for participation
    const baseScore = 25;
    
    // Calculate raw score
    const rawScore = baseScore + voteScore + commentBonus + engagementBonus + 
                    shareBonus + qualityBonus + communityBonus + timeBonus + gitcoinBonus;
    
    // Apply sigmoid-like curve to prevent extreme scores and ensure 0-100 range
    const normalizedScore = 100 / (1 + Math.exp(-(rawScore - 50) / 15));
    
    return Math.max(0, Math.min(100, Math.round(normalizedScore)));
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
      case 'gitcoin_update':
        updatedMetrics.gitcoinScore = value;
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
          timeActive: 1, // Start with 1 day
          gitcoinScore: 0 // Will be updated when passport is verified
        };
        
        const initialData: TrustScoreData = {
          score: calculateTrustScore(initialMetrics),
          level: getTrustLevel(calculateTrustScore(initialMetrics)).name,
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
