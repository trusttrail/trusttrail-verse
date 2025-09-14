import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced security audit logging for sensitive operations
 * 
 * SECURITY: All wallet address access and sensitive operations are logged
 * for compliance, monitoring, and security investigation purposes.
 */

export interface AuditLogEntry {
  action: string;
  table_name: string;
  details?: Record<string, any>;
  user_id?: string;
}

/**
 * Log security-sensitive operations to the audit trail
 * 
 * @param entry - The audit log entry to record
 * @returns Promise<boolean> - Success status
 */
export const logSecurityEvent = async (entry: AuditLogEntry): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        action: entry.action,
        table_name: entry.table_name,
        details: entry.details || {},
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('🚨 Failed to log security event:', error);
      return false;
    }

    console.log('🔒 Security event logged:', entry.action);
    return true;
  } catch (error) {
    console.error('🚨 Exception logging security event:', error);
    return false;
  }
};

/**
 * Log wallet address access attempts
 * 
 * @param walletAddress - The wallet address being accessed
 * @param operation - The type of operation (lookup, create, etc.)
 * @param success - Whether the operation was successful
 */
export const logWalletAccess = async (
  walletAddress: string,
  operation: string,
  success: boolean,
  additionalDetails?: Record<string, any>
): Promise<void> => {
  await logSecurityEvent({
    action: `wallet_${operation}`,
    table_name: 'wallet_profiles',
    details: {
      wallet_address: walletAddress,
      operation,
      success,
      timestamp: Date.now(),
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ...additionalDetails
    }
  });
};

/**
 * Log suspicious activity patterns
 * 
 * @param suspiciousActivity - Description of the suspicious activity
 * @param context - Additional context about the activity
 */
export const logSuspiciousActivity = async (
  suspiciousActivity: string,
  context: Record<string, any>
): Promise<void> => {
  await logSecurityEvent({
    action: 'suspicious_activity',
    table_name: 'security',
    details: {
      activity: suspiciousActivity,
      context,
      severity: 'high',
      requires_investigation: true,
      timestamp: Date.now()
    }
  });

  // In a production system, this could trigger alerts
  console.warn('🚨 SUSPICIOUS ACTIVITY DETECTED:', suspiciousActivity, context);
};