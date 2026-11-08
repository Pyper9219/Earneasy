/**
 * Transactional email.
 *
 * Works with either provider, whichever key is present:
 *   BREVO_API_KEY  (brevo.com, 300 free emails/day, single-sender verification)
 *   RESEND_API_KEY (resend.com, needs a verified domain for external recipients)
 *
 * Never throws: if no provider is configured or the request fails, the payment
 * flow carries on and the problem is only logged.
 */
export interface EmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function parseFrom(raw: string): { name: string; email: string } {
  const match = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    return { name: match[1] || "EarnEasy", email: match[2] };
  }
  return { name: "EarnEasy", email: raw.trim() };
}

function fromRaw(): string {
  return process.env.EMAIL_FROM || "EarnEasy <onboarding@resend.dev>";
}

async function sendWithBrevo(input: EmailInput, apiKey: string): Promise<boolean> {
  const from = parseFrom(fromRaw());

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: from,
      to: [{ email: input.to }],
      subject: input.subject,
      htmlContent: input.html,
      ...(input.text ? { textContent: input.text } : {}),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[email] Brevo rejected "${input.subject}" (${res.status}): ${body.slice(0, 300)}`
    );
    return false;
  }

  return true;
}

async function sendWithResend(input: EmailInput, apiKey: string): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromRaw(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[email] Resend rejected "${input.subject}" (${res.status}): ${body.slice(0, 300)}`
    );
    return false;
  }

  return true;
}

export async function sendEmail(input: EmailInput): Promise<boolean> {
  if (!input.to) return false;

  const brevoKey = process.env.BREVO_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  try {
    if (brevoKey) return await sendWithBrevo(input, brevoKey);
    if (resendKey) return await sendWithResend(input, resendKey);

    console.warn(
      `[email] No email provider configured (BREVO_API_KEY or RESEND_API_KEY). Skipped "${input.subject}" to ${input.to}`
    );
    return false;
  } catch (err) {
    console.error("[email] send failed:", (err as Error).message);
    return false;
  }
}
