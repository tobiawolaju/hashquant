"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const SPLASH_IMAGES = [
    "/splash/Layer_1_TheMajorBackground_FurthestBack.png",
    "/splash/Layer_2_The_Outer_Piece_Frame_Foreground_Borders.png",
    "/splash/Layer_3_Figure_1_The_Diamond_Hander_Center_Left.png",
    "/splash/Layer_4_Figure_2_The_Degen_Trader_Center_Right.png",
    "/splash/Layer_5_Floating_Hands_Foreground_Overlays.png",
];

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    const handleImageLoad = useCallback(() => {
        setLoadedCount(prev => {
            const next = prev + 1;
            if (next >= SPLASH_IMAGES.length) {
                setImagesLoaded(true);
            }
            return next;
        });
    }, []);

    // Start the dismiss timer only after all images are loaded
    useEffect(() => {
        if (!imagesLoaded) return;
        const timer = setTimeout(() => setIsVisible(false), 4500);
        return () => clearTimeout(timer);
    }, [imagesLoaded]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* ═══ z-[0]: Layer 1 — Major Background (Slow zoom 1→1.1) ═══ */}
                    <motion.div
                        initial={{ scale: 1, opacity: 0 }}
                        animate={imagesLoaded ? { scale: 1.1, opacity: 1 } : {}}
                        transition={{ duration: 4.5, ease: "easeOut" }}
                        className="absolute inset-0 z-[0]"
                    >
                        <Image
                            src="/splash/Layer_1_TheMajorBackground_FurthestBack.png"
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[5]: Layer 2 — Outer Frame (BEHIND statues, fades in, scales down) ═══ */}
                    <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={imagesLoaded ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 z-[5]"
                    >
                        <Image
                            src="/splash/Layer_2_The_Outer_Piece_Frame_Foreground_Borders.png"
                            alt="Frame"
                            fill
                            className="object-cover"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[10]: Layer 3 — Diamond Hander (Slides in from left) ═══ */}
                    <motion.div
                        initial={{ x: "-60%", opacity: 0 }}
                        animate={imagesLoaded ? { x: "0%", opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 z-[10] w-[45%] h-[85%]"
                    >
                        <Image
                            src="/splash/Layer_3_Figure_1_The_Diamond_Hander_Center_Left.png"
                            alt="Diamond Hander"
                            fill
                            className="object-contain object-bottom"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[10]: Layer 4 — Degen Trader (Slides in from right) ═══ */}
                    <motion.div
                        initial={{ x: "60%", opacity: 0 }}
                        animate={imagesLoaded ? { x: "0%", opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 right-0 z-[10] w-[45%] h-[85%]"
                    >
                        <Image
                            src="/splash/Layer_4_Figure_2_The_Degen_Trader_Center_Right.png"
                            alt="Degen Trader"
                            fill
                            className="object-contain object-bottom"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[20]: Center Text — #Quant branding (Un-blur) ═══ */}
                    <div className="relative z-[20]">
                        <motion.h1
                            initial={{ filter: "blur(20px)", opacity: 0, scale: 0.9 }}
                            animate={imagesLoaded ? { filter: "blur(0px)", opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 2, ease: "easeOut", delay: 1.0 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-[-0.05em] drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                        >
                            <span className="text-white opacity-80">#</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neon to-neon-dim">Quant</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={imagesLoaded ? { opacity: 1 } : {}}
                            transition={{ delay: 2.5, duration: 1 }}
                            className="text-center mt-4"
                        >
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Modular Liquidity Protocol</span>
                        </motion.div>
                    </div>

                    {/* ═══ z-[30]: Layer 5 — Floating Hands (Rises from bottom) ═══ */}
                    <motion.div
                        initial={{ y: "40%", opacity: 0 }}
                        animate={imagesLoaded ? { y: "0%", opacity: 1 } : {}}
                        transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 right-0 z-[30] h-[50%]"
                    >
                        <Image
                            src="/splash/Layer_5_Floating_Hands_Foreground_Overlays.png"
                            alt="Floating Hands"
                            fill
                            className="object-contain object-bottom"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[99]: Aesthetic Grain Overlay ═══ */}
                    <div className="absolute inset-0 z-[99] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
