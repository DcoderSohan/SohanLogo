// Preloader.jsx
import React, { useEffect, useState } from 'react';

const Preloader = ({ onDone }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 100) {
      const timer = setTimeout(() => setCount(count + 1), 10); // Fast speed
      return () => clearTimeout(timer);
    } else {
      setTimeout(onDone, 400); // Small delay before removing preloader
    }
  }, [count, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      <span
        style={{
          fontSize: "9rem",
          color: "#fff",
          margin: "2rem",
        }}
        className='font-Tourney'
      >
        {count}%
      </span>
    </div>
  );
};

export default Preloader;
