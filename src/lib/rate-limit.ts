
const MAX_DAILY_ANALYSES = 15;
const RATE_LIMIT_KEY = 'walletStoryRateLimit';

type RateLimitData = {
  date: string; // YYYY-MM-DD
  count: number;
};

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getRateLimit(): { allowed: boolean; remaining: number; resetTime: string } {
    if (typeof window === 'undefined') {
        return { allowed: true, remaining: MAX_DAILY_ANALYSES, resetTime: '' };
    }

    const today = getTodayString();
    const item = window.localStorage.getItem(RATE_LIMIT_KEY);
    
    let data: RateLimitData;

    if (item) {
        try {
            data = JSON.parse(item);
            if (data.date !== today) {
                // It's a new day, reset the count
                data = { date: today, count: 0 };
            }
        } catch {
            data = { date: today, count: 0 };
        }
    } else {
        data = { date: today, count: 0 };
    }

    const allowed = data.count < MAX_DAILY_ANALYSES;
    const remaining = MAX_DAILY_ANALYSES - data.count;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const resetTime = tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return { allowed, remaining: Math.max(0, remaining), resetTime };
}

export function checkRateLimit(): boolean {
    return getRateLimit().allowed;
}

export function incrementRateLimit() {
    if (typeof window === 'undefined') return;

    const today = getTodayString();
    const item = window.localStorage.getItem(RATE_LIMIT_KEY);
    let data: RateLimitData;

    if (item) {
        try {
            data = JSON.parse(item);
            if (data.date === today) {
                data.count += 1;
            } else {
                data = { date: today, count: 1 };
            }
        } catch {
            data = { date: today, count: 1 };
        }
    } else {
        data = { date: today, count: 1 };
    }
    
    window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}
