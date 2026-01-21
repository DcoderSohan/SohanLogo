import React, { useState, useEffect, useRef } from "react";
import "./Loading.css";

const Loading = ({ onComplete }) => {
  const [percentage, setPercentage] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // Lock scroll on mount
  useEffect(() => {
    // Disable scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling on unmount
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const DURATION = 6000; // 7.5 seconds (between 7-8 seconds)
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / DURATION) * 100, 100);
      
      setPercentage(Math.floor(progress));

      if (progress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Step 1: Wait at 100%
        setTimeout(() => {
          // Step 2: Start CSS fade out
          setIsFading(true);
          
          // Step 3: Remove from DOM and call onComplete after transition
          setTimeout(() => {
            setShouldRender(false);
            if (onComplete) onComplete();
          }, 500); // Matches CSS transition time
        }, 500);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onComplete]);

  if (!shouldRender) return null;

  const progressAngle = (percentage / 100) * 360;

  return (
    <div className={`loading-container ${isFading ? "fade-out" : ""}`}>
      <div className="loading-wrapper">
        <div 
          className="loading-border"
          style={{
            background: `conic-gradient(
              #ffffff 0deg,
              #ffffff ${progressAngle}deg,
              rgba(255, 255, 255, 0.1) ${progressAngle}deg,
              rgba(255, 255, 255, 0.1) 360deg
            )`
          }}
        >
          <div className="loading-border-inner"></div>
        </div>
        
        <div className="loading-logo">
          <img 
            src="/SWhiteLogo.png" 
            alt="Logo" 
            className="loading-logo-img"
          />
        </div>
        
        <div className="loading-percentage">
          <span className="loading-percentage-number">{percentage}</span>
          <span className="loading-percentage-symbol">%</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
