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

  const toggle = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    
    if (opening) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // Show overlay immediately for animation
      if (overlay.current) {
        overlay.current.style.display = "flex";
      }
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
    
    if (tl.current) {
      opening ? tl.current.play() : tl.current.reverse();
    }
  };

  useEffect(() => {
    // The SplitText/GSAP setup logic as a function
    const setupSplitText = () => {
      // Initial overlay animation timeline - smoother animations
      gsap.set(
        [
          overlay.current,
          nav.current,
          socials.current,
          logo.current,
          closeBtn.current,
        ],
        { autoAlpha: 0, y: 30 }
      );
      
      // Create smooth opening/closing timeline
      tl.current = gsap
        .timeline({ paused: true, reversed: true })
        // Fade in overlay background
        .to(overlay.current, { 
          autoAlpha: 1, 
          duration: 0.4,
          ease: "power2.out"
        })
        // Animate close button
        .to(closeBtn.current, { 
          autoAlpha: 1, 
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.3")
        // Animate navigation links
        .to(nav.current, { 
          autoAlpha: 1, 
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.2")
        // Animate social links
        .to(socials.current, { 
          autoAlpha: 1, 
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.3")
        // Animate logo
        .to(logo.current, { 
          autoAlpha: 1, 
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.3");

      // Setup hover animations for each link individually (desktop only)
      linkRefs.current.forEach((linkEl) => {
        if (linkEl) {
          const split = new SplitText(linkEl, { type: "chars" });
          const chars = split.chars;

          // Create underline element
          const underline = document.createElement("div");
          underline.style.cssText = `
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 30%;
            height: 1px;
            background-color: white;
            transform: scaleX(0);
            transform-origin: left;
          `;
          linkEl.appendChild(underline);

          // Store original text for cleanup
          linkEl._splitText = split;
          linkEl._underline = underline;
          linkEl._originalText = linkEl.textContent;

          // Set up hover animations - text always visible, just animates on hover
          const hoverIn = () => {
            // Only on desktop (hover capable devices)
            if (window.matchMedia("(hover: hover)").matches) {
              gsap.fromTo(
                chars,
                { y: 20, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  stagger: 0.03,
                  ease: "power2.out",
                  duration: 0.4,
                }
              );
              // Animate underline in and then out automatically
              gsap
                .timeline()
                .to(underline, {
                  scaleX: 1,
                  duration: 0.4,
                  ease: "power2.out",
                  delay: 0.2,
                })
                .to(underline, {
                  scaleX: 0,
                  duration: 0.3,
                  ease: "power2.in",
                  delay: 0.1,
                });
            }
          };

          const hoverOut = () => {
            // Kill any ongoing underline animations and reset
            gsap.killTweensOf(underline);
            gsap.set(underline, { scaleX: 0 });
          };

          linkEl.addEventListener("mouseenter", hoverIn);
          linkEl.addEventListener("mouseleave", hoverOut);

          // Store event listeners for cleanup
          linkEl._hoverIn = hoverIn;
          linkEl._hoverOut = hoverOut;
        }
      });
    };

    // Wait for fonts to be loaded before running SplitText
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setupSplitText);
    } else {
      // Fallback for older browsers
      window.addEventListener("load", setupSplitText);
      return () => window.removeEventListener("load", setupSplitText);
    }

    // Cleanup function
    return () => {
      linkRefs.current.forEach((linkEl) => {
        if (linkEl && linkEl._splitText) {
          linkEl.removeEventListener("mouseenter", linkEl._hoverIn);
          linkEl.removeEventListener("mouseleave", linkEl._hoverOut);
          if (linkEl._underline) {
            linkEl.removeChild(linkEl._underline);
          }
          linkEl._splitText.revert();
        }
      });
    };
  }, []);

  // Handle overlay visibility on close
  useEffect(() => {
    if (!isOpen && overlay.current && tl.current) {
      const hideOverlay = () => {
        if (overlay.current && tl.current && tl.current.reversed()) {
          overlay.current.style.display = "none";
        }
      };
      const timer = setTimeout(hideOverlay, 400); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const links = ["Home", "About", "Projects", "Contact"];
  const socialsData = [
    { name: "GitHub", href: "https://github.com/DcoderSohan" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/sohan-sarang/" },
  ];

  return (
    <>
      {/* Navbar Header - Consistent across all devices */}
      <header className="navbar-header">
        <div className="navbar-container">
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
          display: isOpen ? 'flex' : 'none',
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
