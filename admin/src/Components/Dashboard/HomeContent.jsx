import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Home, Quote, BarChart3, Github, Code, Save } from "lucide-react";
import QuoteFormModal from "./Forms/QuoteFormModal";
import StatFormModal from "./Forms/StatFormModal";
import SkillFormModal from "./Forms/SkillFormModal";
import HeroFormModal from "./Forms/HeroFormModal";
import GitgraphFormModal from "./Forms/GitgraphFormModal";
import { homeAPI } from "../../utils/api";
import { useNotification } from "../Common/Notification";
import ConfirmModal from "../Common/ConfirmModal";

const HomeContent = () => {
  const { success, error } = useNotification();
  const [activeCategory, setActiveCategory] = useState("hero");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState(null);

  // Hero Section Data
  const [heroData, setHeroData] = useState({
    name: "Sohan Sarang",
    title: "WEB",
    subtitle: "DEVELOPER",
    subtitleAlt: "DESIGNER",
    heroImageMobile: "",
    heroImageTablet: "",
    heroImageDesktop: "",
  });

  // Quote Section Data
  const [quotes, setQuotes] = useState([
    {
      _id: 1,
      text: '"Code is not just lines it\'s creativity in motion, logic in art, and passion in practice."',
    },
  ]);

  // Stats Section Data
  const [stats, setStats] = useState([
    { _id: 1, label: "Commits", value: 500, plus: true },
    { _id: 2, label: "Projects", value: 10, plus: true },
    { _id: 3, label: "Satisfied Customers", value: 2, plus: false },
  ]);

  // Gitgraph Section Data
  const [gitgraphData, setGitgraphData] = useState({
    userName: "DcoderSohan",
  });

  // Skills Section Data
  const [skills, setSkills] = useState([
    { _id: 1, name: "React", icon: "", percent: 90, color: "from-cyan-400 to-blue-500", height: "tall" },
    { _id: 2, name: "JavaScript", icon: "", percent: 85, color: "from-yellow-300 to-yellow-500", height: "short" },
    { _id: 3, name: "HTML5", icon: "", percent: 95, color: "from-orange-400 to-pink-500", height: "medium" },
    { _id: 4, name: "CSS3", icon: "", percent: 90, color: "from-blue-400 to-indigo-500", height: "tall" },
  ]);

  // Skills Section Settings
  const [skillsSettings, setSkillsSettings] = useState({
    title: "My Skills",
    subtitle: "Technologies I work with",
    backgroundImageMobile: "",
    backgroundImageDesktop: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, message: "", type: "warning" });

  // Load home content from API on mount
  useEffect(() => {
    const fetchHome = async () => {
      try {
        setIsLoading(true);
        const response = await homeAPI.getHomeForAdmin();
        const data = response?.data || response;
        
        if (data) {
          if (data.hero) setHeroData(data.hero);
          if (data.quotes) setQuotes(data.quotes);
          if (data.stats) setStats(data.stats);
          if (data.skills) {
            if (data.skills.settings) setSkillsSettings(data.skills.settings);
            if (data.skills.items) setSkills(data.skills.items);
          }
          if (data.gitgraph) setGitgraphData(data.gitgraph);
        }
      } catch (error) {
        console.error("Failed to load home content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, []);

  const categories = [
    { id: "hero", name: "Hero Section", icon: Home, color: "purple" },
    { id: "quote", name: "Quote", icon: Quote, color: "blue" },
    { id: "skills", name: "Skills", icon: Code, color: "orange" },
    { id: "stats", name: "Stats", icon: BarChart3, color: "green" },
    { id: "gitgraph", name: "Gitgraph", icon: Github, color: "pink" },
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
    const itemName = type === "quote" ? "quote" : type === "stat" ? "statistic" : "skill";
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
      type: "danger",
      onConfirm: () => {
        switch (type) {
          case "quote":
            setQuotes(prev => prev.filter(q => (q._id || q.id) !== id));
            break;
          case "stat":
            setStats(prev => prev.filter(s => (s._id || s.id) !== id));
            break;
          case "skill":
            setSkills(prev => prev.filter(s => (s._id || s.id) !== id));
            break;
          default:
            break;
        }
      },
    });
  };

  const handleSave = (type, data) => {
    switch (type) {
      case "hero":
        setHeroData(data);
        break;
      case "quote":
        if (editingItem) {
          setQuotes(prev => prev.map(q => (q._id || q.id) === (editingItem._id || editingItem.id) ? { ...q, ...data } : q));
        } else {
          // new items will get proper _id from backend on save
          setQuotes(prev => [...prev, { ...data, id: Date.now() }]);
        }
        break;
      case "stat":
        if (editingItem) {
          setStats(prev => prev.map(s => (s._id || s.id) === (editingItem._id || editingItem.id) ? { ...s, ...data } : s));
        } else {
          setStats(prev => [...prev, { ...data, id: Date.now() }]);
        }
        break;
      case "skill":
        if (editingItem) {
          setSkills(prev => prev.map(s => (s._id || s.id) === (editingItem._id || editingItem.id) ? { ...s, ...data } : s));
        } else {
          setSkills(prev => [...prev, { ...data, id: Date.now() }]);
        }
        break;
      case "gitgraph":
        setGitgraphData(data);
        break;
      default:
        break;
    }
    setIsFormModalOpen(false);
    setEditingItem(null);
    setFormType(null);
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const payload = {
        hero: heroData,
        quotes,
        skills: {
          settings: skillsSettings,
          items: skills,
        },
        stats,
        gitgraph: gitgraphData,
      };

      console.log("Saving payload:", JSON.stringify(payload, null, 2)); // Debug log
      console.log("Stats being saved:", stats); // Debug log
      console.log("Skills being saved:", skills); // Debug log

      const response = await homeAPI.saveHome(payload);
      console.log("Save response:", response); // Debug log
      success("Home content saved successfully!", { title: "Success" });
      
      // Reload data from server to get updated IDs
      const updatedData = await homeAPI.getHomeForAdmin();
      const data = updatedData?.data || updatedData;
      if (data) {
        if (data.stats) setStats(data.stats);
        if (data.skills?.items) setSkills(data.skills.items);
        if (data.skills?.settings) setSkillsSettings(data.skills.settings);
      }
    } catch (err) {
      console.error("Failed to save home content:", err);
      error("Failed to save home content. Please try again.", { title: "Error" });
    } finally {
      setIsSaving(false);
    }
  };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case "hero":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-400">Hero Section</h3>
              <button
                onClick={() => handleAdd("hero")}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Hero
              </button>
            </div>
            <div className="bg-[#080808] border border-white/10 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white font-medium">{heroData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Title</p>
                <p className="text-white font-medium">{heroData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Subtitle</p>
                <p className="text-white font-medium">{heroData.subtitle} / {heroData.subtitleAlt}</p>
              </div>
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-400">Quotes</h3>
              <button
                onClick={() => handleAdd("quote")}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Quote
              </button>
            </div>
            <div className="space-y-3">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="p-3 sm:p-4 bg-[#080808] border border-white/10 rounded-lg flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4"
                >
                  <p className="flex-1 text-sm text-gray-300">{quote.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit("quote", quote)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete("quote", quote.id)}
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

      case "stats":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-400">Statistics</h3>
              <button
                onClick={() => handleAdd("stat")}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Stat
              </button>
            </div>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="p-4 bg-[#080808] border border-white/10 rounded-lg flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">{stat.label}</p>
                    <p className="text-sm text-gray-400">
                      {stat.value}{stat.plus ? "+" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit("stat", stat)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete("stat", stat.id)}
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
                  key={skill.id}
                  className="p-4 bg-[#080808] border border-white/10 rounded-lg flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/')) ? (
                      <div className="w-10 h-10 flex items-center justify-center bg-[#080808] rounded border border-white/10">
                        <img 
                          src={skill.icon} 
                          alt={skill.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.outerHTML = `<div class="w-10 h-10 flex items-center justify-center text-lg font-bold text-white">${skill.name.charAt(0)}</div>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-[#080808] rounded border border-white/10 text-lg font-bold text-white">
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
                      onClick={() => handleDelete("skill", skill.id)}
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

      case "gitgraph":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-pink-400">Gitgraph</h3>
              <button
                onClick={() => handleAdd("gitgraph")}
                className="flex items-center gap-2 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Gitgraph
              </button>
            </div>
            <div className="bg-[#080808] border border-white/10 rounded-lg p-6">
              <div>
                <p className="text-sm text-gray-400">GitHub Username</p>
                <p className="text-white font-medium">{gitgraphData.userName}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setIsLoading(true);
        const response = await homeAPI.getHomeForAdmin();
        const data = response?.data || response;

        if (data?.hero) setHeroData(data.hero);
        if (Array.isArray(data?.quotes)) setQuotes(data.quotes);
        if (Array.isArray(data?.stats)) setStats(data.stats);
        if (data?.skills?.settings) setSkillsSettings(data.skills.settings);
        if (Array.isArray(data?.skills?.items)) setSkills(data.skills.items);
        if (data?.gitgraph) setGitgraphData(data.gitgraph);
      } catch (error) {
        console.error("Failed to load home content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, []);

  const renderFormModal = () => {
    if (!isFormModalOpen) return null;

    switch (formType) {
      case "hero":
        return (
          <HeroFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={heroData}
            onSave={(data) => handleSave("hero", data)}
          />
        );
      case "quote":
        return (
          <QuoteFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={editingItem}
            onSave={(data) => handleSave("quote", data)}
          />
        );
      case "stat":
        return (
          <StatFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={editingItem}
            onSave={(data) => handleSave("stat", data)}
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
      case "gitgraph":
        return (
          <GitgraphFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
              setFormType(null);
            }}
            data={gitgraphData}
            onSave={(data) => handleSave("gitgraph", data)}
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Home Content</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your home page content and images
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg transition-all text-sm sm:text-base font-medium disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save All"}
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
                      category.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                      category.color === 'orange' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                      category.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                      'bg-pink-500/20 text-pink-400 border border-pink-500/50'
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm || (() => {})}
        title="Confirm Delete"
        message={confirmModal.message}
        confirmText="Delete"
        cancelText="Cancel"
        type={confirmModal.type}
      />
    </div>
  );
};

export default HomeContent;

