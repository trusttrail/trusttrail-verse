
import { GitcoinPassportData } from '@/types/gitcoinPassport';

export const savePassportDataToStorage = (userId: string, address: string, score: number): GitcoinPassportData => {
  const data: GitcoinPassportData = {
    address,
    score,
    verified: true,
    timestamp: Date.now(),
    lastRefresh: Date.now()
  };

  localStorage.setItem(`gitcoin_passport_${userId}`, JSON.stringify(data));
  return data;
};

export const loadPassportDataFromStorage = (userId: string): GitcoinPassportData | null => {
  const storedData = localStorage.getItem(`gitcoin_passport_${userId}`);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Failed to parse stored passport data:', error);
      localStorage.removeItem(`gitcoin_passport_${userId}`);
    }
  }
  return null;
};

export const clearPassportDataFromStorage = (userId: string): void => {
  localStorage.removeItem(`gitcoin_passport_${userId}`);
};

export const checkIfDataIsStale = (data: GitcoinPassportData): boolean => {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  return data.lastRefresh < sevenDaysAgo;
};
