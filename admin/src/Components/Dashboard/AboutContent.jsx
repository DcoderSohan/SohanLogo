import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, User, Briefcase, GraduationCap, Code, Save, X, Loader2 } from "lucide-react";
import IntroFormModal from "./Forms/IntroFormModal";
import ExperienceFormModal from "./Forms/ExperienceFormModal";
import EducationFormModal from "./Forms/EducationFormModal";
import SkillFormModal from "./Forms/SkillFormModal";
import { aboutAPI } from "../../utils/api";
import { useNotification } from "../Common/Notification";
import ConfirmModal from "../Common/ConfirmModal";
import InputModal from "../Common/InputModal";

const AboutContent = () => {
  const { success, error } = useNotification();
  const [activeCategory, setActiveCategory] = useState("intro");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, message: "", type: "warning" });
  const [inputModal, setInputModal] = useState({ isOpen: false, onConfirm: null, title: "", message: "", placeholder: "" });

  // Intro Section Data
  const [introData, setIntroData] = useState({
    name: "Sohan Sarang",
    title: "Full-Stack Web Developer",
    description: "I'm a passionate full-stack web developer with a strong foundation in modern web technologies. I love creating beautiful, functional, and user-friendly web experiences. With expertise in React.js, Node.js, and various frontend/backend technologies, I bring ideas to life through code.",
    profileImage: "",
    tags: ["Available for Projects", "Full-Stack Developer"],
    scrollingSkills: ["Analyze", "Design", "Develop", "Testing", "Deployment"],
  });

  // Experience Section Data
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: "Freelance Web Developer",
      company: "Self-Employed",
      location: "Remote",
      period: "2022 - Present",
      description: "Building responsive web applications and websites for clients. Specializing in React.js, Node.js, and modern web technologies.",
      achievements: [
        "Completed 27+ projects successfully",
        "Built full-stack applications",
        "Implemented modern UI/UX designs",
        "Optimized websites for performance"
      ]
    }
  ]);

  // Education Section Data
  const [educations, setEducations] = useState([
    {
      id: 1,
      degree: "Bachelor's in Information Technology",
      university: "University of Mumbai",
      location: "Mumbai, India",
      year: "2024",
      description: "Strong foundation in computer science, software engineering, and web technologies."
    }
  ]);

  // Skills Section Data
  const [skills, setSkills] = useState([]);
  
  // Skills Section Settings
  const [skillsSettings, setSkillsSettings] = useState({
    title: "My Skills",
    subtitle: "Technologies I work with",
  });

  // Fetch about data on mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutAPI.getAboutForAdmin();
        if (response.success && response.data) {
          const data = response.data;
          setIntroData(data.intro || {
            name: "Sohan Sarang",
            title: "Full-Stack Web Developer",
            description: "I'm a passionate full-stack web developer with a strong foundation in modern web technologies. I love creating beautiful, functional, and user-friendly web experiences. With expertise in React.js, Node.js, and various frontend/backend technologies, I bring ideas to life through code.",
            profileImage: "",
            tags: ["Available for Projects", "Full-Stack Developer"],
            scrollingSkills: ["Analyze", "Design", "Develop", "Testing", "Deployment"],
          });
          setExperiences(data.experiences || []);
          setEducations(data.educations || []);
          if (data.skills) {
            if (data.skills.settings) setSkillsSettings(data.skills.settings);
            if (data.skills.items) setSkills(data.skills.items);
          }
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
        error("Failed to load about content");
      }
    };
    fetchAboutData();
  }, [error]);

  const categories = [
    { id: "intro", name: "Intro", icon: User, color: "blue" },
    { id: "experience", name: "Experience", icon: Briefcase, color: "green" },
    { id: "education", name: "Education", icon: GraduationCap, color: "purple" },
    { id: "skills", name: "Skills", icon: Code, color: "orange" },
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
          case "experience":
            setExperiences(prev => prev.filter(e => (e._id || e.id) !== id));
            break;
          case "education":
            setEducations(prev => prev.filter(e => (e._id || e.id) !== id));
            break;
        case "skill":
          setSkills(prev => prev.filter(s => (s._id || s.id) !== id));
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
      case "intro":
        setIntroData(data);
        break;
      case "experience":
        if (editingItem) {
          setExperiences(prev => prev.map(e => (e._id || e.id) === (editingItem._id || editingItem.id) ? { ...data, _id: e._id || e.id } : e));
        } else {
          setExperiences(prev => [...prev, data]);
        }
        break;
      case "education":
        if (editingItem) {
          setEducations(prev => prev.map(e => (e._id || e.id) === (editingItem._id || editingItem.id) ? { ...data, _id: e._id || e.id } : e));
        } else {
          setEducations(prev => [...prev, data]);
        }
        break;
      case "skill":
        if (editingItem) {
          setSkills(prev => prev.map(s => (s._id || s.id) === (editingItem._id || editingItem.id) ? { ...data, _id: s._id || s.id } : s));
        } else {
          setSkills(prev => [...prev, data]);
        }
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
        intro: introData,
        experiences,
        educations,
        skills: {
          settings: skillsSettings,
          items: skills,
        },
      };
      const response = await aboutAPI.saveAbout(allData);
      if (response.success) {
        success("About content saved successfully!");
        // Refresh data after save
        const fetchResponse = await aboutAPI.getAboutForAdmin();
        if (fetchResponse.success && fetchResponse.data) {
          const data = fetchResponse.data;
          setIntroData(data.intro || introData);
          setExperiences(data.experiences || []);
          setEducations(data.educations || []);
          if (data.skills) {
            if (data.skills.settings) setSkillsSettings(data.skills.settings);
            if (data.skills.items) setSkills(data.skills.items);
          }
        }
      } else {
        error(response.message || "Failed to save about content");
      }
    } catch (err) {
      console.error("Error saving about content:", err);
      error("Failed to save about content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    setInputModal({
      isOpen: true,
      title: "Add Tag",
      message: "Enter a new tag name",
      placeholder: "e.g., Available for Projects",
      onConfirm: (tag) => {
        setIntroData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
      },
    });
  };

  const handleRemoveTag = (tagToRemove) => {
    setIntroData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddScrollingSkill = () => {
    setInputModal({
      isOpen: true,
      title: "Add Scrolling Skill",
      message: "Enter a new scrolling skill",
      placeholder: "e.g., Analyze, Design, Develop",
      onConfirm: (skill) => {
        setIntroData(prev => ({
          ...prev,
          scrollingSkills: [...prev.scrollingSkills, skill]
        }));
      },
    });
  };

  const handleRemoveScrollingSkill = (skillToRemove) => {
    setIntroData(prev => ({
      ...prev,
      scrollingSkills: prev.scrollingSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case "intro":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-400">Intro Section</h3>
              <button
                onClick={() => handleAdd("intro")}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Intro
              </button>
            </div>
            <div className="bg-[#080808] border border-white/10 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
              {introData.profileImage && (
                <div>
                  <img src={introData.profileImage} alt="Profile" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white font-medium">{introData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Title</p>
                <p className="text-white font-medium">{introData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-white text-sm">{introData.description}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Tags</p>
                  <button
                    onClick={handleAddTag}
                    className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {introData.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Scrolling Skills</p>
                  <button
                    onClick={handleAddScrollingSkill}
                    className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {introData.scrollingSkills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs flex items-center gap-1">
                      {skill}
                      <button onClick={() => handleRemoveScrollingSkill(skill)} className="text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-400">Experiences</h3>
              <button
                onClick={() => handleAdd("experience")}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp._id || exp.id}
                  className="p-4 bg-[#080808] border border-white/10 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h5 className="font-medium">{exp.title}</h5>
                      <p className="text-sm text-gray-400">{exp.company} • {exp.location} • {exp.period}</p>
                      <p className="text-sm text-gray-300 mt-2">{exp.description}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-xs text-gray-400">• {achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit("experience", exp)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("experience", exp._id || exp.id)}
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

      case "education":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-400">Education</h3>
              <button
                onClick={() => handleAdd("education")}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div
                  key={edu._id || edu.id}
                  className="p-4 bg-[#080808] border border-white/10 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h5 className="font-medium">{edu.degree}</h5>
                      <p className="text-sm text-gray-400">{edu.university} • {edu.location} • {edu.year}</p>
                      <p className="text-sm text-gray-300 mt-2">{edu.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit("education", edu)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("education", edu._id || edu.id)}
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

      case "skills":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-orange-400">Skills</h3>
              <button
                onClick={() => handleAdd("skill")}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill._id || skill.id}
                  className="p-4 bg-[#080808] border border-white/10 rounded-lg flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/') || skill.icon.startsWith('data:image')) ? (
                      <div className="w-10 h-10 flex items-center justify-center bg-[#080808] rounded-lg border border-white/10 overflow-hidden">
                        <img 
                          src={skill.icon} 
                          alt={skill.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.outerHTML = `<div class="w-10 h-10 flex items-center justify-center text-lg font-bold text-white bg-white/10 rounded-full">${skill.name.charAt(0)}</div>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-lg font-bold text-white">
                        {skill.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-sm text-gray-400">
                        {skill.percent}% • {skill.height}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit("skill", skill)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete("skill", skill._id || skill.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
      case "intro":
        return (
          <IntroFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={introData}
            onSave={(data) => handleSave("intro", data)}
          />
        );
      case "experience":
        return (
          <ExperienceFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={editingItem}
            onSave={(data) => handleSave("experience", data)}
          />
        );
      case "education":
        return (
          <EducationFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={editingItem}
            onSave={(data) => handleSave("education", data)}
          />
        );
      case "skill":
        return (
          <SkillFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={editingItem}
            onSave={(data) => handleSave("skill", data)}
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">About Content</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your about page content and images
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all text-sm sm:text-base font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                    ? category.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                      category.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                      category.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                      'bg-orange-500/20 text-orange-400 border border-orange-500/50'
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

      {/* Input Modal */}
      <InputModal
        isOpen={inputModal.isOpen}
        title={inputModal.title}
        message={inputModal.message}
        placeholder={inputModal.placeholder}
        onConfirm={inputModal.onConfirm || (() => {})}
        onClose={() => setInputModal({ ...inputModal, isOpen: false })}
      />
    </div>
  );
};

export default AboutContent;
