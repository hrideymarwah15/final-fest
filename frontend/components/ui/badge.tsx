import { cn } from "@/lib/utils";

interface BadgeProps {
    variant?: "default" | "accent" | "success" | "warning";
    className?: string;
    children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
    const variants: Record<string, string> = {
        default: "bg-white/5 text-[var(--text-secondary)]",
        accent: "bg-[var(--accent-muted)] text-[var(--accent-hover)]",
        success: "bg-[var(--success)]/15 text-[var(--success)]",
        warning: "bg-[var(--warning)]/15 text-[var(--warning)]",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide rounded",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
