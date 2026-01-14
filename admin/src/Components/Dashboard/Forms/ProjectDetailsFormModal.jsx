import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Upload, Loader2 } from "lucide-react";
import InputModal from "../../Common/InputModal";
import { uploadAPI } from "../../../utils/api";
import { useNotification } from "../../Common/Notification";

const ProjectDetailsFormModal = ({ isOpen, onClose, project, data, onSave }) => {
  const { error: showError } = useNotification();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    images: [],
    longDescription: "",
    features: [],
    githubUrl: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        images: data.images || [],
        longDescription: data.longDescription || "",
        features: data.features || [],
        githubUrl: data.githubUrl || "",
      });
    } else {
      setFormData({
        images: [],
        longDescription: "",
        features: [],
        githubUrl: "",
      });
    }
  }, [data, isOpen]);

  const handleAddImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
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
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, response.data.url]
          }));
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
    input.click();
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const [inputModal, setInputModal] = useState({ isOpen: false, onConfirm: null, title: "", message: "", placeholder: "" });

  const handleAddFeature = () => {
    setInputModal({
      isOpen: true,
      title: "Add Feature",
      message: "Enter a feature",
      placeholder: "e.g., Responsive Design, User Authentication",
      onConfirm: (feature) => {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, feature]
        }));
      },
    });
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
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
                className="w-full max-w-4xl bg-[#080808] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold">Edit Project Details</h2>
                    {project && <p className="text-sm text-gray-400 mt-1">{project.title}</p>}
                  </div>
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Project Images</label>
                      <button
                        type="button"
                        onClick={handleAddImage}
                        disabled={uploading}
                        className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            Add Image
                          </>
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.images.map((image, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={image}
                            alt={`Project image ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Long Description</label>
                    <textarea
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Detailed description of the project..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Features</label>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-sm text-gray-300">
                            {feature}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
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

export default ProjectDetailsFormModal;

