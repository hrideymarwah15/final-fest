"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, Search, CreditCard, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Create Account",
        description: "Sign up with your college email in just 30 seconds",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
    },
    {
        icon: Search,
        title: "Choose Sports",
        description: "Browse events and select your favorite sports to compete in",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
    },
    {
        icon: CreditCard,
        title: "Pay Securely",
        description: "Complete payment through our secure gateway",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
    },
    {
        icon: CheckCircle,
        title: "You're In!",
        description: "Receive confirmation and get ready to compete",
        color: "text-violet-400",
        bgColor: "bg-violet-500/10",
        borderColor: "border-violet-500/30",
    },
];

export function HowItWorksSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            <div className="absolute inset-0 grid-bg" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[var(--accent-secondary)] mb-4">
                        HOW IT WORKS
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Register for your favorite sports in four simple steps
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-0.5 bg-[var(--card-border)]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-orange-500 via-emerald-500 to-violet-500"
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            style={{ transformOrigin: "left" }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative"
                            >
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 h-full hover:border-[var(--accent-primary-dim)] transition-all duration-300 group">
                                    {/* Step Number */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-sm font-bold text-white">
                                        {index + 1}
                                    </div>

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-16 h-16 rounded-2xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center mb-6`}
                                    >
                                        <step.icon className={`w-8 h-8 ${step.color}`} />
                                    </motion.div>

                                    {/* Content */}
                                    <h3 className="font-display text-xl text-[var(--accent-secondary)] mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Arrow (Desktop) */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:flex absolute top-20 -right-3 z-10">
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.5 + index * 0.15 }}
                                                className="w-6 h-6 rounded-full bg-[var(--background)] border border-[var(--card-border)] flex items-center justify-center"
                                            >
                                                <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                                            </motion.div>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Step Indicator */}
                                <div className="flex justify-center mt-4 lg:hidden">
                                    <div className="flex gap-2">
                                        {steps.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-[var(--accent-primary)]" : "bg-[var(--card-border)]"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
