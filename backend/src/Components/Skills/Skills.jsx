import React, { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

// Simulating the icons with styled divs since we don't have react-icons
const IconWrapper = ({ children, color = "#60a5fa" }) => (
  <div
    style={{
      fontSize: "32px",
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
    }}
  >
    {children}
  </div>
);

const skills = [
  {
    name: "React",
    icon: <IconWrapper color="#61dafb">⚛️</IconWrapper>,
    percent: 90,
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "JavaScript",
    icon: <IconWrapper color="#f7df1e">📜</IconWrapper>,
    percent: 85,
    color: "from-yellow-300 to-yellow-500",
  },
  {
    name: "HTML5",
    icon: <IconWrapper color="#e34c26">🌐</IconWrapper>,
    percent: 95,
    color: "from-orange-400 to-pink-500",
  },
  {
    name: "CSS3",
    icon: <IconWrapper color="#1572b6">🎨</IconWrapper>,
    percent: 90,
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Tailwind CSS",
    icon: <IconWrapper color="#06b6d4">🌊</IconWrapper>,
    percent: 80,
    color: "from-teal-300 to-cyan-500",
  },
  {
    name: "Node.js",
    icon: <IconWrapper color="#339933">🚀</IconWrapper>,
    percent: 75,
    color: "from-green-400 to-lime-500",
  },
  {
    name: "Express.js",
    icon: <IconWrapper color="#000000">⚡</IconWrapper>,
    percent: 75,
    color: "from-gray-400 to-gray-700",
  },
  {
    name: "MongoDB",
    icon: <IconWrapper color="#47a248">🍃</IconWrapper>,
    percent: 70,
    color: "from-green-400 to-emerald-600",
  },
  {
    name: "GitHub",
    icon: <IconWrapper color="#181717">🐙</IconWrapper>,
    percent: 85,
    color: "from-gray-400 to-gray-900",
  },
  {
    name: "Cursor AI",
    icon: <IconWrapper color="#8b5cf6">🤖</IconWrapper>,
    percent: 65,
    color: "from-fuchsia-400 to-blue-600",
  },
];

// Duplicate skills for seamless infinite scroll
const duplicatedSkills = [...skills, ...skills, ...skills];

const SkillCard = ({ skill, index }) => {
  return (
    <div className="flex-shrink-0 mx-1 sm:mx-2">
      <div
        className={`
        flex flex-col items-center justify-center
        w-24 h-32 sm:w-28 sm:h-36 p-2 rounded-xl
        border border-white/30
        bg-white/10
        backdrop-blur-md
        shadow-lg
      `}
      >
        {/* Icon */}
        <div className="mb-2">{skill.icon}</div>

        {/* Skill name */}
        <div className="font-bold text-xs text-white mb-1 text-center">
          {skill.name}
        </div>

        {/* Animated percentage */}
        <AnimatedPercent
          percent={skill.percent}
          color={skill.color}
          isVisible={true}
        />
      </div>
    </div>
  );
};

const AnimatedPercent = ({ percent, color, isVisible }) => {
  const [display, setDisplay] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (isVisible) {
      controls.start({ width: `${percent}%` });
      let start = 0;
      const step = () => {
        setDisplay((prev) => {
          if (prev < percent) {
            requestAnimationFrame(step);
            return prev + 1;
          }
          return percent;
        });
      };
      const timer = setTimeout(step, 500);
      return () => clearTimeout(timer);
    }
  }, [percent, isVisible, controls]);

  return (
    <div className="w-full">
      <div className="flex justify-center mb-1">
        <span className="text-xs sm:text-sm text-cyan-200 font-semibold">
          {display}%
        </span>
      </div>
      <div className="w-full h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const Skills = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Detect mobile devices for performance optimization
    const isMobile = window.innerWidth < 768;
    const scrollSpeed = isMobile ? 1 : 2; // Slower on mobile
    const intervalTime = isMobile ? 32 : 16; // Less frequent updates on mobile
    
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        if (prev <= -1600) {
          return 0;
        }
        return prev - scrollSpeed;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Title animation variants
  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      {/* Responsive background: only on mobile */}
      <style>{`
        .skills-bg {
          background-image: url('/skillsMbl.webp');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        @media (min-width: 768px) {
          .skills-bg {
            background-image: url('/skillsBg.webp');
          }
        }
      `}</style>
      
      <section
        ref={ref}
        className="skills-bg
          min-h-screen w-full py-20
          bg-gradient-to-br
          from-[#0a0a15] via-[#101624] to-[#05070d]
          flex flex-col items-center justify-center
          relative overflow-hidden
        "
        id="skills"
      >
        {/* Skills container with fog effects */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative w-full overflow-hidden"
        >
          {/* Left fog effect - larger on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-[#0a0a15] via-[#0a0a15]/80 to-transparent z-10 pointer-events-none" />

          {/* Right fog effect - larger on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-[#0a0a15] via-[#0a0a15]/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling container */}
          <div
            className="flex items-center py-8"
            style={{
              transform: `translateX(${scrollPosition}px)`,
              transition: "none",
              willChange: "transform", // Optimize for animations
            }}
          >
            {duplicatedSkills.map((skill, index) => (
              <SkillCard
                key={`${skill.name}-${index}`}
                skill={skill}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Skills;