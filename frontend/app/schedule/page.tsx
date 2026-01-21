"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const schedule = [
    {
        day: "Day 1",
        date: "Feb 14, 2026",
        events: [
            { time: "9:00 AM", sport: "Football - Group Stage", venue: "Main Ground" },
            { time: "10:00 AM", sport: "Cricket - T10 Matches", venue: "Cricket Ground" },
            { time: "2:00 PM", sport: "Basketball - 3x3 Groups", venue: "Indoor Court" },
            { time: "4:00 PM", sport: "Valorant - Qualifiers", venue: "Gaming Arena" },
        ],
    },
    {
        day: "Day 2",
        date: "Feb 15, 2026",
        events: [
            { time: "9:00 AM", sport: "Badminton - Singles", venue: "Sports Complex" },
            { time: "10:00 AM", sport: "Table Tennis - Knockouts", venue: "Indoor Hall" },
            { time: "2:00 PM", sport: "Chess - Swiss Rounds", venue: "Conference Room" },
            { time: "4:00 PM", sport: "Football - Semi Finals", venue: "Main Ground" },
        ],
    },
    {
        day: "Day 3",
        date: "Feb 16, 2026",
        events: [
            { time: "9:00 AM", sport: "Athletics - Track Events", venue: "Athletic Track" },
            { time: "11:00 AM", sport: "Cricket - Finals", venue: "Cricket Ground" },
            { time: "3:00 PM", sport: "Football - Finals", venue: "Main Ground" },
            { time: "5:00 PM", sport: "Closing Ceremony", venue: "Main Stage" },
        ],
    },
];

export default function SchedulePage() {
    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="container max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center pt-8 mb-10"
                >
                    <span className="text-caption text-[var(--accent)] uppercase tracking-widest block mb-3">
                        Event Timeline
                    </span>
                    <h1 className="font-display text-heading text-[var(--text-primary)]">
                        Schedule
                    </h1>
                </motion.div>

                <div className="space-y-8">
                    {schedule.map((day, i) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="accent">{day.day}</Badge>
                                <span className="text-small text-[var(--text-muted)]">{day.date}</span>
                            </div>

                            <div className="space-y-2">
                                {day.events.map((event, j) => (
                                    <div key={j} className="card p-4 flex items-center gap-4">
                                        <span className="text-caption text-[var(--accent)] w-20 flex-shrink-0">
                                            {event.time}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-small text-[var(--text-primary)]">{event.sport}</p>
                                            <p className="text-caption text-[var(--text-muted)]">{event.venue}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
