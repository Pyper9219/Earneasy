<<<<<<< HEAD
﻿export async function initiateTransfer(payload: any) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const response = await fetch('https://api.flutterwave.com/v3/transfers', {
    method: 'POST', headers: { Authorization: 'Bearer ' + secretKey, 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return await response.json();
=======
import { flwClient } from "./client";

export interface TransferPayload {
  account_bank: string;
  account_number: string;
  amount: number;
  currency: string;
  narration: string;
  reference: string;
  callback_url?: string;
  debit_currency?: string;
}

export async function initiateTransfer(payload: TransferPayload) {
  const { data } = await flwClient.post("/transfers", payload);
  return data;
>>>>>>> 33073f7 (Initial commit)
}