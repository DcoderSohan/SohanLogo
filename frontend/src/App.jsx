import { useState, useEffect, lazy, Suspense, memo } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import ErrorBoundary from "./Components/ErrorBoundary";

// Lazy load pages for better performance
const Home = lazy(() => import("./Pages/Home"));
const Projectssection = lazy(() => import("./Pages/Projectssection"));
const Aboutsection = lazy(() => import("./Pages/Aboutsection"));
const ProjectDetail = lazy(() => import("./Pages/ProjectDetail"));
const Contact = lazy(() => import("./Components/Contact/Contact"));


const App = memo(() => {

  // Fix mobile scrolling issues - ensure scrolling is always enabled (especially Chrome)
  useEffect(() => {
    const enableScrolling = () => {
      // Check if mobile device
      const isMobile = window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      
      if (isMobile) {
        // Aggressive fixes for Chrome mobile
        if (isChrome) {
          // Force remove any fixed positioning that might block scroll
          document.documentElement.style.height = 'auto';
          document.documentElement.style.minHeight = '100vh';
          document.documentElement.style.overflowY = 'auto';
          document.documentElement.style.overflowX = 'hidden';
          document.documentElement.style.touchAction = 'pan-y pan-x';
          document.documentElement.style.webkitOverflowScrolling = 'touch';
          document.documentElement.style.position = 'relative';
          
          document.body.style.height = 'auto';
          document.body.style.minHeight = '100vh';
          document.body.style.overflowY = 'auto';
          document.body.style.overflowX = 'hidden';
          document.body.style.touchAction = 'pan-y pan-x';
          document.body.style.webkitOverflowScrolling = 'touch';
          document.body.style.position = 'relative';
          document.body.style.top = '0';
          document.body.style.left = '0';
        } else {
          // Standard mobile fixes
          document.documentElement.style.overflowY = 'auto';
          document.documentElement.style.touchAction = 'pan-y';
          document.documentElement.style.webkitOverflowScrolling = 'touch';
          
          document.body.style.overflowY = 'auto';
          document.body.style.touchAction = 'pan-y';
          document.body.style.webkitOverflowScrolling = 'touch';
          document.body.style.position = 'relative';
        }
        
        // Ensure root allows scrolling
        const root = document.getElementById('root');
        if (root) {
          root.style.overflowY = 'auto';
          root.style.overflowX = 'hidden';
          root.style.touchAction = isChrome ? 'pan-y pan-x' : 'pan-y';
          root.style.webkitOverflowScrolling = 'touch';
          root.style.position = 'relative';
          root.style.height = 'auto';
          root.style.minHeight = '100vh';
        }
        
        // Remove any elements blocking scroll
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' && style.top === '0' && style.left === '0' && style.width === '100%' && style.height === '100%') {
            // This might be a full-screen overlay blocking scroll
            if (!el.id || (el.id !== 'root' && !el.closest('#root'))) {
              el.style.touchAction = 'pan-y';
            }
          }
        });
        
        // Add loaded class to body for CSS targeting
        document.body.classList.add('loaded');
      }
    };

    // Run immediately
    enableScrolling();

    // Run after a short delay to ensure it applies
    const timer1 = setTimeout(enableScrolling, 100);
    const timer2 = setTimeout(enableScrolling, 500);
    
    // Run on visibility change (handles second-time opening)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(enableScrolling, 100);
      }
    };

    // Run on focus (handles tab switching back)
    const handleFocus = () => {
      setTimeout(enableScrolling, 100);
    };

    // Run on route changes
    const handleRouteChange = () => {
      setTimeout(enableScrolling, 200);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', enableScrolling); // Handles back/forward navigation
    
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', enableScrolling);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="bg-[#080808] relative min-h-screen">
        <Router>
          <Suspense fallback={<div className="min-h-screen bg-[#080808] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route path="/about" element={<Aboutsection />} />
              <Route path="/projects" element={<Projectssection />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
          <Footer />
        </Router>
      </div>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
