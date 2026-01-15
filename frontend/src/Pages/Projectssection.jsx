import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projectsAPI } from "../utils/api";

// Helper function to check if URL is a blob URL
const isBlobUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('blob:');
};

// Helper function to validate image URL
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  // Reject blob URLs
  if (isBlobUrl(url)) return false;
  // Accept http/https URLs or relative paths
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('./');
};

const Projectssection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const sectionRef = useRef(null);
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch projects data from API
  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await projectsAPI.getProjects();
        if (response.success && response.data) {
          // Clean blob URLs from the data before setting
          const cleanedData = {
            ...response.data,
            projects: (response.data.projects || []).map(project => {
              if (project.image && isBlobUrl(project.image)) {
                console.warn(`Project "${project.title || 'Unknown'}" has blob URL, removing it`);
                return { ...project, image: '' };
              }
              return project;
            })
          };
          setProjectsData(cleanedData);
        } else {
          console.warn("Projects API response missing success or data:", response);
          setProjectsData({ settings: {}, projects: [] });
        }
      } catch (error) {
        console.error("Error fetching projects data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchProjectsData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for visibility
  useEffect(() => {
    // Set visible immediately if projects are loaded (for better UX)
    if (projectsData && projectsData.projects && projectsData.projects.length > 0) {
      setIsVisible(true);
    }

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
  }, [projectsData]);

  const handleImageLoad = useCallback((projectId) => {
    setLoadedImages((prev) => new Set([...prev, projectId]));
  }, []);

  // Early return after all hooks
  if (loading || !projectsData) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  const { settings, projects = [] } = projectsData;

  // Filter out projects with invalid blob URLs and clean the data
  const validProjects = (projects || []).map(project => {
    // If image is a blob URL, set it to empty string to trigger fallback
    if (project.image && isBlobUrl(project.image)) {
      return { ...project, image: '' };
    }
    return project;
  }).filter(project => {
    // Only show projects that have valid data (title is required)
    const isValid = project && project.title && project.title.trim() !== '';
    if (!isValid) {
      console.warn('Project filtered out (missing title):', project);
    }
    return isValid;
  }).sort((a, b) => {
    // Sort featured project first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });


  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-32 md:py-40 lg:py-24 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 projects-section"
    >
      <div className="max-w-6xl mx-auto lg:py-20">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {settings?.title || "Featured Projects"}
          </h2>
          {settings?.subtitle && (
            <p className="text-gray-400 mb-4">{settings.subtitle}</p>
          )}
          <div className="w-10 h-[1.5px] bg-gray-500 mx-auto"></div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 lg:gap-8">
          {validProjects.length === 0 ? (
            <div className="text-gray-400 text-center py-8 col-span-2">
              <p>No projects available.</p>
              <p className="text-sm mt-2">Total projects in data: {projects.length}</p>
              <p className="text-sm">Valid projects after filtering: {validProjects.length}</p>
            </div>
          ) : (
            validProjects.map((project, index) => {
              const projectId = project._id || project.id;
              if (!projectId) {
                console.error('Project missing ID:', project);
                return null;
              }
              return (
                <ProjectCard
                  key={projectId}
                  project={project}
                  index={index}
                  isVisible={isVisible}
                  onImageLoad={handleImageLoad}
                  isImageLoaded={loadedImages.has(projectId)}
                />
              );
            })
          )}
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

  // Check if image URL is valid (not a blob URL)
  const hasValidImage = project.image && !isBlobUrl(project.image) && isValidImageUrl(project.image);

  const handleLinkClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
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
        transition-transform duration-500
        h-full
        flex
        flex-col
        project-card-tablet"
      >
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              FEATURED
            </div>
          </div>
        )}
        {/* Project Image */}
        <Link to={`/project/${project._id || project.id}`} className="block">
          <div className="relative overflow-hidden p-3 cursor-pointer">
            {hasValidImage && !imageError ? (
              <>
                {/* Loading placeholder */}
                {!isImageLoaded && (
                  <div className="w-full h-40 md:h-44 lg:h-48 bg-gray-700 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-40 md:h-44 lg:h-48 object-cover transition-transform duration-400 project-image-tablet ${
                    isImageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => onImageLoad(project._id || project.id)}
                  onError={() => setImageError(true)}
                  fetchPriority="low"
                />
              </>
            ) : (
              // Fallback when image is invalid, blob URL, or fails to load
              <div className="w-full h-40 md:h-44 lg:h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {project.title ? project.title.split(" ")[0] : "Project"}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-4 md:p-5 lg:p-6 flex-1 flex flex-col project-content-tablet">
          <Link to={`/project/${project._id || project.id}`}>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer">
              {project.title}
            </h3>
          </Link>

          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
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
          )}

          {/* Description and Button */}
          <div className="flex items-start justify-between gap-4 mt-auto">
            <Link 
              to={`/project/${project._id || project.id}`}
              className="text-gray-300 text-sm leading-relaxed flex-1 line-clamp-2 hover:text-white transition-colors cursor-pointer"
            >
              {project.description || "No description available."}
            </Link>
            {project.liveUrl && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS for line clamping and tablet-specific styles
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
  
  /* Tablet-specific fixes for projects page */
  @media (min-width: 768px) and (max-width: 1023px) {
    .projects-section {
      padding-top: 10rem !important;
      padding-bottom: 3rem !important;
    }
    .project-card-tablet {
      max-height: 480px !important;
      min-height: 450px !important;
    }
    .project-image-tablet {
      height: 180px !important;
    }
    .project-content-tablet {
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

export default Projectssection;
