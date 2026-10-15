import { ReferralCode } from '@/lib/db/models/ReferralCode';
export function generateReferralCode(name: string): string {
  const prefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return prefix + randomSuffix;
}
export async function generateUniqueCode(name: string): Promise<string> {
  let code = generateReferralCode(name);
  let exists = await ReferralCode.findOne({ code });
  while (exists) { code = generateReferralCode(name) + Math.floor(Math.random() * 10); exists = await ReferralCode.findOne({ code }); }
  return code;
}
export async function createReferralCodeForUser(userId: string, name: string) {
  const code = await generateUniqueCode(name);
  return await ReferralCode.create({ userId, code, isActive: true });
}