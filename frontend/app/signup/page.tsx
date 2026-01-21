"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const colleges = [
    "Rishihood University",
    "Delhi University",
    "IIT Delhi",
    "BITS Pilani",
    "Ashoka University",
    "Shiv Nadar University",
    "Other",
];

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
        if (!formData.college) newErrors.college = "Please select your college";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        // TODO: Integrate with Supabase Auth
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4">
            {/* Background */}
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-primary)]/10 blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-secondary)]/5 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-lg"
            >
                <Card hover={false} className="p-8">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? "bg-[var(--accent-primary)]" : "bg-[var(--card-border)]"}`} />
                        <div className={`w-12 h-0.5 transition-colors ${step >= 2 ? "bg-[var(--accent-primary)]" : "bg-[var(--card-border)]"}`} />
                        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? "bg-[var(--accent-primary)]" : "bg-[var(--card-border)]"}`} />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl text-[var(--accent-secondary)] mb-2">
                            {step === 1 ? "CREATE ACCOUNT" : "SECURE YOUR ACCOUNT"}
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            {step === 1 ? "Enter your details to get started" : "Set a strong password"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    icon={<User className="w-4 h-4" />}
                                    error={errors.name}
                                    required
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="you@college.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    icon={<Mail className="w-4 h-4" />}
                                    error={errors.email}
                                    required
                                />

                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    icon={<Phone className="w-4 h-4" />}
                                    error={errors.phone}
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        College <span className="text-[var(--accent-primary)]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                        <select
                                            value={formData.college}
                                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                            className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-[var(--foreground)] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Select your college</option>
                                            {colleges.map((college) => (
                                                <option key={college} value={college}>{college}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.college && <p className="mt-2 text-sm text-[var(--error)]">{errors.college}</p>}
                                </div>

                                <Button type="button" onClick={handleNext} className="w-full">
                                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                <div className="relative">
                                    <Input
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        icon={<Lock className="w-4 h-4" />}
                                        error={errors.password}
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

                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-[var(--card-border)]"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            Password strength: {strengthLabels[passwordStrength - 1] || "Too weak"}
                                        </p>
                                    </div>
                                )}

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    icon={<Lock className="w-4 h-4" />}
                                    error={errors.confirmPassword}
                                    required
                                />

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                        className="w-5 h-5 mt-0.5 rounded border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-primary)]"
                                    />
                                    <span className="text-sm text-[var(--text-secondary)]">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-[var(--accent-primary)]">Terms of Service</Link>
                                        {" "}and{" "}
                                        <Link href="/privacy" className="text-[var(--accent-primary)]">Privacy Policy</Link>
                                    </span>
                                </label>
                                {errors.acceptTerms && <p className="text-sm text-[var(--error)]">{errors.acceptTerms}</p>}

                                <div className="flex gap-4">
                                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" isLoading={isLoading}>
                                        {!isLoading && "Create Account"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-8 text-[var(--text-secondary)]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium">
                            Sign in
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
