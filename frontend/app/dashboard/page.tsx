"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Trophy, Calendar, Bell, CreditCard, Settings, LogOut,
    ArrowRight, Clock, CheckCircle, AlertCircle, XCircle,
    ChevronRight, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock user data
const user = {
    name: "Hridey Marwah",
    email: "hridey@rishihood.edu.in",
    college: "Rishihood University",
    avatar: null,
};

// Mock registrations
const registrations = [
    {
        id: 1,
        sport: "Football",
        icon: "⚽",
        registrationNumber: "REG-FOO-0042",
        status: "confirmed",
        paymentStatus: "completed",
        amount: 2000,
        date: "2026-01-20",
        eventDate: "Feb 14, 2026",
        teamName: "Thunder Hawks",
    },
    {
        id: 2,
        sport: "Badminton",
        icon: "🏸",
        registrationNumber: "REG-BAD-0056",
        status: "payment_pending",
        paymentStatus: "pending",
        amount: 500,
        date: "2026-01-22",
        eventDate: "Feb 15, 2026",
        teamName: null,
    },
    {
        id: 3,
        sport: "Cricket",
        icon: "🏏",
        registrationNumber: "REG-CRI-0012",
        status: "waitlist",
        paymentStatus: "pending",
        amount: 2500,
        date: "2026-01-18",
        eventDate: "Feb 14-16, 2026",
        teamName: "Blazing Stars",
        waitlistPosition: 3,
    },
];

// Mock stats
const stats = [
    { label: "Active Registrations", value: "3", icon: Trophy, color: "text-emerald-400" },
    { label: "Pending Payments", value: "2", icon: CreditCard, color: "text-amber-400" },
    { label: "Upcoming Events", value: "3", icon: Calendar, color: "text-blue-400" },
    { label: "Notifications", value: "5", icon: Bell, color: "text-violet-400" },
];

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "error" | "default"; icon: React.ElementType }> = {
    confirmed: { label: "Confirmed", variant: "success", icon: CheckCircle },
    payment_pending: { label: "Payment Pending", variant: "warning", icon: AlertCircle },
    waitlist: { label: "Waitlisted", variant: "default", icon: Clock },
    cancelled: { label: "Cancelled", variant: "error", icon: XCircle },
};

export default function DashboardPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary-light)] flex items-center justify-center text-2xl font-display text-white">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="font-display text-3xl text-[var(--accent-secondary)]">
                                    WELCOME, {user.name.split(" ")[0].toUpperCase()}!
                                </h1>
                                <p className="text-[var(--text-secondary)]">{user.college}</p>
                            </div>
                        </div>
                        <Link href="/sports">
                            <Button>
                                Browse Sports <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                        >
                            <Card hover={false} className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-lg bg-[var(--card-bg-hover)] flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-mono text-3xl font-bold text-[var(--accent-secondary)]">
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Registrations */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-2xl text-[var(--accent-secondary)]">
                                MY REGISTRATIONS
                            </h2>
                            <Link href="/dashboard/registrations" className="text-sm text-[var(--accent-primary)] hover:underline flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {registrations.map((reg, index) => {
                                const status = statusConfig[reg.status];
                                return (
                                    <motion.div
                                        key={reg.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                    >
                                        <Card hover className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-[var(--card-bg-hover)] flex items-center justify-center text-2xl flex-shrink-0">
                                                    {reg.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div>
                                                            <h3 className="font-display text-xl text-[var(--accent-secondary)]">
                                                                {reg.sport}
                                                            </h3>
                                                            <p className="text-xs text-[var(--text-muted)] font-mono">
                                                                {reg.registrationNumber}
                                                            </p>
                                                        </div>
                                                        <Badge variant={status.variant}>
                                                            <status.icon className="w-3 h-3 mr-1" />
                                                            {status.label}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)] mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                                                            {reg.eventDate}
                                                        </span>
                                                        {reg.teamName && (
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-4 h-4 text-[var(--text-muted)]" />
                                                                {reg.teamName}
                                                            </span>
                                                        )}
                                                        {reg.waitlistPosition && (
                                                            <span className="text-amber-400">
                                                                Waitlist Position: #{reg.waitlistPosition}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono text-lg font-semibold text-[var(--accent-secondary)]">
                                                            {formatCurrency(reg.amount)}
                                                        </span>
                                                        {reg.status === "payment_pending" ? (
                                                            <Link href={`/payment/${reg.id}`}>
                                                                <Button size="sm">
                                                                    Pay Now <ArrowRight className="w-3 h-3 ml-1" />
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <Link href={`/dashboard/registrations/${reg.id}`}>
                                                                <Button size="sm" variant="ghost">
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="font-display text-2xl text-[var(--accent-secondary)] mb-6">
                            QUICK ACTIONS
                        </h2>

                        <div className="space-y-3">
                            {[
                                { label: "Browse Sports", href: "/sports", icon: Trophy },
                                { label: "My Registrations", href: "/dashboard/registrations", icon: Calendar },
                                { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "5" },
                                { label: "Payment History", href: "/dashboard/payments", icon: CreditCard },
                                { label: "Edit Profile", href: "/dashboard/profile", icon: Settings },
                            ].map((action) => (
                                <Link key={action.href} href={action.href}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className="flex items-center justify-between p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl hover:border-[var(--accent-primary-dim)] transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <action.icon className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                                            <span className="text-[var(--text-secondary)] group-hover:text-[var(--accent-secondary)] transition-colors">
                                                {action.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {action.badge && (
                                                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-xs flex items-center justify-center text-white">
                                                    {action.badge}
                                                </span>
                                            )}
                                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}

                            <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center gap-3 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl hover:border-red-500/30 transition-colors group text-left"
                            >
                                <LogOut className="w-5 h-5 text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
                                <span className="text-[var(--text-secondary)] group-hover:text-red-400 transition-colors">
                                    Sign Out
                                </span>
                            </motion.button>
                        </div>

                        {/* Upcoming Event Card */}
                        <Card hover={false} className="mt-6 p-6 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent border-[var(--accent-primary)]/30">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                                <span className="text-xs text-[var(--accent-primary)] uppercase tracking-wider">Next Event</span>
                            </div>
                            <h3 className="font-display text-xl text-[var(--accent-secondary)] mb-1">Football</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">Feb 14, 2026 at 9:00 AM</p>
                            <div className="text-xs text-[var(--text-muted)]">
                                📍 Main Ground, Rishihood University
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
