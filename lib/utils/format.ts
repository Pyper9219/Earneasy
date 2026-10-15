import { CURRENCY } from "@/lib/utils/constants";

const numberFormatter = new Intl.NumberFormat("en-KE");

export function formatKES(amount: number): string {
  return `${CURRENCY} ${numberFormatter.format(amount)}`;
}

export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString("en-KE");
}
