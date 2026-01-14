import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // sm, md, lg, xl
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-xl sm:rounded-2xl ${sizeClasses[size]} w-full shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden`}
            >
              {/* Sticky Header */}
              {(title || showCloseButton) && (
                <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
                  {title && (
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 py-4 sm:py-6">
                <div className="text-white">{children}</div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

