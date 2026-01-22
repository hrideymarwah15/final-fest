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
        image: "/photos/DSC00347.JPG"
    },
    {
        id: 2, name: "Basketball", slug: "basketball",
        description: "3x3 format with group stage",
        type: "TEAM", fee: 1500,
        slots: { filled: 28, max: 32 },
        image: "/photos/DSC00406.JPG"
    },
    {
        id: 3, name: "Badminton", slug: "badminton",
        description: "Singles and doubles categories",
        type: "INDIVIDUAL", fee: 500,
        slots: { filled: 56, max: 64 },
        image: "/photos/DSC00543.JPG"
    },
    {
        id: 4, name: "Cricket", slug: "cricket",
        description: "T10 format matches",
        type: "TEAM", fee: 2500,
        slots: { filled: 12, max: 16 },
        image: "/photos/DSC00569.JPG"
    },
];

export function FeaturedSportsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section bg-[var(--bg-secondary)] relative overflow-hidden">
            <div className="container relative z-10">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <div className="card card-interactive h-[300px] group relative overflow-hidden flex flex-col justify-end p-6 border-0">
                                        {/* Background Image */}
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={sport.image}
                                                alt={sport.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-display text-2xl text-white mb-1">
                                                        {sport.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-300">
                                                        {sport.description}
                                                    </p>
                                                </div>
                                                <span className="badge badge-accent backdrop-blur-md bg-black/30 border-white/10 text-white">
                                                    {sport.type === "TEAM" ? <Users size={12} /> : <User size={12} />}
                                                    {sport.type === "TEAM" ? "Team" : "Solo"}
                                                </span>
                                            </div>

                                            {/* Progress */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-caption mb-1">
                                                    <span className="text-gray-400">
                                                        {percentage >= 80 && <span className="text-[var(--warning)] mr-1">●</span>}
                                                        Registrations
                                                    </span>
                                                    <span className="text-gray-300 font-medium">
                                                        {sport.slots.filled}/{sport.slots.max}
                                                    </span>
                                                </div>
                                                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-[var(--accent)] rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={isInView ? { width: `${percentage}%` } : {}}
                                                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <div>
                                                    <span className="text-caption text-gray-400 block">Entry Fee</span>
                                                    <span className="font-display text-lg text-white">
                                                        ₹{sport.fee.toLocaleString()}
                                                    </span>
                                                </div>
                                                <span className="text-small text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Details <ArrowRight size={14} />
                                                </span>
                                            </div>
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
                    className="text-center mt-12"
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
