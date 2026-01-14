import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Settings, FileText, MapPin, Save, Loader2 } from "lucide-react";
import { contactPageAPI } from "../../utils/api";
import { useNotification } from "../Common/Notification";
import ConfirmModal from "../Common/ConfirmModal";
import ContactPageSettingsFormModal from "./Forms/ContactPageSettingsFormModal";
import FormFieldFormModal from "./Forms/FormFieldFormModal";

const ContactPageContent = () => {
  const { success, error } = useNotification();
  const [activeCategory, setActiveCategory] = useState("settings");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, message: "", type: "warning" });

  // Settings Data
  const [settings, setSettings] = useState({
    title: "Get In Touch",
    subtitle: "Feel free to reach out to me",
    description: "",
    mapLocation: {
      latitude: 19.1896137,
      longitude: 73.0358554,
      zoom: 15,
    },
  });

  // Form Fields Data
  const [formFields, setFormFields] = useState([]);

  // Fetch contact page data on mount
  useEffect(() => {
    const fetchContactPageData = async () => {
      try {
        setIsLoading(true);
        const response = await contactPageAPI.getContactPageForAdmin();
        if (response.success && response.data) {
          const data = response.data;
          setSettings(data.settings || {
            title: "Get In Touch",
            subtitle: "Feel free to reach out to me",
            description: "",
            mapLocation: {
              latitude: 19.1896137,
              longitude: 73.0358554,
              zoom: 15,
            },
          });
          setFormFields(data.formFields || []);
        }
      } catch (err) {
        console.error("Error fetching contact page data:", err);
        error("Failed to load contact page content");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactPageData();
  }, [error]);

  const categories = [
    { id: "settings", name: "Page Settings", icon: Settings, color: "purple" },
    { id: "formFields", name: "Form Fields", icon: FileText, color: "blue" },
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
        if (type === "formField") {
          setFormFields(prev => {
            // Filter out the deleted field
            const filtered = prev.filter(f => (f._id || f.id) !== id);
            // Sort by current order and reassign sequential order values
            return filtered
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((field, index) => ({
                ...field,
                order: index + 1,
              }));
          });
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  const handleSave = (type, data) => {
    switch (type) {
      case "settings":
        setSettings(data);
        break;
      case "formField":
        if (editingItem) {
          setFormFields(prev => prev.map(f => (f._id || f.id) === (editingItem._id || editingItem.id) ? { ...data, _id: f._id || f.id } : f));
        } else {
          setFormFields(prev => [...prev, data]);
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
    try {
      setIsSaving(true);
      const response = await contactPageAPI.saveContactPage({
        settings,
        formFields,
      });

      if (response.success) {
        success("Contact page content saved successfully!");
      } else {
        error("Failed to save contact page content");
      }
    } catch (err) {
      console.error("Error saving contact page:", err);
      error("Failed to save contact page content");
    } finally {
      setIsSaving(false);
    }
  };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case "settings":
        return (
          <div className="space-y-4">
            <div className="bg-[#080808] border border-white/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Page Settings</h3>
                  <p className="text-sm text-gray-400">Manage page title, subtitle, description, and map location</p>
                </div>
                <button
                  onClick={() => handleEdit("settings", settings)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Title:</span>
                  <span className="text-white ml-2">{settings.title}</span>
                </div>
                <div>
                  <span className="text-gray-400">Subtitle:</span>
                  <span className="text-white ml-2">{settings.subtitle}</span>
                </div>
                {settings.description && (
                  <div>
                    <span className="text-gray-400">Description:</span>
                    <span className="text-white ml-2">{settings.description}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Map Location:</span>
                  <span className="text-white ml-2">
                    {settings.mapLocation?.latitude}, {settings.mapLocation?.longitude} (Zoom: {settings.mapLocation?.zoom})
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "formFields":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Form Fields</h3>
              <button
                onClick={() => handleAdd("formField")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </button>
            </div>
            {formFields.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No form fields added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formFields
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((field) => (
                    <div
                      key={field._id || field.id}
                      className="p-4 bg-[#080808] border border-white/10 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-white">{field.label}</h5>
                            {field.required && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Required</span>
                            )}
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{field.type}</span>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">
                            <span className="text-gray-500">Name:</span> {field.name}
                          </p>
                          {field.placeholder && (
                            <p className="text-sm text-gray-400 mb-1">
                              <span className="text-gray-500">Placeholder:</span> {field.placeholder}
                            </p>
                          )}
                          <p className="text-sm text-gray-400">
                            <span className="text-gray-500">Order:</span> {field.order || 0}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit("formField", field)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete("formField", field._id || field.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-[#080808] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#080808] border-b border-white/10 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">Contact Page</h2>
            <p className="text-gray-400 text-sm">Manage contact form fields and map location</p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save All</span>
              </>
            )}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? `bg-${category.color}-500/20 border border-${category.color}-500/30 text-${category.color}-400`
                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {renderCategoryContent()}
      </div>

      {/* Form Modals */}
      {isFormModalOpen && formType === "settings" && (
        <ContactPageSettingsFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingItem(null);
            setFormType(null);
          }}
          onSave={(data) => handleSave("settings", data)}
          initialData={editingItem || settings}
        />
      )}

      {isFormModalOpen && formType === "formField" && (
        <FormFieldFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingItem(null);
            setFormType(null);
          }}
          onSave={(data) => handleSave("formField", data)}
          initialData={editingItem}
          existingFields={formFields}
        />
      )}

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

export default ContactPageContent;

