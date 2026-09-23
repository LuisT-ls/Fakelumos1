const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_TRACKED_IDENTIFIERS = 10_000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requests = new Map<string, RateLimitEntry>();

/**
 * Limite local de melhor esforço. Em produção distribuída, substituir por
 * armazenamento compartilhado (por exemplo, Redis/Upstash).
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();

  // Remove entradas vencidas e evita crescimento ilimitado caso muitos
  // identificadores diferentes atinjam a rota em uma mesma instância.
  for (const [key, entry] of requests) {
    if (entry.resetAt <= now) requests.delete(key);
  }

  if (!requests.has(identifier) && requests.size >= MAX_TRACKED_IDENTIFIERS) {
    const oldestIdentifier = requests.keys().next().value;
    if (oldestIdentifier !== undefined) requests.delete(oldestIdentifier);
  }

  const current = requests.get(identifier);

  if (!current || current.resetAt <= now) {
    requests.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
