<<<<<<< HEAD
﻿export async function verifyPayment(transactionId: string) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) throw new Error('Flutterwave secret key is missing');
  const response = await fetch('https://api.flutterwave.com/v3/transactions/' + transactionId + '/verify', {
    headers: { Authorization: 'Bearer ' + secretKey, 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (data.status === 'success' && data.data.status === 'successful') return { success: true, data: data.data };
  return { success: false, data: data.data };
=======
import { flwClient } from "./client";
import type { FlutterwaveVerifyResponse } from "@/types/flutterwave";

export async function verifyPayment(
  transactionId: number | string
): Promise<FlutterwaveVerifyResponse> {
  const { data } = await flwClient.get<FlutterwaveVerifyResponse>(
    `/transactions/${transactionId}/verify`
  );
  return data;
>>>>>>> 33073f7 (Initial commit)
}