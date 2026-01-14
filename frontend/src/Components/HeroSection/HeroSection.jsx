import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lightning from './Lightning';

// Mock Silk component for demonstration
const Silk = ({ speed, scale, color, noiseIntensity, rotation }) => (
  <div
    className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20"
    style={{
      background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
      animation: `pulse ${speed}s infinite ease-in-out`,
    }}
  />
);

const HeroSection = ({ heroData }) => {
  const text = "Hire Me • Hire Me • Hire Me •";
  const radius = 4;
  const duration = 12;
  const reverse = false;

  const name = heroData?.name || "Sohan Sarang";
  const title = heroData?.title || "WEB";
  const subtitle = heroData?.subtitle || "DEVELOPER";
  const subtitleAlt = heroData?.subtitleAlt || "DESIGNER";
  const heroImageMobile = heroData?.heroImageMobile || "/Me1_mobile.jpg";
  const heroImageTablet = heroData?.heroImageTablet || "/Me1_tablet.jpg";
  const heroImageDesktop = heroData?.heroImageDesktop || "/Me1_Desktop.jpg";

  const [currentWord, setCurrentWord] = useState(subtitle);

  useEffect(() => {
    setCurrentWord(subtitle);
    const interval = setInterval(() => {
      setCurrentWord((prev) =>
        prev === subtitle ? subtitleAlt : subtitle
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [subtitle, subtitleAlt]);

  const letters = [...text, " "];
  const angleStep = 360 / letters.length;

  const onHireClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        // Run SplitText here
      });
    } else {
      // Fallback: run SplitText after a timeout or on window.onload
    }
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black bg-center bg-cover hero-bg"
      style={{
        backgroundImage: `url('${heroImageDesktop}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
        maxHeight: "100vh",
        height: "100vh",
        width: "100%",
        maxWidth: "100vw",
        position: "relative",
        touchAction: "none",
        overscrollBehavior: "none",
        zIndex: 1,
        isolation: "isolate",
      }}
    >
      {/* Overlay for background opacity */}
      <div className="absolute inset-0 bg-[#080808]" style={{ opacity: 0.7, zIndex: 1 }}></div>
      
      {/* Gradient fade at the top */}
      <div
        className="absolute top-0 left-0 w-full h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to top, transparent, #000 100%)",
          zIndex: 2,
        }}
      />

      {/* Gradient fade at the bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #000 90%)",
          zIndex: 2,
        }}
      />
      {/* Removed Lightning background */}

      <div className="font-mono h-full gap-6 flex items-center md:items-start justify-start flex-col pl-2 sm:pl-4 md:pl-6 lg:pl-8 xl:pl-12 pr-4 sm:pr-6 md:pr-8 pt-36 sm:pt-36 md:pt-36 relative z-10 w-full max-w-7xl mx-auto overflow-hidden" style={{ position: "relative", zIndex: 10, isolation: "isolate" }}>
        {/* Blinking name animation */}
        <div className="name flex justify-center md:justify-start w-full mt-12 sm:mt-16 md:mt-16 md:ml-8 lg:ml-8 xl:ml-8">
          {Array.from(name).map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{
                duration: 0.2,
                delay: i * 0.3,
                times: [0, 0.3, 0.7, 1],  
                ease: "easeInOut",
              }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white"
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* Title with animated switching word - CENTERED ON MOBILE/TABLET */}
        <div className="title font-mono text-white flex flex-col items-center md:items-start justify-center md:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-center md:text-left w-full mt-4 sm:mt-6 md:mt-10 md:ml-4 lg:ml-6 xl:ml-8">
          <h1 
            className="leading-none"
            style={{
              fontSize: "clamp(5rem, 14vw, 8rem)",
              lineHeight: 1,
            }}
          >
            {title}
          </h1>

          {/* Fixed width container to prevent horizontal scrolling */}
          <div className="relative w-full flex justify-center md:justify-start items-center px-2 md:px-0 overflow-hidden">
            <div
              className="relative flex justify-center md:justify-start items-center w-full md:w-auto"
              style={{
                width: "100%",
                maxWidth: "clamp(280px, 90vw, 900px)",
                minHeight: "clamp(60px, 12vw, 140px)",
                overflow: "hidden",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentWord}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex justify-center md:justify-start items-center"
                  style={{ willChange: "opacity" }}
                >
                  <div className="flex justify-center md:justify-start items-center w-full overflow-hidden">
                    {currentWord.split("").map((char, i) => (
                      <motion.span
                        key={`${currentWord}-${char}-${i}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{
                          type: "tween",
                          ease: "easeOut",
                          duration: 0.3,
                          delay: i * 0.01,
                        }}
                        className="inline-block"
                        style={{
                          fontSize: "clamp(5rem, 14vw, 8rem)",
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                          willChange: "transform, opacity",
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Rotating circle with Hire Me button - Fixed outside content container */}
      <div className="hire-me-circle fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:absolute md:bottom-8 md:right-8 flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 z-20">
        <div
          className="relative inline-block w-full h-full rotating-circle"
          style={{ 
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            perspective: "1000px",
          }}
        >
          {letters.map((char, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 text-white text-xs sm:text-sm md:text-base"
              style={{
                transform: `
                  translate3d(-50%, -50%, 0)
                  rotate(${i * angleStep}deg)
                  translate3d(0, calc(-1 * ${radius}ch), 0)
                `,
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <button
          onClick={onHireClick}
          className="absolute inset-0 m-auto bg-white text-black rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all duration-300 text-xs sm:text-sm md:text-base hire-me-btn"
          style={{ willChange: "transform" }}
        >
          Hire Me
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes rotate-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        
        .rotating-circle {
          animation: ${reverse ? 'rotate-reverse' : 'rotate'} ${duration}s linear infinite;
          transform-origin: center center;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          perspective: 1000px;
          -webkit-perspective: 1000px;
        }
        
        /* Responsive background images */
        @media (max-width: 767px) {
          .hero-bg {
            background-image: url('${heroImageMobile}') !important;
            background-size: cover !important;
            background-position: center center !important;
            object-fit: cover;
            width: 100% !important;
            height: 100vh !important;
            max-width: 100% !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            position: relative !important;
            z-index: 1 !important;
            isolation: isolate !important;
            contain: layout style paint !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-bg {
            background-image: url('${heroImageTablet}') !important;
            background-size: cover !important;
            background-position: center center !important;
            object-fit: cover;
            width: 100% !important;
            height: 100vh !important;
            max-width: 100% !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            position: relative !important;
            z-index: 1 !important;
            isolation: isolate !important;
            contain: layout style paint !important;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-bg {
            background-image: url('${heroImageDesktop}') !important;
            background-size: cover !important;
            background-position: center center !important;
          }
        }
        
        /* Prevent scrollbars and layout shifts */
        .hero-bg {
          overflow: hidden !important;
          position: relative !important;
          contain: layout style paint !important;
          isolation: isolate !important;
          touch-action: none !important;
          overscroll-behavior: none !important;
          -webkit-overflow-scrolling: touch;
          z-index: 1 !important;
          width: 100% !important;
          max-width: 100vw !important;
          box-sizing: border-box !important;
          clip-path: inset(0);
        }
        
        /* Ensure hero section doesn't allow overflow from other sections */
        .hero-bg * {
          max-width: 100%;
          box-sizing: border-box;
        }
        
        html, body {
          overflow-x: hidden !important;
          overflow-y: auto;
          width: 100%;
          height: 100%;
          position: relative;
          touch-action: pan-y;
        }
        
        @media (max-width: 1023px) {
          html, body {
            position: relative;
            overflow-x: hidden !important;
            height: auto;
          }
          
          .hero-bg {
            position: relative !important;
            overflow: hidden !important;
          }
        }
        
        /* Performance optimizations */
        .hire-me-circle {
          contain: layout style paint;
          isolation: isolate;
        }
        
        .hire-me-btn:active {
          transform: scale(0.95);
        }
        
        .hire-me-btn:hover {
          transform: scale(1.1);
        }
        
        /* Larger text for mobile and tablet with proper overflow handling */
        @media (max-width: 1023px) {
          .title h1,
          .title .inline-block {
            font-size: clamp(4rem, 12vw, 7rem) !important;
          }
          .title > div > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
          .title > div > div > div {
            width: auto !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
        }
        
        @media (max-width: 767px) {
          .title h1,
          .title .inline-block {
            font-size: clamp(3.5rem, 14vw, 6rem) !important;
          }
          .title > div > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
          .title > div > div > div {
            width: auto !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
        }
        
        /* Fix rotating circle performance on mobile and tablet */
        @media (max-width: 1023px) {
          .hire-me-circle {
            position: fixed !important;
            bottom: 1rem !important;
            right: 1rem !important;
            top: auto !important;
            left: auto !important;
            transform: translateZ(0) !important;
            -webkit-transform: translateZ(0) !important;
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
            will-change: transform !important;
            margin: 0 !important;
            contain: layout style paint !important;
            isolation: isolate !important;
            pointer-events: auto !important;
            touch-action: none !important;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
          
          .rotating-circle {
            transform: translateZ(0) !important;
            -webkit-transform: translateZ(0) !important;
            animation-timing-function: linear !important;
            animation-play-state: running !important;
            -webkit-animation-play-state: running !important;
          }
          
          /* Prevent any scrolling or movement */
          .hero-bg {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
            touch-action: none !important;
            overscroll-behavior: none !important;
            -webkit-overflow-scrolling: none !important;
            z-index: 1 !important;
            isolation: isolate !important;
            contain: layout style paint !important;
          }
        }
        
        /* Reduce animation complexity on mobile for better performance */
        @media (max-width: 767px) {
          .name span {
            animation-play-state: running;
          }
          
          .title .inline-block {
            transform: translateZ(0);
          }
          
          /* Prevent any unwanted scrolling */
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* Additional performance optimizations for tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-bg {
            position: relative !important;
            touch-action: none !important;
          }
          
          .rotating-circle {
            animation-timing-function: linear !important;
            -webkit-animation-timing-function: linear !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
