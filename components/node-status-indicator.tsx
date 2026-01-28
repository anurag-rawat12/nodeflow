import { type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";
export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

/* ---------------- Overlay Spinner ---------------- */

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      {/* overlay ring only — no size change */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl outline outline-2 outline-offset-[-2px] outline-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.6)]" />

      <div className="absolute inset-0 z-50 rounded-2xl bg-background/50 backdrop-blur-sm" />

      <div className="pointer-events-none absolute inset-0 z-50 grid place-items-center">
        <span className="absolute h-12 w-12 animate-pulse rounded-full bg-blue-500/25 blur-md" />
        <LoaderCircle className="size-6 animate-spin text-blue-500" />
      </div>

      {children}
    </div>
  );
};

/* ---------------- Animated Border (NO SIZE CHANGE) ---------------- */

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative">
      {/* overlay gradient ring */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl",
          "outline outline-2 outline-offset-[-2px] outline-blue-400",
          "shadow-[0_0_18px_rgba(59,130,246,0.7)]",
          "before:content-[''] before:absolute before:inset-0 before:rounded-2xl",
          "before:bg-[conic-gradient(from_0deg,theme(colors.blue.500),transparent,theme(colors.blue.500))]",
          "before:animate-spin before:opacity-70",
          className
        )}
      />
      {children}
    </div>
  );
};

/* ---------------- Static Border (NO SIZE CHANGE) ---------------- */

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl outline outline-2 outline-offset-[-2px]",
          className
        )}
      />
      {children}
    </div>
  );
};

/* ---------------- Main Wrapper ---------------- */

export const NodeStatusIndicator = ({
  status = "initial",
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  if (status === "loading") {
    if (variant === "overlay") {
      return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
    }
    return (
      <BorderLoadingIndicator className={className}>
        {children}
      </BorderLoadingIndicator>
    );
  }

  if (status === "success") {
    return (
      <StatusBorder
        className={cn(
          "outline-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.8)]",
          className
        )}
      >
        {children}
      </StatusBorder>
    );
  }

  if (status === "error") {
    return (
      <StatusBorder
        className={cn(
          "outline-red-400 shadow-[0_0_18px_rgba(248,113,113,0.85)]",
          className
        )}
      >
        {children}
      </StatusBorder>
    );
  }

  return <>{children}</>;
};
