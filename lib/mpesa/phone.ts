/**
 * Normalises Kenyan phone numbers to the 2547XXXXXXXX / 2541XXXXXXXX form Daraja requires.
 * Accepts 0712345678, 712345678, +254712345678, 254712345678, with spaces or dashes.
 */
export function normalizeMpesaPhone(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/[^\d]/g, "");

  let normalized: string | null = null;

  if (/^0[17]\d{8}$/.test(digits)) {
    normalized = `254${digits.slice(1)}`;
  } else if (/^[17]\d{8}$/.test(digits)) {
    normalized = `254${digits}`;
  } else if (/^254[17]\d{8}$/.test(digits)) {
    normalized = digits;
  }

  return normalized;
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 6)}***${phone.slice(-2)}`;
}
