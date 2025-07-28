import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RealCompany {
  name: string;
  reviewCount: number;
  averageRating: number;
  category: string;
  latestReviewDate: string;
  logo: string;
}

// Official company logos from trusted sources
const COMPANY_LOGOS: Record<string, string> = {
  'Binance': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  'PancakeSwap': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
  'Ethereum': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  'OpenSea': 'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png',
  'Dreamstarter.xyz': 'https://pbs.twimg.com/profile_images/1673628171051331584/5Wf5ZMcF_400x400.jpg',
  'Pump.fun': 'https://pbs.twimg.com/profile_images/1798409590515642368/uHoVg8EH_400x400.jpg',
  'Uniswap': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
  'Aave': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
  'Compound': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
  'Solana': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  'Cardano': 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
  'Polygon': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
};

export interface RealReview {
  id: string;
  company_name: string;
  title: string;
  content: string;
  rating: number;
  wallet_address: string;
  created_at: string;
  category: string;
  status: string;
}

export const useCompanyData = () => {
  const [companies, setCompanies] = useState<RealCompany[]>([]);
  const [recentReviews, setRecentReviews] = useState<RealReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);

      // Fetch approved reviews to calculate company stats
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('company_name, rating, category, created_at')
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      // Group reviews by company and calculate stats
      const companyStats = reviews?.reduce((acc: Record<string, any>, review) => {
        const company = review.company_name;
        if (!acc[company]) {
          acc[company] = {
            name: company,
            reviewCount: 0,
            totalRating: 0,
            category: review.category,
            latestReviewDate: review.created_at
          };
        }
        
        acc[company].reviewCount += 1;
        acc[company].totalRating += review.rating;
        
        // Update to latest review date
        if (new Date(review.created_at) > new Date(acc[company].latestReviewDate)) {
          acc[company].latestReviewDate = review.created_at;
        }
        
        return acc;
      }, {});

      // Convert to array and calculate average ratings
      const companiesArray = Object.values(companyStats || {}).map((company: any) => ({
        name: company.name,
        reviewCount: company.reviewCount,
        averageRating: Number((company.totalRating / company.reviewCount).toFixed(1)),
        category: company.category,
        latestReviewDate: company.latestReviewDate,
        logo: COMPANY_LOGOS[company.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=6366f1&color=ffffff&size=64`
      }));

      // Sort by review count and rating
      const sortedCompanies = companiesArray
        .filter(company => company.reviewCount > 0)
        .sort((a, b) => {
          // First sort by review count, then by rating
          if (b.reviewCount !== a.reviewCount) {
            return b.reviewCount - a.reviewCount;
          }
          return b.averageRating - a.averageRating;
        });

      setCompanies(sortedCompanies);

    } catch (error) {
      console.error('Error in fetchCompanyData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent reviews:', error);
        return;
      }

      setRecentReviews(reviews || []);
    } catch (error) {
      console.error('Error in fetchRecentReviews:', error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    fetchRecentReviews();
  }, []);

  const refreshData = () => {
    fetchCompanyData();
    fetchRecentReviews();
  };

  return {
    companies,
    recentReviews,
    loading,
    refreshData
  };
};