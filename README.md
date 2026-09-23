# EarnEasy

A 3-level referral commission platform built with **Next.js 14 (App Router)**, **MongoDB**, and **Flutterwave**.

Users pay a one-time KES 450 fee to activate. When a user pays, commissions are distributed up to 3 levels:

| Level | Payout |
| ----- | ------ |
| 1     | KES 250 |
| 2     | KES 100 |
| 3     | KES 50  |

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in values
npm run seed                 # creates admin + demo users
npm run dev# Earneasy

