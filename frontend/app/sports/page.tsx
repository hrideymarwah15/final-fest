"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, Users, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Team", "Individual", "Indoor", "Outdoor"];

const allSports = [
    { id: 1, name: "Football", slug: "football", category: "Team", type: "TEAM", fee: 2000, slots: { filled: 42, max: 48 } },
    { id: 2, name: "Basketball", slug: "basketball", category: "Team", type: "TEAM", fee: 1500, slots: { filled: 28, max: 32 } },
    { id: 3, name: "Badminton", slug: "badminton", category: "Indoor", type: "INDIVIDUAL", fee: 500, slots: { filled: 56, max: 64 } },
    { id: 4, name: "Cricket", slug: "cricket", category: "Team", type: "TEAM", fee: 2500, slots: { filled: 12, max: 16 } },
    { id: 5, name: "Table Tennis", slug: "table-tennis", category: "Indoor", type: "INDIVIDUAL", fee: 300, slots: { filled: 30, max: 32 } },
    { id: 6, name: "Chess", slug: "chess", category: "Indoor", type: "INDIVIDUAL", fee: 200, slots: { filled: 28, max: 32 } },
    { id: 7, name: "Athletics", slug: "athletics", category: "Outdoor", type: "INDIVIDUAL", fee: 200, slots: { filled: 40, max: 50 } },
    { id: 8, name: "Volleyball", slug: "volleyball", category: "Team", type: "TEAM", fee: 1500, slots: { filled: 14, max: 16 } },
];

export default function SportsPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const filtered = allSports.filter((sport) => {
        const matchesSearch = sport.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" ||
            sport.category === category ||
            (category === "Team" && sport.type === "TEAM") ||
            (category === "Individual" && sport.type === "INDIVIDUAL");
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 pt-8"
                >
                    <h1 className="font-display text-heading text-[var(--text-primary)] mb-3">
                        All Sports
                    </h1>
                    <p className="text-body text-[var(--text-secondary)]">
                        Browse and register for events
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8"
                >
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Search sports..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search size={16} />}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${category === cat
                                        ? "bg-[var(--accent)] text-white"
                                        : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results */}
                <p className="text-caption text-[var(--text-muted)] mb-4">
                    {filtered.length} sports found
                </p>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={category + search}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {filtered.map((sport, i) => {
                            const pct = (sport.slots.filled / sport.slots.max) * 100;

                            return (
                                <motion.div
                                    key={sport.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link href={`/sports/${sport.slug}`}>
                                        <div className="card card-interactive p-5 h-full group">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="font-display text-lg text-[var(--text-primary)]">
                                                    {sport.name}
                                                </h3>
                                                <Badge>
                                                    {sport.type === "TEAM" ? <Users size={10} /> : <User size={10} />}
                                                    {sport.type === "TEAM" ? "Team" : "Solo"}
                                                </Badge>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex justify-between text-caption mb-1.5">
                                                    <span className="text-[var(--text-muted)]">Spots</span>
                                                    <span className="text-[var(--text-secondary)]">
                                                        {sport.slots.filled}/{sport.slots.max}
                                                    </span>
                                                </div>
                                                <div className="h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[var(--accent)] rounded-full transition-all"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                                                <span className="font-display text-base text-[var(--text-primary)]">
                                                    ₹{sport.fee.toLocaleString()}
                                                </span>
                                                <span className="text-small text-[var(--text-muted)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View <ArrowRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[var(--text-muted)]">No sports found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
