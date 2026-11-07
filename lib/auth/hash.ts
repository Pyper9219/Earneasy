<<<<<<< HEAD
﻿import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;
export async function hashPassword(password: string): Promise<string> { return await bcrypt.hash(password, SALT_ROUNDS); }
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> { return await bcrypt.compare(password, hashedPassword); }
export const verifyPassword = comparePassword;
=======
import bcrypt from "bcryptjs";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}
>>>>>>> 33073f7 (Initial commit)
