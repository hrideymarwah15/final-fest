"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
    quickLinks: [
        { href: "/sports", label: "Browse Sports" },
        { href: "/schedule", label: "Event Schedule" },
        { href: "/rules", label: "Rules & Regulations" },
        { href: "/faq", label: "FAQ" },
    ],
    support: [
        { href: "/contact", label: "Contact Us" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/refund", label: "Refund Policy" },
    ],
};

const socialLinks = [
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];

export function Footer() {
    return (
        <footer className="relative bg-[var(--background-secondary)] border-t border-[var(--card-border)] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 grid-bg opacity-50" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center">
                                <span className="font-display text-2xl text-white">R</span>
                            </div>
                            <div>
                                <span className="font-display text-xl tracking-wide text-white block">RISHIHOOD</span>
                                <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
                                    Sports Fest 2026
                                </span>
                            </div>
                        </div>
                        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                            Experience the thrill of competition. Join thousands of athletes from across India
                            in the biggest inter-college sports festival.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors"
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="font-display text-lg text-[var(--accent-secondary)] mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="font-display text-lg text-[var(--accent-secondary)] mb-6">Contact Info</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                                <span className="text-[var(--text-secondary)]">
                                    Rishihood University, Sonipat, Haryana 131029
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0" />
                                <a href="tel:+919876543210" className="text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0" />
                                <a href="mailto:sportsfest@rishihood.edu.in" className="text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] transition-colors">
                                    sportsfest@rishihood.edu.in
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="font-display text-lg text-[var(--accent-secondary)] mb-6">Stay Updated</h4>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Subscribe to get the latest updates on events and registrations.
                        </p>
                        <form className="space-y-3">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                icon={<Mail className="w-4 h-4" />}
                            />
                            <Button className="w-full">
                                Subscribe
                            </Button>
                        </form>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-[var(--card-border)]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[var(--text-muted)]">
                            © 2026 Rishihood Sports Fest. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            {footerLinks.support.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
