import { assertMpesaConfigured } from "./config";

let cached: { token: string; expiresAt: number } | null = null;

/**
 * Daraja OAuth token. Uses the same Basic auth the "basic auth token" is built from:
 * base64(consumerKey:consumerSecret).
 */
export async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - 60_000) {
    return cached.token;
  }

  const cfg = assertMpesaConfigured();
  const basic = Buffer.from(`${cfg.consumerKey}:${cfg.consumerSecret}`).toString(
    "base64"
  );

  const res = await fetch(
    `${cfg.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${basic}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `M-Pesa auth failed (${res.status}). Check MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET. ${text.slice(0, 200)}`
    );
  }

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: string | number;
  };

  if (!data.access_token) {
    throw new Error("M-Pesa auth returned no access_token");
  }

  const ttlSeconds = Number(data.expires_in ?? 3599) || 3599;
  cached = {
    token: data.access_token,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };

  return cached.token;
}
