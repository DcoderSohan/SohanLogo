import { useEffect, useState } from "react";

const NUM_PILLARS = 7;
const ANIMATION_DURATION = 400; // ms per pillar

const PillarReveal = ({ onDone }) => {
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    if (openIndex < NUM_PILLARS) {
      const timer = setTimeout(() => setOpenIndex(openIndex + 1), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    } else {
      setTimeout(onDone, 300); // After all pillars open, call onDone
    }
  }, [openIndex]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
      className="font-Tourney"
    >
      {Array.from({ length: NUM_PILLARS }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: "#000",
            transition: "transform 0.4s cubic-bezier(.77,0,.18,1)",
            transform: openIndex >= i ? "scaleY(0)" : "scaleY(1)",
            transformOrigin: "top",
          }}
          className="border border-gray-900 font-Tourney"
        />
      ))}
    </div>
  );
};

export default PillarReveal;
