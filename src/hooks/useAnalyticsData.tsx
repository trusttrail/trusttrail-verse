import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    totalCategories: 0
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
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
      
      // Fetch overview data
      const { data: overviewData, error: overviewError } = await supabase
        .from('reviews')
        .select('id, rating, company_name, category')
        .eq('status', 'approved');

      if (overviewError) throw overviewError;

      if (overviewData && overviewData.length > 0) {
        const totalReviews = overviewData.length;
        const avgRating = overviewData.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        const uniqueCompanies = new Set(overviewData.map(r => r.company_name)).size;
        const uniqueCategories = new Set(overviewData.map(r => r.category)).size;

        setOverview({
          totalReviews,
          avgRating: Number(avgRating.toFixed(1)),
          totalCompanies: uniqueCompanies,
          totalCategories: uniqueCategories
        });

        // Process category data
        const categoryMap = new Map<string, { count: number; totalRating: number }>();
        overviewData.forEach(review => {
          const current = categoryMap.get(review.category) || { count: 0, totalRating: 0 };
          categoryMap.set(review.category, {
            count: current.count + 1,
            totalRating: current.totalRating + review.rating
          });
        });

        const categories: CategoryData[] = Array.from(categoryMap.entries()).map(([category, data], index) => ({
          category,
          reviewCount: data.count,
          avgRating: Number((data.totalRating / data.count).toFixed(1)),
          color: colorPalette[index % colorPalette.length]
        }));

        setCategoryData(categories.sort((a, b) => b.reviewCount - a.reviewCount));

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
          totalCategories: 0
        });
        setCategoryData([]);
        setCompanyData([]);
      }

      // Fetch daily data
      const { data: dailyReviews, error: dailyError } = await supabase
        .from('reviews')
        .select('created_at, rating')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);

      if (dailyError) throw dailyError;

      if (dailyReviews && dailyReviews.length > 0) {
        const dailyMap = new Map<string, { count: number; totalRating: number }>();
        dailyReviews.forEach(review => {
          const date = new Date(review.created_at).toISOString().split('T')[0];
          const current = dailyMap.get(date) || { count: 0, totalRating: 0 };
          dailyMap.set(date, {
            count: current.count + 1,
            totalRating: current.totalRating + review.rating
          });
        });

        const daily: DailyData[] = Array.from(dailyMap.entries()).map(([date, data]) => ({
          date,
          reviews: data.count,
          rating: Number((data.totalRating / data.count).toFixed(1))
        }));

        setDailyData(daily.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } else {
        setDailyData([]);
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
    dailyData,
    companyData,
    loading,
    refreshData: fetchAnalyticsData
  };
};