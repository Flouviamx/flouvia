// In-memory rate limiter — per Vercel instance.
// For multi-instance production, replace store with Upstash Redis.
const store = new Map<string, { count: number; reset: number }>();

// Clean up expired entries every 5 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.reset) store.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param key    Unique identifier — use IP or userId
 * @param limit  Max requests per window (default: 20)
 * @param windowMs  Window duration in ms (default: 60 s)
 */
export function rateLimit(key: string, limit = 20, windowMs = 60_000): boolean {
  const now   = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
