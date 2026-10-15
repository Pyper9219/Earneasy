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