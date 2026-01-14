import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CountUp = ({ end, duration = 2, plus = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold mb-2 text-white min-h-[48px] flex items-center justify-center">
      {count.toLocaleString()}
      {plus && <span>+</span>}
    </div>
  );
};

const Stats = ({ stats = [] }) => {
  // Default stats if none provided
  const defaultStats = [
    { label: 'Commits', value: 500, plus: true },
    { label: 'Projects', value: 10, plus: true },
    { label: 'Satisfied Customers', value: 2, plus: false },
  ];

  const statsData = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center bg-[#080808] py-8 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
          {statsData.map(({ _id, label, value, end, plus }, idx) => {
            const statValue = value || end || 0;
            return (
              <motion.div
                key={_id || label || idx}
                className="w-full max-w-sm mx-auto flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg p-6 sm:p-8 min-h-[140px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.1, 
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
              >
                <CountUp end={statValue} duration={2} plus={plus} />
                <span className="text-base sm:text-lg font-semibold tracking-wide text-white text-center leading-tight">
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stats;