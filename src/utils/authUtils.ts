
// Re-export all auth utilities from their respective modules
export { cleanupAuthState } from './auth/authCleanup';
export { performGlobalSignOut } from './auth/authSignOut';
export { validateEmailFormat, normalizeEmail } from './auth/emailValidation';
export { checkWalletExists, linkWalletToProfile } from './auth/walletProfile';
export { 
  autoSignInWithWallet, 
  getAutoSignInData, 
  clearAutoSignInData, 
  handleWalletAutoSignIn 
} from './auth/autoSignIn';
