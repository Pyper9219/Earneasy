/**
 * Normalises Kenyan phone numbers to 2547XXXXXXXX / 2541XXXXXXXX.
 * Accepts 0712345678, 712345678, +254712345678, 254712345678, with spaces or dashes.
 */
export function normalizeKenyanPhone(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/[^\d]/g, "");

  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  if (/^254[17]\d{8}$/.test(digits)) return digits;

  return null;
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 6)}***${phone.slice(-2)}`;
}
