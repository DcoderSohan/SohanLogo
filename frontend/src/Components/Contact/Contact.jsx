import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Send, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useLocation } from "react-router-dom";
import { contactAPI, contactPageAPI } from "../../utils/api";
import SuccessModal from "./SuccessModal";

const Contact = memo(() => {
  const location = useLocation();
  const isStandalonePage = location.pathname === "/contact";
  const [formData, setFormData] = useState({});
  const [contactPageData, setContactPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'error'
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Refs for intersection observer
  const titleRef = useRef(null);
  const formRef = useRef(null);

  // Animation controls
  const titleControls = useAnimation();
  const formControls = useAnimation();

  // Intersection observer hooks
  const titleInView = useInView(titleRef, { once: true, threshold: 0.3 });
  const formInView = useInView(formRef, { once: true, threshold: 0.2 });

  // Fetch contact page data
  useEffect(() => {
    const fetchContactPageData = async () => {
      try {
        setLoading(true);
        const response = await contactPageAPI.getContactPage();
        if (response.success && response.data) {
          setContactPageData(response.data);
          // Initialize form data based on form fields
          const initialFormData = {};
          (response.data.formFields || []).forEach(field => {
            initialFormData[field.name] = "";
          });
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error("Error fetching contact page data:", error);
        // Fallback to default form fields
        setFormData({ name: "", email: "", mobile: "", message: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchContactPageData();
    // Only refetch on standalone page, and less frequently to reduce re-renders
    if (isStandalonePage) {
      const interval = setInterval(fetchContactPageData, 60000); // Reduced from 30s to 60s
      return () => clearInterval(interval);
    }
  }, [isStandalonePage]);

  // Get map configuration from API or use defaults
  const mapLocation = useMemo(() => contactPageData?.settings?.mapLocation || {
    latitude: 19.1896137,
    longitude: 73.0358554,
    zoom: 15,
  }, [contactPageData?.settings?.mapLocation]);
  
  // Generate Google Maps embed URL
  const mapEmbedUrl = useMemo(() => 
    `https://www.google.com/maps?q=${mapLocation.latitude},${mapLocation.longitude}&z=${mapLocation.zoom}&output=embed`,
    [mapLocation]
  );

  // Get form fields from API or use defaults, and sort by order
  const formFields = useMemo(() => (contactPageData?.formFields || [
    { name: "name", label: "Name", type: "text", placeholder: "Your Name", required: true, order: 1 },
    { name: "email", label: "Email", type: "email", placeholder: "your.email@example.com", required: true, order: 2 },
    { name: "mobile", label: "Mobile", type: "tel", placeholder: "+1234567890", required: true, order: 3 },
    { name: "message", label: "Message", type: "textarea", placeholder: "Your Message", required: true, order: 4 },
  ]).sort((a, b) => (a.order || 0) - (b.order || 0)), [contactPageData?.formFields]);

  // Get page settings from API or use defaults
  const pageSettings = useMemo(() => contactPageData?.settings || {
    title: "Get In Touch",
    subtitle: "Feel free to reach out to me",
    description: "",
  }, [contactPageData?.settings]);

  // Check screen size - proper responsive breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Mobile: < 640px, Tablet: 640px - 1024px, Desktop: > 1024px
      setIsMobile(width < 640);
    };

    checkScreenSize();
    const resizeHandler = () => {
      // Debounce resize for better performance
      setTimeout(checkScreenSize, 150);
    };
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // Trigger animations when sections come into view
  useEffect(() => {
    if (titleInView) {
      titleControls.start("visible");
    }
  }, [titleInView, titleControls]);

  useEffect(() => {
    if (formInView) {
      formControls.start("visible");
    }
  }, [formInView, formControls]);

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateMobile = useCallback((mobile) => {
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ""));
  }, []);

  const showNotification = useCallback((message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(""), 5000);
  }, []);

  const handleSubmit = async () => {
    // Dynamic validation based on form fields
    const requiredFields = formFields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name] || !formData[f.name].trim());
    
    if (missingFields.length > 0) {
      showNotification(`Please fill in all required fields: ${missingFields.map(f => f.label).join(", ")}`, "error");
      return;
    }

    // Validate email if email field exists
    const emailField = formFields.find(f => f.type === "email");
    if (emailField && formData[emailField.name]) {
      if (!validateEmail(formData[emailField.name])) {
        showNotification("Please enter a valid email address", "error");
        return;
      }
    }

    // Validate mobile if tel field exists
    const mobileField = formFields.find(f => f.type === "tel");
    if (mobileField && formData[mobileField.name]) {
      if (!validateMobile(formData[mobileField.name])) {
        showNotification("Please enter a valid mobile number", "error");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare submission data with all form fields
      const submissionData = {};
      formFields.forEach(field => {
        if (formData[field.name]) {
          submissionData[field.name] = formData[field.name].trim();
        }
      });

      // Save to backend database and send email via backend
      const result = await contactAPI.createContact(submissionData);

      if (result && result.success) {
        // Reset form data
        const resetData = {};
        formFields.forEach(field => {
          resetData[field.name] = "";
        });
        setFormData(resetData);
        setShowSuccessModal(true);
      } else {
        throw new Error(result?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to send message. Please try again or contact me directly.";
      showNotification(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simplified animation variants - smooth and performant
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0 },
    visible: (index) => ({
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: index * 0.05,
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div>
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <div
        className={`${isStandalonePage ? 'min-h-screen' : ''} flex ${isStandalonePage ? 'items-start' : 'items-center'} justify-center relative py-8 sm:py-12`}
        style={{
          background:
            "linear-gradient(135deg, #080808 40%, #1e1b4b 70%, #4f46e5 100%)",
          touchAction: 'pan-y', // Enable vertical scrolling on mobile
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          overflowX: 'hidden',
          overflowY: 'visible',
        }}
        id="contact"
      >
        {/* Static background elements - no animations for better performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/6 w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {!isStandalonePage ? (
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start py-8 md:py-12 lg:py-16 contact-grid">
              {/* Left side - Title */}
              <motion.div
                ref={titleRef}
                className="text-center md:text-left order-1"
                variants={containerVariants}
                initial="hidden"
                animate={titleControls}
              >
                <div className="space-y-2 md:space-y-3">
                  {["Let's", "Work", "Together"].map((word, index) => (
                    <motion.h1
                      key={word}
                      custom={index}
                      variants={wordVariants}
                      className={`contact-title-text
                      text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                      font-Tourney text-white leading-tight
                      ${word === "Let's" ? "hover:text-purple-400" : ""}
                      ${word === "Work" ? "hover:text-blue-400" : ""}
                      ${word === "Together" ? "hover:text-green-400" : ""}
                      transition-colors duration-300 cursor-default
                    `}
                    >
                      {word}
                    </motion.h1>
                  ))}
                </div>
              </motion.div>

              {pageSettings.description && (
                <motion.div
                  className="mt-4 md:mt-6 text-gray-300 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {pageSettings.description}
                </motion.div>
              )}

              {/* Right side - Form */}
              <motion.div
                ref={formRef}
                variants={formVariants}
                initial="hidden"
                animate={formControls}
                className="relative order-2"
              >
                <div className="backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-700/30 shadow-xl bg-gray-900/30 contact-form-container">
                  {/* Notification */}
                  {notification && (
                    <div
                      className={`mb-4 text-center font-semibold text-sm md:text-base px-4 py-3 rounded-lg ${
                        notificationType === "success"
                          ? "text-green-400 bg-green-400/10 border border-green-400/20"
                          : "text-red-400 bg-red-400/10 border border-red-400/20"
                      }`}
                    >
                      {notification}
                    </div>
                  )}

                  <div className="space-y-4 md:space-y-6">
                  {/* Dynamic Form inputs */}
                  {formFields && formFields.length > 0 && formFields
                    .filter(field => field && field.type !== "textarea")
                    .map((field, index) => {
                      // Map field types to icons
                      const iconMap = {
                        text: User,
                        email: Mail,
                        tel: Phone,
                        number: Phone,
                      };
                      const Icon = iconMap[field.type] || User;
                      const colorMap = {
                        text: "purple",
                        email: "blue",
                        tel: "green",
                        number: "green",
                      };
                      const color = colorMap[field.type] || "purple";

                      return (
                        <motion.div
                          key={field.name}
                          custom={index}
                          variants={inputVariants}
                          className="relative group"
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Icon
                              className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-${color}-400 transition-colors duration-300`}
                            />
                          </div>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            className={`contact-input
                            w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 
                            bg-gray-900/50 border border-gray-600/50 rounded-lg
                            text-white placeholder-gray-400 text-sm md:text-base
                            focus:border-${color}-400 focus:outline-none focus:ring-2 focus:ring-${color}-400/20
                            transition-all duration-200 backdrop-blur-sm
                          `}
                            required={field.required}
                          />
                        </motion.div>
                      );
                    })}

                  {/* Textarea fields */}
                  {formFields && formFields.length > 0 && formFields
                    .filter(field => field && field.type === "textarea")
                    .map((field, index) => (
                      <motion.div
                        key={field.name}
                        custom={formFields.filter(f => f.type !== "textarea").length + index}
                        variants={inputVariants}
                        className="relative group"
                      >
                        <div className="absolute top-3 md:top-4 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                        </div>
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          rows={4}
                          className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-200 backdrop-blur-sm resize-none text-sm md:text-base contact-textarea"
                          required={field.required}
                        />
                      </motion.div>
                    ))}

                  {/* Submit Button */}
                  <motion.div className="flex justify-center pt-4 md:pt-6">
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={isSubmitting}
                      className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-r from-purple-500 via-purple-900 to-blue-500 rounded-full text-white font-semibold shadow-xl md:shadow-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
                    >
                      {isSubmitting ? (
                        <div className="relative z-10 animate-spin">
                          <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                      ) : (
                        <Send className="h-5 w-5 md:h-6 md:w-6 relative z-10" />
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : null}

          {/* Standalone Contact Page Layout - Text and Form side by side, Map full width below */}
          {isStandalonePage ? (
            <div className="pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12">
              {/* Top Section: Title/Text and Form side by side (desktop), stacked on mobile/tablet */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start mb-8 md:mb-12 contact-grid">
                {/* Left side - Title/Text */}
                <motion.div
                  ref={titleRef}
                  variants={containerVariants}
                  initial="hidden"
                  animate={titleControls}
                  className="text-center md:text-left"
                >
                  <div className="space-y-2 md:space-y-3">
                    {["Let's", "Work", "Together"].map((word, index) => (
                      <motion.h1
                        key={word}
                        custom={index}
                        variants={wordVariants}
                        className={`contact-title-text
                        text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                        font-Tourney text-white leading-tight
                        ${word === "Let's" ? "hover:text-purple-400" : ""}
                        ${word === "Work" ? "hover:text-blue-400" : ""}
                        ${word === "Together" ? "hover:text-green-400" : ""}
                        transition-colors duration-300 cursor-default
                      `}
                      >
                        {word}
                      </motion.h1>
                    ))}
                  </div>

                  {pageSettings.description && (
                    <motion.div
                      className="mt-4 md:mt-6 text-gray-300 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {pageSettings.description}
                    </motion.div>
                  )}
                </motion.div>

                {/* Right side - Form */}
                <motion.div
                  ref={formRef}
                  variants={formVariants}
                  initial="hidden"
                  animate={formControls}
                  className="relative"
                >
                  <div className="backdrop-blur-sm md:backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-700/30 shadow-xl md:shadow-2xl bg-gray-900/30 md:bg-gray-900/20 contact-form-container">
                    {/* Notification */}
                    {notification && (
                      <div
                        className={`mb-4 text-center font-semibold text-sm md:text-base px-4 py-3 rounded-lg ${
                          notificationType === "success"
                            ? "text-green-400 bg-green-400/10 border border-green-400/20"
                            : "text-red-400 bg-red-400/10 border border-red-400/20"
                        }`}
                      >
                        {notification}
                      </div>
                    )}

                    <div className="space-y-4 md:space-y-6">
                      {/* Dynamic Form inputs */}
                      {formFields && formFields.length > 0 && formFields
                        .filter(field => field && field.type !== "textarea")
                        .map((field, index) => {
                          const iconMap = {
                            text: User,
                            email: Mail,
                            tel: Phone,
                            number: Phone,
                          };
                          const Icon = iconMap[field.type] || User;
                          const colorMap = {
                            text: "purple",
                            email: "blue",
                            tel: "green",
                            number: "green",
                          };
                          const color = colorMap[field.type] || "purple";

                          return (
                            <motion.div
                              key={field.name}
                              custom={index}
                              variants={inputVariants}
                              className="relative group"
                            >
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Icon
                                  className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-${color}-400 transition-colors duration-300`}
                                />
                              </div>
                              <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleInputChange}
                                placeholder={field.placeholder || field.label}
                                className={`contact-input
                                w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 
                                bg-gray-900/50 border border-gray-600/50 rounded-lg
                                text-white placeholder-gray-400 text-sm md:text-base
                                focus:border-${color}-400 focus:outline-none focus:ring-2 focus:ring-${color}-400/20
                                transition-all duration-200 backdrop-blur-sm
                              `}
                                required={field.required}
                              />
                            </motion.div>
                          );
                        })}

                      {/* Textarea fields */}
                      {formFields && formFields.length > 0 && formFields
                        .filter(field => field && field.type === "textarea")
                        .map((field, index) => (
                          <motion.div
                            key={field.name}
                            custom={formFields.filter(f => f.type !== "textarea").length + index}
                            variants={inputVariants}
                            className="relative group"
                          >
                            <div className="absolute top-3 md:top-4 left-0 pl-3 flex items-center pointer-events-none z-10">
                              <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                            </div>
                            <textarea
                              name={field.name}
                              value={formData[field.name] || ""}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              rows={4}
                              className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-200 backdrop-blur-sm resize-none text-sm md:text-base contact-textarea"
                              required={field.required}
                            />
                          </motion.div>
                        ))}

                      {/* Submit Button */}
                      <motion.div className="flex justify-center pt-4 md:pt-6">
                        <motion.button
                          type="button"
                          onClick={handleSubmit}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          disabled={isSubmitting}
                          className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-r from-purple-500 via-purple-900 to-blue-500 rounded-full text-white font-semibold shadow-xl md:shadow-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
                        >
                          {isSubmitting ? (
                            <div className="relative z-10 animate-spin">
                              <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full" />
                            </div>
                          ) : (
                            <Send className="h-5 w-5 md:h-6 md:w-6 relative z-10" />
                          )}
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Section: Map full width */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden border-2 border-gray-700/40 shadow-xl md:shadow-2xl px-2 md:px-4 relative group rounded-2xl md:rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-10 rounded-2xl md:rounded-3xl"></div>
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full relative z-0 rounded-2xl md:rounded-3xl"
                  title="Location Map"
                ></iframe>
              </motion.div>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
});

Contact.displayName = 'Contact';

export default Contact;