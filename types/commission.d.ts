export type CommissionLevel = 1 | 2 | 3;

export interface CommissionConfigShape {
  level1: number;
  level2: number;
  level3: number;
  totalPrice: number;
}

export interface CommissionEntry {
  _id: string;
  userId: string;
  level: CommissionLevel;
  amount: number;
  sourcePaymentId: string;
  sourceUserId: string;
  createdAt: string;
}

export interface DistributionResult {
  paymentId: string;
  distributed: Array<{
    userId: string;
    level: CommissionLevel;
    amount: number;
  }>;
  skipped: boolean;
  reason?: string;
}