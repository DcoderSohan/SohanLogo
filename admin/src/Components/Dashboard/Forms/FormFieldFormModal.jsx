import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";

const FormFieldFormModal = ({ isOpen, onClose, onSave, initialData, existingFields = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    type: "text",
    placeholder: "",
    required: true,
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        label: initialData.label || "",
        type: initialData.type || "text",
        placeholder: initialData.placeholder || "",
        required: initialData.required !== undefined ? initialData.required : true,
        order: initialData.order || 0,
      });
    } else {
      // Set default order for new field
      const maxOrder = existingFields.length > 0 
        ? Math.max(...existingFields.map(f => f.order || 0))
        : -1;
      setFormData({
        name: "",
        label: "",
        type: "text",
        placeholder: "",
        required: true,
        order: maxOrder + 1,
      });
    }
  }, [initialData, isOpen, existingFields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.label) {
      return;
    }

    // Check if field name already exists (excluding current field if editing)
    const isNameTaken = existingFields.some(f => {
      const fieldId = f._id || f.id;
      const currentId = initialData?._id || initialData?.id;
      return f.name === formData.name && fieldId !== currentId;
    });

    if (isNameTaken) {
      alert("A field with this name already exists. Please choose a different name.");
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
            <h3 className="text-xl font-bold text-white">
              {initialData ? "Edit Form Field" : "Add Form Field"}
            </h3>
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
              <label className="block text-sm font-medium mb-2 text-white">Field Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                placeholder="e.g., name, email, message"
                required
                disabled={!!initialData} // Disable if editing (name shouldn't change)
              />
              <p className="text-xs text-gray-400 mt-1">
                Field name (used internally, lowercase with underscores)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Label *</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                placeholder="e.g., Your Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Field Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                required
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Telephone</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Placeholder</label>
              <input
                type="text"
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                placeholder="e.g., Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                min="0"
              />
              <p className="text-xs text-gray-400 mt-1">
                Lower numbers appear first in the form
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                id="required"
              />
              <label htmlFor="required" className="text-sm text-white cursor-pointer">
                Required field
              </label>
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

export default FormFieldFormModal;

