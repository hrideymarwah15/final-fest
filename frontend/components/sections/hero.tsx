"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Trophy, Users, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const stats = [
        { icon: Trophy, value: "15+", label: "Sports Events" },
        { icon: Users, value: "50+", label: "Colleges" },
        { icon: Flame, value: "2000+", label: "Athletes" },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            <div className="absolute inset-0 grid-bg" />

            {/* Gradient Orbs */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-primary)]/20 blur-[120px]"
                animate={{
                    x: mousePosition.x * 2,
                    y: mousePosition.y * 2,
                }}
                transition={{ type: "spring", stiffness: 50, damping: 30 }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-secondary)]/10 blur-[120px]"
                animate={{
                    x: -mousePosition.x * 2,
                    y: -mousePosition.y * 2,
                }}
                transition={{ type: "spring", stiffness: 50, damping: 30 }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                {/* Pre-title Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="primary" className="mb-8 glass">
                        <Sparkles className="w-3 h-3 mr-1" />
                        February 14-16, 2026
                    </Badge>
                </motion.div>

                {/* Main Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6"
                >
                    <h1 className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] tracking-wide">
                        <span className="text-[var(--accent-secondary)]">RISHIHOOD</span>
                        <br />
                        <span className="text-gradient text-glow">SPORTS FEST</span>
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10"
                >
                    Experience the thrill of competition. Join thousands of athletes
                    from across India in the biggest inter-college sports festival.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                >
                    <Link href="/signup">
                        <Button size="lg" className="group">
                            Register Now
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/sports">
                        <Button variant="secondary" size="lg">
                            Explore Sports
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--accent-primary-dim)] mb-3">
                                <stat.icon className="w-6 h-6 text-[var(--accent-primary)]" />
                            </div>
                            <div className="font-mono text-3xl lg:text-4xl font-bold text-[var(--accent-secondary)]">
                                {stat.value}
                            </div>
                            <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center text-[var(--text-muted)]"
                    >
                        <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[var(--accent-primary)]/30" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[var(--accent-primary)]/30" />
        </section>
    );
}
