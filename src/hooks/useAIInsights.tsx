import { useMemo } from 'react';

interface AnalyticsOverview {
  totalReviews: number;
  avgRating: number;
  totalCompanies: number;
  totalCategories: number;
}

interface CategoryData {
  category: string;
  reviewCount: number;
  avgRating: number;
  color: string;
}

interface DailyData {
  date: string;
  reviews: number;
  rating: number;
}

interface AIInsight {
  type: 'positive' | 'warning' | 'growth' | 'trend' | 'neutral' | 'empty';
  title: string;
  message: string;
  action: string;
  confidence?: number;
  impact?: 'high' | 'medium' | 'low';
}

export const useAIInsights = (
  overview: AnalyticsOverview,
  categoryData: CategoryData[],
  dailyData: DailyData[]
): AIInsight[] => {
  return useMemo(() => {
    const insights: AIInsight[] = [];
    
    // Empty state
    if (overview.totalReviews === 0) {
      return [{
        type: "empty",
        title: "🚀 Analytics Ready to Launch",
        message: "Your intelligent dashboard is configured and waiting for the first blockchain-verified review submissions.",
        action: "encourage_reviews",
        confidence: 100,
        impact: "high"
      }];
    }

    // Quality Analysis
    if (overview.avgRating >= 4.5) {
      insights.push({
        type: "positive",
        title: "🌟 Exceptional User Satisfaction",
        message: `Outstanding ${overview.avgRating}/5 rating across ${overview.totalReviews} verified reviews indicates superior service quality.`,
        action: "maintain_excellence",
        confidence: 95,
        impact: "high"
      });
    } else if (overview.avgRating >= 4.0) {
      insights.push({
        type: "positive",
        title: "✅ Strong Performance",
        message: `Solid ${overview.avgRating}/5 average rating shows consistent quality with room for optimization.`,
        action: "optimize_quality",
        confidence: 85,
        impact: "medium"
      });
    } else if (overview.avgRating < 3.5) {
      insights.push({
        type: "warning",
        title: "⚠️ Quality Improvement Needed",
        message: `Current ${overview.avgRating}/5 rating suggests addressing user concerns. Focus on top-performing categories for best practices.`,
        action: "quality_intervention",
        confidence: 90,
        impact: "high"
      });
    }

    // Category Dominance Analysis
    if (categoryData.length > 0) {
      const topCategory = categoryData[0];
      const categoryPercentage = Math.round((topCategory.reviewCount / overview.totalReviews) * 100);
      
      if (categoryPercentage > 50) {
        insights.push({
          type: "trend",
          title: "📊 Market Concentration Alert",
          message: `${topCategory.category} dominates with ${categoryPercentage}% market share. Consider diversification strategies.`,
          action: "diversify_portfolio",
          confidence: 88,
          impact: "medium"
        });
      } else if (categoryPercentage > 30) {
        insights.push({
          type: "trend",
          title: "🎯 Category Leadership",
          message: `${topCategory.category} leads with ${categoryPercentage}% share and ${topCategory.avgRating}/5 rating - strong market position.`,
          action: "leverage_strength",
          confidence: 85,
          impact: "medium"
        });
      }

      // Quality variance analysis
      const ratingVariance = Math.max(...categoryData.map(c => c.avgRating)) - Math.min(...categoryData.map(c => c.avgRating));
      if (ratingVariance > 1.5) {
        const poorCategories = categoryData.filter(c => c.avgRating < overview.avgRating - 0.5);
        if (poorCategories.length > 0) {
          insights.push({
            type: "warning",
            title: "📈 Inconsistent Quality Detected",
            message: `${poorCategories.length} categories underperforming average. Focus improvement efforts on these sectors.`,
            action: "target_improvement",
            confidence: 82,
            impact: "medium"
          });
        }
      }
    }

    // Growth Trend Analysis
    if (dailyData.length >= 7) {
      const recent = dailyData.slice(-3);
      const earlier = dailyData.slice(-7, -3);
      
      if (recent.length > 0 && earlier.length > 0) {
        const recentAvg = recent.reduce((sum, day) => sum + day.reviews, 0) / recent.length;
        const earlierAvg = earlier.reduce((sum, day) => sum + day.reviews, 0) / earlier.length;
        
        if (recentAvg > earlierAvg * 1.3) {
          insights.push({
            type: "growth",
            title: "🚀 Accelerating Growth Detected",
            message: `Review velocity increased ${Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100)}% in recent days. Momentum building strong.`,
            action: "capitalize_growth",
            confidence: 87,
            impact: "high"
          });
        } else if (recentAvg < earlierAvg * 0.7) {
          insights.push({
            type: "warning",
            title: "📉 Declining Activity Trend",
            message: `Review submissions decreased ${Math.round(((earlierAvg - recentAvg) / earlierAvg) * 100)}% recently. Consider engagement initiatives.`,
            action: "boost_engagement",
            confidence: 83,
            impact: "medium"
          });
        }
      }

      // Rating trend analysis
      const recentRating = recent.reduce((sum, day) => sum + day.rating, 0) / recent.length;
      const earlierRating = earlier.reduce((sum, day) => sum + day.rating, 0) / earlier.length;
      
      if (recentRating > earlierRating + 0.3) {
        insights.push({
          type: "positive",
          title: "⭐ Quality Improvement Trend",
          message: `Average rating improved from ${earlierRating.toFixed(1)} to ${recentRating.toFixed(1)} recently. User satisfaction increasing.`,
          action: "maintain_trajectory",
          confidence: 81,
          impact: "medium"
        });
      }
    }

    // Volume Analysis
    if (overview.totalReviews >= 100) {
      insights.push({
        type: "positive",
        title: "🎉 Significant Data Milestone",
        message: `${overview.totalReviews} verified reviews provide statistically significant insights for confident decision-making.`,
        action: "leverage_insights",
        confidence: 95,
        impact: "high"
      });
    } else if (overview.totalReviews >= 50) {
      insights.push({
        type: "neutral",
        title: "📊 Building Dataset Strength",
        message: `${overview.totalReviews} reviews establish good foundation. More data will enhance AI prediction accuracy.`,
        action: "continue_collection",
        confidence: 75,
        impact: "medium"
      });
    }

    // Market Coverage Analysis
    if (overview.totalCategories >= 8) {
      insights.push({
        type: "positive",
        title: "🌐 Comprehensive Market Coverage",
        message: `${overview.totalCategories} Web3 sectors covered demonstrates broad ecosystem engagement and market understanding.`,
        action: "maintain_diversity",
        confidence: 88,
        impact: "medium"
      });
    }

    // Default neutral insight if no specific patterns detected
    if (insights.length === 0) {
      insights.push({
        type: "neutral",
        title: "📈 Steady Platform Growth",
        message: "Platform showing consistent progress with balanced review activity across sectors and quality metrics.",
        action: "maintain_momentum",
        confidence: 70,
        impact: "medium"
      });
    }

    // Sort by impact and confidence
    return insights.sort((a, b) => {
      const impactScore = (insight: AIInsight) => 
        insight.impact === 'high' ? 3 : insight.impact === 'medium' ? 2 : 1;
      
      const aScore = impactScore(a) * (a.confidence || 50);
      const bScore = impactScore(b) * (b.confidence || 50);
      
      return bScore - aScore;
    });
  }, [overview, categoryData, dailyData]);
};

export default useAIInsights;