export interface ReferralNode {
  _id: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  referralCode?: string;
  isActivated?: boolean;
  level?: number;
  earnings?: number;
  children?: ReferralNode[];
}
