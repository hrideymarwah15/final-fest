"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Sample sports data
const featuredSports = [
    {
        id: 1,
        name: "Football",
        slug: "football",
        description: "5-a-side tournament with knockout rounds",
        icon: "⚽",
        type: "TEAM",
        gradient: "from-emerald-500 to-emerald-700",
        accentColor: "#22c55e",
        fee: 2000,
        date: "Feb 14, 2026",
        venue: "Main Ground",
        filledSlots: 42,
        maxSlots: 48,
    },
    {
        id: 2,
        name: "Basketball",
        slug: "basketball",
        description: "3x3 format with group stage and finals",
        icon: "🏀",
        type: "TEAM",
        gradient: "from-orange-500 to-orange-700",
        accentColor: "#f97316",
        fee: 1500,
        date: "Feb 14-15, 2026",
        venue: "Indoor Court",
        filledSlots: 28,
        maxSlots: 32,
    },
    {
        id: 3,
        name: "Badminton",
        slug: "badminton",
        description: "Singles and doubles categories",
        icon: "🏸",
        type: "INDIVIDUAL",
        gradient: "from-violet-500 to-violet-700",
        accentColor: "#8b5cf6",
        fee: 500,
        date: "Feb 15, 2026",
        venue: "Sports Complex",
        filledSlots: 56,
        maxSlots: 64,
    },
    {
        id: 4,
        name: "Cricket",
        slug: "cricket",
        description: "T10 format with exciting matches",
        icon: "🏏",
        type: "TEAM",
        gradient: "from-blue-500 to-blue-700",
        accentColor: "#3b82f6",
        fee: 2500,
        date: "Feb 14-16, 2026",
        venue: "Cricket Ground",
        filledSlots: 12,
        maxSlots: 16,
    },
];

export function FeaturedSportsSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--background-secondary)]" />
            <div className="absolute inset-0 dots-bg" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge variant="secondary" className="mb-4">Featured Events</Badge>
                    <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[var(--accent-secondary)] mb-4">
                        CHOOSE YOUR SPORT
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        From individual excellence to team glory, find your arena and compete with the best.
                    </p>
                </motion.div>

                {/* Sports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {featuredSports.map((sport, index) => {
                        const percentage = Math.round((sport.filledSlots / sport.maxSlots) * 100);
                        const isAlmostFull = percentage >= 80;

                        return (
                            <motion.div
                                key={sport.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link href={`/sports/${sport.slug}`}>
                                    <Card glow className="group h-full">
                                        {/* Gradient Accent Line */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sport.gradient}`} />

                                        <div className="p-6 lg:p-8">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center text-3xl`}
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    >
                                                        {sport.icon}
                                                    </motion.div>
                                                    <div>
                                                        <h3 className="font-display text-2xl text-[var(--accent-secondary)]">
                                                            {sport.name}
                                                        </h3>
                                                        <p className="text-sm text-[var(--text-muted)]">{sport.description}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={sport.type === "TEAM" ? "team" : "individual"}>
                                                    {sport.type === "TEAM" ? (
                                                        <><Users className="w-3 h-3 mr-1" /> Team</>
                                                    ) : (
                                                        <><User className="w-3 h-3 mr-1" /> Solo</>
                                                    )}
                                                </Badge>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                                                    {sport.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                                                    {sport.venue}
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-6">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm text-[var(--text-muted)]">Registration Progress</span>
                                                    <span
                                                        className="text-sm font-mono font-semibold"
                                                        style={{ color: sport.accentColor }}
                                                    >
                                                        {sport.filledSlots}/{sport.maxSlots}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full bg-gradient-to-r ${sport.gradient} rounded-full`}
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${percentage}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: 0.3 }}
                                                    />
                                                </div>
                                                {isAlmostFull && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-xs text-amber-400 mt-2 flex items-center gap-1"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                        Almost Full - Register Soon!
                                                    </motion.p>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="flex justify-between items-center pt-4 border-t border-[var(--card-border)]">
                                                <div>
                                                    <span className="text-xs text-[var(--text-muted)] uppercase">Entry Fee</span>
                                                    <p className="font-mono text-xl font-bold text-[var(--accent-secondary)]">
                                                        {formatCurrency(sport.fee)}
                                                    </p>
                                                </div>
                                                <motion.div
                                                    className="flex items-center gap-2 text-[var(--accent-primary)] font-medium"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <span>View Details</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                                            style={{
                                                background: `radial-gradient(600px circle at 50% 50%, ${sport.accentColor}10, transparent 40%)`
                                            }}
                                        />
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link href="/sports">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 text-[var(--accent-secondary)] font-medium text-lg hover:text-[var(--accent-primary)] transition-colors"
                        >
                            View All Sports
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
