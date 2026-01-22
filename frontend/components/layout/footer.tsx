"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const links = [
    { href: "/sports", label: "Sports" },
    { href: "/schedule", label: "Schedule" },
    { href: "/rules", label: "Rules" },
    { href: "/faq", label: "FAQ" },
];

export function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Newsletter State
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        // Simulate API request
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus("success");
            setEmail("");
            // Reset success message after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            console.error("Newsletter subscription failed:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <footer ref={ref} className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="container py-12 lg:py-16"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                                <span className="font-display text-sm text-white font-bold">R</span>
                            </div>
                            <span className="font-display text-base text-[var(--text-primary)]">
                                RISHIHOOD SPORTS FEST
                            </span>
                        </div>
                        <p className="text-small text-[var(--text-muted)] max-w-xs mb-6">
                            The ultimate inter-college sports championship.
                            February 7-8, 2026 at Rishihood University.
                        </p>
                        <div className="space-y-2 text-small text-[var(--text-muted)]">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>Rishihood University, Sonipat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                <a href="mailto:sports@rishihood.edu.in" className="hover:text-[var(--text-primary)] transition-colors">
                                    sports@rishihood.edu.in
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-caption text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-small text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-caption text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                            Stay Updated
                        </h4>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="relative">
                                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                                <Input
                                    id="newsletter-email"
                                    type="email"
                                    placeholder="Enter email"
                                    className="text-small"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-label="Email address"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full text-small"
                                disabled={status === "loading" || status === "success"}
                            >
                                {status === "loading" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : status === "success" ? (
                                    <>Subscribed <Check className="w-4 h-4 ml-2" /></>
                                ) : (
                                    "Subscribe"
                                )}
                            </Button>
                            {status === "error" && (
                                <p className="text-xs text-[var(--error)]">Something went wrong. Try again.</p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-caption text-[var(--text-muted)]">
                        © 2026 Rishihood Sports Fest. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-caption text-[var(--text-muted)]">
                        <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms</Link>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}
