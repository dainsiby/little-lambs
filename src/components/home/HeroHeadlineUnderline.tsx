import React from "react";

export function HeroHeadlineUnderline() {
  return (
    <svg
      className="hero-underline-svg"
      viewBox="0 0 380 24"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 16C82 6 220 4 372 15"
        stroke="#eca90b"
        strokeWidth="6"
        strokeLinecap="round"
        className="underline-stroke-back"
      />
      <path
        d="M12 18C120 8 260 9 368 18"
        stroke="#f59e0b"
        strokeWidth="4"
        strokeLinecap="round"
        className="underline-stroke-front"
      />
    </svg>
  );
}
