import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { web3Categories } from '@/data/web3Categories';

interface AnalyticsOverview {
  totalReviews: number;
  avgRating: number;
  totalCompanies: number;
  uniqueReviewers: number;
  dailyAverage: number;
  reviewsThisMonth: number;
}

interface CategoryData {
  category: string;
  reviewCount: number;
  avgRating: number;
  color: string;
}

interface NetworkData {
  date: string;
  reviews: number;
  rating: number;
}

interface CompanyData {
  companyName: string;
  reviewCount: number;
  avgRating: number;
}

export const useAnalyticsData = () => {
  const [overview, setOverview] = useState<AnalyticsOverview>({
    totalReviews: 0,
    avgRating: 0,
    totalCompanies: 0,
    uniqueReviewers: 0,
    dailyAverage: 0,
    reviewsThisMonth: 0
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Color palette for charts
  const colorPalette = [
    "#7b58f6", "#2c9fff", "#22c55e", "#f59e0b", "#ef4444", 
    "#8b5cf6", "#06b6d4", "#f97316", "#84cc16", "#ec4899"
  ];

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews data
      const { data: overviewData, error: overviewError } = await supabase
        .from('reviews')
        .select('id, rating, company_name, category, user_id, created_at')
        .eq('status', 'approved');

      if (overviewError) throw overviewError;

      // Fetch daily trends data  
      const { data: dailyTrends, error: dailyError } = await supabase
        .from('reviews')
        .select('created_at, rating')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);

      if (dailyError) throw dailyError;

      if (overviewData && overviewData.length > 0) {
        const totalReviews = overviewData.length;
        const avgRating = overviewData.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        const uniqueCompanies = new Set(overviewData.map(r => r.company_name)).size;
        const uniqueReviewers = new Set(overviewData.filter(r => r.user_id).map(r => r.user_id)).size;
        
        // Calculate reviews this month
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const reviewsThisMonth = overviewData.filter(r => new Date(r.created_at) >= thisMonth).length;
        
        // Calculate daily average over last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentReviews = overviewData.filter(r => new Date(r.created_at) >= thirtyDaysAgo);
        const dailyAverage = recentReviews.length / 30;

        setOverview({
          totalReviews,
          avgRating: Number(avgRating.toFixed(1)),
          totalCompanies: uniqueCompanies,
          uniqueReviewers,
          dailyAverage: Number(dailyAverage.toFixed(1)),
          reviewsThisMonth
        });

        // Process category data with proper display names
        const categoryMap = new Map<string, { count: number; totalRating: number }>();
        overviewData.forEach(review => {
          const current = categoryMap.get(review.category) || { count: 0, totalRating: 0 };
          categoryMap.set(review.category, {
            count: current.count + 1,
            totalRating: current.totalRating + review.rating
          });
        });

        const categories: CategoryData[] = Array.from(categoryMap.entries()).map(([categoryId, data], index) => {
          const categoryInfo = web3Categories.find(cat => cat.id === categoryId);
          const displayName = categoryInfo ? categoryInfo.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
          
          return {
            category: displayName,
            reviewCount: data.count,
            avgRating: Number((data.totalRating / data.count).toFixed(1)),
            color: colorPalette[index % colorPalette.length]
          };
        });

        setCategoryData(categories.sort((a, b) => b.reviewCount - a.reviewCount));

        // Process daily trends data
        if (dailyTrends && dailyTrends.length > 0) {
          const dailyMap = new Map<string, { count: number; totalRating: number }>();
          dailyTrends.forEach(review => {
            const date = new Date(review.created_at).toISOString().split('T')[0];
            const current = dailyMap.get(date) || { count: 0, totalRating: 0 };
            dailyMap.set(date, {
              count: current.count + 1,
              totalRating: current.totalRating + review.rating
            });
          });

          const trends: NetworkData[] = Array.from(dailyMap.entries()).map(([date, data]) => ({
            date,
            reviews: data.count,
            rating: Number((data.totalRating / data.count).toFixed(1))
          }));

          setNetworkData(trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } else {
          setNetworkData([]);
        }

        // Process company data
        const companyMap = new Map<string, { count: number; totalRating: number }>();
        overviewData.forEach(review => {
          const current = companyMap.get(review.company_name) || { count: 0, totalRating: 0 };
          companyMap.set(review.company_name, {
            count: current.count + 1,
            totalRating: current.totalRating + review.rating
          });
        });

        const companies: CompanyData[] = Array.from(companyMap.entries()).map(([companyName, data]) => ({
          companyName,
          reviewCount: data.count,
          avgRating: Number((data.totalRating / data.count).toFixed(1))
        }));

        setCompanyData(companies.sort((a, b) => b.reviewCount - a.reviewCount));
      } else {
        // No data available - set empty state
        setOverview({
          totalReviews: 0,
          avgRating: 0,
          totalCompanies: 0,
          uniqueReviewers: 0,
          dailyAverage: 0,
          reviewsThisMonth: 0
        });
        setCategoryData([]);
        setNetworkData([]);
        setCompanyData([]);
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return {
    overview,
    categoryData,
    networkData,
    companyData,
    loading,
    refreshData: fetchAnalyticsData
  };
};