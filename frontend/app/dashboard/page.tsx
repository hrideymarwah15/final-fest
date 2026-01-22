"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, CreditCard, Bell, ArrowRight, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
    { label: "Active", value: "3", icon: Trophy },
    { label: "Pending", value: "2", icon: CreditCard },
    { label: "Alerts", value: "5", icon: Bell },
];

const registrations = [
    { id: 1, sport: "Football", status: "confirmed", amount: 2000, date: "Feb 14" },
    { id: 2, sport: "Badminton", status: "pending", amount: 500, date: "Feb 15" },
    { id: 3, sport: "Cricket", status: "waitlist", amount: 2500, date: "Feb 14-16", position: 3 },
];

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "default"; icon: typeof CheckCircle }> = {
    confirmed: { label: "Confirmed", variant: "success", icon: CheckCircle },
    pending: { label: "Payment Due", variant: "warning", icon: AlertCircle },
    waitlist: { label: "Waitlist", variant: "default", icon: Clock },
};

export default function DashboardPage() {
    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 mb-8"
                >
                    <div>
                        <h1 className="font-display text-2xl text-[var(--text-primary)] mb-1">
                            Welcome back
                        </h1>
                        <p className="text-small text-[var(--text-muted)]">
                            Manage your registrations
                        </p>
                    </div>
                    <Link href="/sports">
                        <Button>
                            Browse Sports <ArrowRight size={16} />
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="card p-5">
                            <div className="flex items-center justify-between">
                                <stat.icon size={18} className="text-[var(--text-muted)]" />
                                <span className="font-display text-2xl text-[var(--text-primary)]">
                                    {stat.value}
                                </span>
                            </div>
                            <p className="text-caption text-[var(--text-muted)] mt-2">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Registrations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="font-display text-lg text-[var(--text-primary)] mb-4">
                        My Registrations
                    </h2>

                    <div className="space-y-3">
                        {registrations.map((reg, i) => {
                            const status = statusConfig[reg.status] || statusConfig.pending;

                            return (
                                <motion.div
                                    key={reg.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.05 }}
                                    className="card p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-display text-base text-[var(--text-primary)]">
                                                    {reg.sport}
                                                </h3>
                                                <Badge variant={status.variant}>
                                                    <status.icon size={10} />
                                                    {status.label}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-4 text-small text-[var(--text-muted)]">
                                                <span>{reg.date}</span>
                                                <span>₹{reg.amount.toLocaleString()}</span>
                                                {reg.position && (
                                                    <span className="text-[var(--warning)]">
                                                        Position #{reg.position}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {reg.status === "pending" ? (
                                            <Button size="sm">Pay Now</Button>
                                        ) : (
                                            <Button size="sm" variant="ghost">View</Button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
