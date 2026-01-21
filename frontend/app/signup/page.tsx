"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "", email: "", phone: "", password: "", confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
            return;
        }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? "bg-[var(--accent)]" : "bg-[var(--border-subtle)]"}`} />
                    <div className={`w-8 h-0.5 transition-colors ${step >= 2 ? "bg-[var(--accent)]" : "bg-[var(--border-subtle)]"}`} />
                    <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? "bg-[var(--accent)]" : "bg-[var(--border-subtle)]"}`} />
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-display text-2xl text-[var(--text-primary)] mb-1">
                        {step === 1 ? "Create account" : "Set password"}
                    </h1>
                    <p className="text-small text-[var(--text-muted)]">
                        {step === 1 ? "Enter your details" : "Secure your account"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <Input
                                label="Full Name"
                                placeholder="Your name"
                                icon={<User size={16} />}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@college.edu"
                                icon={<Mail size={16} />}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Phone"
                                type="tel"
                                placeholder="10-digit number"
                                icon={<Phone size={16} />}
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                            <Button type="submit" className="w-full">
                                Continue <ArrowRight size={16} />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 8 characters"
                                    icon={<Lock size={16} />}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-[var(--text-muted)]"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm password"
                                icon={<Lock size={16} />}
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                required
                            />
                            <div className="flex gap-3">
                                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">
                                    <ArrowLeft size={16} /> Back
                                </Button>
                                <Button type="submit" className="flex-1" isLoading={isLoading}>
                                    {!isLoading && "Create Account"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </form>

                {/* Sign in */}
                <p className="text-center mt-6 text-small text-[var(--text-muted)]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[var(--accent)]">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}
