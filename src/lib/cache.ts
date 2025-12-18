import { AnalysisResult } from '@/lib/types';

const CACHE_PREFIX = 'walletStoryCache_';
const CACHE_DURATION_HOURS = 24;
const CACHE_DURATION_MS = CACHE_DURATION_HOURS * 60 * 60 * 1000;

type CachedData = {
  timestamp: number;
  result: AnalysisResult;
};

export function getCachedResult(address: string): AnalysisResult | null {
  if (typeof window === 'undefined') return null;

  const key = `${CACHE_PREFIX}${address.toLowerCase()}`;
  const item = window.localStorage.getItem(key);

  if (!item) {
    return null;
  }

  try {
    const data: CachedData = JSON.parse(item);
    if (Date.now() - data.timestamp > CACHE_DURATION_MS) {
      window.localStorage.removeItem(key);
      return null;
    }
    return data.result;
  } catch (error) {
    console.error("Error reading from cache:", error);
    return null;
  }
}

export function setCachedResult(address: string, result: AnalysisResult): void {
    if (typeof window === 'undefined') return;

  const key = `${CACHE_PREFIX}${address.toLowerCase()}`;
  const data: CachedData = {
    timestamp: Date.now(),
    result,
  };

  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
}
