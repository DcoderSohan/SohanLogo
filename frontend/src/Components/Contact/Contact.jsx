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

  // Check screen size - only mobile (below 640px) gets different layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
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

  // Optimized animation variants - smoother and lighter on mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        staggerChildren: isMobile ? 0.1 : 0.15,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? -20 : -50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.5 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Smoother easing
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 30 : 50,
      rotateX: isMobile ? 0 : -90, // Disable 3D transforms on mobile
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        delay: index * (isMobile ? 0.1 : 0.2),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : 100,
      y: isMobile ? 30 : 0,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.5 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const inputVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 10 : 20,
      scale: 0.98,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        delay: index * (isMobile ? 0.05 : 0.1),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: isMobile ? 0 : -180, // Simpler animation on mobile
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: isMobile ? 0.3 : 0.6,
      },
    },
    hover: {
      scale: isMobile ? 1.05 : 1.1,
      boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0.8 : 1.5,
        ease: "easeInOut",
      },
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
        {/* Optimized animated background elements - reduced on mobile */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            style={{ willChange: 'opacity' }}
          >
            <motion.div
              className="absolute top-1/4 left-1/6 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, 30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ 
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/6 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.2, 0.4],
                x: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              style={{ 
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-green-500/8 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.5, 0.3],
                y: [0, -40, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              style={{ 
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
            />
          </motion.div>
        )}

        <div className="relative w-full max-w-7xl mx-auto px-4">
          {!isStandalonePage && (
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start py-8 sm:py-12 contact-grid">
              {/* Left side - Title */}
              <motion.div
                ref={titleRef}
                className="text-center sm:text-center md:text-center lg:text-left order-1 px-2 sm:px-4 md:px-6"
                variants={containerVariants}
                initial="hidden"
                animate={titleControls}
              >
              <div className="space-y-1 sm:space-y-2">
                {["Let's", "Work", "Together"].map((word, index) => (
                  <motion.h1
                    key={word}
                    custom={index}
                    variants={wordVariants}
                    className={`contact-title-text
                    text-4xl font-Tourney sm:text-6xl md:text-7xl lg:text-8xl 
                 text-white leading-tight
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
                  className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto sm:mx-auto md:mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  {pageSettings.description}
                </motion.div>
              )}

              {/* Mobile-only decorative elements - simplified */}
              {isMobile && (
                <motion.div
                  className="mt-4 flex justify-center sm:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-1"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut",
                      }}
                      style={{ willChange: 'transform, opacity' }}
                    />
                  ))}
                </motion.div>
              )}
              </motion.div>

              {/* Right side - Form */}
              <motion.div
                ref={formRef}
                variants={formVariants}
                initial="hidden"
                animate={formControls}
                className="relative order-2 px-2 sm:px-4"
              >
              <motion.div
                className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-700/30 shadow-2xl bg-gray-900/20 contact-form-container"
                whileHover={{
                  borderColor: "rgba(168, 85, 247, 0.3)",
                  transition: { duration: 0.3 },
                }}
              >
                {/* Notification */}
                {notification && (
                  <motion.div
                    className={`mb-4 text-center font-semibold text-sm sm:text-base px-4 py-3 rounded-lg ${
                      notificationType === "success"
                        ? "text-green-400 bg-green-400/10 border border-green-400/20"
                        : "text-red-400 bg-red-400/10 border border-red-400/20"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {notification}
                  </motion.div>
                )}

                <div className="space-y-4 sm:space-y-6">
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
                              className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-${color}-400 transition-colors duration-300`}
                            />
                          </div>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            className={`contact-input
                            w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-3 
                            bg-gray-900/50 border border-gray-600/50 rounded-lg
                            text-white placeholder-gray-400 text-sm sm:text-base
                            focus:border-${color}-400 focus:outline-none focus:ring-2 focus:ring-${color}-400/20
                            transition-all duration-300 backdrop-blur-sm
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
                        <div className="absolute top-3 sm:top-4 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                        </div>
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          rows={isMobile ? "3" : "4"}
                          className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 backdrop-blur-sm resize-none text-sm sm:text-base contact-textarea"
                          required={field.required}
                        />
                      </motion.div>
                    ))}

                  {/* Submit Button */}
                  <motion.div className="flex justify-center pt-2 sm:pt-4">
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={isSubmitting}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gradient-to-r from-purple-500 via-purple-900 to-blue-500 rounded-full text-white font-semibold shadow-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="relative z-10"
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full" />
                        </motion.div>
                      ) : (
                        <Send className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                      )}

                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.1 }}
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
              </motion.div>
            </div>
          )}

          {/* Standalone Contact Page Layout - Text and Form side by side, Map full width below */}
          {isStandalonePage && (
            <div className="pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12">
              {/* Top Section: Title/Text and Form side by side (desktop), stacked on mobile/tablet */}
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start mb-8 sm:mb-12 contact-grid">
                {/* Left side - Title/Text */}
                <motion.div
                  ref={titleRef}
                  className="text-center sm:text-center md:text-center lg:text-left px-2 sm:px-4 md:px-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate={titleControls}
                >
                  <div className="space-y-1 sm:space-y-2">
                    {["Let's", "Work", "Together"].map((word, index) => (
                      <motion.h1
                        key={word}
                        custom={index}
                        variants={wordVariants}
                    className={`contact-title-text
                    text-4xl font-Tourney sm:text-6xl md:text-7xl lg:text-8xl 
                        text-white leading-tight
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
                      className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto sm:mx-auto md:mx-auto lg:mx-0"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    >
                      {pageSettings.description}
                    </motion.div>
                  )}

                  {/* Decorative elements - optimized */}
                  <motion.div
                    className="mt-4 flex justify-center sm:justify-center md:justify-center lg:justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: isMobile ? 0.8 : 1.2, duration: isMobile ? 0.4 : 0.6 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-1"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: isMobile ? 2.5 : 2,
                          repeat: Infinity,
                          delay: i * (isMobile ? 0.4 : 0.3),
                          ease: "easeInOut",
                        }}
                        style={{ willChange: 'transform, opacity' }}
                      />
                    ))}
                  </motion.div>
                </motion.div>

                {/* Right side - Form */}
                <motion.div
                  ref={formRef}
                  variants={formVariants}
                  initial="hidden"
                  animate={formControls}
                  className="relative px-2 sm:px-4"
                >
                <motion.div
                  className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-700/30 shadow-2xl bg-gray-900/20 contact-form-container"
                  whileHover={{
                    borderColor: "rgba(168, 85, 247, 0.3)",
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Notification */}
                  {notification && (
                    <motion.div
                      className={`mb-4 text-center font-semibold text-sm sm:text-base px-4 py-3 rounded-lg ${
                        notificationType === "success"
                          ? "text-green-400 bg-green-400/10 border border-green-400/20"
                          : "text-red-400 bg-red-400/10 border border-red-400/20"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {notification}
                    </motion.div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
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
                                className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-${color}-400 transition-colors duration-300`}
                              />
                            </div>
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name] || ""}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              className={`contact-input
                            w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-3 
                            bg-gray-900/50 border border-gray-600/50 rounded-lg
                            text-white placeholder-gray-400 text-sm sm:text-base
                            focus:border-${color}-400 focus:outline-none focus:ring-2 focus:ring-${color}-400/20
                            transition-all duration-300 backdrop-blur-sm
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
                          <div className="absolute top-3 sm:top-4 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                          </div>
                          <textarea
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            rows={isMobile ? "3" : "4"}
                            className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 backdrop-blur-sm resize-none text-sm sm:text-base contact-textarea"
                            required={field.required}
                          />
                        </motion.div>
                      ))}

                    {/* Submit Button */}
                    <motion.div className="flex justify-center pt-2 sm:pt-4">
                      <motion.button
                        type="button"
                        onClick={handleSubmit}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        disabled={isSubmitting}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gradient-to-r from-purple-500 via-purple-900 to-blue-500 rounded-full text-white font-semibold shadow-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />

                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="relative z-10"
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full" />
                          </motion.div>
                        ) : (
                          <Send className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                        )}

                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          whileTap={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.1 }}
                        />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
              </div>

              {/* Bottom Section: Map full width */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden border-2 border-gray-700/40 shadow-2xl px-2 sm:px-4 relative group"
                style={{
                  borderRadius: '3rem 1.5rem 3rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-10" style={{ borderRadius: '3rem 1.5rem 3rem 1.5rem' }}></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full pointer-events-none z-10"></div>
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '3rem 1.5rem 3rem 1.5rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full relative z-0"
                  title="Location Map"
                ></iframe>
              </motion.div>
            </div>
          )}

        </div>
      </div>
      
      {/* Performance and mobile scrolling optimizations */}
      <style>{`
        /* Mobile scrolling fixes */
        @media (max-width: 767px) {
          #contact {
            -webkit-overflow-scrolling: touch !important;
            overflow-scrolling: touch !important;
            touch-action: pan-y !important;
            overscroll-behavior-y: auto !important;
            position: relative !important;
            will-change: scroll-position !important;
          }
          
          #contact * {
            -webkit-tap-highlight-color: transparent !important;
            touch-action: pan-y !important;
          }
          
          /* Disable heavy effects on mobile */
          #contact .backdrop-blur-xl {
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
          }
          
          /* Optimize animations */
          #contact [class*="motion"] {
            will-change: transform, opacity !important;
            transform: translateZ(0) !important;
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
          }
          
          /* Prevent animation blocking scroll */
          #contact {
            pointer-events: auto !important;
          }
          
          #contact > div {
            pointer-events: auto !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          /* Fix text size for tablet */
          .contact-title-text {
            font-size: clamp(3rem, 8vw, 5rem) !important;
          }
          
          /* Fix form container width and spacing */
          .contact-form-container {
            max-width: 100% !important;
            padding: 1.5rem !important;
          }
          
          /* Ensure proper grid alignment */
          .contact-grid {
            gap: 2rem !important;
            align-items: center !important;
          }
          
          /* Fix input field sizes */
          .contact-input {
            padding: 0.75rem 1rem !important;
            font-size: 0.9rem !important;
          }
          
          /* Fix textarea */
          .contact-textarea {
            min-height: 100px !important;
            padding: 0.75rem 1rem !important;
          }
          
          /* Tablet scrolling */
          #contact {
            -webkit-overflow-scrolling: touch !important;
            touch-action: pan-y !important;
          }
        }
        
        /* General performance optimizations */
        #contact {
          contain: layout style paint !important;
          isolation: isolate !important;
        }
        
        /* GPU acceleration for animated elements */
        #contact [data-framer-component-type] {
          transform: translateZ(0) !important;
          will-change: transform, opacity !important;
        }
      `}</style>
    </div>
  );
});

Contact.displayName = 'Contact';

export default Contact;
