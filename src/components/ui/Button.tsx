import { forwardRef } from "react";
import type { ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonVariant =
  | "ghostPill"
  | "ghostPillCompact"
  | "frostedPill"
  | "ghostRounded"
  | "solidWhitePill"
  | "solidWhitePillCompact"
  | "solidWhite"
  | "solidWhiteWide"
  | "primary"
  | "primaryTight"
  | "outline"
  | "outlineMuted"
  | "outlineWide"
  | "frostedIcon"
  | "frostedIconCompact"
  | "sidebarIcon"
  | "overlayClose"
  | "galleryClose"
  | "authProvider"
  | "subscribe"
  | "carouselNav"
  | "mockup"
  | "mobileClose"
  | "gradient";

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant: Exclude<ButtonVariant, "gradient">;
};

type GradientButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant: "gradient";
  gradientFrom: string;
  gradientTo: string;
};

type ButtonProps = BaseButtonProps | GradientButtonProps;

const variantStyles: Record<Exclude<ButtonVariant, "gradient">, string> = {
  ghostPill:
    "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10",
  ghostPillCompact:
    "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white/60 transition hover:bg-white/10",
  frostedPill:
    "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20",
  ghostRounded:
    "inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:bg-white/5",
  solidWhitePill:
    "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200",
  solidWhitePillCompact:
    "inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90",
  solidWhite:
    "inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white/90",
  solidWhiteWide:
    "inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200",
  primary:
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400",
  primaryTight:
    "inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60",
  outline:
    "inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
  outlineMuted:
    "inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10",
  outlineWide:
    "inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10",
  frostedIcon:
    "inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10",
  frostedIconCompact:
    "inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10",
  sidebarIcon:
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/15",
  overlayClose:
    "grid size-9 place-items-center rounded-full bg-black/60 text-white/90 transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-white/40",
  galleryClose:
    "inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/40 group-hover:opacity-100",
  authProvider:
    "inline-flex w-full items-center justify-center gap-3 rounded-full bg-neutral-800 px-6 py-4 text-lg font-medium text-white ring-1 ring-white/10 transition hover:bg-neutral-700 active:scale-[.995]",
  subscribe:
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 bg-gradient-to-r from-fuchsia-400/30 via-pink-400/30 to-purple-400/30 transition hover:from-fuchsia-400/40 hover:to-purple-400/40",
  carouselNav:
    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow transition hover:bg-white",
  mockup:
    "inline-flex items-center justify-center rounded-lg bg-[#6f2da8] px-3 py-1.5 text-sm font-medium text-white",
  mobileClose:
    "inline-flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white",
};

const gradientBaseClasses =
  "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg transition hover:brightness-105";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, ...restProps },
  ref,
) {
  if (variant === "gradient") {
    const { children, gradientFrom, gradientTo, style, ...rest } = restProps as GradientButtonProps;
    const backgroundImage = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;
    const mergedStyle: CSSProperties = { ...style, backgroundImage };
    return (
      <button ref={ref} className={gradientBaseClasses} style={mergedStyle} {...rest}>
        {children}
      </button>
    );
  }

  const { children, style, ...rest } = restProps as BaseButtonProps;
  const className = variantStyles[variant];

  return (
    <button ref={ref} className={className} style={style} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant };
