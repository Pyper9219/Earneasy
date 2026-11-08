import { assertPalplussConfigured } from "./config";

export interface PalplussTransaction {
  transactionId: string;
  tenantId?: string;
  type?: string;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REVERSED" | string;
  amount: number;
  currency?: string;
  phone?: string;
  accountReference?: string;
  providerRequestId?: string;
  providerCheckoutId?: string;
  mpesaReceipt?: string | null;
  resultCode?: string;
  resultDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
  error?: { message?: string; code?: string };
  requestId?: string;
}

/** Shared request helper. Auth is HTTP Basic with the API key as the username. */
export async function palplussRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const cfg = assertPalplussConfigured();
  const basic = Buffer.from(`${cfg.apiKey}:`).toString("base64");

  const res = await fetch(`${cfg.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const body = (await res.json().catch(() => ({}))) as Envelope<T>;

  if (!res.ok || body.success === false) {
    const message =
      body?.error?.message || `PalPluss request failed (${res.status})`;
    throw new Error(message);
  }

  return (body.data ?? ({} as T)) as T;
}

/** Sends the M-Pesa prompt to the customer's phone. */
export async function initiateStkPush(input: {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<PalplussTransaction> {
  const cfg = assertPalplussConfigSafe();

  const payload: Record<string, unknown> = {
    amount: Math.round(input.amount),
    phone: input.phone,
    accountReference: input.accountReference,
    transactionDesc: input.transactionDesc,
    callbackUrl: cfg.callbackUrl,
  };

  if (cfg.channelId) payload.channelId = cfg.channelId;

  return palplussRequest<PalplussTransaction>("/payments/stk", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Reads the authoritative status straight from PalPluss. */
export async function getTransaction(
  transactionId: string
): Promise<PalplussTransaction> {
  return palplussRequest<PalplussTransaction>(
    `/transactions/${encodeURIComponent(transactionId)}`
  );
}

function assertPalplussConfigSafe() {
  return assertPalplussConfigured();
}
