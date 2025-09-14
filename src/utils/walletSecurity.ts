import { supabase } from '@/integrations/supabase/client';

/**
 * Secure wallet profile operations that prevent mass data extraction
 * 
 * SECURITY: This module ensures all wallet_profiles queries are targeted
 * and never allow bulk data extraction that could expose user privacy.
 */

export interface WalletProfile {
  id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

/**
 * Securely find a wallet profile by specific wallet address
 * 
 * @param walletAddress - The specific wallet address to look up
 * @returns The wallet profile or null if not found
 * 
 * SECURITY: This function enforces that queries always include a specific 
 * wallet address filter, preventing bulk extraction of wallet data.
 */
export const findWalletProfileByAddress = async (
  walletAddress: string
): Promise<WalletProfile | null> => {
  if (!walletAddress || typeof walletAddress !== 'string') {
    throw new Error('Wallet address is required and must be a string');
  }

  // Normalize the address to lowercase for consistent comparison
  const normalizedAddress = walletAddress.toLowerCase().trim();
  
  // Validate the address format (basic hex check)
  if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    throw new Error('Invalid wallet address format');
  }

  console.log('🔒 Secure wallet profile lookup for:', normalizedAddress);

  try {
    const { data, error } = await supabase
      .from('wallet_profiles')
      .select('id, wallet_address, created_at, updated_at')
      .eq('wallet_address', normalizedAddress)
      .maybeSingle();

    if (error) {
      console.error('❌ Error in secure wallet profile lookup:', error);
      throw new Error(`Failed to lookup wallet profile: ${error.message}`);
    }

    console.log('✅ Secure wallet profile lookup completed');
    return data;
  } catch (error) {
    console.error('❌ Exception in secure wallet profile lookup:', error);
    throw error;
  }
};

/**
 * Securely create a new wallet profile
 * 
 * @param walletAddress - The wallet address to create a profile for
 * @returns The created wallet profile
 * 
 * SECURITY: This function validates input and creates profiles securely.
 */
export const createWalletProfileSecurely = async (
  walletAddress: string
): Promise<WalletProfile> => {
  if (!walletAddress || typeof walletAddress !== 'string') {
    throw new Error('Wallet address is required and must be a string');
  }

  // Normalize the address to lowercase for consistent comparison
  const normalizedAddress = walletAddress.toLowerCase().trim();
  
  // Validate the address format (basic hex check)
  if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    throw new Error('Invalid wallet address format');
  }

  console.log('🔒 Secure wallet profile creation for:', normalizedAddress);

  try {
    const { data, error } = await supabase
      .from('wallet_profiles')
      .insert({ wallet_address: normalizedAddress })
      .select('id, wallet_address, created_at, updated_at')
      .single();

    if (error) {
      console.error('❌ Error in secure wallet profile creation:', error);
      throw new Error(`Failed to create wallet profile: ${error.message}`);
    }

    console.log('✅ Secure wallet profile created');
    return data;
  } catch (error) {
    console.error('❌ Exception in secure wallet profile creation:', error);
    throw error;
  }
};

/**
 * Securely get or create a wallet profile
 * 
 * @param walletAddress - The wallet address to get or create a profile for
 * @returns The wallet profile (existing or newly created)
 * 
 * SECURITY: This function combines secure lookup and creation operations.
 */
export const getOrCreateWalletProfileSecurely = async (
  walletAddress: string
): Promise<WalletProfile> => {
  // First, try to find existing profile
  const existingProfile = await findWalletProfileByAddress(walletAddress);
  
  if (existingProfile) {
    return existingProfile;
  }

  // If not found, create new profile
  return await createWalletProfileSecurely(walletAddress);
};

/**
 * SECURITY WARNING: This function intentionally does NOT provide a way to:
 * 1. List all wallet profiles
 * 2. Search wallet profiles without specific addresses
 * 3. Bulk extract wallet data
 * 
 * These operations would compromise user privacy by exposing wallet addresses
 * that could be used to track blockchain transactions.
 */