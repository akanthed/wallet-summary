'use client';

type TrackEventProps = {
    eventName: string;
    payload?: Record<string, string | number | boolean | undefined>;
}

export function track(eventName: string, payload?: Record<string, any>) {
    // Use an empty object for payload if not provided
    const eventData = { eventName, payload: payload || {} };
  
    // Use sendBeacon if available for better reliability, otherwise fallback to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
      navigator.sendBeacon('/api/log', blob);
    } else {
      fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        keepalive: true, // keepalive helps ensure the request is sent even if the page is unloading
      });
    }
}
