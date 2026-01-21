"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, iconPosition = "left", type = "text", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        {label}
                        {props.required && <span className="text-[var(--accent-primary)] ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {icon && iconPosition === "left" && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={type}
                        className={cn(
                            "w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-[var(--foreground)] rounded-xl px-4 py-3",
                            "placeholder:text-[var(--text-muted)]",
                            "focus:outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary-dim)]",
                            "hover:border-[var(--accent-primary-dim)]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all duration-200",
                            icon && iconPosition === "left" && "pl-12",
                            icon && iconPosition === "right" && "pr-12",
                            error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-red-500/20",
                            className
                        )}
                        {...props}
                    />
                    {icon && iconPosition === "right" && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            {icon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-2 text-sm text-[var(--error)] animate-fade-in">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
