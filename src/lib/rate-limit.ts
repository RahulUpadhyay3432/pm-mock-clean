type Key = string;

const buckets = new Map<Key, { count: number; ts: number }>();
const WINDOW_MS = 15_000;
const LIMIT = 15;

export function rateLimit(key: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const item = buckets.get(key);
  if (!item || now - item.ts > WINDOW_MS) {
    buckets.set(key, { count: 1, ts: now });
    return { ok: true, remaining: LIMIT - 1 };
  }
  if (item.count >= LIMIT) return { ok: false, remaining: 0 };
  item.count += 1;
  return { ok: true, remaining: LIMIT - item.count };
}