type Key = string;

type Bucket = { timestamps: number[] };

const ipBuckets = new Map<Key, Bucket>();
const emailBuckets = new Map<Key, Bucket>();

function allow(buckets: Map<Key, Bucket>, key: Key, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  // prune
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return true;
}

export function limitByIP(limit: number, windowMs: number) {
  return (req: any, res: any, next: any) => {
    const key = req.ip || 'unknown';
    if (!allow(ipBuckets, key, limit, windowMs)) {
      return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } });
    }
    next();
  };
}

export function limitByEmail(limit: number, windowMs: number) {
  return (req: any, res: any, next: any) => {
    const email = (req.body?.email || req.query?.email || '').toLowerCase();
    if (!email) return next();
    if (!allow(emailBuckets, email, limit, windowMs)) {
      return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests for this email' } });
    }
    next();
  };
}
