import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";

gsap.registerPlugin(SplitText);

const Navbar = ({ className = "" }) => {
  const overlay = useRef();
  const nav = useRef();
  const closeBtn = useRef();
  const socials = useRef();
  const logo = useRef();
  const tl = useRef();
  const linkRefs = useRef([]);

  useEffect(() => {
    // The SplitText/GSAP setup logic as a function
    const setupSplitText = () => {
      // Initial overlay animation timeline
      gsap.set(
        [
          overlay.current,
          nav.current,
          socials.current,
          logo.current,
          closeBtn.current,
        ],
        { autoAlpha: 0, y: 20 }
      );
      tl.current = gsap
        .timeline({ paused: true, reversed: true })
        .to(overlay.current, { autoAlpha: 1, duration: 0.3 })
        .to(nav.current, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.2")
        .to(socials.current, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.2")
        .to(logo.current, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.2")
        .to(closeBtn.current, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.2");

      // Setup hover animations for each link individually
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

  const toggle = () => {
    const opening = tl.current.reversed();
    opening ? tl.current.play() : tl.current.reverse();
    document.body.style.overflow = opening ? "hidden" : "auto";
  };

  const links = ["Home", "About", "Projects", "Contact"];
  const socialsData = [
    { name: "GitHub", href: "https://github.com/DcoderSohan" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/sohan-sarang/" },
  ];

  return (
    <>
      <header className="fixed font-Audiowide top-4 z-50 w-[95%] sm:w-[85%] md:w-[70%] left-1/2 -translate-x-1/2 mx-auto rounded-lg p-2 sm:p-4 flex justify-between items-center gap-2 sm:gap-4 backdrop-blur-md bg-black/30 border border-white/10 shadow-lg">
        <div className="text-2xl text-white flex-shrink-0">
          <Link to="/">
            <img
              src="./mylogo.webp"
              alt="Logo"
              width={90}
              className="w-[90px] sm:w-[120px] md:w-[150px] h-auto"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>
        <button
          onClick={toggle}
          className="text-base sm:text-lg font-medium text-white hover:opacity-80 transition-opacity px-3 py-1 sm:px-4 sm:py-2"
        >
          Menu
        </button>
      </header>

      <div
        ref={overlay}
        className="fixed -top-8 left-0 right-0 bottom-0 z-50 bg-black flex flex-col p-8 md:p-16"
        style={{ 
          margin: 0,
          backgroundImage: 'url("./Navbg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <button
          ref={closeBtn}
          onClick={toggle}
          className="absolute font-Audiowide font-normal top-6 right-6 md:top-8 md:right-8 text-white text-xl z-10 p-2 hover:opacity-80 transition-opacity touch-manipulation"
          style={{ minHeight: 44, minWidth: 44 }}
        >
          Close
        </button>

        <nav ref={nav} className="flex font-Audiowide flex-col pt-20 space-y-6 md:space-y-10">
          {links.map((l, index) => {
            // Map link names to route paths
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
                className="font-Audiowide font-normal text-white text-3xl md:text-5xl relative inline-block cursor-pointer"
              >
                {l}
              </Link>
            );
          })}
        </nav>

        <div
          ref={socials}
          className="absolute font-Audiowide font-normal bottom-32 right-6 md:right-8 flex flex-col items-end space-y-2"
        >
          {socialsData.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="text-white text-lg hover:opacity-80 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.name}
            </a>
          ))}
        </div>

        <div
          ref={logo}
          className="absolute bottom-10 right-6 md:bottom-10 md:right-10 text-white text-4xl md:text-6xl font-bold"
        >
          <img
            src="./mylogo.webp"
            alt="Logo"
            className="w-[200px] md:w-[400px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
