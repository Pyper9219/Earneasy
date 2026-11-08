/**
 * Admin access control.
 * A user is an admin when either their account role is "admin" or their
 * email is listed in ADMIN_EMAILS. The owner's email is the built-in default.
 */
export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "amosmurimi217@gmail.com";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export function isAdminSession(session: {
  role?: string;
  email?: string;
} | null): boolean {
  if (!session) return false;
  return session.role === "admin" || isAdminEmail(session.email);
}
