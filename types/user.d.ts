export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  referralCode: string;
  hasPaid: boolean;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: "user" | "admin";
  name: string;
}