import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Quote = ({ quotes = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Get first quote or use default
  const defaultQuote = `"Code is not just lines it's creativity in motion, logic in art, and passion in practice."`;
  const quoteText = quotes.length > 0 ? quotes[0].text : defaultQuote;
  const words = quoteText.split(' ');

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: 0.5,
      },
    },
  };

  return (
    <div
      className="
        flex justify-center items-center
        w-full
        sm:w-[400px]
        md:w-[600px]
        lg:w-[700px]
        mx-auto
        py-2
        sm:py-2
        h-[30vh]
      "
      style={{
        minHeight: '60px', // fallback for very small screens
      }}
    >
      <motion.h1
        className="
          text-white
          text-lg
          sm:text-2xl
          font-Poppins
          text-center
          leading-snug
          w-full
          break-words
          py-4
        "
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
};

export default Quote;
