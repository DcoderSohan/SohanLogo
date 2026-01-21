import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Link } from "react-router-dom";
import "./Navbar.css";

gsap.registerPlugin(SplitText);

const Navbar = ({ className = "" }) => {
  const overlay = useRef();
  const nav = useRef();
  const closeBtn = useRef();
  const socials = useRef();
  const logo = useRef();
  const tl = useRef();
  const linkRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggle = () => {
    if (isAnimating) return; // Block clicks while animating
    
    setIsAnimating(true);

    if (!isOpen) {
      // Opening
      setIsOpen(true);
      if (overlay.current) overlay.current.style.display = "flex";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (tl.current) tl.current.play();
    } else {
      // Closing
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (tl.current) tl.current.reverse();
    }
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize Timeline once
  useEffect(() => {
    // Set initial hidden states
    if (overlay.current) {
      gsap.set(overlay.current, { autoAlpha: 0 });
    }
    if (nav.current && socials.current && logo.current && closeBtn.current) {
      gsap.set([nav.current, socials.current, logo.current, closeBtn.current], { 
        autoAlpha: 0, 
        y: 30 
      });
    }

    tl.current = gsap.timeline({
      paused: true,
      onComplete: () => setIsAnimating(false),
      onReverseComplete: () => {
        if (overlay.current) overlay.current.style.display = "none";
        setIsAnimating(false);
        setIsOpen(false);
      }
    });

    tl.current
      .to(overlay.current, { 
        autoAlpha: 1, 
        duration: 0.4, 
        ease: "power2.inOut" 
      })
      .to([closeBtn.current, nav.current, socials.current, logo.current], {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.2");

    return () => {
      if (tl.current) tl.current.kill();
    };
  }, []);

  // SplitText & Underline Logic (Desktop only - no mobile touch)
  useEffect(() => {
    const ctx = gsap.context(() => {
      linkRefs.current.forEach((linkEl) => {
        if (!linkEl) return;
        
        // Remove existing underline if any (cleanup)
        const existing = linkEl.querySelector(".navbar-link-underline");
        if (existing) existing.remove();

        try {
          const split = new SplitText(linkEl, { type: "chars" });
          const underline = document.createElement("div");
          underline.className = "navbar-link-underline";
          underline.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: white;
            transform: scaleX(0);
            transform-origin: left;
            opacity: 0;
            pointer-events: none;
          `;
          linkEl.appendChild(underline);

          const hoverIn = () => {
            gsap.to(split.chars, { y: -5, stagger: 0.02, duration: 0.3 });
            gsap.to(underline, { scaleX: 1, opacity: 1, duration: 0.3 });
          };

          const hoverOut = () => {
            gsap.to(split.chars, { y: 0, stagger: 0.02, duration: 0.3 });
            gsap.to(underline, { scaleX: 0, opacity: 0, duration: 0.3 });
          };

          // Only add hover listeners (no touch for mobile - underline disabled on mobile)
          linkEl.addEventListener("mouseenter", hoverIn);
          linkEl.addEventListener("mouseleave", hoverOut);
        } catch (error) {
          console.warn('Animation setup failed:', error);
        }
      });
    });

    return () => ctx.revert();
  }, [isOpen]); // Re-init splittext when menu opens to ensure correct measuring

  // Handle overlay visibility on close - now handled in toggle function
  // This useEffect is kept for edge cases but main logic is in toggle()

  const links = ["Home", "About", "Projects", "Contact"];
  const socialsData = [
    { name: "GitHub", href: "https://github.com/DcoderSohan" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/sohan-sarang/" },
  ];

  return (
    <>
      {/* Navbar Header - Consistent across all devices */}
      <header className="navbar-header">
        <div className={`navbar-container ${hasScrolled ? "navbar-container--glass" : ""}`}>
          <Link to="/" className="navbar-logo">
            <img
              src="./mylogo.webp"
              alt="Logo"
              className="navbar-logo-img"
              loading="eager"
              decoding="async"
            />
          </Link>
          <button
            onClick={toggle}
            className="navbar-menu-btn"
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Menu Overlay - Consistent across all devices */}
      <div
        ref={overlay}
        className="navbar-overlay"
        style={{
          display: 'none', // Controlled by JS/GSAP
        }}
      >
        <button
          ref={closeBtn}
          onClick={toggle}
          className="navbar-close-btn"
          aria-label="Close menu"
        >
          Close
        </button>

        <nav ref={nav} className="navbar-nav">
          {links.map((l, index) => {
            let path = "/";
            if (l === "About") path = "/about";
            else if (l === "Projects") path = "/projects";
            else if (l === "Contact") path = "/contact";
            else if (l === "Home") path = "/";

            return (
              <Link
                key={l}
                ref={(el) => (linkRefs.current[index] = el)}
                to={path}
                onClick={toggle}
                className="navbar-link"
              >
                {l}
              </Link>
            );
          })}
        </nav>

        <div ref={socials} className="navbar-socials">
          {socialsData.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="navbar-social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.name}
            </a>
          ))}
        </div>

        <div ref={logo} className="navbar-overlay-logo">
          <img
            src="./mylogo.webp"
            alt="Logo"
            className="navbar-overlay-logo-img"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
