import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";

const ContactPageSettingsFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    mapLocation: {
      latitude: 19.1896137,
      longitude: 73.0358554,
      zoom: 15,
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        mapLocation: {
          latitude: initialData.mapLocation?.latitude || 19.1896137,
          longitude: initialData.mapLocation?.longitude || 73.0358554,
          zoom: initialData.mapLocation?.zoom || 15,
        },
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle) {
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1a1a1a] border border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Page Settings</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Subtitle *</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-lg font-semibold text-white mb-4">Map Location</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.mapLocation.latitude}
                    onChange={(e) => setFormData({
                      ...formData,
                      mapLocation: { ...formData.mapLocation, latitude: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                    required
                    min="-90"
                    max="90"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.mapLocation.longitude}
                    onChange={(e) => setFormData({
                      ...formData,
                      mapLocation: { ...formData.mapLocation, longitude: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                    required
                    min="-180"
                    max="180"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Zoom Level (1-20)</label>
                <input
                  type="number"
                  value={formData.mapLocation.zoom}
                  onChange={(e) => setFormData({
                    ...formData,
                    mapLocation: { ...formData.mapLocation, zoom: parseInt(e.target.value) || 15 }
                  })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  min="1"
                  max="20"
                />
              </div>

              <p className="text-xs text-gray-400 mt-2">
                You can find coordinates by right-clicking on Google Maps and selecting "What's here?"
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-white/10 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactPageSettingsFormModal;

