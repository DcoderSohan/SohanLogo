import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const NotificationItem = ({ notification, onRemove }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/50',
    error: 'bg-red-500/10 border-red-500/50',
    warning: 'bg-yellow-500/10 border-yellow-500/50',
    info: 'bg-blue-500/10 border-blue-500/50',
  };

  React.useEffect(() => {
    if (notification.autoClose !== false) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border
        ${bgColors[notification.type] || bgColors.info}
        backdrop-blur-sm shadow-lg min-w-[300px] max-w-[400px]
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[notification.type] || icons.info}
      </div>
      <div className="flex-1">
        {notification.title && (
          <h4 className="font-semibold text-white mb-1 text-sm">
            {notification.title}
          </h4>
        )}
        <p className="text-sm text-gray-300">
          {notification.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </motion.div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      autoClose: true,
      ...notification,
    };
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return showNotification({ ...options, type: 'success', message });
  }, [showNotification]);

  const error = useCallback((message, options = {}) => {
    return showNotification({ ...options, type: 'error', message });
  }, [showNotification]);

  const warning = useCallback((message, options = {}) => {
    return showNotification({ ...options, type: 'warning', message });
  }, [showNotification]);

  const info = useCallback((message, options = {}) => {
    return showNotification({ ...options, type: 'info', message });
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{ showNotification, success, error, warning, info, removeNotification }}
    >
      {children}
      <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <AnimatePresence>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRemove={removeNotification}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

