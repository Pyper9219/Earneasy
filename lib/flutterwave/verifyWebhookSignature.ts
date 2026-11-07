<<<<<<< HEAD
﻿import crypto from 'crypto';
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  if (!secretHash) {
    console.warn('FLUTTERWAVE_SECRET_HASH is not set. Skipping webhook signature verification.');
    return true; 
  }
  const hmac = crypto.createHmac('sha256', secretHash);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  return digest === signature;
}
=======
import crypto from "crypto";

/**
 * Flutterwave sends a `verif-hash` header matching your dashboard webhook secret hash.
 */
export function verifyWebhookSignature(
  signature: string | null,
  secretHash: string | undefined = process.env.FLUTTERWAVE_WEBHOOK_HASH
): boolean {
  if (!signature || !secretHash) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(secretHash)
    );
  } catch {
    return false;
  }
}
>>>>>>> 33073f7 (Initial commit)
