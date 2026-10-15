export interface ReferralNode {
  userId: string;
  name: string;
  email: string;
  code: string;
  level: 1 | 2 | 3;
  joinedAt: string;
  children?: ReferralNode[];
}

export interface ReferralTree {
  root: ReferralNode;
  totalL1: number;
  totalL2: number;
  totalL3: number;
}

export interface ReferralStats {
  directCount: number;
  level2Count: number;
  level3Count: number;
  totalEarnings: number;
  pendingEarnings: number;
}