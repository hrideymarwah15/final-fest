"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
    const Comp = hover ? motion.div : "div";

    return (
        <Comp
            {...(hover && {
                whileHover: { y: -2 },
                transition: { duration: 0.2 }
            })}
            className={cn(
                "bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl transition-colors",
                hover && "hover:border-[var(--border-default)]",
                className
            )}
        >
            {children}
        </Comp>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-5 pb-0", className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-5", className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-5 pt-0 border-t border-[var(--border-subtle)]", className)}>
            {children}
        </div>
    );
}
