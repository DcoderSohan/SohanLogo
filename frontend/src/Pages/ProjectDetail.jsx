import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsAPI } from "../utils/api";

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

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project data from API
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getProjects();
        if (response.success && response.data) {
          const projects = response.data.projects || [];
          const details = response.data.projectDetails || [];
          
          // Find project by _id or id
          const foundProject = projects.find(p => 
            (p._id && p._id.toString() === id) || 
            (p.id && p.id.toString() === id)
          );
          
          if (foundProject) {
            // Find project details by projectId
            const foundDetails = details.find(d => {
              const projectId = d.projectId?._id || d.projectId;
              return projectId && (
                projectId.toString() === foundProject._id?.toString() || 
                projectId.toString() === foundProject.id?.toString()
              );
            });
            
            setProject(foundProject);
            setProjectDetails(foundDetails || null);
          } else {
            console.warn('Project not found with id:', id);
            setProject(null);
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  // Get images from project details or use project image, filter out blob URLs
  const projectImages = React.useMemo(() => {
    if (projectDetails?.images && projectDetails.images.length > 0) {
      return projectDetails.images.filter(img => img && isValidImageUrl(img));
    }
    if (project?.image && isValidImageUrl(project.image)) {
      return [project.image];
    }
    return [];
  }, [projectDetails, project]);

  // Auto-slide images
  useEffect(() => {
    if (!project || projectImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === projectImages.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [project, projectImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!project) return;
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") setIsImageModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentImageIndex, project]);

  const goToNext = () => {
    if (!project || projectImages.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === projectImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    if (!project || projectImages.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-4">The project you're looking for doesn't exist.</p>
          <Link to="/projects" className="text-blue-400 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Back button - positioned below navbar */}
      <div className="fixed top-20 sm:top-20 md:top-24 left-4 sm:left-6 md:left-8 lg:left-24 z-30">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-md border border-white/20 text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 pb-6 md:pb-8">
        {/* Image Slider */}
        <div className="mb-6 md:mb-8">
          <div className="relative group">
            {/* Main Image */}
            <div 
              className="relative w-full h-[180px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-lg sm:rounded-xl overflow-hidden bg-gray-900 cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              {projectImages.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={projectImages[currentImageIndex]}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain bg-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    loading="lazy"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {project.title.split(" ")[0]}
                  </span>
                </div>
              )}

              {/* Navigation Arrows - Visible on mobile, hover on desktop */}
              {projectImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 sm:p-2.5 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
                    style={{ minHeight: 44, minWidth: 44 }}
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 sm:p-2.5 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
                    style={{ minHeight: 44, minWidth: 44 }}
                    aria-label="Next image"
                  >
                    <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {projectImages.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                  {currentImageIndex + 1} / {projectImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {projectImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {projectImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                      currentImageIndex === index
                        ? "border-blue-500 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100 active:opacity-100"
                    }`}
                    style={{ minHeight: 64, minWidth: 64 }}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Title - Below Slider */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center sm:text-left leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">About This Project</h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {projectDetails?.longDescription || project.description || "No description available."}
              </p>
            </div>

            {projectDetails?.features && projectDetails.features.length > 0 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {projectDetails.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-gray-300 text-sm sm:text-base"
                  >
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
              {/* Skills */}
              {project.skills && project.skills.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-white/10 text-white border border-white/20 rounded-lg"
                    >
                      {skill}
                    </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="space-y-2 sm:space-y-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base touch-manipulation"
                    style={{ minHeight: 44 }}
                  >
                    <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                    Visit Live Site
                  </a>
                )}
                {projectDetails?.githubUrl && (
                  <a
                    href={projectDetails.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors font-medium text-sm sm:text-base touch-manipulation"
                    style={{ minHeight: 44 }}
                  >
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-2.5 transition-colors touch-manipulation z-10"
              style={{ minHeight: 44, minWidth: 44 }}
              aria-label="Close"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

              <div className="relative max-w-7xl w-full h-full flex items-center justify-center p-4">
                {projectImages.length > 0 ? (
                  <img
                    src={projectImages[currentImageIndex]}
                    alt={`${project.title} - Fullscreen`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Fullscreen image failed to load:', projectImages[currentImageIndex]);
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center';
                      fallback.innerHTML = `<span class="text-white font-bold text-4xl">${project.title ? project.title.split(" ")[0] : "Project"}</span>`;
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-4xl">
                      {project.title ? project.title.split(" ")[0] : "Project"}
                    </span>
                  </div>
                )}

              {projectImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-2 sm:left-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 sm:p-3 transition-colors touch-manipulation"
                    style={{ minHeight: 44, minWidth: 44 }}
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-2 sm:right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 sm:p-3 transition-colors touch-manipulation"
                    style={{ minHeight: 44, minWidth: 44 }}
                    aria-label="Next image"
                  >
                    <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail;

