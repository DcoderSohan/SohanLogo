import React, { memo, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = memo(({ heroData }) => {
  const name = heroData?.name || "Sohan Sarang";
  const title = heroData?.title || "WEB";
  const subtitle = heroData?.subtitle || "DEVELOPER";
  const subtitleAlt = heroData?.subtitleAlt || "DESIGNER";
  const heroImageDesktop = heroData?.heroImageDesktop || "/Me1_Desktop.jpg";

  const [currentWord, setCurrentWord] = useState(subtitle);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Detect mobile device for performance optimization
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 767;
  }, []);

  useEffect(() => {
    // Reduce animation frequency on mobile for better performance
    const intervalTime = isMobile ? 5000 : 4000;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev === subtitle ? subtitleAlt : subtitle));
        setIsAnimating(false);
      }, isMobile ? 200 : 300);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [subtitle, subtitleAlt, isMobile]);

  return (
    <div
      className="relative min-h-screen w-full text-white flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${heroImageDesktop}')`,
        ...(isMobile ? { 
          willChange: 'auto',
          transform: 'translateZ(0)' // Force GPU acceleration on mobile
        } : {})
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero content - always anchored towards bottom, all devices */}
      <div className="relative z-10 flex-1 w-full flex items-end">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pb-16 sm:pb-20 lg:pb-24">
          <p className="text-sm sm:text-base md:text-lg font-medium mb-3 sm:mb-4 md:mb-6 text-white/90 text-left">
            {name}
          </p>
          <div className="leading-none tracking-tight text-left max-w-4xl">
            <div
              className="font-extrabold text-white"
              style={{ fontSize: "clamp(2.8rem, 9vw, 5.5rem)" }}
            >
              {title}
            </div>
            <div
              className="font-extrabold text-white mt-2 sm:mt-4 relative"
              style={{ 
                fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
                minHeight: "clamp(2.8rem, 9vw, 5.5rem)"
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWord}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex flex-wrap"
                >
                  {currentWord.split("").map((char, index) => (
                    <motion.span
                      key={`${currentWord}-${index}`}
                      initial={isMobile ? { opacity: 0 } : { 
                        rotateY: 180,
                        opacity: 0
                      }}
                      animate={isMobile ? { opacity: 1 } : { 
                        rotateY: 0,
                        opacity: 1
                      }}
                      transition={isMobile ? {
                        delay: index * 0.02,
                        duration: 0.2,
                        ease: "easeOut"
                      } : {
                        delay: index * 0.05,
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      style={{ 
                        display: "inline-block",
                        ...(isMobile ? {} : { transformStyle: "preserve-3d" })
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
