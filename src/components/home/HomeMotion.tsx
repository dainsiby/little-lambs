"use client";

import { useEffect } from "react";

/** Progressive enhancement: content remains visible without JavaScript. */
export function HomeMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const start = () => {
      stop();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting || seen.has(target)) return;
          seen.add(target);
          observer?.unobserve(target);
          // Never animate an element containing keyboard focus.
          if (target.contains(document.activeElement)) return;
          const animation = target.animate(
            [{ opacity: 0.65, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 480, easing: "cubic-bezier(.2,.7,.3,1)" },
          );
          animations.add(animation);
          animation.finished.then(() => animations.delete(animation)).catch(() => {});
        });
      }, { threshold: 0.08 });
      document.querySelectorAll("#main-content .activity-card, #main-content .story-teaser-card, #main-content .catalogue-card").forEach(el => observer?.observe(el));
    };
    start();
    preference.addEventListener("change", start);
    return () => { stop(); preference.removeEventListener("change", start); };
  }, []);
  return null;
}
