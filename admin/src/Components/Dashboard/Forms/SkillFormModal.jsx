import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, Loader2 } from "lucide-react";
import { uploadAPI } from "../../../utils/api";
import { useNotification } from "../../Common/Notification";

const SkillFormModal = ({ isOpen, onClose, data, onSave }) => {
  const { error: showError } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    icon: "", // Now stores image URL instead of emoji
    category: "Other",
    percent: 0,
    color: "from-purple-400 to-blue-500",
    height: "medium",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        icon: data.icon || "", // Image URL
        category: data.category || "Other",
        percent: data.percent || 0,
        color: data.color || "from-purple-400 to-blue-500",
        height: data.height || "medium",
      });
    } else {
      setFormData({
        name: "",
        icon: "",
        category: "Other",
        percent: 0,
        color: "from-purple-400 to-blue-500",
        height: "medium",
      });
    }
  }, [data, isOpen]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file', { title: "Invalid File" });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size should be less than 5MB', { title: "File Too Large" });
      return;
    }

    setUploading(true);

    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.data.url;
      setFormData(prev => ({ ...prev, icon: imageUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
      showError('Failed to upload image. Please try again.', { title: "Upload Error" });
    } finally {
      setUploading(false);
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
              className="w-full max-w-2xl bg-[#080808] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold">{data ? "Edit Skill" : "Add Skill"}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`
                  form::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div>
                  <label className="block text-sm font-medium mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Skill Icon/Image</label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {formData.icon && (
                      <div className="relative w-24 h-24 mx-auto border-2 border-white/20 rounded-lg overflow-hidden bg-white/5">
                        <img
                          src={formData.icon}
                          alt="Skill icon"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icon: "" }))}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded text-white text-xs"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="skill-icon-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="skill-icon-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-white/5 ${
                          uploading 
                            ? 'border-orange-500/50 cursor-wait opacity-50' 
                            : 'border-white/20 hover:border-orange-500'
                        }`}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-8 h-8 mb-2 text-orange-400 animate-spin" />
                            <span className="text-sm text-gray-400">Uploading...</span>
                          </>
                        ) : formData.icon ? (
                          <>
                            <Upload className="w-6 h-6 mb-2 text-gray-400" />
                            <span className="text-sm text-gray-400">Change Image</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-sm text-gray-400">Upload Icon/Image</span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (max 5MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                    
                    {/* Or use URL option */}
                    <div className="text-center text-xs text-gray-400">OR</div>
                    <input
                      type="url"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm"
                      placeholder="Or paste image URL here"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g., Frontend, Backend, Tools"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Percentage (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percent}
                    onChange={(e) => setFormData({ ...formData, percent: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Color Gradient</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: "Cyan to Blue", value: "from-cyan-400 to-blue-500", preview: "bg-gradient-to-r from-cyan-400 to-blue-500" },
                      { name: "Purple to Blue", value: "from-purple-400 to-blue-500", preview: "bg-gradient-to-r from-purple-400 to-blue-500" },
                      { name: "Yellow", value: "from-yellow-300 to-yellow-500", preview: "bg-gradient-to-r from-yellow-300 to-yellow-500" },
                      { name: "Orange to Pink", value: "from-orange-400 to-pink-500", preview: "bg-gradient-to-r from-orange-400 to-pink-500" },
                      { name: "Blue to Indigo", value: "from-blue-400 to-indigo-500", preview: "bg-gradient-to-r from-blue-400 to-indigo-500" },
                      { name: "Teal to Cyan", value: "from-teal-300 to-cyan-500", preview: "bg-gradient-to-r from-teal-300 to-cyan-500" },
                      { name: "Green to Lime", value: "from-green-400 to-lime-500", preview: "bg-gradient-to-r from-green-400 to-lime-500" },
                      { name: "Gray", value: "from-gray-400 to-gray-700", preview: "bg-gradient-to-r from-gray-400 to-gray-700" },
                      { name: "Green to Emerald", value: "from-green-400 to-emerald-600", preview: "bg-gradient-to-r from-green-400 to-emerald-600" },
                      { name: "Fuchsia to Blue", value: "from-fuchsia-400 to-blue-600", preview: "bg-gradient-to-r from-fuchsia-400 to-blue-600" },
                      { name: "Red to Pink", value: "from-red-400 to-pink-500", preview: "bg-gradient-to-r from-red-400 to-pink-500" },
                      { name: "Indigo to Purple", value: "from-indigo-400 to-purple-500", preview: "bg-gradient-to-r from-indigo-400 to-purple-500" },
                    ].map((colorOption) => (
                      <button
                        key={colorOption.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: colorOption.value })}
                        className={`
                          relative p-3 rounded-lg border-2 transition-all
                          ${formData.color === colorOption.value 
                            ? 'border-orange-500 scale-105' 
                            : 'border-white/20 hover:border-white/40'
                          }
                        `}
                      >
                        <div className={`${colorOption.preview} w-full h-8 rounded mb-2`}></div>
                        <span className="text-xs text-gray-300 text-center block">{colorOption.name}</span>
                        {formData.color === colorOption.value && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Card Height</label>
                  <select
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="tall">Tall</option>
                  </select>
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
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2"
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

export default SkillFormModal;

