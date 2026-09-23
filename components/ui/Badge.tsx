import clsx from "clsx";
import type { ReactNode } from "react";

type Variant = "success" | "warning" | "danger" | "neutral" | "info";

export default function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-emerald-100 text-emerald-700": variant === "success",
          "bg-amber-100 text-amber-700": variant === "warning",
          "bg-red-100 text-red-700": variant === "danger",
          "bg-slate-100 text-slate-700": variant === "neutral",
          "bg-sky-100 text-sky-700": variant === "info",
        }
      )}
    >
      {children}
    </span>
  );
}