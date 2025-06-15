
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return null;
      
      // Check if user is admin using the new admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
        return null;
      }
      
      // Return profile-like object for compatibility
      return {
        id: session.session.user.id,
        is_admin: !!adminData,
        email: session.session.user.email,
        created_at: session.session.user.created_at
      };
    }
  });
};
