"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        // TODO: Integrate with Supabase Auth
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-primary)]/10 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-secondary)]/5 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <Card hover={false} className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="w-16 h-16 bg-[var(--accent-primary)] rounded-2xl flex items-center justify-center mx-auto mb-4"
                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                        >
                            <span className="font-display text-3xl text-white">R</span>
                        </motion.div>
                        <h1 className="font-display text-3xl text-[var(--accent-secondary)] mb-2">
                            WELCOME BACK
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            Sign in to continue to Sports Fest
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@college.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            icon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                icon={<Lock className="w-4 h-4" />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[42px] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="w-4 h-4 rounded border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                                />
                                <span className="text-sm text-[var(--text-secondary)]">Remember me</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            {!isLoading && (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--card-border)]" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 text-sm text-[var(--text-muted)] bg-[var(--card-bg)]">
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <Button variant="secondary" className="w-full">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Sign Up Link */}
                    <p className="text-center mt-8 text-[var(--text-secondary)]">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </Card>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--accent-primary)]/50 rounded-tl-xl" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-[var(--accent-primary)]/50 rounded-br-xl" />
            </motion.div>
        </div>
    );
}
