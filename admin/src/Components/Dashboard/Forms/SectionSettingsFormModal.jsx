import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, Loader2 } from "lucide-react";
import { uploadAPI } from "../../../utils/api";
import { useNotification } from "../../Common/Notification";

const SectionSettingsFormModal = ({ isOpen, onClose, data, onSave }) => {
  const { error: showError } = useNotification();
  const [uploading, setUploading] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    backgroundImageMobile: "",
    backgroundImageDesktop: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        subtitle: data.subtitle || "",
        backgroundImageMobile: data.backgroundImageMobile || "",
        backgroundImageDesktop: data.backgroundImageDesktop || "",
      });
    }
  }, [data, isOpen]);

  const handleImageUpload = async (e, fieldName) => {
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

    setUploading(prev => ({ ...prev, [fieldName]: true }));

    try {
      const response = await uploadAPI.uploadImage(file);
      if (response.success && response.data?.url) {
        setFormData(prev => ({ ...prev, [fieldName]: response.data.url }));
      } else {
        showError(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image');
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
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
                <h2 className="text-xl font-bold">Edit Section Settings</h2>
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
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-purple-400">Background Images</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "backgroundImageMobile", label: "Mobile Background" },
                      { name: "backgroundImageDesktop", label: "Desktop Background" },
                    ].map(({ name, label }) => (
                      <div key={name} className="space-y-2">
                        <label className="block text-sm font-medium">{label}</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, name)}
                            className="hidden"
                            id={name}
                          />
                          <label
                            htmlFor={name}
                            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-white/5 ${uploading[name] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {uploading[name] ? (
                              <>
                                <Loader2 className="w-6 h-6 mb-1 text-purple-400 animate-spin" />
                                <span className="text-xs text-gray-400">Uploading...</span>
                              </>
                            ) : formData[name] ? (
                              <img
                                src={formData[name]}
                                alt={label}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <>
                                <Upload className="w-6 h-6 mb-1 text-gray-400" />
                                <span className="text-xs text-gray-400">Upload</span>
                              </>
                            )}
                          </label>
                        </div>
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
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors flex items-center gap-2"
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
  );
};

export default SectionSettingsFormModal;

