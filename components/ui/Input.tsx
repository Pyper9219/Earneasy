import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...rest }: Props) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        className={clsx(
          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500",
          error && "border-red-500",
          className
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}