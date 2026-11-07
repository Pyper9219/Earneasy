<<<<<<< HEAD
import clsx from "clsx";
import type { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("bg-white rounded-2xl border p-6", className)}>
      {children}
    </div>
  );
=======
import clsx from "clsx";
import type { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("bg-white rounded-2xl border p-6", className)}>
      {children}
    </div>
  );
>>>>>>> 33073f7 (Initial commit)
}