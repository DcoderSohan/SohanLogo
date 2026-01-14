import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";

const Projectssection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
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
    {
      id: 5,
      title: "Superlabs Website",
      image: "./project-5.webp",
      skills: ["React JS", "Tailwind CSS"],
      description: "Responsive recreation of Superlabs platform",
      liveUrl: "https://superlabs-clone.vercel.app/",
    },
    {
      id: 6,
      title: "Ovallen Watches Showcase",
      image: "./project-6.webp",
      skills: ["HTML", "CSS", "JavaScript"],
      description: "Interactive timepiece collection showcase",
      liveUrl: "https://ovalen.vercel.app/",
    },
    {
      id: 7,
      title: "Plant Shop Frontend",
      image: "./project-7.webp",
      skills: ["HTML", "CSS", "JavaScript"],
      description: "Clean plant shop interface for online browsing",
      liveUrl: "https://planto-henna.vercel.app/",
    },
    {
      id: 8,
      title: "Arvyna Website",
      image: "./project-8.webp",
      skills: ["HTML", "CSS", "JavaScript"],
      description: "Polished clone with interactive elements",
      liveUrl: "https://arvyna.vercel.app/",
    },
    {
      id: 9,
      title: "Ancient Temple - Dwarka Website",
      image: "./project-9.webp",
      skills: ["HTML", "Tailwind CSS", "GSAP"],
      description: "Animated showcase of Dwarkadhish Temple",
      liveUrl: "https://ancient-temple.vercel.app/",
    },
    {
      id: 10,
      title: "Fortress Website (Desktop Only)",
      image: "./project-10.webp",
      skills: ["HTML", "CSS", "JavaScript"],
      description: "Responsive clone built for skill development",
      liveUrl: "https://web-page-assignment-three.vercel.app/",
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
        rootMargin: "0px 0px -50px 0px",
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

  const handleImageLoad = useCallback((projectId) => {
    setLoadedImages((prev) => new Set([...prev, projectId]));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-32 md:py-24 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800"
    >
      <div className="max-w-6xl mx-auto lg:py-20">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-10 h-[1.5px] bg-gray-500 mx-auto"></div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
              onImageLoad={handleImageLoad}
              isImageLoaded={loadedImages.has(project.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  index,
  isVisible,
  onImageLoad,
  isImageLoaded,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleLinkClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`group relative transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{
        transitionDelay: `${Math.min(index * 100, 500)}ms`,
      }}
    >
      <div
        className="relative
        bg-white/20
        backdrop-blur-lg
        border border-white/20
        shadow-lg
        overflow-hidden
        transition-transform duration-500"
      >
        {/* Project Image */}
        <div className="relative overflow-hidden p-3">
          {!imageError ? (
            <>
              {/* Loading placeholder */}
              {!isImageLoaded && (
                <div className="w-full h-40 md:h-48 bg-gray-700 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={project.image}
                alt={project.title}
                className={`w-full h-48 object-cover transition-transform duration-700 ${
                  isImageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
                loading="lazy"
                decoding="async"
                onLoad={() => onImageLoad(project.id)}  
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            // Fallback when image fails to load
            <div className="w-full h-40 md:h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {project.title.split(" ")[0]}
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
            {project.title}
          </h3>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.slice(0, 3).map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-3 py-1 text-xs font-medium bg-white/20 text-white border border-white/30"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="px-2 md:px-3 py-1 text-xs font-medium bg-gray-600/20 text-gray-400 rounded-full">
                +{project.skills.length - 3}
              </span>
            )}
          </div>

          

          {/* Description and Button */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-gray-300 text-sm leading-relaxed flex-1 line-clamp-3">
              {project.description}
            </p>
            <button
              className="flex-shrink-0 group/btn relative flex items-center justify-center w-12 h-12 bg-white rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => handleLinkClick(project.liveUrl)}
              aria-label={`Visit ${project.title}`}
            >
              <ArrowUpRight
                size={20}
                className="text-black transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS for line clamping
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Projectssection;
