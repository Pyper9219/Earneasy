import { flwClient } from "./client";
import type { FlutterwaveVerifyResponse } from "@/types/flutterwave";

export async function verifyPayment(
  transactionId: number | string
): Promise<FlutterwaveVerifyResponse> {
  const { data } = await flwClient.get<FlutterwaveVerifyResponse>(
    `/transactions/${transactionId}/verify`
  );
  return data;
}