"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999] bg-abyss flex items-center justify-center overflow-hidden"
                >
                    {/* Layer 1: Background Paper Cutout (Slow Zoom) */}
                    <motion.div
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 0.3 }}
                        transition={{ duration: 4, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <svg width="120%" height="120%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                            <path d="M0 1000C200 800 400 900 600 700C800 500 1000 600 1000 0H0V1000Z" fill="url(#grad1)" />
                            <defs>
                                <linearGradient id="grad1" x1="500" y1="1000" x2="500" y2="0" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#a855f7" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="#09090b" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Layer 2: Midground Paper Cutout (Medium Zoom) */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.8, opacity: 0.4 }}
                        transition={{ duration: 4, ease: "easeOut", delay: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1000 1000C800 850 600 950 400 750C200 550 0 650 0 1000H1000Z" fill="#a855f7" fillOpacity="0.1" />
                            <path d="M1000 0C800 150 600 50 400 250C200 450 0 350 0 0H1000Z" fill="#a855f7" fillOpacity="0.05" />
                        </svg>
                    </motion.div>

                    {/* Layer 3: Foreground Paper Cutout (Fast Zoom) */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2.5, opacity: 0.2 }}
                        transition={{ duration: 4, ease: "easeOut", delay: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <svg width="80%" height="80%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="500" cy="500" r="400" stroke="#a855f7" strokeWidth="2" strokeDasharray="10 20" opacity="0.3" />
                            <path d="M300 300L700 700M700 300L300 700" stroke="#a855f7" strokeWidth="1" opacity="0.2" />
                        </svg>
                    </motion.div>

                    {/* Center Text: #Quant (Un-blur animation) */}
                    <div className="relative">
                        <motion.h1
                            initial={{ filter: "blur(20px)", opacity: 0, scale: 0.9 }}
                            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-[-0.05em] drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                        >
                            <span className="text-white opacity-80">#</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neon to-neon-dim">Quant</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5, duration: 1 }}
                            className="text-center mt-4"
                        >
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Modular Liquidity Protocol</span>
                        </motion.div>
                    </div>

                    {/* Aesthetic Grain Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
