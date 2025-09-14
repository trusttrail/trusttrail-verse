import { supabase } from '@/integrations/supabase/client';

/**
 * Security audit logging utilities
 * 
 * SECURITY: All sensitive operations should be logged for monitoring
 * and security analysis. This helps detect potential security breaches.
 */

export interface AuditLogEntry {
  action: string;
  table_name: string;
  details?: Record<string, any>;
  user_id?: string;
}

/**
 * Log a security-related action for audit purposes
 * 
 * @param entry - The audit log entry to record
 * @returns Promise that resolves when the log entry is saved
 */
export const logSecurityAction = async (entry: AuditLogEntry): Promise<void> => {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        action: entry.action,
        table_name: entry.table_name,
        details: entry.details || {},
        user_id: entry.user_id
      });

    if (error) {
      console.error('❌ Failed to log security action:', error);
      // Don't throw - logging failure shouldn't break the main operation
    } else {
      console.log('📝 Security action logged:', entry.action);
    }
  } catch (error) {
    console.error('❌ Exception in security logging:', error);
    // Don't throw - logging failure shouldn't break the main operation
  }
};

/**
 * Log suspicious wallet access attempts
 * 
 * @param walletAddress - The wallet address being accessed
 * @param context - Additional context about the access attempt
 */
export const logWalletAccess = async (
  walletAddress: string, 
  context: Record<string, any> = {}
): Promise<void> => {
  await logSecurityAction({
    action: 'wallet_access_attempt',
    table_name: 'wallet_profiles',
    details: {
      wallet_address: walletAddress,
      timestamp: new Date().toISOString(),
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ...context
    }
  });
};

/**
 * Log authentication events
 * 
 * @param event - The authentication event type
 * @param details - Additional details about the event
 */
export const logAuthEvent = async (
  event: string,
  details: Record<string, any> = {}
): Promise<void> => {
  await logSecurityAction({
    action: `auth_${event}`,
    table_name: 'auth_events',
    details: {
      event_type: event,
      timestamp: new Date().toISOString(),
      ...details
    }
  });
};