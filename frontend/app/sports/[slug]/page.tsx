"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft, Calendar, MapPin, Users, User, Clock, Trophy,
    CheckCircle, AlertCircle, ArrowRight, Share2, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

// Mock sport data
const sportData: Record<string, any> = {
    football: {
        id: 1, name: "Football", slug: "football", category: "Outdoor",
        description: "Experience the thrill of competitive 5-a-side football! Our tournament features knockout rounds with intense matches that will test your team's skills, strategy, and stamina.",
        rules: [
            "Each team must have 5 players on the field",
            "Match duration: 2 halves of 15 minutes each",
            "Rolling substitutions allowed",
            "No slide tackles permitted",
            "Goalkeeper can play the ball across the halfway line",
        ],
        icon: "⚽", type: "TEAM", teamMin: 5, teamMax: 8,
        gradient: "from-emerald-500 to-emerald-700",
        accentColor: "#22c55e",
        fee: 2000, earlyBirdFee: 1500, earlyBirdDeadline: "2026-02-01",
        date: "Feb 14, 2026", time: "9:00 AM - 6:00 PM",
        venue: "Main Ground, Rishihood University",
        filledSlots: 42, maxSlots: 48,
        registrationDeadline: "2026-02-10",
        isOpen: true, waitlistEnabled: true, maxWaitlist: 5, currentWaitlist: 2,
    },
};

export default function SportDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const sport = sportData[slug] || sportData.football;

    const [isLiked, setIsLiked] = useState(false);

    const percentage = Math.round((sport.filledSlots / sport.maxSlots) * 100);
    const spotsLeft = sport.maxSlots - sport.filledSlots;
    const isEarlyBird = new Date() < new Date(sport.earlyBirdDeadline);
    const currentFee = isEarlyBird ? sport.earlyBirdFee : sport.fee;

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link href="/sports" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sports
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card hover={false} className="overflow-hidden">
                                {/* Gradient Banner */}
                                <div className={`h-32 bg-gradient-to-r ${sport.gradient} relative`}>
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="absolute bottom-4 left-6 flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl border border-white/30">
                                            {sport.icon}
                                        </div>
                                        <div>
                                            <Badge variant={sport.type === "TEAM" ? "team" : "individual"} className="mb-2">
                                                {sport.type === "TEAM" ? <Users className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                                {sport.type} EVENT
                                            </Badge>
                                            <h1 className="font-display text-4xl text-white">{sport.name}</h1>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsLiked(!isLiked)}
                                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                        {sport.description}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card hover={false} className="p-6">
                                <h2 className="font-display text-xl text-[var(--accent-secondary)] mb-4">EVENT DETAILS</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-[var(--card-bg-hover)] rounded-xl">
                                        <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)]">Date</p>
                                            <p className="text-[var(--accent-secondary)] font-medium">{sport.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-[var(--card-bg-hover)] rounded-xl">
                                        <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)]">Time</p>
                                            <p className="text-[var(--accent-secondary)] font-medium">{sport.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-[var(--card-bg-hover)] rounded-xl sm:col-span-2">
                                        <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)]">Venue</p>
                                            <p className="text-[var(--accent-secondary)] font-medium">{sport.venue}</p>
                                        </div>
                                    </div>
                                    {sport.type === "TEAM" && (
                                        <div className="flex items-center gap-3 p-4 bg-[var(--card-bg-hover)] rounded-xl sm:col-span-2">
                                            <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                                            <div>
                                                <p className="text-xs text-[var(--text-muted)]">Team Size</p>
                                                <p className="text-[var(--accent-secondary)] font-medium">{sport.teamMin} - {sport.teamMax} players</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Rules */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card hover={false} className="p-6">
                                <h2 className="font-display text-xl text-[var(--accent-secondary)] mb-4">RULES & REGULATIONS</h2>
                                <ul className="space-y-3">
                                    {sport.rules.map((rule: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                            <span className="text-[var(--text-secondary)]">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card hover={false} className="p-6 sticky top-28">
                                {/* Pricing */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-mono text-4xl font-bold text-[var(--accent-secondary)]">
                                            {formatCurrency(currentFee)}
                                        </span>
                                        {isEarlyBird && (
                                            <span className="text-[var(--text-muted)] line-through text-lg">
                                                {formatCurrency(sport.fee)}
                                            </span>
                                        )}
                                    </div>
                                    {isEarlyBird && (
                                        <Badge variant="success" className="mt-2">
                                            Early Bird - Save {formatCurrency(sport.fee - sport.earlyBirdFee)}!
                                        </Badge>
                                    )}
                                </div>

                                {/* Capacity */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[var(--text-muted)]">Registration Progress</span>
                                        <span className="font-mono" style={{ color: sport.accentColor }}>
                                            {sport.filledSlots}/{sport.maxSlots}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden mb-2">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${sport.gradient}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                    {spotsLeft <= 10 && spotsLeft > 0 && (
                                        <p className="text-xs text-amber-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Only {spotsLeft} spots left!
                                        </p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div className="p-4 bg-[var(--card-bg-hover)] rounded-xl mb-6">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                                        <Clock className="w-4 h-4" />
                                        Registration closes on
                                    </div>
                                    <p className="font-mono text-[var(--accent-secondary)] mt-1">
                                        February 10, 2026
                                    </p>
                                </div>

                                {/* CTA */}
                                <Link href={`/register/${sport.slug}`}>
                                    <Button className="w-full" size="lg">
                                        Register Now
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>

                                {sport.waitlistEnabled && spotsLeft === 0 && (
                                    <p className="text-center text-sm text-[var(--text-muted)] mt-4">
                                        Waitlist available ({sport.currentWaitlist}/{sport.maxWaitlist} in queue)
                                    </p>
                                )}

                                {/* Info */}
                                <div className="mt-6 pt-6 border-t border-[var(--card-border)] space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                                        Instant confirmation
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                                        Secure payment via Razorpay
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                                        Free cancellation before Feb 8
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
