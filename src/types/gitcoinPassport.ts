
export interface GitcoinPassportData {
  address: string;
  score: number;
  verified: boolean;
  timestamp: number;
  lastRefresh: number;
}

export interface GitcoinPassportHook {
  passportData: GitcoinPassportData | null;
  isVerified: boolean;
  passportScore: number;
  needsRefresh: boolean;
  isVerifying: boolean;
  verifyPassport: (walletAddress: string) => Promise<boolean>;
  refreshPassportScore: (walletAddress: string) => Promise<boolean>;
  clearPassportData: () => void;
  savePassportData: (address: string, score: number) => void;
  fetchGitcoinScore: (walletAddress: string) => Promise<number | null>;
}
