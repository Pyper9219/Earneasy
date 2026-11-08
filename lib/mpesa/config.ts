export type MpesaEnvName = "sandbox" | "production";

export interface MpesaConfig {
  env: MpesaEnvName;
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  transactionType: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
  callbackUrl: string;
  missing: string[];
}

/**
 * Reads the Daraja credentials from the environment.
 * Everything the user must add in Vercel is listed in `missing` when absent.
 */
export function getMpesaConfig(): MpesaConfig {
  const env: MpesaEnvName =
    (process.env.MPESA_ENV || "sandbox").toLowerCase() === "production"
      ? "production"
      : "sandbox";

  const consumerKey = process.env.MPESA_CONSUMER_KEY || "";
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
  const passkey = process.env.MPESA_PASSKEY || "";
  const shortcode = process.env.MPESA_SHORTCODE || "";

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );
  const callbackUrl =
    process.env.MPESA_CALLBACK_URL || `${appUrl}/api/payments/mpesa/callback`;

  const transactionType =
    process.env.MPESA_TRANSACTION_TYPE === "CustomerBuyGoodsOnline"
      ? "CustomerBuyGoodsOnline"
      : "CustomerPayBillOnline";

  const missing: string[] = [];
  if (!consumerKey) missing.push("MPESA_CONSUMER_KEY");
  if (!consumerSecret) missing.push("MPESA_CONSUMER_SECRET");
  if (!passkey) missing.push("MPESA_PASSKEY");
  if (!shortcode) missing.push("MPESA_SHORTCODE");

  return {
    env,
    baseUrl:
      env === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke",
    consumerKey,
    consumerSecret,
    passkey,
    shortcode,
    transactionType,
    callbackUrl,
    missing,
  };
}

export function assertMpesaConfigured(): MpesaConfig {
  const cfg = getMpesaConfig();
  if (cfg.missing.length > 0) {
    throw new Error(
      `M-Pesa is not configured. Missing environment variables: ${cfg.missing.join(", ")}`
    );
  }
  return cfg;
}

/** Kenya local time in the YYYYMMDDHHMMSS format Daraja expects. */
export function mpesaTimestamp(date = new Date()): string {
  const kenya = new Date(date.getTime() + 3 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    kenya.getUTCFullYear().toString() +
    p(kenya.getUTCMonth() + 1) +
    p(kenya.getUTCDate()) +
    p(kenya.getUTCHours()) +
    p(kenya.getUTCMinutes()) +
    p(kenya.getUTCSeconds())
  );
}
