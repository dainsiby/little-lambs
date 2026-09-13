import React from "react";

export function ReadingLambMascot() {
  return (
    <svg
      width="220"
      height="200"
      viewBox="0 0 220 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="reading-lamb-svg"
      aria-hidden="true"
    >
      {/* Soft Shadow Base */}
      <ellipse cx="110" cy="182" rx="75" ry="10" fill="#061e33" opacity="0.4" />

      {/* Fluffy Lamb Body Base */}
      <path
        d="M65 145 C50 145 45 130 50 115 C40 110 38 95 48 85 C42 70 55 58 70 62 C80 50 100 48 110 58 C120 48 140 50 150 62 C165 58 178 70 172 85 C182 95 180 110 170 115 C175 130 170 145 155 145 Z"
        fill="#FFFFFF"
        stroke="#1A365D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Fluffy Tail */}
      <path
        d="M48 125 C40 125 38 115 45 110 C40 102 48 98 52 105 Z"
        fill="#FFFFFF"
        stroke="#1A365D"
        strokeWidth="2"
      />

      {/* Head */}
      <path
        d="M75 90 C75 60 145 60 145 90 C145 125 75 125 75 90 Z"
        fill="#FFFDF7"
        stroke="#1A365D"
        strokeWidth="2.5"
      />

      {/* Left Ear */}
      <path
        d="M76 76 C55 60 42 75 66 88 Z"
        fill="#F7D6D0"
        stroke="#1A365D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Right Ear */}
      <path
        d="M144 76 C165 60 178 75 154 88 Z"
        fill="#F7D6D0"
        stroke="#1A365D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Fluffy Head Tuft / Hair Cut */}
      <path
        d="M90 62 C85 52 100 45 110 52 C120 45 135 52 130 62 C140 68 132 76 120 74 C110 78 100 78 90 74 Z"
        fill="#FFFFFF"
        stroke="#1A365D"
        strokeWidth="2"
      />

      {/* Face Features — Cute Eyes */}
      <ellipse cx="96" cy="88" rx="4" ry="5.5" fill="#1A365D" />
      <ellipse cx="124" cy="88" rx="4" ry="5.5" fill="#1A365D" />
      <circle cx="94.5" cy="86.5" r="1.5" fill="#FFFFFF" />
      <circle cx="122.5" cy="86.5" r="1.5" fill="#FFFFFF" />

      {/* Cute Cheeks */}
      <ellipse cx="88" cy="95" rx="5" ry="3" fill="#F4A261" opacity="0.4" />
      <ellipse cx="132" cy="95" rx="5" ry="3" fill="#F4A261" opacity="0.4" />

      {/* Nose & Mouth */}
      <path
        d="M107 94 L113 94 L110 98 Z"
        fill="#E76F51"
        stroke="#1A365D"
        strokeWidth="1.5"
      />
      <path
        d="M110 98 Q105 104 102 102 M110 98 Q115 104 118 102"
        stroke="#1A365D"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Arms Holding Book */}
      <path
        d="M70 120 C65 135 85 145 92 138"
        fill="#FFFFFF"
        stroke="#1A365D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M150 120 C155 135 135 145 128 138"
        fill="#FFFFFF"
        stroke="#1A365D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Open Storybook */}
      <path
        d="M68 152 Q110 144 110 156 Q110 144 152 152 L146 178 Q110 170 110 180 Q110 170 74 178 Z"
        fill="#64DFDF"
        stroke="#1A365D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M72 150 Q110 142 110 154 L110 178 Q110 168 76 176 Z"
        fill="#FFFDF7"
        stroke="#1A365D"
        strokeWidth="1.5"
      />
      <path
        d="M148 150 Q110 142 110 154 L110 178 Q110 168 144 176 Z"
        fill="#FFFDF7"
        stroke="#1A365D"
        strokeWidth="1.5"
      />

      {/* Book Page Lines */}
      <path d="M82 158 H100 M82 164 H96 M82 170 H98" stroke="#1A365D" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M120 158 H138 M124 164 H138 M120 170 H136" stroke="#1A365D" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

      {/* Little Pencil Beside Book */}
      <g transform="translate(155, 168) rotate(-25)">
        <rect x="0" y="0" width="22" height="6" rx="1.5" fill="#ECA90B" stroke="#1A365D" strokeWidth="1.2" />
        <path d="M22 0 L28 3 L22 6 Z" fill="#F4A261" stroke="#1A365D" strokeWidth="1.2" />
        <path d="M26 2 L28 3 L26 4 Z" fill="#1A365D" />
        <rect x="-4" y="0" width="4" height="6" fill="#E76F51" stroke="#1A365D" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
