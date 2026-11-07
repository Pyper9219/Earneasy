# EarnEasy

<<<<<<< HEAD
A 3-level referral commission platform built with **Next.js 14 (App Router)**, **MongoDB**, and **Flutterwave**.

Users pay a one-time KES 450 fee to activate. When a user pays, commissions are distributed up to 3 levels:

| Level | Payout |
| ----- | ------ |
| 1     | KES 250 |
| 2     | KES 100 |
| 3     | KES 50  |
=======
A 3-level referral commission platform built with **Next.js 14 (App Router)**, **TypeScript**, **MongoDB (Mongoose)**, and **Flutterwave** for payments.

## Overview

EarnEasy is a referral-based earning platform where users pay a one-time activation fee (KES 450) to unlock earning potential. When a user makes a payment, commissions are automatically distributed up to 3 levels of their referral tree:

| Level | Payout | Description |
| ----- | ------ | ----------- |
| 1     | KES 250 | Direct referrals who pay |
| 2     | KES 100 | Referrals of your direct referrals |
| 3     | KES 50  | Third generation in your network |

Total potential earnings per paying member: **KES 400**

## Features

- 🔐 **Authentication**: JWT-based session management with HTTP-only cookies
- 👥 **3-Level Referral System**: Automatic upline resolution and commission distribution
- 💰 **Wallet System**: Balance tracking, earnings history, and payout requests
- 💳 **Flutterwave Integration**: Secure payment processing for KES transactions
- 📊 **Admin Dashboard**: Commission configuration, referral tree visualization, payout management
- 🔔 **Real-time Commission Engine**: Idempotent distribution with duplicate prevention
- 📱 **Responsive UI**: Built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Payments**: Flutterwave
- **Styling**: Tailwind CSS
- **Auth**: Jose (JWT), bcryptjs
- **Validation**: Zod

## Project Structure

```
earneasy/
├── app/
│   ├── (auth)/           # Login, Register pages
│   ├── (dashboard)/      # Protected user dashboard
│   │   ├── dashboard/    # Main dashboard with stats
│   │   ├── earnings/     # Commission ledger
│   │   ├── payouts/      # Withdrawal requests
│   │   ├── referrals/    # Referral tree & invite
│   │   ├── settings/     # Account settings
│   │   └── layout.tsx    # Auth-protected layout with sidebar nav
│   ├── (admin)/          # Admin-only pages
│   │   ├── admin/
│   │   └── layout.tsx    # Admin layout
│   ├── (marketing)/      # Public landing page
│   ├── api/              # API routes
│   │   ├── auth/         # Login, register, logout
│   │   ├── commissions/  # Commission ledger
│   │   ├── payments/     # Flutterwave webhooks & init
│   │   ├── payouts/      # Payout management
│   │   ├── referrals/    # Referral tree & codes
│   │   └── wallet/       # Wallet balance
│   ├── globals.css
│   └── layout.tsx        # Root layout
├── components/
│   ├── admin/            # Admin components
│   └── dashboard/        # Dashboard components
├── lib/
│   ├── auth/             # Session & middleware
│   ├── commission/       # Distribution engine
│   ├── db/               # MongoDB connection & models
│   ├── referral/         # Upline resolution
│   └── utils/            # Error handling
├── middleware.ts         # Route protection
├── tailwind.config.ts
└── package.json
```
>>>>>>> 33073f7 (Initial commit)

## Quick Start

```bash
<<<<<<< HEAD
npm install
cp .env.example .env.local   # fill in values
npm run seed                 # creates admin + demo users
npm run dev# Earneasy

=======
# 1. Navigate to project
cd earneasy

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Seed database (creates admin + demo users)
npm run seed

# 5. Start development server
npm run dev
```

App runs at **http://localhost:3000**

## Environment Variables

Create `.env.local` with:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/earneasy

# Auth
JWT_SECRET=your-super-secret-key-min-32-chars

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxx
FLUTTERWAVE_WEBHOOK_SECRET=your-webhook-secret
FLUTTERWAVE_BASE_URL=https://api.flutterwave.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Authentication Flow

1. **Register** → Creates user, generates referral code, sets `referredBy` if invite code provided
2. **Login** → Verifies password, creates JWT session token (7-day expiry), sets HTTP-only cookie
3. **Protected Routes** → Middleware checks session cookie, redirects to `/login` if invalid
4. **Dashboard Layout** → Server-side session verification, redirects if not authenticated
5. **API Routes** → `requireAuth()` / `requireAdmin()` helpers for server-side protection

## Referral Commission Engine

Located in `lib/commission/distributeCommission.ts`:

- Triggered by Flutterwave webhook on successful KES 450 payment
- Idempotent: checks `commissionDistributed` flag + unique index on `CommissionLedger`
- Resolves up to 3 uplines using `resolveUpline()` (walks `referredBy` chain)
- Credits wallet via `creditWallet()` and creates `CommissionLedger` entries
- Marks payment as `commissionDistributed = true`

## Database Models

- **User**: name, email, password, phone, role, referralCode, referredBy, level, hasPaid
- **Wallet**: userId, balance, totalEarned, totalWithdrawn
- **Payment**: userId, amount, status, flutterwaveTxRef, commissionDistributed
- **CommissionLedger**: userId, level, amount, sourcePaymentId, sourceUserId
- **CommissionConfig**: level1, level2, level3, totalPrice (singleton key="default")
- **Payout**: userId, amount, status, destination, reference, failureReason
- **ReferralCode**: code, userId, usedBy, usedAt

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login, sets session cookie
- `POST /api/auth/logout` - Clears session cookie

### Wallet
- `GET /api/wallet` - Get wallet balance & stats

### Referrals
- `GET /api/referrals` - Get user's referral code
- `POST /api/referrals/generate-code` - Generate new referral code
- `GET /api/referrals/tree/[userId]` - Get referral tree (admin or self)

### Commissions
- `GET /api/commissions` - List user's commissions
- `GET /api/commissions/[id]` - Get single commission entry

### Payments (Flutterwave)
- `POST /api/payments/flutterwave/initiate` - Initialize payment
- `POST /api/payments/flutterwave/verify` - Verify transaction
- `POST /api/payments/flutterwave/webhook` - Flutterwave webhook handler

### Payouts
- `GET /api/payouts` - List user's payout requests
- `POST /api/payouts` - Create payout request
- `GET /api/payouts/[id]` - Get payout details
- `POST /api/payouts/callback` - Payout provider callback

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/commission-config` - Get commission config
- `POST /api/admin/commission-config` - Update commission config

## Deployment

1. **Database**: MongoDB Atlas or self-hosted
2. **Environment**: Set all production env vars
3. **Build**: `npm run build`
4. **Start**: `npm start` (or deploy to Vercel)
5. **Flutterwave**: Configure webhook URL to `/api/payments/flutterwave/webhook`

## Admin Access

After seeding, login with:
- Email: `admin@earneasy.com`
- Password: `admin123`

Change password immediately in production!

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with admin + demo users

## License

MIT
>>>>>>> 33073f7 (Initial commit)
