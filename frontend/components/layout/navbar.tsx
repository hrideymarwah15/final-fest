"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sports", label: "Sports" },
    { href: "/schedule", label: "Schedule" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--card-border)]"
                        : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/">
                            <motion.div
                                className="flex items-center gap-3 cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    className="w-10 h-10 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center"
                                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="font-display text-xl text-white">R</span>
                                </motion.div>
                                <div className="hidden sm:block">
                                    <span className="font-display text-xl tracking-wide text-white">RISHIHOOD</span>
                                    <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                                        Sports Fest 2026
                                    </span>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium uppercase tracking-wide text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] transition-colors duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">
                                    Register Now
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden p-2 text-[var(--accent-secondary)]"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-20 z-40 bg-[var(--background)]/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block text-lg font-medium uppercase tracking-wide text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] py-3 border-b border-[var(--card-border)]"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-6 space-y-4">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="secondary" className="w-full">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full">
                                        Register Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
