import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Projectssection from "./Pages/Projectssection";
import Aboutsection from "./Pages/Aboutsection";
import Contact from "./Components/Contact/Contact";
import Preloader from "./Preloader/Preloader";
import PillarReveal from "./Preloader/PillarReveal";
import Footer from "./Components/Footer/Footer";


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPillars, setShowPillars] = useState(false);
  const [contentAnimated, setContentAnimated] = useState(false);

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
    <div className="bg-[#080808] relative min-h-screen">
      {isLoading && (
        <Preloader onDone={() => {
          setIsLoading(false);
          setShowPillars(true);
        }} />
      )}
      {showPillars && (
        <PillarReveal onDone={() => setShowPillars(false)} />
      )}
      {/* Main content always rendered, but animated */}
      <div
        className={`transition-all duration-700 ${
          showPillars
            ? "pointer-events-none select-none"
            : ""
        }`}
      >
        <Router>
          <Navbar className={`transition-all duration-700 ${
            contentAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`} />
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
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </div>
  );
}

export default App;
