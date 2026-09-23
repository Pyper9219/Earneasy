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
}