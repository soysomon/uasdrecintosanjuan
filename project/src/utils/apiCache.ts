/**
 * apiCache — sessionStorage cache with TTL.
 *
 * Why sessionStorage?
 * - Survives SPA navigation (component unmount/remount) within the same tab.
 * - Clears automatically when the tab closes → fresh data on new sessions.
 * - Zero latency on re-fetches: images and data appear instantly.
 */

const PREFIX = 'uasd_c_';

interface Entry<T> {
  data: T;
  ts:   number;
  ttl:  number;
}

/** Return cached value or null if missing / expired. */
export function getCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry: Entry<T> = JSON.parse(raw);
    if (Date.now() - entry.ts > entry.ttl) {
      sessionStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/** Store a value. Default TTL = 2 minutes. */
export function setCache<T>(key: string, data: T, ttlMs = 120_000): void {
  try {
    const entry: Entry<T> = { data, ts: Date.now(), ttl: ttlMs };
    sessionStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // sessionStorage full / unavailable — ignore silently.
  }
}

/**
 * Inject a <link rel="preload"> for an image URL.
 * Starts the download before the <img> element renders.
 * Skips local paths (starts with '/').
 */
export function preloadImageUrl(url: string): void {
  if (!url || url.startsWith('/') || url.startsWith('blob:')) return;
  // Avoid duplicate preload links
  if (document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
  const link = document.createElement('link');
  link.rel          = 'preload';
  link.as           = 'image';
  link.href         = url;
  link.fetchPriority = 'high';
  document.head.appendChild(link);
}
