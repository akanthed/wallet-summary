import { AnalysisResult } from '@/lib/types';

const CACHE_PREFIX = 'walletStoryCache_';
const CACHE_DURATION_HOURS = 24;
const DEFAULT_CACHE_DURATION_MS = CACHE_DURATION_HOURS * 60 * 60 * 1000;

type CachedData = {
  timestamp: number;
  result: AnalysisResult | null;
};

export function getCachedResult(address: string): AnalysisResult | null | undefined {
  if (typeof window === 'undefined') return undefined;

  const key = `${CACHE_PREFIX}${address.toLowerCase()}`;
  const item = window.localStorage.getItem(key);

  if (!item) {
    return undefined; // Return undefined to indicate "not in cache"
  }

  try {
    const data: CachedData = JSON.parse(item);
    if (Date.now() - data.timestamp > DEFAULT_CACHE_DURATION_MS) {
      window.localStorage.removeItem(key);
      return undefined; // Cache expired
    }
    return data.result; // Can be AnalysisResult or null
  } catch (error) {
    console.error("Error reading from cache:", error);
    return undefined;
  }
}

export function setCachedResult(address: string, result: AnalysisResult | null, durationMs = DEFAULT_CACHE_DURATION_MS): void {
    if (typeof window === 'undefined') return;

  const key = `${CACHE_PREFIX}${address.toLowerCase()}`;
  const data: CachedData = {
    timestamp: Date.now(),
    result,
  };

  try {
    const item = {
        ...data,
        // Override timestamp for custom duration
        timestamp: Date.now() + durationMs - DEFAULT_CACHE_DURATION_MS,
    };
    window.localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
}
