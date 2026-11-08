import { sendEmail } from "./send";

const BRAND = "EarnEasy";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://earneasy-delta.vercel.app").replace(
  /\/+$/,
  ""
);

function money(amount: number): string {
  return `KES ${Math.round(amount).toLocaleString("en-KE")}`;
}

function layout(opts: {
  heading: string;
  intro: string;
  rows?: Array<[string, string]>;
  note?: string;
  cta?: { label: string; href: string };
}): string {
  const rows = (opts.rows ?? [])
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;color:#64748b;font-size:14px;">${label}</td>
        <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:600;text-align:right;">${value}</td>
      </tr>`
    )
    .join("");

  const cta = opts.cta
    ? `<p style="margin:28px 0 0;">
         <a href="${opts.cta.href}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;">${opts.cta.label}</a>
       </p>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:#050b1a;padding:22px 28px;">
                <span style="color:#34d399;font-size:18px;font-weight:700;letter-spacing:-0.3px;">EarnEasy</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 10px;font-size:21px;line-height:1.3;color:#0f172a;">${opts.heading}</h1>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">${opts.intro}</p>
                ${rows ? `<table role="presentation" width="100%" style="border-top:1px solid #e2e8f0;">${rows}</table>` : ""}
                ${opts.note ? `<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#64748b;">${opts.note}</p>` : ""}
                ${cta}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 26px;">
                <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                  You are receiving this email because you have an ${BRAND} account.
                  Questions? Reply to this email or contact support.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Sent to the upline when a referral pays and commission lands in their wallet. */
export async function sendCommissionEarnedEmail(input: {
  to: string;
  name?: string;
  amount: number;
  level: number;
  newBalance?: number;
  referralLabel?: string;
}): Promise<boolean> {
  const levelWord =
    input.level === 1 ? "direct referral" : `level ${input.level} referral`;
  return sendEmail({
    to: input.to,
    subject: `Congratulations! You earned ${money(input.amount)}`,
    html: layout({
      heading: `Congratulations, ${input.name || "friend"}! 🎉`,
      intro: `You just earned <strong>${money(input.amount)}</strong> from your ${levelWord}. The money is already in your EarnEasy wallet and ready to withdraw.`,
      rows: [
        ["Commission", money(input.amount)],
        ["Source", `${input.referralLabel || "Referral"} (level ${input.level})`],
        ...(input.newBalance != null ? [["Wallet balance", money(input.newBalance)] as [string, string]] : []),
      ],
      note:
        "Keep sharing your invite link to earn on every level. Withdrawals are reviewed by an admin before payout.",
      cta: { label: "View your earnings", href: `${APP_URL}/earnings` },
    }),
    text: `Congratulations! You earned ${money(input.amount)} from your ${levelWord}. Your new wallet balance is ${
      input.newBalance != null ? money(input.newBalance) : "updated"
    }. View it at ${APP_URL}/earnings`,
  });
}

/** Confirms that a withdrawal request was received and is waiting for approval. */
export async function sendWithdrawalRequestedEmail(input: {
  to: string;
  name?: string;
  amount: number;
  reference: string;
  destination: string;
  balanceAfter?: number;
}): Promise<boolean> {
  return sendEmail({
    to: input.to,
    subject: `Withdrawal request received: ${money(input.amount)}`,
    html: layout({
      heading: "Your withdrawal is with our team",
      intro: `Hi ${input.name || "there"}, we received your request to withdraw <strong>${money(
        input.amount
      )}</strong>. An admin reviews every withdrawal before it is paid out.`,
      rows: [
        ["Amount", money(input.amount)],
        ["Reference", input.reference],
        ["Destination", input.destination],
        ...(input.balanceAfter != null ? [["Remaining balance", money(input.balanceAfter)] as [string, string]] : []),
        ["Status", "Awaiting admin approval"],
      ],
      note:
        "You will get another email the moment the request is approved or if it is returned to your balance. Approval usually takes a short while.",
      cta: { label: "Track your withdrawal", href: `${APP_URL}/payouts` },
    }),
    text: `We received your withdrawal request for ${money(input.amount)} (${input.reference}). It is awaiting admin approval. Track it at ${APP_URL}/payouts`,
  });
}

export async function sendWithdrawalApprovedEmail(input: {
  to: string;
  name?: string;
  amount: number;
  reference: string;
}): Promise<boolean> {
  return sendEmail({
    to: input.to,
    subject: `Your withdrawal of ${money(input.amount)} was approved`,
    html: layout({
      heading: "Withdrawal approved ✅",
      intro: `Good news ${input.name || "there"}, your withdrawal of <strong>${money(
        input.amount
      )}</strong> has been approved and is being prepared for payment.`,
      rows: [
        ["Amount", money(input.amount)],
        ["Reference", input.reference],
        ["Status", "Approved"],
      ],
      cta: { label: "View payout", href: `${APP_URL}/payouts` },
    }),
    text: `Your withdrawal of ${money(input.amount)} was approved. Reference ${input.reference}.`,
  });
}

export async function sendWithdrawalPaidEmail(input: {
  to: string;
  name?: string;
  amount: number;
  reference: string;
}): Promise<boolean> {
  return sendEmail({
    to: input.to,
    subject: `You have been paid ${money(input.amount)}`,
    html: layout({
      heading: "Payment sent 💸",
      intro: `Hi ${input.name || "there"}, we have paid out <strong>${money(
        input.amount
      )}</strong>. Check your M-Pesa messages for the confirmation.`,
      rows: [
        ["Amount", money(input.amount)],
        ["Reference", input.reference],
        ["Status", "Paid"],
      ],
      note: "If you cannot see the money within a few hours, reply to this email and we will check.",
      cta: { label: "View payout", href: `${APP_URL}/payouts` },
    }),
    text: `You have been paid ${money(input.amount)} (${input.reference}).`,
  });
}

export async function sendWithdrawalRejectedEmail(input: {
  to: string;
  name?: string;
  amount: number;
  reference: string;
  reason?: string;
}): Promise<boolean> {
  return sendEmail({
    to: input.to,
    subject: `Your withdrawal request was not approved`,
    html: layout({
      heading: "Withdrawal returned to your balance",
      intro: `Hi ${input.name || "there"}, your withdrawal of <strong>${money(
        input.amount
      )}</strong> was not approved, so the money has been returned to your EarnEasy wallet.`,
      rows: [
        ["Amount returned", money(input.amount)],
        ["Reference", input.reference],
        ["Reason", input.reason || "Not approved by admin"],
      ],
      note: "You can request again at any time, or contact support if you think this was a mistake.",
      cta: { label: "Open your wallet", href: `${APP_URL}/payouts` },
    }),
    text: `Your withdrawal of ${money(input.amount)} was not approved. Reason: ${
      input.reason || "not approved by admin"
    }. The money is back in your wallet.`,
  });
}
