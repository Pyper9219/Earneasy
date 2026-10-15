export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-block border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin"
      aria-label="Loading"
    />
  );
}