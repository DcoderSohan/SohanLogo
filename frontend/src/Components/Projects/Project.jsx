import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Helper function to check if URL is a blob URL
const isBlobUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('blob:');
};

// Helper function to validate image URL
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (isBlobUrl(url)) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('./');
};

const Project = ({ projects: projectsProp = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Use provided projects or fallback to empty array
  const projects = projectsProp.length > 0 ? projectsProp : [];

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
        min-h-screen pt-28 sm:pt-32 md:pt-40 lg:pt-36 pb-20 px-4 md:px-8 overflow-hidden
        bg-[#080808]
        bg-[url('/projectImgBg.webp')]
        md:bg-[url('/projectsImg.webp')]
        bg-cover bg-center
        md:bg-cover md:bg-center
        relative
        project-section
      `}
    >
      {/* Overlay for low opacity effect */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-6 lg:gap-8 mb-12">
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center py-8 col-span-2">No projects available.</p>
          ) : (
            projects.map((project, index) => {
              const projectId = project._id || project.id;
              return (
                <ProjectCard
                  key={projectId}
                  project={project}
                  index={index}
                  isVisible={isVisible}
                />
              );
            })
          )}
        </div>

        {/* View All Projects Button */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <Link
            to="/projects"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>View All Projects</span>
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const projectId = project._id || project.id;
  const hasValidImage = project.image && !isBlobUrl(project.image) && isValidImageUrl(project.image);

  return (
    <div
      className={`group relative transition-all duration-400 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-20"
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
        h-full
        flex
        flex-col
        max-w-full
        md:max-h-[600px]
        lg:max-h-none
        project-card
      "
      >
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              FEATURED
            </div>
          </div>
        )}
        {/* Project Image - Clickable */}
        <Link to={`/project/${projectId}`} className="block">
          <div className="relative overflow-hidden p-3 cursor-pointer">
            {hasValidImage && !imageError ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 md:h-52 lg:h-64 object-cover transition-opacity duration-300 project-card-image"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {project.title ? project.title.split(" ")[0] : "Project"}
                </span>
              </div>
            )}
          </div>
        </Link>
        {/* Card Content */}
        <div className="p-4 md:p-5 lg:p-6 relative z-10 flex-1 flex flex-col project-card-content">
          <Link to={`/project/${projectId}`}>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300 cursor-pointer">
              {project.title}
            </h3>
          </Link>
          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
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
          )}
          {/* Description and Button Side by Side */}
          <div className="flex items-center justify-between gap-4 w-full mt-auto">
            <p className="text-gray-300 text-sm md:text-sm leading-relaxed flex-1 w-[60%] line-clamp-2">
              {project.description || "No description available."}
            </p>
            {project.liveUrl && (
              <button
                className="flex-shrink-0 group/btn relative flex items-center justify-center w-12 h-12 bg-white rounded-full transition-opacity duration-200 hover:opacity-80"
                onClick={() => window.open(project.liveUrl, "_blank")}
              >
                <ArrowUpRight
                  size={24}
                  className={`text-black transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5
                  `}
                />
              </button>
            )}
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
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
  
  /* Tablet-specific fixes */
  @media (min-width: 768px) and (max-width: 1023px) {
    .project-section {
      padding-top: 10rem !important;
    }
    .project-card {
      max-height: 470px !important;
      min-height: 430px !important;
    }
    .project-card .project-card-image {
      height: 170px !important;
    }
    .project-card-content {
      padding: 1rem 1.25rem !important;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Project;
