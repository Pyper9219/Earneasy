/**
 * Email sending through Resend (https://resend.com).
 * Needs RESEND_API_KEY and EMAIL_FROM in the environment.
 *
 * Never throws: if email is not configured or the provider fails, the payment
 * flow carries on and the problem is only logged.
 */
export interface EmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM || "EarnEasy <onboarding@resend.dev>";
}

export async function sendEmail(input: EmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not set. Skipped "${input.subject}" to ${input.to}`
    );
    return false;
  }

  if (!input.to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
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
  } catch (err) {
    console.error("[email] send failed:", (err as Error).message);
    return false;
  }
}
