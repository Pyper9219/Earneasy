export const CLIENT_PRICE_KES = Number(process.env.CLIENT_PRICE_KES ?? 450);
export const CURRENCY = "KES";

export const COMMISSION_LEVELS = [1, 2, 3] as const;
export const DEFAULT_COMMISSION_CONFIG = {
  level1: 250,
  level2: 100,
  level3: 50,
  totalPrice: CLIENT_PRICE_KES,
};

export const MIN_PAYOUT_KES = 500;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  referrals: "/referrals",
  invite: "/referrals/invite",
  earnings: "/earnings",
  payouts: "/payouts",
  settings: "/settings",
  admin: "/admin",
} as const;