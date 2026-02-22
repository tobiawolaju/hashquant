import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);

    // Aggressive Body & HTML Scroll Lock
    useEffect(() => {
        if (isVisible) {
            const originalBodyOverflow = document.body.style.overflow;
            const originalHtmlOverflow = document.documentElement.style.overflow;
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalBodyOverflow;
                document.documentElement.style.overflow = originalHtmlOverflow;
            };
        }
    }, [isVisible]);

    const { scrollYProgress } = useScroll({
        container: containerRef,
    });

    const handleImageLoad = useCallback(() => {
        setLoadedCount(prev => {
            const next = prev + 1;
            if (next >= SPLASH_IMAGES.length) {
                setImagesLoaded(true);
            }
            return next;
        });
    }, []);

    const handleStartTrading = () => {
        setIsVisible(false);
    };

    // Parallax Transforms (Reverse on Scroll)
    // BG (Layer 1)
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    // Figure 1 (Diamond Hander): Stays visible longer then clears
    const figure1X = useTransform(scrollYProgress, [0, 0.45], ["0%", "-40%"]);
    const figure1Opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

    // Figure 2 (Degen Trader)
    const figure2X = useTransform(scrollYProgress, [0, 0.45], ["0%", "40%"]);
    const figure2Opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

    // Floating Hands
    const handsY = useTransform(scrollYProgress, [0, 0.5], ["0%", "45%"]);
    const handsOpacity = useTransform(scrollYProgress, [0, 0.45], [0.9, 0]);

    // Title Transforms: Fades out completely before content appears
    const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);
    const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

    // Content Reveal: Starts appearing only after title is gone
    const contentOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
    const contentY = useTransform(scrollYProgress, [0.4, 0.7], [80, 0]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-black overflow-y-auto scrollbar-hide"
                    style={{
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {/* Hide scrollbar for Chrome/Safari via CSS-in-JS pseudo-style */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .scrollbar-hide::-webkit-scrollbar { display: none !important; }
                    `}} />

                    {/* The Height of the Landing Page */}
                    <div className="h-[250vh] w-full relative">
                        {/* Fixed Background Layers */}
                        <div className="sticky top-0 h-screen w-full overflow-hidden">
                            {/* ═══ z-[0]: Layer 1 — Major Background ═══ */}
                            <motion.div
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={imagesLoaded ? { scale: 1, opacity: 0.8 } : {}}
                                style={{ y: bgY, scale: bgScale, filter: "blur(4px)" }}
                                transition={{ duration: 2.5, ease: "easeOut" }}
                                className="absolute inset-0 z-[0] transform-gpu"
                            >
                                <Image
                                    src="/splash/Layer_1_TheMajorBackground_FurthestBack.png"
                                    alt="Background"
                                    fill
                                    className="object-cover brightness-50"
                                    priority
                                    onLoad={handleImageLoad}
                                />
                            </motion.div>

                            {/* ═══ z-[5]: Layer 2 — Outer Frame ═══ */}
                            <motion.div
                                initial={{ scale: 1.05, opacity: 0 }}
                                animate={imagesLoaded ? { scale: 1, opacity: 0.6 } : {}}
                                transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
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

                            {/* ═══ z-[10]: Layer 3 — Diamond Hander ═══ */}
                            <motion.div
                                initial={{ x: "-40%", opacity: 0 }}
                                animate={imagesLoaded ? { x: "0%", opacity: 1 } : {}}
                                style={{ x: figure1X, opacity: figure1Opacity }}
                                transition={{ delay: 0.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 left-0 z-[10] w-[50%] h-[90%]"
                            >
                                <Image
                                    src="/splash/Layer_3_Figure_1_The_Diamond_Hander_Center_Left.png"
                                    alt="Diamond Hander"
                                    fill
                                    className="object-contain object-bottom"
                                    onLoad={handleImageLoad}
                                />
                            </motion.div>

                            {/* ═══ z-[10]: Layer 4 — Degen Trader ═══ */}
                            <motion.div
                                initial={{ x: "40%", opacity: 0 }}
                                animate={imagesLoaded ? { x: "0%", opacity: 1 } : {}}
                                style={{ x: figure2X, opacity: figure2Opacity }}
                                transition={{ delay: 0.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 right-0 z-[10] w-[50%] h-[90%]"
                            >
                                <Image
                                    src="/splash/Layer_4_Figure_2_The_Degen_Trader_Center_Right.png"
                                    alt="Degen Trader"
                                    fill
                                    className="object-contain object-bottom"
                                    onLoad={handleImageLoad}
                                />
                            </motion.div>

                            {/* ═══ z-[30]: Layer 5 — Floating Hands ═══ */}
                            <motion.div
                                initial={{ y: "20%", opacity: 0 }}
                                animate={imagesLoaded ? { y: "0%", opacity: 0.9 } : {}}
                                style={{ y: handsY, opacity: handsOpacity }}
                                transition={{ delay: 0.8, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 left-0 right-0 z-[30] h-[60%]"
                            >
                                <Image
                                    src="/splash/Layer_5_Floating_Hands_Foreground_Overlays.png"
                                    alt="Floating Hands"
                                    fill
                                    className="object-contain object-bottom contrast-125"
                                    onLoad={handleImageLoad}
                                />
                            </motion.div>

                            {/* ═══ z-[40]: Gradient Overlay ═══ */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={imagesLoaded ? { opacity: 0.55 } : {}}
                                transition={{ duration: 2.5 }}
                                className="absolute inset-0 z-[40] bg-gradient-to-b from-abyss/40 via-black/30 to-black pointer-events-none"
                            />

                            {/* ═══ z-[100]: Hero Section ═══ */}
                            <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 text-center pointer-events-none">
                                <motion.div
                                    style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
                                >
                                    <motion.h1
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={imagesLoaded ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 1.8, ease: "easeOut", delay: 1 }}
                                        className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                                    >
                                        Dominus Quant
                                    </motion.h1>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={imagesLoaded ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 2, duration: 1.2 }}
                                        className="mt-8 flex flex-col items-center gap-3"
                                    >
                                        <p className="text-white tracking-[0.8em] uppercase text-[10px] md:text-xs font-bold opacity-60">
                                            Deep Intelligence Protocol
                                        </p>
                                        <motion.div
                                            animate={{ y: [0, 8, 0] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* ═══ z-[110]: Landing Content ═══ */}
                            <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center pointer-events-none p-6">
                                <motion.div
                                    style={{
                                        opacity: contentOpacity,
                                        y: contentY,
                                        pointerEvents: useTransform(scrollYProgress, p => p > 0.6 ? "auto" : "none")
                                    }}
                                    className="max-w-3xl text-center bg-black/50 backdrop-blur-xl p-16 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                >
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
                                        Turning Random James<br /><span className="text-neon">into Quants</span>
                                    </h2>
                                    <p className="text-white/70 text-base md:text-xl mb-12 leading-relaxed max-w-xl mx-auto font-medium">
                                        A high-fidelity on-chain trading intelligence protocol.
                                        Distributed market intelligence powering a shared algorithmic trading pool.
                                    </p>
                                    <button
                                        onClick={handleStartTrading}
                                        className="group relative px-20 py-6 bg-white text-black font-black text-sm tracking-[0.3em] uppercase overflow-hidden transition-all hover:scale-105 active:scale-95 rounded-full"
                                    >
                                        <span className="relative z-10 flex items-center gap-4">
                                            Hybrid Trade
                                            <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </motion.div>
                            </div>

                            {/* ═══ z-[200]: Grain Overlay ═══ */}
                            <div className="absolute inset-0 z-[200] opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        </div>
                    </div>

                </motion.div >
            )}
        </AnimatePresence >
    );
}

