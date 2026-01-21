"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
    primary: "bg-[var(--accent-primary)] text-[var(--accent-secondary)] hover:bg-[var(--accent-primary-hover)] hover:shadow-lg hover:shadow-[var(--accent-primary-glow)]",
    secondary: "bg-transparent text-[var(--accent-secondary)] border-2 border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--background)]",
    tertiary: "bg-[var(--accent-tertiary)] text-white hover:bg-[var(--accent-tertiary-hover)]",
    ghost: "bg-transparent text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] hover:bg-[var(--accent-primary-dim)]",
    danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, icon, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                disabled={disabled || isLoading}
                className={cn(
                    "relative inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-widest rounded-lg transition-all duration-300 btn-shimmer",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : icon ? (
                    <span className="w-4 h-4">{icon}</span>
                ) : null}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
