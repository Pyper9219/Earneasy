<<<<<<< HEAD
﻿export async function initiatePayment(payload: any) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST', headers: { Authorization: 'Bearer ' + secretKey, 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return await response.json();
=======
import { flwClient } from "./client";
import type {
  FlutterwaveInitPayload,
  FlutterwaveInitResponse,
} from "@/types/flutterwave";

export async function initiatePayment(
  payload: FlutterwaveInitPayload
): Promise<FlutterwaveInitResponse> {
  const { data } = await flwClient.post<FlutterwaveInitResponse>(
    "/payments",
    payload
  );
  return data;
>>>>>>> 33073f7 (Initial commit)
}