import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, ArrowUpRight } from "lucide-react";

const Project = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "Digital Agency (Web & Graphics Design)",
      image: "./project-1.webp",
      skills: ["HTML", "CSS", "JavaScript", "GSAP"],
      description: "A stylish digital agency site with modern animations",
      liveUrl: "https://pixelora-agency.vercel.app/",
    },
    {
      id: 2,
      title: "NewsMania Website",
      image: "./project-2.webp",
      skills: ["React JS", "Tailwind CSS"],
      description: "Dynamic news site with live API integration and search",
      liveUrl: "https://news-mania-silk.vercel.app/",
    },
    {
      id: 3,
      title: "Amazon Forest Website",
      image: "./project-3.webp",
      skills: ["React JS", "Tailwind CSS"],
      description: "Educational animal gallery about Amazon rainforest",
      liveUrl: "https://amazon-forest.vercel.app/",
    },
    {
      id: 4,
      title: "Graphics Designer Portfolio",
      image: "./project-4.webp",
      skills: ["React JS", "Tailwind CSS", "Framer Motion"],
      description: "Portfolio with smooth animations and project layouts",
      liveUrl: "https://graphics-designer.vercel.app/",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        min-h-screen py-20 px-4 overflow-hidden
        bg-[#080808]
        bg-[url('/projectImgBg.webp')] bg-fixed
        md:bg-[url('/projectsImg.webp')] md:bg-fixed
        bg-cover bg-center
        md:bg-cover md:bg-center
        relative
      `}
    >
      {/* Overlay for low opacity effect */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore my latest work and creative solutions
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-20 scale-95"
      }`}
      style={{
        transitionDelay: `${index * 200}ms`,
        animation: isVisible
          ? `slideInUp 0.8s ease-out ${index * 0.2}s both`
          : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="
        relative
        bg-white/20
        backdrop-blur-lg
        border border-white/20
        shadow-lg
        overflow-hidden
        transition-transform duration-500
      "
      >
        {/* Project Image */}
        <div className="relative overflow-hidden p-3">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-700"
          />
        </div>
        {/* Card Content */}
        <div className="p-6 relative z-10">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
            {project.title}
          </h3>
          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-3 py-1 text-xs font-medium bg-white/20 text-white border border-white/30"
              >
                {skill}
              </span>
            ))}
          </div>
          {/* Description and Button Side by Side */}
          <div className="flex items-center justify-between gap-4 w-full">
            <p className="text-gray-300 text-sm leading-relaxed flex-1 w-[60%]">
              {project.description}
            </p>
            <button
              className="flex-shrink-0 group/btn relative flex items-center justify-center w-12 h-12 bg-white rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => window.open(project.liveUrl, "_blank")}
            >
              <ArrowUpRight
                size={24}
                className={`text-black transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5
                `}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add custom keyframes for animations
const styles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  @keyframes uniqueArrow {
    0% { transform: rotate(0deg) translate(0, 0); }
    30% { transform: rotate(-20deg) translate(-4px, -4px); }
    60% { transform: rotate(20deg) translate(4px, -4px); }
    100% { transform: rotate(0deg) translate(0, 0); }
  }
  .group-hover\\:animate-uniqueArrow:hover {
    animation: uniqueArrow 0.6s cubic-bezier(.68,-0.55,.27,1.55);
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Project;
