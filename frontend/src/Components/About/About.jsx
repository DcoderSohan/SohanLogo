import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 md:py-32 bg-[#080808]">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Profile Picture with Rounded Rectangle and Floating Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Square Profile Picture Container (4:4 aspect ratio) */}
            <div 
              className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] border-2 border-white/30 rounded-3xl overflow-hidden z-0"
            >
              <img 
                src="./Me2.jpg" 
                alt="Sohan Sarang" 
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />

              {/* Floating Tag with Scrolling Text - On top of image, right bottom corner */}
              <div className="absolute bottom-3 right-3 w-[196px] h-12 md:w-[280px] md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden z-10">
                {/* Fade effect on left (starting) */}
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent z-20 pointer-events-none"></div>
                
                {/* Fade effect on right (ending) */}
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent z-20 pointer-events-none"></div>
                
                {/* Scrolling Text Container */}
                <div className="flex items-center h-full overflow-hidden relative">
                  <div className="flex items-center gap-4 md:gap-6 animate-scroll-infinite whitespace-nowrap">
                    <span className="text-white/90 text-xs md:text-sm font-medium">Analyze</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Design</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Develop</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Testing</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Deployment</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Analyze</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Design</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Develop</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Testing</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Deployment</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Analyze</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Design</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Develop</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Testing</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Deployment</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Analyze</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Design</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Develop</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Testing</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/90 text-xs md:text-sm font-medium">Deployment</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Introduction Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 text-center md:text-left max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              Sohan Sarang
            </h1>
            <h2 className="text-2xl md:text-3xl text-blue-400 mb-6 font-semibold">
              Full-Stack Web Developer
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              I'm a passionate full-stack web developer with a strong foundation in modern web technologies. 
              I love creating beautiful, functional, and user-friendly web experiences. With expertise in 
              React.js, Node.js, and various frontend/backend technologies, I bring ideas to life through code.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg text-sm">
                Available for Projects
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-infinite {
          animation: scroll-infinite 15s linear infinite;
          display: inline-flex;
          flex-shrink: 0;
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default About;
