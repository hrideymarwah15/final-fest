"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Users, User } from "lucide-react";

const sports = [
    {
        id: 1, name: "Football", slug: "football",
        description: "5-a-side knockout tournament",
        type: "TEAM", fee: 2000,
        slots: { filled: 42, max: 48 },
    },
    {
        id: 2, name: "Basketball", slug: "basketball",
        description: "3x3 format with group stage",
        type: "TEAM", fee: 1500,
        slots: { filled: 28, max: 32 },
    },
    {
        id: 3, name: "Badminton", slug: "badminton",
        description: "Singles and doubles categories",
        type: "INDIVIDUAL", fee: 500,
        slots: { filled: 56, max: 64 },
    },
    {
        id: 4, name: "Cricket", slug: "cricket",
        description: "T10 format matches",
        type: "TEAM", fee: 2500,
        slots: { filled: 12, max: 16 },
    },
];

export function FeaturedSportsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section bg-[var(--bg-secondary)]">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="text-caption text-[var(--accent)] uppercase tracking-widest block mb-4">
                        Featured Events
                    </span>
                    <h2 className="font-display text-heading text-[var(--text-primary)]">
                        Choose Your Sport
                    </h2>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sports.map((sport, index) => {
                        const percentage = (sport.slots.filled / sport.slots.max) * 100;

                        return (
                            <motion.div
                                key={sport.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link href={`/sports/${sport.slug}`}>
                                    <div className="card card-interactive p-6 h-full group">
                                        {/* Header row */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-display text-xl text-[var(--text-primary)] mb-1">
                                                    {sport.name}
                                                </h3>
                                                <p className="text-small text-[var(--text-muted)]">
                                                    {sport.description}
                                                </p>
                                            </div>
                                            <span className="badge">
                                                {sport.type === "TEAM" ? <Users size={10} /> : <User size={10} />}
                                                {sport.type === "TEAM" ? "Team" : "Solo"}
                                            </span>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-caption mb-2">
                                                <span className="text-[var(--text-muted)]">
                                                    {percentage >= 80 && <span className="text-[var(--warning)] mr-1">●</span>}
                                                    Registrations
                                                </span>
                                                <span className="text-[var(--text-secondary)] font-medium">
                                                    {sport.slots.filled}/{sport.slots.max}
                                                </span>
                                            </div>
                                            <div className="h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-[var(--accent)] rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={isInView ? { width: `${percentage}%` } : {}}
                                                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                                                />
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                                            <div>
                                                <span className="text-caption text-[var(--text-muted)] block">Entry</span>
                                                <span className="font-display text-lg text-[var(--text-primary)]">
                                                    ₹{sport.fee.toLocaleString()}
                                                </span>
                                            </div>
                                            <span className="text-small text-[var(--text-muted)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-10"
                >
                    <Link
                        href="/sports"
                        className="inline-flex items-center gap-2 text-small text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        View all sports <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
