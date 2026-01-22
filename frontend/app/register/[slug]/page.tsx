"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft, ArrowRight, Users, User, Plus, Trash2, Check,
    AlertCircle, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

// Mock sports database
const sportsData: Record<string, any> = {
    football: {
        id: 1, name: "Football", slug: "football",
        icon: "⚽", type: "TEAM", teamMin: 5, teamMax: 8,
        gradient: "from-emerald-500 to-emerald-700",
        fee: 2000, earlyBirdFee: 1500, isEarlyBird: true,
    },
    badminton: {
        id: 3, name: "Badminton", slug: "badminton",
        icon: "🏸", type: "INDIVIDUAL", teamMin: 1, teamMax: 1,
        gradient: "from-blue-500 to-blue-700",
        fee: 500, earlyBirdFee: 400, isEarlyBird: false,
    },
    // Default fallback
    default: {
        id: 0, name: "Sports Event", slug: "default",
        icon: "🏆", type: "TEAM", teamMin: 1, teamMax: 10,
        gradient: "from-red-500 to-red-700",
        fee: 1000, earlyBirdFee: 800, isEarlyBird: false,
    }
};

interface TeamMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    isCaptain: boolean;
}

export default function RegisterPage() {
    const params = useParams();
    const slug = params?.slug as string;

    // 1. Dynamic Sport Selection
    const sport = sportsData[slug] || sportsData.default;

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState<TeamMember[]>([
        { id: "1", name: "", email: "", phone: "", isCaptain: true }
    ]);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const currentFee = sport.isEarlyBird ? sport.earlyBirdFee : sport.fee;
    const convenienceFee = Math.round(currentFee * 0.02);
    const totalAmount = currentFee + convenienceFee;

    const addMember = () => {
        if (members.length < sport.teamMax) {
            setMembers([...members, {
                id: Date.now().toString(),
                name: "", email: "", phone: "", isCaptain: false
            }]);
        }
    };

    // 2. Captain Removal Logic
    const removeMember = (id: string) => {
        if (members.length > sport.teamMin) {
            const memberToRemove = members.find(m => m.id === id);
            if (!memberToRemove) return;

            const remainingMembers = members.filter(m => m.id !== id);

            // Reassign captain if needed
            if (memberToRemove.isCaptain && remainingMembers.length > 0) {
                remainingMembers[0].isCaptain = true;
            }

            setMembers(remainingMembers);
        }
    };

    const updateMember = (id: string, field: keyof TeamMember, value: string | boolean) => {
        setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    // 3. Validation Logic
    const isFormValid = useMemo(() => {
        const hasValidTeamSize = members.length >= sport.teamMin;
        const hasValidTeamName = sport.type === "TEAM" ? !!teamName.trim() : true;
        const allMembersHaveNames = members.every(m => m.name?.trim().length > 0);
        return hasValidTeamSize && hasValidTeamName && allMembersHaveNames && acceptTerms;
    }, [members, teamName, acceptTerms, sport.type, sport.teamMin]);

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep(3);
    };

    const steps = [
        { num: 1, label: "Review" },
        { num: 2, label: sport.type === "TEAM" ? "Team" : "Details" },
        { num: 3, label: "Payment" },
    ];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                    <Link href={`/sports/${sport.slug}`} className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-secondary)]">
                        <ArrowLeft className="w-4 h-4" /> Back to {sport.name}
                    </Link>
                </motion.div>

                {/* Progress Indicators */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((s, i) => (
                            <div key={s.num} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s.num
                                    ? "bg-[var(--accent-primary)] text-white"
                                    : "bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]"
                                    }`}>
                                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                                </div>
                                <span className={`ml-3 text-sm hidden sm:block ${step >= s.num ? "text-[var(--accent-secondary)]" : "text-[var(--text-muted)]"}`}>
                                    {s.label}
                                </span>
                                {i < steps.length - 1 && (
                                    <div className={`w-12 sm:w-24 h-0.5 mx-4 ${step > s.num ? "bg-[var(--accent-primary)]" : "bg-[var(--card-border)]"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Card hover={false} className="p-6 mb-6">
                                <h2 className="font-display text-2xl text-[var(--accent-secondary)] mb-6">REGISTRATION SUMMARY</h2>

                                <div className="flex items-center gap-4 p-4 bg-[var(--card-bg-hover)] rounded-xl mb-6">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center text-3xl`}>
                                        {sport.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl text-[var(--accent-secondary)]">{sport.name}</h3>
                                        <Badge variant={sport.type === "TEAM" ? "accent" : "default"}>
                                            {sport.type === "TEAM" ? <Users className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                            {sport.type} EVENT
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between py-3 border-b border-[var(--card-border)]">
                                        <span className="text-[var(--text-secondary)]">Registration Fee</span>
                                        <span className="font-mono text-[var(--accent-secondary)]">{formatCurrency(currentFee)}</span>
                                    </div>
                                    {sport.isEarlyBird && (
                                        <div className="flex justify-between py-3 border-b border-[var(--card-border)]">
                                            <span className="text-[var(--success)]">Early Bird Discount</span>
                                            <span className="font-mono text-[var(--success)]">-{formatCurrency(sport.fee - sport.earlyBirdFee)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-3 border-b border-[var(--card-border)]">
                                        <span className="text-[var(--text-secondary)]">Convenience Fee (2%)</span>
                                        <span className="font-mono text-[var(--accent-secondary)]">{formatCurrency(convenienceFee)}</span>
                                    </div>
                                    <div className="flex justify-between py-3">
                                        <span className="text-lg font-semibold text-[var(--accent-secondary)]">Total</span>
                                        <span className="font-mono text-2xl font-bold text-[var(--accent-secondary)]">{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>
                            </Card>

                            <Button onClick={() => setStep(2)} className="w-full" size="lg">
                                Continue <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Card hover={false} className="p-6 mb-6">
                                <h2 className="font-display text-2xl text-[var(--accent-secondary)] mb-6">
                                    {sport.type === "TEAM" ? "TEAM DETAILS" : "PARTICIPANT DETAILS"}
                                </h2>

                                {/* 4. Team vs Individual Logic */}
                                {sport.type === "TEAM" ? (
                                    <>
                                        <Input
                                            label="Team Name"
                                            placeholder="Enter your team name"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="mb-6"
                                            required
                                        />

                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-[var(--accent-secondary)] font-medium">Team Members</h3>
                                                <p className="text-xs text-[var(--text-muted)]">{sport.teamMin}-{sport.teamMax} players required</p>
                                            </div>
                                            <Badge variant={members.length >= sport.teamMin ? "success" : "warning"}>
                                                {members.length}/{sport.teamMax}
                                            </Badge>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            {members.map((member, index) => (
                                                <motion.div
                                                    key={member.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 bg-[var(--card-bg-hover)] rounded-xl space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-[var(--text-muted)]">Player {index + 1}</span>
                                                            {member.isCaptain && <Badge variant="accent">Captain</Badge>}
                                                        </div>
                                                        {members.length > sport.teamMin && (
                                                            <button
                                                                onClick={() => removeMember(member.id)}
                                                                className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid sm:grid-cols-3 gap-3">
                                                        <Input
                                                            placeholder="Name"
                                                            value={member.name}
                                                            onChange={(e) => updateMember(member.id, "name", e.target.value)}
                                                            required
                                                        />
                                                        <Input
                                                            placeholder="Email (optional)"
                                                            type="email"
                                                            value={member.email}
                                                            onChange={(e) => updateMember(member.id, "email", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Phone (optional)"
                                                            type="tel"
                                                            value={member.phone}
                                                            onChange={(e) => updateMember(member.id, "phone", e.target.value)}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {members.length < sport.teamMax && (
                                            <Button variant="secondary" onClick={addMember} className="w-full mb-6">
                                                <Plus className="w-4 h-4 mr-2" /> Add Team Member
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    // Individual Form
                                    <div className="space-y-4 mb-6">
                                        <Input
                                            label="Full Name"
                                            placeholder="Enter your full name"
                                            value={members[0].name}
                                            onChange={(e) => updateMember(members[0].id, "name", e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="Email Address"
                                            placeholder="Enter your email"
                                            type="email"
                                            value={members[0].email}
                                            onChange={(e) => updateMember(members[0].id, "email", e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="Phone Number"
                                            placeholder="Enter your phone number"
                                            type="tel"
                                            value={members[0].phone}
                                            onChange={(e) => updateMember(members[0].id, "phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                {sport.type === "TEAM" && members.length < sport.teamMin && (
                                    <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6 text-amber-400">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm">You need at least {sport.teamMin} team members to register.</span>
                                    </div>
                                )}

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                        className="w-5 h-5 mt-0.5 rounded border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-primary)]"
                                    />
                                    <span className="text-sm text-[var(--text-secondary)]">
                                        I confirm that {sport.type === "TEAM" ? "all team members are" : "I am"} aware of and agree to the rules and regulations of this event.
                                    </span>
                                </label>
                            </Card>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="flex-1"
                                    size="lg"
                                    disabled={!isFormValid}
                                    isLoading={isLoading}
                                >
                                    {!isLoading && <>Proceed to Pay <CreditCard className="w-4 h-4 ml-2" /></>}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <Card hover={false} className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-20 h-20 rounded-full bg-[var(--success)] flex items-center justify-center mx-auto mb-6"
                                >
                                    <Check className="w-10 h-10 text-white" />
                                </motion.div>

                                <h2 className="font-display text-3xl text-[var(--accent-secondary)] mb-2">REGISTRATION COMPLETE!</h2>
                                <p className="text-[var(--text-secondary)] mb-6">
                                    Your registration for <span className="text-[var(--accent-primary)]">{sport.name}</span> has been confirmed.
                                </p>

                                <div className="p-4 bg-[var(--card-bg-hover)] rounded-xl mb-6 inline-block">
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Registration Number</p>
                                    <p className="font-mono text-xl text-[var(--accent-secondary)]">REG-{sport.slug.toUpperCase()}-00{Math.floor(Math.random() * 1000)}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/dashboard">
                                        <Button size="lg">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/sports">
                                        <Button variant="secondary" size="lg">
                                            Register for More
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
