import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, Plus, Loader2 } from "lucide-react";
import InputModal from "../../Common/InputModal";
import { uploadAPI } from "../../../utils/api";
import { useNotification } from "../../Common/Notification";

const ProjectFormModal = ({ isOpen, onClose, data, onSave }) => {
  const { error: showError } = useNotification();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    skills: [],
    description: "",
    liveUrl: "",
    featured: false,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        image: data.image || "",
        skills: data.skills || [],
        description: data.description || "",
        liveUrl: data.liveUrl || "",
        featured: data.featured || false,
      });
    } else {
      setFormData({
        title: "",
        image: "",
        skills: [],
        description: "",
        liveUrl: "",
        featured: false,
      });
    }
  }, [data, isOpen]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadImage(file);
      if (response.success && response.data?.url) {
        setFormData(prev => ({ ...prev, image: response.data.url }));
      } else {
        showError(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const [inputModal, setInputModal] = useState({ isOpen: false, onConfirm: null, title: "", message: "", placeholder: "" });

  const handleAddSkill = () => {
    setInputModal({
      isOpen: true,
      title: "Add Skill",
      message: "Enter a skill name",
      placeholder: "e.g., React, Node.js",
      onConfirm: (skill) => {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skill]
        }));
      },
    });
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55]"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-3xl bg-[#080808] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold">{data ? "Edit Project" : "Add Project"}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`
                    form::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Image</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="projectImage"
                      />
                      <label
                        htmlFor="projectImage"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-green-500 transition-colors bg-white/5"
                      >
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Project"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-sm text-gray-400">Upload Image</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Live URL</label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Skills</label>
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="text-xs px-2 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-400 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Skill
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(idx)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Project Toggle */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-yellow-500/50 bg-white/5 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
                    />
                    <label htmlFor="featured" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-yellow-400">⭐ Featured Project</span>
                        <span className="text-xs text-gray-400">(Only one project can be featured)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This project will be highlighted with a golden tag</p>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Input Modal */}
      <InputModal
        isOpen={inputModal.isOpen}
        title={inputModal.title}
        message={inputModal.message}
        placeholder={inputModal.placeholder}
        onConfirm={inputModal.onConfirm || (() => {})}
        onClose={() => setInputModal({ ...inputModal, isOpen: false })}
      />
    </>
  );
};

export default ProjectFormModal;

