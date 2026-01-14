import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Send, User, Mail, Phone, MessageSquare } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'error'
  const [isMobile, setIsMobile] = useState(false);

  // Refs for intersection observer
  const titleRef = useRef(null);
  const formRef = useRef(null);

  // Animation controls
  const titleControls = useAnimation();
  const formControls = useAnimation();

  // Intersection observer hooks
  const titleInView = useInView(titleRef, { once: true, threshold: 0.3 });
  const formInView = useInView(formRef, { once: true, threshold: 0.2 });

  // EmailJS Configuration - Replace with your actual values
  const EMAILJS_SERVICE_ID = "service_9axwrfs";
  const EMAILJS_TEMPLATE_ID = "template_yvct6v9";
  const EMAILJS_PUBLIC_KEY = "CWEwSugV7hRCvdtRz";

  // Initialize EmailJS
  useEffect(() => {
    // Load EmailJS script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.onload = () => {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ""));
  };

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(""), 5000);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      showNotification("Please enter your name", "error");
      return;
    }

    if (!formData.email.trim()) {
      showNotification("Please enter your email", "error");
      return;
    }

    if (!validateEmail(formData.email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    if (!formData.mobile.trim()) {
      showNotification("Please enter your mobile number", "error");
      return;
    }

    if (!validateMobile(formData.mobile)) {
      showNotification("Please enter a valid mobile number", "error");
      return;
    }

    if (!formData.message.trim()) {
      showNotification("Please enter your message", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if EmailJS is loaded
      if (!window.emailjs) {
        throw new Error("EmailJS not loaded");
      }

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_mobile: formData.mobile,
        message: formData.message,
        to_name: "Sohan", // Your name
        reply_to: formData.email,
      };

      // Send email using EmailJS
      const result = await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (result.status === 200) {
        showNotification(
          "Message sent successfully! I'll get back to you soon.",
          "success"
        );
        setFormData({ name: "", email: "", mobile: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      showNotification(
        "Failed to send message. Please try again or contact me directly.",
        "error"
      );
    }

    setIsSubmitting(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? -30 : -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      },
    }),
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : 100,
      y: isMobile ? 50 : 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const inputVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.6,
      },
    },
    hover: {
      scale: 1.1,
      boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)",
      transition: {
        duration: 0.3,
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
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center overflow-hidden relative py-24 "
        style={{
          background:
            "linear-gradient(135deg, #080808 40%, #1e1b4b 70%, #4f46e5 100%)",
        }}
        id="contact"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-1/4 left-1/6 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
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
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
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
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>

        <div className="relative w-full max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center min-h-screen sm:min-h-0">
            {/* Left side - Title */}
            <motion.div
              ref={titleRef}
              className="text-center sm:text-left order-1 px-2 sm:px-4"
              variants={containerVariants}
              initial="hidden"
              animate={titleControls}
            >
              <div className="space-y-2 sm:space-y-4">
                {["Let's", "Work", "Together"].map((word, index) => (
                  <motion.h1
                    key={word}
                    custom={index}
                    variants={wordVariants}
                    className={`
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

              <motion.div
                className="mt-4 sm:mt-6 lg:mt-8 text-gray-300 text-sm sm:text-lg leading-relaxed max-w-md mx-auto sm:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                Ready to bring your ideas to life? Let's connect and create
                something amazing together.
              </motion.div>

              {/* Mobile-only decorative elements */}
              <motion.div
                className="mt-6 flex justify-center sm:hidden"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-1"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
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
              className="relative order-2 px-2 sm:px-4"
            >
              <motion.div
                className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-700/30 shadow-2xl bg-gray-900/20"
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
                  {/* Form inputs */}
                  {[
                    {
                      name: "name",
                      type: "text",
                      placeholder: "Full Name",
                      icon: User,
                      color: "purple",
                    },
                    {
                      name: "email",
                      type: "email",
                      placeholder: "Email Address",
                      icon: Mail,
                      color: "blue",
                    },
                    {
                      name: "mobile",
                      type: "tel",
                      placeholder: "Mobile Number",
                      icon: Phone,
                      color: "green",
                    },
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      custom={index}
                      variants={inputVariants}
                      className="relative group"
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <field.icon
                          className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-${field.color}-400 transition-colors duration-300`}
                        />
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className={`
                        w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-3 
                        bg-gray-900/50 border border-gray-600/50 rounded-lg
                        text-white placeholder-gray-400 text-sm sm:text-base
                        focus:border-${field.color}-400 focus:outline-none focus:ring-2 focus:ring-${field.color}-400/20
                        transition-all duration-300 backdrop-blur-sm
                      `}
                        required
                      />
                    </motion.div>
                  ))}

                  {/* Message Input */}
                  <motion.div
                    custom={3}
                    variants={inputVariants}
                    className="relative group"
                  >
                    <div className="absolute top-3 sm:top-4 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message"
                      rows={isMobile ? "3" : "4"}
                      className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 backdrop-blur-sm resize-none text-sm sm:text-base"
                      required
                    />
                  </motion.div>

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
        </div>
      </div>
    </div>
  );
};

export default Contact;
