"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const photos = [
    "/photos/DSC00347.JPG",
    "/photos/DSC00406.JPG",
    "/photos/DSC00543.JPG",
    "/photos/DSC00556.JPG",
];

export function GallerySection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-[var(--bg-primary)]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Title Overlay */}
                <div className="absolute z-50 text-center pointer-events-none mix-blend-difference text-white">
                    <h2 className="font-display text-display uppercase tracking-tighter">
                        Capture The
                        <br />
                        Moment
                    </h2>
                </div>

                {photos.map((photo, index) => {
                    // Calculate range for each photo relative to scroll progress
                    // 0 to 1 split into 4 segments
                    const start = index * 0.25;
                    const end = start + 0.25;

                    // First image is always visible at start
                    const clipPath = useTransform(
                        scrollYProgress,
                        [start, end],
                        index === 0
                            ? ["polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"] // Static
                            : ["polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"] // Wipe Up
                    );

                    const scale = useTransform(
                        scrollYProgress,
                        [start, end],
                        [1, 1.1] // Subtle zoom effect
                    );

                    return (
                        <motion.div
                            key={photo}
                            style={{ clipPath, zIndex: index }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <motion.img
                                src={photo}
                                alt={`Gallery image ${index + 1}`}
                                style={{ scale }}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" /> {/* Dimmer */}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
