import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, MapPin } from "lucide-react";

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "Let's Work Together",
    description: "Ready to bring your ideas to life? Let's connect and create something amazing together.",
    mapLatitude: 19.1896137,
    mapLongitude: 73.0358554,
    mapZoom: 15,
    emailjsServiceId: "service_9axwrfs",
    emailjsTemplateId: "template_yvct6v9",
    emailjsPublicKey: "CWEwSugV7hRCvdtRz",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'mapLatitude' || name === 'mapLongitude' || name === 'mapZoom' 
        ? parseFloat(value) || 0 
        : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact content saved:", formData);
    alert("Contact content saved successfully!");
    onClose();
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
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#080808] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Manage Contact Content</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Contact Form Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-pink-400">Contact Form</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Map Configuration */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-pink-400 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Map Configuration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        name="mapLatitude"
                        value={formData.mapLatitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        name="mapLongitude"
                        value={formData.mapLongitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Zoom Level</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        name="mapZoom"
                        value={formData.mapZoom}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">Map Preview URL:</p>
                    <code className="text-xs text-green-400 break-all">
                      {`https://www.google.com/maps?q=${formData.mapLatitude},${formData.mapLongitude}&z=${formData.mapZoom}&output=embed`}
                    </code>
                  </div>
                </div>

                {/* EmailJS Configuration */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-pink-400">EmailJS Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Service ID</label>
                      <input
                        type="text"
                        name="emailjsServiceId"
                        value={formData.emailjsServiceId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Template ID</label>
                      <input
                        type="text"
                        name="emailjsTemplateId"
                        value={formData.emailjsTemplateId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Public Key</label>
                      <input
                        type="text"
                        name="emailjsPublicKey"
                        value={formData.emailjsPublicKey}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;

