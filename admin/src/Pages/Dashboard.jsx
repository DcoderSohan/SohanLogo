import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  Home as HomeIcon, 
  User, 
  FolderKanban, 
  Mail,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  LayoutGrid,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import HomeContent from "../Components/Dashboard/HomeContent";
import AboutContent from "../Components/Dashboard/AboutContent";
import ProjectsContent from "../Components/Dashboard/ProjectsContent";
import ContactContent from "../Components/Dashboard/ContactContent";
import ContactPageContent from "../Components/Dashboard/ContactPageContent";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const sections = [
    { id: "home", name: "Home", icon: HomeIcon, color: "purple" },
    { id: "about", name: "About", icon: User, color: "blue" },
    { id: "projects", name: "Projects", icon: FolderKanban, color: "green" },
    { id: "contact", name: "Contact Messages", icon: Mail, color: "pink" },
    { id: "contactPage", name: "Contact Page", icon: Mail, color: "orange" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeContent />;
      case "about":
        return <AboutContent />;
      case "projects":
        return <ProjectsContent />;
      case "contact":
        return <ContactContent />;
      case "contactPage":
        return <ContactPageContent />;
      default:
        return null;
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Draggable menu button state
  const [buttonPosition, setButtonPosition] = useState({ x: 12, y: 12 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const buttonRef = useRef(null);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('menuButtonPosition');
    if (savedPosition) {
      try {
        const { x, y } = JSON.parse(savedPosition);
        setButtonPosition({ x, y });
      } catch (e) {
        console.error('Error loading menu button position:', e);
      }
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('menuButtonPosition', JSON.stringify(buttonPosition));
  }, [buttonPosition]);

  // Handle drag start
  const handleDragStart = (e) => {
    if (window.innerWidth >= 1024) return; // Only on small devices
    
    setIsDragging(true);
    setHasMoved(false);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragStart({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }
  };

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isDragging || window.innerWidth >= 1024) return;
    
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    // Check if button has moved significantly (more than 5px)
    const currentPos = buttonRef.current?.getBoundingClientRect();
    if (currentPos) {
      const movedDistance = Math.sqrt(
        Math.pow(newX - currentPos.left, 2) + Math.pow(newY - currentPos.top, 2)
      );
      if (movedDistance > 5) {
        setHasMoved(true);
      }
    }
    
    // Constrain to viewport bounds
    const buttonWidth = buttonRef.current?.offsetWidth || 48;
    const buttonHeight = buttonRef.current?.offsetHeight || 48;
    const maxX = window.innerWidth - buttonWidth;
    const maxY = window.innerHeight - buttonHeight;
    
    setButtonPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging, dragStart]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // Reset hasMoved after a short delay to allow click detection
    setTimeout(() => {
      setHasMoved(false);
    }, 100);
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const mouseMoveHandler = (e) => handleDragMove(e);
      const mouseUpHandler = () => handleDragEnd();
      const touchMoveHandler = (e) => {
        e.preventDefault();
        handleDragMove(e);
      };
      const touchEndHandler = () => handleDragEnd();
      
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('touchmove', touchMoveHandler, { passive: false });
      document.addEventListener('touchend', touchEndHandler);
      
      return () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('touchmove', touchMoveHandler);
        document.removeEventListener('touchend', touchEndHandler);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <div className="h-screen bg-[#080808] text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Draggable Mobile Menu Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => {
          // Only toggle menu if button wasn't dragged
          if (!hasMoved && !isDragging) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }
        }}
        onMouseDown={(e) => {
          if (window.innerWidth < 1024) {
            handleDragStart(e);
          }
        }}
        onTouchStart={(e) => {
          if (window.innerWidth < 1024) {
            handleDragStart(e);
          }
        }}
        className="lg:hidden fixed z-50 p-2.5 bg-[#080808] backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors shadow-lg cursor-move touch-none select-none"
        style={{
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
        }}
        whileTap={isDragging ? {} : { scale: 0.95 }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
        ) : (
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
        )}
      </motion.button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static left-0 top-0 h-full w-64 sm:w-72 bg-[#080808] border-r border-white/10 flex flex-col z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-xl lg:shadow-none
      `}>
        {/* Logo and Title */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
          <div className="mb-4">
            <img
              src="/mylogo.webp"
              alt="Logo"
              className="w-full h-auto max-h-14 sm:max-h-16 md:max-h-20 object-contain"
            />
            <h1 className="text-base sm:text-lg md:text-xl font-bold mt-2 sm:mt-3 text-white">Dashboard</h1>
          </div>
          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors text-xs sm:text-sm font-medium text-white"
          >
            View Site
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide p-3 sm:p-4">
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all relative text-sm sm:text-base
                    ${isActive 
                      ? section.color === 'purple' ? 'bg-purple-500/20 text-purple-300 border-l-4 border-purple-500' :
                        section.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-500' :
                        section.color === 'green' ? 'bg-green-500/20 text-green-300 border-l-4 border-green-500' :
                        section.color === 'orange' ? 'bg-orange-500/20 text-orange-300 border-l-4 border-orange-500' :
                        'bg-pink-500/20 text-pink-300 border-l-4 border-pink-500'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium truncate">{section.name}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Profile and Logout Section */}
        <div className="p-3 sm:p-4 border-t border-white/10 flex-shrink-0 space-y-2">
          {/* Admin Info */}
          {admin && (
            <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-lg mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                {admin.profileImage ? (
                  <img src={admin.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{admin.email}</p>
              </div>
            </div>
          )}

          {/* Profile Link */}
          <Link
            to="/admin/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium">Profile Settings</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden h-full lg:ml-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-4 pb-4 sm:py-6 lg:py-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
