"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Users, User, Calendar, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sportData: Record<string, any> = {
    football: {
        name: "Football", type: "TEAM", teamSize: "5-8 players",
        description: "5-a-side knockout tournament with intense matches testing your team's skills.",
        fee: 2000, earlyBirdFee: 1500,
        date: "Feb 14, 2026", time: "9:00 AM - 6:00 PM",
        venue: "Main Ground, Rishihood University",
        slots: { filled: 42, max: 48 },
        rules: [
            "5 players per team on field",
            "2 halves of 15 minutes each",
            "Rolling substitutions allowed",
            "No slide tackles",
        ],
    },
};

export default function SportDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const sport = sportData[slug] || sportData.football;
    const pct = (sport.slots.filled / sport.slots.max) * 100;
    const spotsLeft = sport.slots.max - sport.slots.filled;

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="container max-w-4xl">
                {/* Back */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-8 mb-6"
                >
                    <Link href="/sports" className="inline-flex items-center gap-2 text-small text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <ArrowLeft size={14} /> Back to Sports
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="font-display text-heading text-[var(--text-primary)] mb-1">
                                        {sport.name}
                                    </h1>
                                    <Badge>
                                        {sport.type === "TEAM" ? <Users size={10} /> : <User size={10} />}
                                        {sport.type}
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-body text-[var(--text-secondary)]">
                                {sport.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card p-6"
                        >
                            <h2 className="font-display text-base text-[var(--text-primary)] mb-4">Details</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
                                    <Calendar size={16} className="text-[var(--accent)]" />
                                    <div>
                                        <p className="text-caption text-[var(--text-muted)]">Date</p>
                                        <p className="text-small text-[var(--text-primary)]">{sport.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
                                    <MapPin size={16} className="text-[var(--accent)]" />
                                    <div>
                                        <p className="text-caption text-[var(--text-muted)]">Venue</p>
                                        <p className="text-small text-[var(--text-primary)]">{sport.venue}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card p-6"
                        >
                            <h2 className="font-display text-base text-[var(--text-primary)] mb-4">Rules</h2>
                            <ul className="space-y-2">
                                {sport.rules.map((rule: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-small text-[var(--text-secondary)]">
                                        <CheckCircle size={14} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="card p-6 sticky top-24">
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-display text-3xl text-[var(--text-primary)]">
                                        ₹{sport.earlyBirdFee.toLocaleString()}
                                    </span>
                                    <span className="text-small text-[var(--text-muted)] line-through">
                                        ₹{sport.fee.toLocaleString()}
                                    </span>
                                </div>
                                <Badge variant="accent">Early Bird</Badge>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-caption mb-2">
                                    <span className="text-[var(--text-muted)]">Registrations</span>
                                    <span className="text-[var(--text-secondary)]">
                                        {sport.slots.filled}/{sport.slots.max}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                {spotsLeft <= 10 && (
                                    <p className="text-caption text-[var(--warning)] mt-2">
                                        Only {spotsLeft} spots left
                                    </p>
                                )}
                            </div>

                            <Link href={`/register/${slug}`}>
                                <Button className="w-full mb-4">
                                    Register Now <ArrowRight size={16} />
                                </Button>
                            </Link>

                            <div className="space-y-2 text-caption text-[var(--text-muted)]">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={12} className="text-[var(--success)]" />
                                    Instant confirmation
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={12} className="text-[var(--success)]" />
                                    Secure payment
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
