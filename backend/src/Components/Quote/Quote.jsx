import React, { useState, useEffect } from 'react';

const quoteText = `"Code is not just lines it's creativity in motion, logic in art, and passion in practice."`;

const TYPING_SPEED = 60; // ms per character
const DELETING_SPEED = 30; // ms per character
const PAUSE_AFTER_TYPING = 1500; // ms
const PAUSE_AFTER_DELETING = 500; // ms

const Quote = () => {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isDeleting && displayed.length < quoteText.length) {
      timeout = setTimeout(() => {
        setDisplayed(quoteText.slice(0, displayed.length + 1));
      }, TYPING_SPEED);
    } else if (!isDeleting && displayed.length === quoteText.length) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(quoteText.slice(0, displayed.length - 1));
      }, DELETING_SPEED);
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => setIsDeleting(false), PAUSE_AFTER_DELETING);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting]);

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
      <h1
        className="
          text-white
          text-lg
          sm:text-2xl
          font-Audiowide
          text-center
          leading-snug
          w-full
          break-words
          py-4
        "
      >
        {displayed}
        <span
          className="
            inline-block
            w-[1ch]
            h-[1.2em]
            align-bottom
            ml-1
            rounded
            bg-gray-400
            animate-blink
            shadow-[0_0_8px_0_rgba(0,198,255,0.7)]
          "
          style={{
            animation: 'blink 0.7s steps(1) infinite, caretGlow 1.2s infinite alternate',
          }}
        />
      </h1>
      {/* Tailwind can't generate custom keyframes from inline style, so add them below */}
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes caretGlow {
            0% { box-shadow: 0 0 2px #00c6ff; }
            100% { box-shadow: 0 0 12px #0072ff; }
          }
        `}
      </style>
    </div>
  );
};

export default Quote;
