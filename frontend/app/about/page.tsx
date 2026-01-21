"use client";

import { motion } from "framer-motion";
import { Users, Trophy, MapPin, Calendar } from "lucide-react";

const stats = [
    { value: "5th", label: "Edition" },
    { value: "50+", label: "Colleges" },
    { value: "15+", label: "Sports" },
    { value: "3", label: "Days" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="container max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-8"
                >
                    <span className="text-caption text-[var(--accent)] uppercase tracking-widest block mb-3">
                        About Us
                    </span>
                    <h1 className="font-display text-heading text-[var(--text-primary)] mb-6">
                        Rishihood Sports Fest
                    </h1>

                    <p className="text-body text-[var(--text-secondary)] leading-relaxed mb-8">
                        Rishihood Sports Fest is the premier inter-college sports championship in North India.
                        Since 2022, we've been bringing together athletes from across the country to compete,
                        connect, and celebrate the spirit of sportsmanship.
                    </p>

                    <div className="grid grid-cols-4 gap-4 mb-12">
                        {stats.map((stat) => (
                            <div key={stat.label} className="card p-4 text-center">
                                <div className="font-display text-2xl text-[var(--text-primary)]">{stat.value}</div>
                                <div className="text-caption text-[var(--text-muted)]">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="font-display text-xl text-[var(--text-primary)] mb-4">Our Mission</h2>
                    <p className="text-body text-[var(--text-secondary)] leading-relaxed mb-8">
                        To foster athletic excellence, build lasting connections between institutions,
                        and provide a platform for students to showcase their sporting talents on a national stage.
                    </p>

                    <h2 className="font-display text-xl text-[var(--text-primary)] mb-4">Venue</h2>
                    <div className="card p-6 flex items-start gap-4">
                        <MapPin size={20} className="text-[var(--accent)] mt-1" />
                        <div>
                            <p className="text-body text-[var(--text-primary)] mb-1">Rishihood University</p>
                            <p className="text-small text-[var(--text-muted)]">
                                Delhi-NCR, Sonipat, Haryana 131029
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
