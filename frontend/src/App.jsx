import { useState, useEffect, lazy, Suspense, useCallback, memo } from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./Preloader/Preloader";
import PillarReveal from "./Preloader/PillarReveal";
import Footer from "./Components/Footer/Footer";
import ErrorBoundary from "./Components/ErrorBoundary";

// Lazy load pages for better performance
const Home = lazy(() => import("./Pages/Home"));
const Projectssection = lazy(() => import("./Pages/Projectssection"));
const Aboutsection = lazy(() => import("./Pages/Aboutsection"));
const ProjectDetail = lazy(() => import("./Pages/ProjectDetail"));
const Contact = lazy(() => import("./Components/Contact/Contact"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);


const App = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPillars, setShowPillars] = useState(false);
  const [contentAnimated, setContentAnimated] = useState(false);

  const handlePreloaderDone = useCallback(() => {
    setIsLoading(false);
    setShowPillars(true);
  }, []);

  const handlePillarRevealDone = useCallback(() => {
    setShowPillars(false);
  }, []);

  // Trigger content animation after pillars start opening
  useEffect(() => {
    if (showPillars) {
      // Wait a bit so pillars start animating, then animate content
      const timer = setTimeout(() => setContentAnimated(true), 400);
      return () => clearTimeout(timer);
    } else {
      setContentAnimated(false);
    }
  }, [showPillars]);

  return (
    <ErrorBoundary>
      <div className="bg-[#080808] relative min-h-screen">
        {isLoading && (
          <Preloader onDone={handlePreloaderDone} />
        )}
        {showPillars && (
          <PillarReveal onDone={handlePillarRevealDone} />
        )}
        {/* Main content always rendered, but animated */}
        <div
          className={`transition-all duration-400 ${
            showPillars
              ? "pointer-events-none select-none"
              : ""
          }`}
        >
          <Router>
            <Navbar className={`transition-all duration-400 ${
              contentAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`} />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      animate={contentAnimated}
                    />
                  }
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
      </div>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
