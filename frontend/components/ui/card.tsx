"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    hover?: boolean;
    glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = true, glow = false, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hover ? { y: -8, scale: 1.01 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(
                    "relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden",
                    "transition-all duration-300",
                    hover && "hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)] hover:border-[var(--accent-primary-dim)]",
                    glow && "hover:border-[var(--accent-primary)] hover:shadow-[0_0_40px_rgba(178,14,56,0.15)]",
                    className
                )}
                {...props}
            >
                {children}
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent opacity-0 hover:opacity-5 pointer-events-none transition-opacity" />
            </motion.div>
        );
    }
);

Card.displayName = "Card";

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("p-6 lg:p-8", className)}>
            {children}
        </div>
    );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("p-6 lg:p-8 pt-0", className)}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("p-6 lg:p-8 pt-4 border-t border-[var(--card-border)]", className)}>
            {children}
        </div>
    );
}
