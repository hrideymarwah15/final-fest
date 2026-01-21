"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sports", label: "Sports" },
    { href: "/schedule", label: "Schedule" },
    { href: "/about", label: "About" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileOpen]);

    return (
        <>
            <motion.header
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]" : ""
                    }`}
            >
                <nav className="container flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                            <span className="font-display text-sm text-white font-bold">R</span>
                        </div>
                        <span className="font-display text-base text-[var(--text-primary)] hidden sm:block">
                            RISHIHOOD
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login" className="btn btn-ghost text-sm">
                            Sign in
                        </Link>
                        <Link href="/signup" className="btn btn-primary text-sm">
                            Register
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)]"
                        aria-label="Toggle menu"
                    >
                        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </nav>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-16 z-40 bg-[var(--bg-primary)] md:hidden"
                    >
                        <nav className="container py-8 flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className="block py-3 text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] space-y-3">
                                <Link href="/login" onClick={() => setIsMobileOpen(false)} className="btn btn-secondary w-full justify-center">
                                    Sign in
                                </Link>
                                <Link href="/signup" onClick={() => setIsMobileOpen(false)} className="btn btn-primary w-full justify-center">
                                    Register
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
