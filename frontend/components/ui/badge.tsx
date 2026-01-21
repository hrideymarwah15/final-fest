"use client";

import { cn } from "@/lib/utils";

type BadgeVariant =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "individual"
    | "team";

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variants: Record<BadgeVariant, string> = {
    default: "bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)]",
    primary: "bg-[var(--accent-primary-dim)] text-[var(--accent-primary-light)] border-[var(--accent-primary)]",
    secondary: "bg-[var(--accent-secondary-dim)] text-[var(--accent-secondary)] border-[var(--accent-secondary-dark)]",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    error: "bg-red-500/15 text-red-400 border-red-500/30",
    individual: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    team: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border",
                "transition-all duration-200 hover:scale-105",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
