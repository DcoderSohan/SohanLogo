import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertCircle } from "lucide-react";
import Modal from "./Modal";

const MessageModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "success", // success, error, info, warning
  buttonText = "Got it!",
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/20",
      iconBorder: "border-green-500/50",
      buttonClass: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-400",
      iconBg: "bg-red-500/20",
      iconBorder: "border-red-500/50",
      buttonClass: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
      iconBorder: "border-blue-500/50",
      buttonClass: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/20",
      iconBorder: "border-yellow-500/50",
      buttonClass: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={true}
      closeOnBackdrop={true}
    >
      <div className="text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 ${config.iconBg} rounded-full flex items-center justify-center border-2 ${config.iconBorder}`}
          >
            <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${config.iconColor}`} />
          </div>
        </motion.div>

        {/* Title */}
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-white mb-2"
          >
            {title}
          </motion.h3>
        )}

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 text-sm sm:text-base mb-6"
          >
            {message}
          </motion.p>
        )}

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 ${config.buttonClass} text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95`}
          >
            {buttonText}
          </button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default MessageModal;

