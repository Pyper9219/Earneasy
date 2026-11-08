export interface PalplussConfig {
  apiKey: string;
  baseUrl: string;
  channelId?: string;
  callbackUrl: string;
  missing: string[];
}

/**
 * PalPluss only needs the API key. The Basic auth header is built from it
 * automatically: base64("<apiKey>:").
 */
export function getPalplussConfig(): PalplussConfig {
  const apiKey = (process.env.PALPLUSS_API_KEY || "").trim();
  const isSandbox = (process.env.PALPLUSS_ENV || "production").toLowerCase() === "sandbox";
  const channelId = process.env.PALPLUSS_CHANNEL_ID?.trim() || undefined;

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );
  const callbackUrl =
    process.env.PALPLUSS_CALLBACK_URL || `${appUrl}/api/payments/palpluss/webhook`;

  const missing: string[] = [];
  if (!apiKey) missing.push("PALPLUSS_API_KEY");

  return {
    apiKey,
    baseUrl: isSandbox
      ? "https://sandbox.palpluss.com/v1"
      : "https://api.palpluss.com/v1",
    channelId,
    callbackUrl,
    missing,
  };
}

export function assertPalplussConfigured(): PalplussConfig {
  const cfg = getPalplussConfig();
  if (cfg.missing.length > 0) {
    throw new Error(
      `PalPluss is not configured. Missing environment variables: ${cfg.missing.join(", ")}`
    );
  }
  return cfg;
}
