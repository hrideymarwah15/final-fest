"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    useEffect(() => setMounted(true), []);

    const stats = [
        { value: "15+", label: "Sports" },
        { value: "50+", label: "Colleges" },
        { value: "2K+", label: "Athletes" },
    ];

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[var(--bg-primary)]" />
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(220, 38, 38, 0.15), transparent)'
                }}
            />

            {/* Content */}
            <motion.div
                style={{ opacity, y }}
                className="relative z-10 container text-center pt-20"
            >
                {/* Tag */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <span className="badge badge-accent">
                        Feb 14-16, 2026
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-display text-display mb-6"
                >
                    <span className="block text-[var(--text-primary)]">RISHIHOOD</span>
                    <span className="block text-gradient">SPORTS FEST</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-subheading text-[var(--text-secondary)] max-w-md mx-auto mb-10"
                >
                    The ultimate inter-college championship.
                    <span className="block text-[var(--text-primary)] mt-1">Compete. Connect. Conquer.</span>
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
                >
                    <Link href="/signup" className="btn btn-primary px-6 py-3 group">
                        Register Now
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link href="/sports" className="btn btn-secondary px-6 py-3">
                        View Sports
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex justify-center gap-12 sm:gap-16"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="font-display text-3xl sm:text-4xl text-[var(--text-primary)]">
                                {stat.value}
                            </div>
                            <div className="text-caption text-[var(--text-muted)] uppercase mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={20} className="text-[var(--text-muted)]" />
                </motion.div>
            </motion.div>
        </section>
    );
}
