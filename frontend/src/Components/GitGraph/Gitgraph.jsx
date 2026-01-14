import React, { useRef, useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";

const Gitgraph = ({ userName }) => {
  const calendarRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(calendarRef.current);
        }
      },
      { threshold: 0.2 }
    );
    if (calendarRef.current) {
      observer.observe(calendarRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Inline style to override GitHubCalendar SVG colors to blue
  const svgColorOverride = `
    .react-github-calendar rect[fill="#39d353"],
    .react-github-calendar rect[fill="#26a641"],
    .react-github-calendar rect[fill="#006d32"],
    .react-github-calendar rect[fill="#0e4429"] {
      fill: #2563eb !important;
      transition: fill 0.3s;
    }
  `;

  return (
    <div className="w-full text-gray-400 flex justify-center items-center py-8 px-4 overflow-x-auto">
      <div
        ref={calendarRef}
        className={`
          transition-all duration-700 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
          w-full flex justify-center
        `}
      >
        {/* Inject style for blue color override */}
        <style>{svgColorOverride}</style>
        <GitHubCalendar
          username={userName}
          className="react-github-calendar"
        />
      </div>
    </div>
  );
};

export default Gitgraph;
