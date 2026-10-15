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
}