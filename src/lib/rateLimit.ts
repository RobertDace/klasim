// src/lib/rateLimit.ts
import { headers } from 'next/headers';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store untuk rate limiting sliding window
const ipStore = new Map<string, RateLimitRecord>();

export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headersList.get('x-real-ip') || '127.0.0.1';
}

/**
 * Memeriksa apakah request dari IP ini melebihi batasan kuota dalam rentang waktu tertentu.
 * @param actionKey Kunci pembeda aksi (contoh: 'create_tournament', 'auth_login')
 * @param limit Batas maksimal request dalam window
 * @param windowMs Durasi window dalam milidetik (default: 60 detik)
 */
export async function checkRateLimit(
  actionKey: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): Promise<{ allowed: boolean; remaining: number }> {
  const ip = await getClientIp();
  const key = `${actionKey}:${ip}`;
  const now = Date.now();

  const record = ipStore.get(key);

  if (!record || now > record.resetTime) {
    ipStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

