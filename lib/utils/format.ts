export function formatKES(amount: number): string {
  return `KES ${new Intl.NumberFormat("en-KE").format(amount)}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncate(str: string, len = 40): string {
  return str.length > len ? `${str.slice(0, len)}…` : str;
}