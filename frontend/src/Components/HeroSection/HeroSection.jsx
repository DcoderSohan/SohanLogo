import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = memo(({ heroData }) => {
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

      <div className="font-mono h-full gap-4 sm:gap-6 flex items-center md:items-start justify-center md:justify-start flex-col px-4 sm:px-6 md:pl-6 lg:pl-8 xl:pl-12 md:pr-8 pt-28 sm:pt-32 md:pt-36 pb-20 sm:pb-24 relative z-10 w-full max-w-7xl mx-auto overflow-hidden" style={{ position: "relative", zIndex: 10, isolation: "isolate" }}>
        {/* Blinking name animation */}
        <div className="name flex justify-center md:justify-start w-full mt-6 sm:mt-8 md:mt-16 md:ml-8 lg:ml-8 xl:ml-8">
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
        <div className="title font-mono text-white flex flex-col items-center md:items-start justify-center md:justify-start gap-2 sm:gap-3 md:gap-6 lg:gap-8 text-center md:text-left w-full mt-4 sm:mt-6 md:mt-10 md:ml-4 lg:ml-6 xl:ml-8 px-2 sm:px-4 md:px-0">
          <h1 
            className="leading-none"
            style={{
              fontSize: "clamp(3rem, 12vw, 8rem)",
              lineHeight: 1,
              wordBreak: "break-word",
            }}
          >
            {title}
          </h1>

          {/* Fixed width container to prevent horizontal scrolling */}
          <div className="relative w-full flex justify-center md:justify-start items-center px-2 sm:px-4 md:px-0 overflow-hidden">
            <div
              className="relative flex justify-center md:justify-start items-center w-full md:w-auto"
              style={{
                width: "100%",
                maxWidth: "clamp(250px, 90vw, 900px)",
                minHeight: "clamp(50px, 10vw, 140px)",
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
                  className="absolute inset-0 flex justify-center md:justify-start items-center w-full"
                  style={{ willChange: "opacity" }}
                >
                  <div className="flex justify-center md:justify-start items-center w-full overflow-hidden px-1 sm:px-2 md:px-0">
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
                          fontSize: "clamp(2.5rem, 9vw, 8rem)",
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
        
        /* Prevent scrollbars and layout shifts - but allow vertical scrolling */
        .hero-bg {
          overflow: hidden !important;
          position: relative !important;
          contain: layout style paint !important;
          isolation: isolate !important;
          touch-action: pan-y !important; /* Allow vertical scroll */
          overscroll-behavior-y: auto !important;
          overscroll-behavior-x: none !important;
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
        
        
        /* Larger text for mobile and tablet with proper overflow handling */
        @media (max-width: 1023px) {
          .title h1 {
            font-size: clamp(2.5rem, 10vw, 7rem) !important;
          }
          .title .inline-block {
            font-size: clamp(2.5rem, 9vw, 7rem) !important;
          }
          .title > div > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
            padding: 0 0.5rem !important;
          }
          .title > div > div > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
        }
        
        @media (max-width: 767px) {
          .title h1 {
            font-size: clamp(2rem, 9vw, 5rem) !important;
          }
          .title .inline-block {
            font-size: clamp(2rem, 8vw, 5rem) !important;
          }
          .title > div > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
            padding: 0 0.5rem !important;
          }
          .title > div > div > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
        }
        
        /* Allow vertical scrolling on mobile - only prevent horizontal */
        @media (max-width: 1023px) {
          .hero-bg {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
            touch-action: pan-y !important; /* Allow vertical scroll, block horizontal */
            overscroll-behavior-y: auto !important;
            overscroll-behavior-x: none !important;
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
            touch-action: pan-y !important; /* Allow vertical scroll */
          }
        }
      `}</style>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
