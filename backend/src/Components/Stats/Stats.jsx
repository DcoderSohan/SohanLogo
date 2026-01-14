import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from 'react-countup';

const statsData = [
  { label: 'Commits', end: 500, plus: true },
  { label: 'Projects', end: 10, plus: true },
  { label: 'Satisfied Customers', end: 2, plus: false },
];

const Stats = () => {
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center bg-[#080808] py-8 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-subgrid lg:grid-cols-3 gap-6 sm:gap-8">
          {statsData.map(({ label, end, plus }, idx) => {
            const countUpId = `countup-${idx}`;
            useCountUp({
              ref: countUpId,
              start: 0,
              end,
              duration: 2,
              enableScrollSpy: true,
              scrollSpyOnce: false,
              redraw: true,
            });
            return (
              <motion.div
                key={label}
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
                <div className="text-3xl sm:text-4xl font-bold mb-2 text-white min-h-[48px] flex items-center justify-center">
                  <span id={countUpId} />
                  {plus && <span>+</span>}
                </div>
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