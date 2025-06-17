
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseReview {
  id: string;
  company_name: string;
  category: string;
  title: string;
  content: string;
  rating: number;
  wallet_address: string;
  created_at: string;
  status: string;
}

export const useRecentReviews = () => {
  const [databaseReviews, setDatabaseReviews] = useState<DatabaseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchRecentReviews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        toast({
          title: "Refreshing Reviews",
          description: "Checking for newly approved reviews...",
        });
      } else {
        setLoading(true);
      }
      
      console.log('🔍 Fetching reviews from database...');
      
      const { data: allReviews, error: allError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('❌ Error fetching reviews:', allError);
        toast({
          title: "Error",
          description: "Failed to load reviews. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (allReviews) {
        console.log('✅ Fetched all reviews from database:', allReviews.length, allReviews);
        
        const statusBreakdown = allReviews.reduce((acc, review) => {
          acc[review.status] = (acc[review.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log('📊 Review status breakdown:', statusBreakdown);
        
        // Only show approved reviews
        const approvedReviews = allReviews.filter(r => r.status === 'approved');
        console.log('✅ Approved reviews to display:', approvedReviews.length);
        
        setDatabaseReviews(approvedReviews);
        
        if (forceRefresh) {
          if (approvedReviews.length > 0) {
            toast({
              title: "Reviews Updated",
              description: `Found ${approvedReviews.length} approved reviews. ${statusBreakdown.pending || 0} pending, ${statusBreakdown.rejected || 0} rejected.`,
            });
          } else {
            toast({
              title: "No Approved Reviews",
              description: `No approved reviews found. ${statusBreakdown.pending || 0} pending, ${statusBreakdown.rejected || 0} rejected.`,
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in fetchRecentReviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  return {
    databaseReviews,
    loading,
    refreshing,
    fetchRecentReviews,
  };
};
