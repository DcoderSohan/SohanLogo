import React, { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

// Icon/Image wrapper component
const IconWrapper = ({ icon, name }) => {
  // Clean the icon value
  const cleanIcon = (icon || "").trim();
  
  // Check if icon is a valid image URL
  const isImageUrl = cleanIcon && (
    cleanIcon.startsWith('http://') || 
    cleanIcon.startsWith('https://') || 
    cleanIcon.startsWith('/') ||
    cleanIcon.startsWith('data:image')
  );
  
  // Only render image if it's a valid URL
  if (isImageUrl) {
    return (
      <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg overflow-hidden bg-white/5 border border-white/10">
        <img
          src={cleanIcon}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          onError={(e) => {
            // Fallback if image fails to load - show first letter
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML = `<div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl font-bold text-white bg-white/10 rounded-full">${name.charAt(0)}</div>`;
            }
          }}
        />
      </div>
    );
  }
  
  // Always show first letter if no valid image URL
  // Never display the icon string as text (to avoid showing URLs)
  return (
    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl font-bold text-white bg-white/10 rounded-full">
      {name.charAt(0)}
    </div>
  );
};

// Default skills fallback
const defaultSkills = [
  {
    name: "React",
    icon: "",
    percent: 90,
    color: "from-cyan-400 to-blue-500",
    height: "tall",
  },
  {
    name: "JavaScript",
    icon: "",
    percent: 85,
    color: "from-yellow-300 to-yellow-500",
    height: "short",
  },
  {
    name: "HTML5",
    icon: "",
    percent: 95,
    color: "from-orange-400 to-pink-500",
    height: "medium",
  },
  {
    name: "CSS3",
    icon: "",
    percent: 90,
    color: "from-blue-400 to-indigo-500",
    height: "tall",
  },
];

const SkillCard = ({ skill, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-4 break-inside-avoid"
    >
      <div
        className="
        flex flex-col items-center justify-center
        w-full p-4 md:p-5 rounded-xl
        border border-white/30
        bg-white/10
        backdrop-blur-md
        shadow-lg
        hover:scale-105
        transition-transform duration-300
        min-h-[160px] md:min-h-[180px]
      "
      >
        {/* Icon/Image */}
        <div className="mb-3 md:mb-4">
          <IconWrapper icon={skill.icon} name={skill.name} />
        </div>

        {/* Skill name */}
        <div className="font-bold text-sm md:text-base text-white mb-2 md:mb-3 text-center">
          {skill.name}
        </div>

        {/* Animated percentage */}
        <AnimatedPercent
          percent={skill.percent}
          color={skill.color}
          isVisible={isVisible}
        />
      </div>
    </motion.div>
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
        <span className="text-xs text-cyan-200 font-semibold">
          {display}%
        </span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
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

const Skills = ({ skillsData }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Get skills from API or use defaults
  const skillsItems = skillsData?.items || defaultSkills;
  const skillsSettings = skillsData?.settings || {
    title: "My Skills",
    subtitle: "Technologies I work with",
  };

  // Transform skills data to match component structure
  const skills = skillsItems.map((skill) => {
    // Clean and validate icon URL
    let iconUrl = (skill.icon || "").trim();
    
    // If icon exists but doesn't look like a URL, treat as empty (no warning for emojis or other non-URL values)
    if (iconUrl && !iconUrl.startsWith('http://') && !iconUrl.startsWith('https://') && !iconUrl.startsWith('/') && !iconUrl.startsWith('data:image')) {
      iconUrl = "";
    }
    
    return {
      name: skill.name,
      icon: iconUrl,
      percent: skill.percent,
      color: skill.color,
      height: skill.height || "medium",
    };
  });

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

  return (
    <>
      {/* Responsive background: only on mobile */}
      <style>{`
        .skills-bg {
          background-image: url('/skillsMbl.webp');
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;
          background-attachment: fixed;
        }
        @media (min-width: 768px) {
          .skills-bg {
            background-image: url('/skillsBg.webp');
            background-position: center center;
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
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* Title */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={titleVariants}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {skillsSettings.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              {skillsSettings.subtitle}
            </p>
          </motion.div>

          {/* Masonry Layout Container */}
          <div className="masonry-container">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <SkillCard
                  key={skill.name || index}
                  skill={skill}
                  index={index}
                />
              ))
            ) : (
              <p className="text-white text-center">No skills available</p>
            )}
          </div>
        </div>

        <style>{`
          .masonry-container {
            column-count: 2;
            column-gap: 1rem;
            width: 100%;
          }

          @media (min-width: 640px) {
            .masonry-container {
              column-count: 3;
              column-gap: 1.5rem;
            }
          }

          @media (min-width: 768px) {
            .masonry-container {
              column-count: 3;
              column-gap: 2rem;
            }
          }

          @media (min-width: 1024px) {
            .masonry-container {
              column-count: 4;
              column-gap: 2rem;
            }
          }

          @media (min-width: 1280px) {
            .masonry-container {
              column-count: 5;
              column-gap: 2rem;
            }
          }

          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
            -webkit-column-break-inside: avoid;
            display: inline-block;
            width: 100%;
          }
        `}</style>
      </section>
    </>
  );
};

export default Skills;
