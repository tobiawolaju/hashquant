"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999] bg-abyss flex items-center justify-center overflow-hidden"
                >
                    {/* Background Glow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-[500px] h-[500px] bg-neon/5 rounded-full blur-[120px]"
                    />

                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ letterSpacing: "0.2em", opacity: 0, filter: "blur(10px)" }}
                            animate={{ letterSpacing: "1em", opacity: 1, filter: "blur(0px)" }}
                            transition={{
                                duration: 1.5,
                                ease: "easeOut",
                                staggerChildren: 0.1
                            }}
                            className="text-4xl md:text-6xl font-black text-white tracking-[1em] mr-[-1em]"
                        >
                            <span className="drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">HASH</span>
                            <span className="text-neon drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">QUANT</span>
                        </motion.div>

                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
                            className="h-px bg-gradient-to-r from-transparent via-neon to-transparent mt-8"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-4"
                        >
                            Institutional Grade Liquidity Engine
                        </motion.p>
                    </div>

                    {/* Scanning Line Effect */}
                    <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                        className="absolute left-0 right-0 h-[2px] bg-neon/10 blur-sm z-10"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
