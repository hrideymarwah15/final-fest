"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [mounted, setMounted] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        const target = new Date("2026-02-07T09:00:00").getTime();

        const update = () => {
            const diff = target - Date.now();
            if (diff <= 0) {
                setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return;
            }

            setCountdown({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                secs: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };

        update();
        intervalRef.current = setInterval(update, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const units = [
        { value: countdown.days, label: "Days" },
        { value: countdown.hours, label: "Hours" },
        { value: countdown.mins, label: "Mins" },
        { value: countdown.secs, label: "Secs" },
    ];

    if (!mounted) return null;

    return (
        <section ref={ref} className="section bg-[var(--bg-secondary)]">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="badge badge-accent mb-6">Limited Spots</span>

                        <h2 className="font-display text-heading text-[var(--text-primary)] mb-4">
                            Don't Miss<br />
                            <span className="text-[var(--accent)]">The Action</span>
                        </h2>

                        <p className="text-body text-[var(--text-secondary)] mb-8 max-w-md">
                            Registrations are filling up fast. Secure your spot in the biggest
                            inter-college sports event of the year.
                        </p>

                        {/* Event info */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                                <Calendar size={14} className="text-[var(--accent)]" />
                                <span className="text-small text-[var(--text-primary)]">Feb 7-8, 2026</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                                <MapPin size={14} className="text-[var(--accent)]" />
                                <span className="text-small text-[var(--text-primary)]">Rishihood University</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link href="/signup" className="btn btn-primary px-6 py-3 group">
                            Register Now
                            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Countdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="card p-8"
                    >
                        <span className="text-caption text-[var(--text-muted)] uppercase tracking-widest block mb-6">
                            Event Starts In
                        </span>

                        <div className="grid grid-cols-4 gap-3">
                            {units.map((unit) => (
                                <div key={unit.label} className="text-center">
                                    <div className="bg-[var(--bg-primary)] rounded-lg py-4 mb-2">
                                        <span className="font-display text-3xl sm:text-4xl text-[var(--text-primary)]">
                                            {String(unit.value).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <span className="text-caption text-[var(--text-muted)] uppercase">
                                        {unit.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex justify-between text-small">
                            <span className="text-[var(--text-muted)]">Early bird ends</span>
                            <span className="text-[var(--accent)]">Jan 25, 2026</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
