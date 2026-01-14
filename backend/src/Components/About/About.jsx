import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const terminalLines = [
  { type: "command", text: "$ whoami", delay: 0 },
  { type: "output", text: "sohan_sarang", delay: 100 },
  { type: "command", text: "$ cat about.txt", delay: 200 },
  { type: "output", text: "Loading profile...", delay: 300 },
  { type: "success", text: "✓ Passionate web developer identified", delay: 400 },
  { type: "output", text: "Skills: HTML, CSS, JavaScript, React.js", delay: 500 },
  { type: "output", text: "Backend: Node.js, MongoDB, Express.js", delay: 600 },
  { type: "output", text: "Styling: Tailwind CSS, Responsive Design", delay: 700 },
  { type: "success", text: "✓ Multiple freelance projects completed", delay: 800 },
  { type: "output", text: "Specialization: Full-stack applications", delay: 900 },
  { type: "output", text: "Focus: Clean UI & maintainable code", delay: 1000 },
  { type: "command", text: "$ cat education.txt", delay: 1100 },
  { type: "output", text: "Education: Bachelor's in Information Technology", delay: 1200 },
  { type: "output", text: "University: University of Mumbai", delay: 1300 },
  { type: "output", text: "Graduation: 2024", delay: 1400 },
  { type: "success", text: "✓ Strong academic foundation", delay: 1500 },
  { type: "success", text: "✓ Lifelong learner & collaborator", delay: 1600 },
  { type: "command", text: "$ status --current", delay: 1700 },
  { type: "output", text: "Status: Available for new projects", delay: 1800 },
  { type: "success", text: "Ready to build digital experiences! 🚀", delay: 1900 }
];

const TypingText = ({ text, speed = 20, onComplete, className }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-green-400">▋</span>
      )}
    </span>
  );
};

const TerminalLine = ({ line, index, isVisible, onComplete }) => {
  const getLineClass = (type) => {
    switch (type) {
      case "command":
        return "text-cyan-400";
      case "success":
        return "text-green-400";
      case "output":
        return "text-gray-300";
      default:
        return "text-gray-300";
    }
  };

  const getPrefix = (type) => {
    switch (type) {
      case "command":
        return "";
      case "success":
        return "";
      case "output":
        return "  ";
      default:
        return "  ";
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className="font-mono text-sm leading-relaxed"
    >
      <span className={getLineClass(line.type)}>
        {getPrefix(line.type)}
        <TypingText 
          text={line.text} 
          speed={15} // Moderate typing speed for readability
          onComplete={onComplete}
          className={getLineClass(line.type)}
        />
      </span>
    </motion.div>
  );
};

const About = () => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const terminalRef = React.useRef(null);

  useEffect(() => {
    // Start the first line immediately
    if (currentLineIndex < terminalLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines(prev => [...prev, currentLineIndex]);
      }, terminalLines[currentLineIndex].delay);
      
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex]);

  useEffect(() => {
    // Auto-scroll to bottom when new lines are added
    if (terminalRef.current) {
      const scrollElement = terminalRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleLines]);

  const handleLineComplete = () => {
    // Move to next line after current line completes typing
    setTimeout(() => {
      setCurrentLineIndex(prev => prev + 1);
    }, 10); // Very fast transition between lines
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-2 py-32 sm:px-4 md:px-6 text-white overflow-hidden">
      <div className="relative w-full max-w-6xl h-auto md:h-[500px] border-2 border-gray-700 rounded-xl p-2 py-16 sm:p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
        
        {/* Right - Image & Floating Boxes */}
        <div className="w-full md:w-1/2 order-1 md:order-2 relative flex items-center justify-center mb-20 sm:mb-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-[200px] sm:w-[250px] md:w-[300px] h-[250px] sm:h-[300px] md:h-[350px] border-2 border-gray-600 relative z-10 overflow-hidden rounded-lg"
          >
            <img 
              src="./aboutImg.webp" 
              alt="About" 
              className="w-full h-full object-cover" 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute -top-3 sm:-top-5 right-14 sm:right-20 md:-right-3 lg:right-20 w-14 sm:w-16 h-14 sm:h-16 backdrop-blur-md bg-blue-500/30 rounded-lg z-10"
            style={{
              animation: "float 3s ease-in-out infinite"
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute -bottom-5 sm:-bottom-5 left-14 sm:left-20 md:-left-3 lg:left-20 w-14 sm:w-16 h-14 sm:h-16 backdrop-blur-md bg-blue-500/30 rounded-lg z-10"
            style={{
              animation: "float 3s ease-in-out infinite reverse"
            }}
          />
        </div>

        {/* Left - Hacking Terminal Animation */}
        <div className="w-full md:w-1/2 order-2 md:order-1 bg-[#0a0a0a] rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm ml-2">terminal</span>
            <div className="flex-1"></div>
            <span className="text-xs text-gray-500">sohan@portfolio:~</span>
          </div>
          
          {/* Terminal Content */}
          <div 
            ref={terminalRef}
            className="p-4 h-80 overflow-y-auto overflow-x-hidden bg-black/50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            style={{
              background: "linear-gradient(135deg, #0a0a0a 0%, #111 100%)",
              scrollbarWidth: 'thin',
              scrollbarColor: '#4B5563 #1F2937'
            }}
          >
            <div className="space-y-1 min-h-full">
              {terminalLines.map((line, index) => (
                <TerminalLine
                  key={index}
                  line={line}
                  index={index}
                  isVisible={visibleLines.includes(index)}
                  onComplete={index === currentLineIndex ? handleLineComplete : undefined}
                />
              ))}
              
              {/* Blinking cursor at the end */}
              {currentLineIndex >= terminalLines.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center mt-4"
                >
                  <span className="text-cyan-400 font-mono text-sm">$ </span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="text-green-400 font-mono text-sm"
                  >
                    ▋
                  </motion.span>
                </motion.div>
              )}
              
              {/* Extra spacing at bottom for smooth scrolling */}
              <div className="h-4"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        /* Custom scrollbar styles for better terminal look */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        
        /* Firefox scrollbar */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4B5563 #1F2937;
        }
      `}</style>
    </div>
  );
};

export default About;