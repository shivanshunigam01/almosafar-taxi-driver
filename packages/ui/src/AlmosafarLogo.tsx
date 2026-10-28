import type { CSSProperties } from "react";

export type AlmosafarLogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "mark";
  className?: string;
  style?: CSSProperties;
};

const sizes = { sm: 36, md: 48, lg: 64 };

export function AlmosafarLogo({
  size = "md",
  variant = "light",
  className = "",
  style,
}: AlmosafarLogoProps) {
  const px = sizes[size];
  const bg =
    variant === "dark" ? "#2563eb" : variant === "mark" ? "transparent" : "#2563eb";
  const text = variant === "dark" ? "#fff" : "#fff";

  if (variant === "mark") {
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 64 64"
        className={className}
        style={style}
        aria-hidden
      >
        <rect width="64" height="64" rx="16" fill="#2563eb" />
        <path
          d="M12 40h40l-6-14H18l-6 14zm8-18h24l4 10H16l4-10z"
          fill="#fff"
          opacity="0.95"
        />
        <circle cx="20" cy="42" r="4" fill="#1e293b" />
        <circle cx="44" cy="42" r="4" fill="#1e293b" />
      </svg>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      style={style}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-2xl font-bold shadow-md"
        style={{
          width: px,
          height: px,
          background: bg,
          color: text,
          fontSize: px * 0.35,
        }}
      >
        AT
      </div>
      {size !== "sm" && (
        <div className="leading-tight">
          <div
            className="font-bold tracking-tight"
            style={{
              color: variant === "light" ? "#0f172a" : "#f8fafc",
              fontSize: size === "lg" ? "1.25rem" : "1rem",
            }}
          >
            Almosafar
          </div>
          <div
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: variant === "light" ? "#64748b" : "#94a3b8" }}
          >
            Taxi
          </div>
        </div>
      )}
    </div>
  );
}
