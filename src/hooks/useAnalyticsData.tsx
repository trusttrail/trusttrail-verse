import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { web3Categories } from '@/data/web3Categories';

interface AnalyticsOverview {
  totalReviews: number;
  avgRating: number;
  totalCompanies: number;
  uniqueSignups: number;
  activeWallets: number;
  totalStaked: number;
  feesGenerated: number;
}

interface CategoryData {
  category: string;
  reviewCount: number;
  avgRating: number;
  color: string;
}

interface NetworkData {
  network: string;
  reviewCount: number;
  avgRating: number;
  color: string;
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
    uniqueSignups: 0,
    activeWallets: 0,
    totalStaked: 0,
    feesGenerated: 0
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
        .select('id, rating, company_name, category, user_id')
        .eq('status', 'approved');

      if (overviewError) throw overviewError;

      // Fetch user signups data
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (userError) throw userError;

      // Mock data for business metrics (replace with actual queries when tables exist)
      const mockActiveWallets = 1250;
      const mockStaked = 125000;
      const mockFees = 2500;

      if (overviewData && overviewData.length > 0) {
        const totalReviews = overviewData.length;
        const avgRating = overviewData.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        const uniqueCompanies = new Set(overviewData.map(r => r.company_name)).size;
        const uniqueSignups = userData?.length || 0;

        setOverview({
          totalReviews,
          avgRating: Number(avgRating.toFixed(1)),
          totalCompanies: uniqueCompanies,
          uniqueSignups,
          activeWallets: mockActiveWallets,
          totalStaked: mockStaked,
          feesGenerated: mockFees
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

        // Process network data (using mock data for now)
        const networkMockData = [
          { network: 'Optimism', reviewCount: Math.floor(totalReviews * 0.6), avgRating: avgRating + 0.1, color: colorPalette[0] },
          { network: 'Polygon', reviewCount: Math.floor(totalReviews * 0.4), avgRating: avgRating - 0.1, color: colorPalette[1] }
        ];

        setNetworkData(networkMockData);

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
          uniqueSignups: userData?.length || 0,
          activeWallets: mockActiveWallets,
          totalStaked: mockStaked,
          feesGenerated: mockFees
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