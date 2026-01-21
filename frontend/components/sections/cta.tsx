"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CountdownUnit {
    value: number;
    label: string;
}

export function CTASection() {
    const [countdown, setCountdown] = useState<CountdownUnit[]>([
        { value: 0, label: "Days" },
        { value: 0, label: "Hours" },
        { value: 0, label: "Minutes" },
        { value: 0, label: "Seconds" },
    ]);

    useEffect(() => {
        const targetDate = new Date("2026-02-14T09:00:00");

        const updateCountdown = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff > 0) {
                setCountdown([
                    { value: Math.floor(diff / (1000 * 60 * 60 * 24)), label: "Days" },
                    { value: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), label: "Hours" },
                    { value: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), label: "Minutes" },
                    { value: Math.floor((diff % (1000 * 60)) / 1000), label: "Seconds" },
                ]);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--background-secondary)]" />
            <div className="absolute inset-0 grid-bg opacity-50" />

            {/* Animated Border */}
            <div className="absolute inset-4 lg:inset-8 rounded-3xl border border-[var(--card-border)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/20 via-transparent to-[var(--accent-secondary)]/20 animate-gradient" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="primary" className="mb-6">
                            <Trophy className="w-3 h-3 mr-1" />
                            Limited Spots Available
                        </Badge>

                        <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[var(--accent-secondary)] mb-6 leading-tight">
                            DON&apos;T MISS
                            <br />
                            <span className="text-gradient">THE ACTION</span>
                        </h2>

                        <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
                            Registrations are filling up fast! Secure your spot now and be part of
                            the most exciting inter-college sports event of the year.
                        </p>

                        {/* Event Info */}
                        <div className="flex flex-wrap gap-6 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-dim)] flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] uppercase">Date</p>
                                    <p className="text-[var(--accent-secondary)] font-medium">Feb 14-16, 2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-dim)] flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] uppercase">Venue</p>
                                    <p className="text-[var(--accent-secondary)] font-medium">Rishihood University</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/signup">
                                <Button size="lg" className="group w-full sm:w-auto">
                                    Register Now
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/schedule">
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                    View Schedule
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Countdown Timer */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="text-center mb-8">
                            <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-2">
                                Event Starts In
                            </p>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto" />
                        </div>

                        <div className="grid grid-cols-4 gap-3 sm:gap-4">
                            {countdown.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 sm:p-4 text-center group-hover:border-[var(--accent-primary)] transition-colors">
                                        <motion.div
                                            key={item.value}
                                            initial={{ y: -10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-secondary)]"
                                        >
                                            {String(item.value).padStart(2, "0")}
                                        </motion.div>
                                        <div className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider mt-1">
                                            {item.label}
                                        </div>
                                    </div>
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity -z-10" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Decorative Trophy */}
                        <motion.div
                            className="absolute -top-8 -right-8 text-6xl opacity-20"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            🏆
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[var(--accent-primary)]/30 rounded-tl-3xl" />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[var(--accent-primary)]/30 rounded-br-3xl" />
        </section>
    );
}
