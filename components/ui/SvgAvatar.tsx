/**
 * Avatar drawn as inline SVG: initials on a colour derived from the name.
 * No network request, no raster image, scales perfectly.
 */
export default function SvgAvatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const clean = (name || "?").trim();
  const initials =
    clean
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const hue =
    Array.from(clean).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={clean}
      className={className}
    >
      <circle cx="32" cy="32" r="32" fill={`hsl(${hue}, 55%, 38%)`} />
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
      />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="#ffffff"
      >
        {initials}
      </text>
    </svg>
  );
}
