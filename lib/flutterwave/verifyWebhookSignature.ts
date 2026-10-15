import crypto from 'crypto';
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
