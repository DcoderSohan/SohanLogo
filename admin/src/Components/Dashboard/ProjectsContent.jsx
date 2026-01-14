import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, FolderKanban, FileText, Settings, Save, Loader2 } from "lucide-react";
import ProjectFormModal from "./Forms/ProjectFormModal";
import ProjectDetailsFormModal from "./Forms/ProjectDetailsFormModal";
import SectionSettingsFormModal from "./Forms/SectionSettingsFormModal";
import { useNotification } from "../Common/Notification";
import ConfirmModal from "../Common/ConfirmModal";
import { projectsAPI } from "../../utils/api";

const ProjectsContent = () => {
  const { success, error } = useNotification();
  const [activeCategory, setActiveCategory] = useState("projects");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState(null);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, message: "", type: "warning" });

  // Section Settings
  const [sectionSettings, setSectionSettings] = useState({
    title: "Featured Projects",
    subtitle: "Explore my latest work and creative solutions",
    backgroundImageMobile: "",
    backgroundImageDesktop: "",
  });

  // Projects List Data
  const [projects, setProjects] = useState([]);

  // Project Details Data - stored as array, but we'll convert to object for easier access
  const [projectDetails, setProjectDetails] = useState([]);

  // Fetch projects data on mount
  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        setIsLoading(true);
        const response = await projectsAPI.getProjectsForAdmin();
        if (response.success && response.data) {
          const data = response.data;
          setSectionSettings(data.settings || {
            title: "Featured Projects",
            subtitle: "Explore my latest work and creative solutions",
            backgroundImageMobile: "",
            backgroundImageDesktop: "",
          });
          setProjects(data.projects || []);
          setProjectDetails(data.projectDetails || []);
        }
      } catch (err) {
        console.error("Error fetching projects data:", err);
        error("Failed to load projects content");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectsData();
  }, [error]);

  // Helper function to get project details by project _id
  const getProjectDetailsByProjectId = (projectId) => {
    const id = projectId?._id || projectId;
    return projectDetails.find(
      (detail) => detail.projectId === id || detail.projectId === String(id)
    );
  };

  const categories = [
    { id: "settings", name: "Section Settings", icon: Settings, color: "purple" },
    { id: "projects", name: "Projects List", icon: FolderKanban, color: "green" },
    { id: "details", name: "Project Details", icon: FileText, color: "blue" },
  ];

  const handleAdd = (type) => {
    setFormType(type);
    setEditingItem(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (type, item) => {
    setFormType(type);
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleDelete = (type, id) => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to delete this item?",
      type: "warning",
      onConfirm: () => {
        switch (type) {
          case "project":
            const projectIdStr = String(id);
            setProjects(prev => prev.filter(p => (p._id || p.id) !== id));
            setProjectDetails(prev => prev.filter(detail => {
              return detail.projectId !== projectIdStr && detail.projectId !== id;
            }));
            break;
          default:
            break;
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  const handleSave = (type, data) => {
    switch (type) {
      case "settings":
        setSectionSettings(data);
        break;
      case "project":
        if (editingItem) {
          // If setting this project as featured, unset all other projects
          if (data.featured) {
            setProjects(prev => prev.map(p => {
              if ((p._id || p.id) === (editingItem._id || editingItem.id)) {
                return { ...data, _id: p._id || p.id };
              }
              // Unset featured for all other projects
              return { ...p, featured: false };
            }));
          } else {
            setProjects(prev => prev.map(p => (p._id || p.id) === (editingItem._id || editingItem.id) ? { ...data, _id: p._id || p.id } : p));
          }
        } else {
          // If adding new project as featured, unset all other projects
          if (data.featured) {
            setProjects(prev => {
              const unfeatured = prev.map(p => ({ ...p, featured: false }));
              return [...unfeatured, data];
            });
          } else {
            setProjects(prev => [...prev, data]);
          }
        }
        break;
      case "projectDetails":
        const projectId = selectedProjectForDetails?._id || selectedProjectForDetails?.id;
        if (projectId) {
          const projectIdStr = String(projectId);
          setProjectDetails(prev => {
            const existingIndex = prev.findIndex(detail => {
              return detail.projectId === projectIdStr || detail.projectId === projectId;
            });
            if (existingIndex >= 0) {
              // Update existing
              const updated = [...prev];
              updated[existingIndex] = { ...data, projectId: projectIdStr, _id: prev[existingIndex]._id };
              return updated;
            } else {
              // Add new
              return [...prev, { ...data, projectId: projectIdStr }];
            }
          });
        }
        setSelectedProjectForDetails(null);
        break;
      default:
        break;
    }
    setIsFormModalOpen(false);
    setEditingItem(null);
    setFormType(null);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const allData = {
        settings: sectionSettings,
        projects,
        projectDetails,
      };
      const response = await projectsAPI.saveProjects(allData);
      if (response.success) {
        success("Projects content saved successfully!");
        // Refresh data after save
        const fetchResponse = await projectsAPI.getProjectsForAdmin();
        if (fetchResponse.success && fetchResponse.data) {
          const data = fetchResponse.data;
          setSectionSettings(data.settings || sectionSettings);
          setProjects(data.projects || []);
          setProjectDetails(data.projectDetails || []);
        }
      } else {
        error(response.message || "Failed to save projects content");
      }
    } catch (err) {
      console.error("Error saving projects content:", err);
      error("Failed to save projects content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProjectDetails = (project) => {
    setSelectedProjectForDetails(project);
    setFormType("projectDetails");
    setIsFormModalOpen(true);
  };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case "settings":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-400">Section Settings</h3>
              <button
                onClick={() => handleAdd("settings")}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Settings
              </button>
            </div>
            <div className="bg-[#080808] border border-white/10 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <p className="text-sm text-gray-400">Title</p>
                <p className="text-white font-medium">{sectionSettings.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Subtitle</p>
                <p className="text-white font-medium">{sectionSettings.subtitle}</p>
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-400">Projects</h3>
              <button
                onClick={() => handleAdd("project")}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project._id || project.id}
                  className="p-3 sm:p-4 bg-[#080808] border border-white/10 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{project.title}</h5>
                        {project.featured && (
                          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {project.skills && project.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/20 rounded text-xs text-gray-400">
                            +{project.skills.length - 3}
                          </span>
                        )}
                      </div>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-400 hover:text-green-300"
                      >
                        View Project →
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit("project", project)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("project", project._id || project.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Project Details</h3>
              <p className="text-sm text-gray-400 mb-4">Select a project to edit its detail page content</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((project) => {
                const projectId = project._id || project.id;
                const details = getProjectDetailsByProjectId(projectId);
                return (
                  <button
                    key={projectId}
                    onClick={() => handleEditProjectDetails(project)}
                    className="p-4 text-left bg-[#080808] border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <p className="font-medium text-sm mb-1">{project.title}</p>
                    <p className="text-xs text-gray-400">
                      {details ? 'Details configured' : 'No details yet'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFormModal = () => {
    if (!isFormModalOpen) return null;

    switch (formType) {
      case "settings":
        return (
          <SectionSettingsFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={sectionSettings}
            onSave={(data) => handleSave("settings", data)}
          />
        );
      case "project":
        return (
          <ProjectFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={editingItem}
            onSave={(data) => handleSave("project", data)}
          />
        );
      case "projectDetails":
        return (
          <ProjectDetailsFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setSelectedProjectForDetails(null);
              setFormType(null);
            }}
            project={selectedProjectForDetails}
            data={selectedProjectForDetails ? getProjectDetailsByProjectId(selectedProjectForDetails._id || selectedProjectForDetails.id) : null}
            onSave={(data) => handleSave("projectDetails", data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-8">
      {/* Sticky Header - All Devices */}
      <div className="sticky top-0 z-10 bg-[#080808] backdrop-blur-md -mx-6 sm:-mx-8 px-6 sm:px-8 pt-6 sm:pt-8 pb-4 mb-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Projects Content</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your projects page content and images
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all text-sm sm:text-base font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 border-b border-white/10 pb-4 -mx-6 sm:-mx-8 px-6 sm:px-8">
        <div 
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap flex-shrink-0
                  ${isActive
                    ? category.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                      category.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Content */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCategoryContent()}
      </motion.div>

      {/* Form Modals */}
      {renderFormModal()}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm || (() => {})}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
};

export default ProjectsContent;
