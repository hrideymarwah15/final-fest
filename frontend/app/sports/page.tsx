"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Filter, Grid, List, ArrowRight, Calendar, MapPin, Users, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const categories = ["All", "Indoor", "Outdoor", "E-Sports", "Athletics"];

const allSports = [
    {
        id: 1, name: "Football", slug: "football", category: "Outdoor",
        description: "5-a-side tournament with knockout rounds",
        icon: "⚽", type: "TEAM", gradient: "from-emerald-500 to-emerald-700",
        accentColor: "#22c55e", fee: 2000, earlyBirdFee: 1500,
        date: "Feb 14, 2026", venue: "Main Ground",
        filledSlots: 42, maxSlots: 48, isOpen: true,
    },
    {
        id: 2, name: "Basketball", slug: "basketball", category: "Indoor",
        description: "3x3 format with group stage and finals",
        icon: "🏀", type: "TEAM", gradient: "from-orange-500 to-orange-700",
        accentColor: "#f97316", fee: 1500, earlyBirdFee: 1200,
        date: "Feb 14-15, 2026", venue: "Indoor Court",
        filledSlots: 28, maxSlots: 32, isOpen: true,
    },
    {
        id: 3, name: "Badminton", slug: "badminton", category: "Indoor",
        description: "Singles and doubles categories available",
        icon: "🏸", type: "INDIVIDUAL", gradient: "from-violet-500 to-violet-700",
        accentColor: "#8b5cf6", fee: 500, earlyBirdFee: 400,
        date: "Feb 15, 2026", venue: "Sports Complex",
        filledSlots: 56, maxSlots: 64, isOpen: true,
    },
    {
        id: 4, name: "Cricket", slug: "cricket", category: "Outdoor",
        description: "T10 format with exciting matches",
        icon: "🏏", type: "TEAM", gradient: "from-blue-500 to-blue-700",
        accentColor: "#3b82f6", fee: 2500, earlyBirdFee: 2000,
        date: "Feb 14-16, 2026", venue: "Cricket Ground",
        filledSlots: 12, maxSlots: 16, isOpen: true,
    },
    {
        id: 5, name: "Table Tennis", slug: "table-tennis", category: "Indoor",
        description: "Singles knockout tournament",
        icon: "🏓", type: "INDIVIDUAL", gradient: "from-pink-500 to-pink-700",
        accentColor: "#ec4899", fee: 300, earlyBirdFee: 250,
        date: "Feb 15, 2026", venue: "Indoor Hall",
        filledSlots: 30, maxSlots: 32, isOpen: true,
    },
    {
        id: 6, name: "Valorant", slug: "valorant", category: "E-Sports",
        description: "5v5 tactical shooter tournament",
        icon: "🎮", type: "TEAM", gradient: "from-red-500 to-red-700",
        accentColor: "#ef4444", fee: 1000, earlyBirdFee: 800,
        date: "Feb 14, 2026", venue: "Gaming Arena",
        filledSlots: 14, maxSlots: 16, isOpen: true,
    },
    {
        id: 7, name: "100m Sprint", slug: "100m-sprint", category: "Athletics",
        description: "Individual track event",
        icon: "🏃", type: "INDIVIDUAL", gradient: "from-yellow-500 to-yellow-700",
        accentColor: "#eab308", fee: 200, earlyBirdFee: 150,
        date: "Feb 16, 2026", venue: "Athletic Track",
        filledSlots: 40, maxSlots: 50, isOpen: true,
    },
    {
        id: 8, name: "Chess", slug: "chess", category: "Indoor",
        description: "Swiss format tournament",
        icon: "♟️", type: "INDIVIDUAL", gradient: "from-gray-500 to-gray-700",
        accentColor: "#6b7280", fee: 200, earlyBirdFee: 150,
        date: "Feb 15, 2026", venue: "Conference Room",
        filledSlots: 28, maxSlots: 32, isOpen: true,
    },
];

export default function SportsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredSports = allSports.filter((sport) => {
        const matchesSearch = sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sport.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || sport.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[var(--accent-secondary)] mb-4">
                        ALL SPORTS
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Browse and register for your favorite sports events
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search */}
                        <div className="w-full lg:w-96">
                            <Input
                                placeholder="Search sports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="w-4 h-4" />}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Category Tabs */}
                            <div className="flex gap-2 flex-wrap">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${selectedCategory === category
                                                ? "bg-[var(--accent-primary)] text-[var(--accent-secondary)]"
                                                : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)]"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* View Toggle */}
                            <div className="flex gap-1 bg-[var(--card-bg)] rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-muted)]"
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-muted)]"
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="text-sm text-[var(--text-muted)] mb-6">
                    Showing {filteredSports.length} of {allSports.length} sports
                </div>

                {/* Sports Grid/List */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode + selectedCategory + searchQuery}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "flex flex-col gap-4"
                        }
                    >
                        {filteredSports.map((sport, index) => {
                            const percentage = Math.round((sport.filledSlots / sport.maxSlots) * 100);
                            const isAlmostFull = percentage >= 80;

                            return (
                                <motion.div
                                    key={sport.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/sports/${sport.slug}`}>
                                        <Card glow className="group h-full">
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sport.gradient}`} />

                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <motion.div
                                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center text-2xl`}
                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                        >
                                                            {sport.icon}
                                                        </motion.div>
                                                        <div>
                                                            <h3 className="font-display text-xl text-[var(--accent-secondary)]">
                                                                {sport.name}
                                                            </h3>
                                                            <p className="text-xs text-[var(--text-muted)]">{sport.category}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant={sport.type === "TEAM" ? "team" : "individual"}>
                                                        {sport.type === "TEAM" ? <Users className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                                        {sport.type}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                                                    {sport.description}
                                                </p>

                                                <div className="flex gap-4 text-xs text-[var(--text-muted)] mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {sport.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {sport.venue}
                                                    </span>
                                                </div>

                                                {/* Progress */}
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-[var(--text-muted)]">Spots</span>
                                                        <span className="font-mono" style={{ color: sport.accentColor }}>
                                                            {sport.filledSlots}/{sport.maxSlots}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-[var(--card-border)] rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full bg-gradient-to-r ${sport.gradient}`}
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${percentage}%` }}
                                                            viewport={{ once: true }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-4 border-t border-[var(--card-border)]">
                                                    <div>
                                                        <span className="text-xs text-[var(--text-muted)]">From</span>
                                                        <p className="font-mono text-lg font-bold text-[var(--accent-secondary)]">
                                                            {formatCurrency(sport.earlyBirdFee)}
                                                        </p>
                                                    </div>
                                                    <motion.div
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-center gap-1 text-sm text-[var(--accent-primary)]"
                                                    >
                                                        Details <ArrowRight className="w-4 h-4" />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {filteredSports.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[var(--text-muted)] text-lg">No sports found matching your criteria</p>
                        <Button variant="ghost" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
