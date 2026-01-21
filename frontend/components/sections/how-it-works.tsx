"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, Search, CreditCard, CheckCircle } from "lucide-react";

const steps = [
    { icon: UserPlus, title: "Create Account", description: "Sign up in 30 seconds" },
    { icon: Search, title: "Choose Sports", description: "Browse and select events" },
    { icon: CreditCard, title: "Pay Securely", description: "Secure Razorpay checkout" },
    { icon: CheckCircle, title: "You're In", description: "Get instant confirmation" },
];

export function HowItWorksSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section bg-[var(--bg-primary)]">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="text-caption text-[var(--accent)] uppercase tracking-widest block mb-4">
                        Simple Process
                    </span>
                    <h2 className="font-display text-heading text-[var(--text-primary)]">
                        How It Works
                    </h2>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 24 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="card p-6 h-full">
                                {/* Step number */}
                                <span className="absolute -top-2 left-4 text-caption font-medium text-[var(--accent)] bg-[var(--bg-primary)] px-2">
                                    0{index + 1}
                                </span>

                                {/* Icon */}
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center mb-4 mt-2">
                                    <step.icon size={18} className="text-[var(--text-secondary)]" />
                                </div>

                                {/* Content */}
                                <h3 className="font-display text-base text-[var(--text-primary)] mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-small text-[var(--text-muted)]">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
