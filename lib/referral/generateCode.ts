export function generateReferralCode(name: string): string {
  const prefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${randomSuffix}`;
}
