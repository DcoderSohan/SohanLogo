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

const HeroSection = () => {
  const text = "Hire Me • Hire Me • Hire Me •";
  const radius = 4;
  const duration = 12;
  const reverse = false;

  const [currentWord, setCurrentWord] = useState("DEVELOPER");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) =>
        prev === "DEVELOPER" ? "DESIGNER" : "DEVELOPER"
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      className="relative w-full min-h-screen overflow-hidden bg-black bg-center bg-cover"
      style={{
        backgroundImage: "url('/HeroBgImg.webp')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
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

      <div className="font-mono min-h-screen gap-6 flex items-center justify-center flex-col px-4 relative z-10 w-full">
        {/* Blinking name animation */}
        <div className="name flex justify-center">
          {Array.from("Sohan Sarang").map((char, i) => (
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
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white"
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* Title with animated switching word - FIXED CONTAINER */}
        <div className="title font-mono text-white flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-center w-full max-w-7xl">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl">
            WEB
          </h1>

          {/* Fixed width container to prevent horizontal scrolling */}
          <div className="relative w-full flex justify-center items-center">
            <div
              className="relative flex justify-center items-center"
              style={{
                width: "clamp(300px, 80vw, 800px)", // Fixed responsive width
                minHeight: "clamp(60px, 12vw, 120px)", // Fixed height to prevent vertical shift
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWord}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex justify-center items-center"
                >
                  <div className="flex justify-center items-center">
                    {currentWord.split("").map((char, i) => (
                      <motion.span
                        key={char + i}
                        initial={{ y: 100, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -100, opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          damping: 12,
                          stiffness: 200,
                          mass: 0.8,
                          duration: 0.6,
                          delay: i * 0.04,
                        }}
                        className="inline-block"
                        style={{
                          fontSize: "clamp(2rem, 8vw, 8rem)",
                          lineHeight: 1,
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

        {/* Rotating circle with Hire Me button */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 z-20">
          <motion.div
            className="relative inline-block w-full h-full"
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration }}
          >
            {letters.map((char, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-white text-xs sm:text-sm md:text-base"
                style={{
                  transform: `
                    translate(-50%, -50%)
                    rotate(${i * angleStep}deg)
                    translateY(calc(-1 * ${radius}ch))
                  `,
                  transformOrigin: "center center",
                }}
              >
                {char}
              </span>
            ))}
          </motion.div>

          <motion.button
            onClick={onHireClick}
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.1,
              transition: {
                type: "spring",
                damping: 10,
                stiffness: 400,
              },
            }}
            className="absolute inset-0 m-auto bg-white text-black rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all duration-300 text-xs sm:text-sm md:text-base"
          >
            Hire Me
          </motion.button>
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
      `}</style>
    </div>
  );
};

export default HeroSection;
