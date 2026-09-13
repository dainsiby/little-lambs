import React from 'react';

interface WoodSignpostProps {
  className?: string;
}

/**
 * WoodSignpost renders the exact right hero signpost illustration:
 * - Large fluffy watercolor cloud with gold sparkle stars
 * - Smiling golden sun with rosy cheeks & rays at top right
 * - Cute blue bird perched directly on the wooden post top
 * - Red dashed heart-shaped flight trail
 * - 4 Wooden plank arrow boards (Read: tan, Learn: pink/red, Create: green, Grow: blue)
 * - Natural grass mound base with white daisies, leaves, and grey rocks
 */
export default function WoodSignpost({ className = '' }: WoodSignpostProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center select-none w-full max-w-[270px] sm:max-w-[290px] lg:max-w-[320px] mx-auto ${className}`}
    >
      <svg
        viewBox="0 0 320 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        <defs>
          {/* Plank Gradients */}
          <linearGradient id="tanPlank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5C78E" />
            <stop offset="100%" stopColor="#D99B58" />
          </linearGradient>
          <linearGradient id="pinkPlank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6A090" />
            <stop offset="100%" stopColor="#DC735E" />
          </linearGradient>
          <linearGradient id="greenPlank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A4D4A4" />
            <stop offset="100%" stopColor="#6C9E74" />
          </linearGradient>
          <linearGradient id="bluePlank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8EC5E8" />
            <stop offset="100%" stopColor="#5A96BA" />
          </linearGradient>
          <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6D4C41" />
            <stop offset="50%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>
          {/* Subtle Board Shadow Filter */}
          <filter id="boardShadow" x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#1E293B" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. TOP WATERCOLOR FLUFFY CLOUD */}
        <g opacity="0.95">
          {/* Soft outer cloud watercolor glow */}
          <path
            d="M 60 140 C 35 140, 20 115, 38 95 C 45 68, 80 55, 110 68 C 130 45, 180 40, 210 60 C 235 48, 275 60, 280 90 C 300 105, 290 140, 265 152 C 240 162, 80 162, 60 140 Z"
            fill="#E0F2FE"
            opacity="0.85"
          />
          <path
            d="M 75 130 C 50 130, 42 105, 58 90 C 65 65, 95 58, 120 70 C 140 50, 185 48, 210 65 C 230 55, 265 68, 270 95 C 285 110, 275 135, 250 145 Z"
            fill="#BAE6FD"
            opacity="0.5"
          />
          {/* Inner White Cloud Mass */}
          <path
            d="M 70 128 C 50 128, 45 108, 60 92 C 68 72, 98 62, 122 75 C 142 55, 182 52, 208 70 C 228 60, 258 72, 262 98 C 275 112, 265 135, 245 142 C 225 148, 90 148, 70 128 Z"
            fill="#FFFFFF"
          />
        </g>

        {/* 2. SMILING GOLDEN SUN WITH RAYS (TOP RIGHT OF CLOUD) */}
        <g transform="translate(250, 78)">
          {/* Sun Rays */}
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, idx) => (
            <polygon
              key={idx}
              points="0,-36 -4.5,-26 4.5,-26"
              fill="#F59E0B"
              transform={`rotate(${angle})`}
            />
          ))}
          {/* Sun Circle */}
          <circle cx="0" cy="0" r="24" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2.5" />
          {/* Sun Eyes with Sparkle */}
          <circle cx="-7" cy="-4" r="2.5" fill="#1E293B" />
          <circle cx="-6.2" cy="-5" r="0.8" fill="#FFFFFF" />
          <circle cx="7" cy="-4" r="2.5" fill="#1E293B" />
          <circle cx="7.8" cy="-5" r="0.8" fill="#FFFFFF" />
          {/* Smiling Mouth */}
          <path d="M -7 5 Q 0 13 7 5" fill="none" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />
          {/* Rosy Cheeks */}
          <circle cx="-11" cy="3" r="3" fill="#F87171" opacity="0.65" />
          <circle cx="11" cy="3" r="3" fill="#F87171" opacity="0.65" />
        </g>

        {/* 3. GOLD SPARKLE STARS */}
        <g fill="#F59E0B">
          <path d="M 45 75 Q 45 82 38 82 Q 45 82 45 89 Q 45 82 52 82 Q 45 82 45 75 Z" />
          <path d="M 75 110 Q 75 115 71 115 Q 75 115 75 120 Q 75 115 79 115 Q 75 115 75 110 Z" />
          <path d="M 255 210 Q 255 215 251 215 Q 255 215 255 220 Q 255 215 259 215 Q 255 215 255 210 Z" />
        </g>

        {/* 4. RED DASHED FLYING TRAIL FORMING HEART LOOPS */}
        <path
          d="M 145 224 C 120 230, 90 250, 65 260 C 48 267, 36 282, 52 295 C 65 308, 82 286, 60 274 C 38 262, 26 284, 42 298"
          fill="none"
          stroke="#E76F51"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 5. CENTRAL VERTICAL WOODEN POLE (Top starting at y=235) */}
        <rect x="153" y="235" width="14" height="255" rx="3" fill="url(#poleGrad)" filter="url(#boardShadow)" />

        {/* 6. SMALL BLUE BIRD PERCHED DIRECTLY ON TOP OF WOODEN POLE */}
        <g transform="translate(160, 222)">
          {/* Bird Body */}
          <ellipse cx="0" cy="0" rx="9" ry="7.5" fill="#3B82F6" />
          {/* Bird Chest */}
          <ellipse cx="-2" cy="2" rx="6" ry="5" fill="#93C5FD" opacity="0.8" />
          {/* Bird Head */}
          <circle cx="-5" cy="-4" r="5.5" fill="#60A5FA" />
          {/* Bird Eye */}
          <circle cx="-7" cy="-5" r="1.3" fill="#1E293B" />
          <circle cx="-6.5" cy="-5.5" r="0.5" fill="#FFFFFF" />
          {/* Rosy Cheek */}
          <circle cx="-4" cy="-2" r="1.8" fill="#F87171" opacity="0.7" />
          {/* Bird Beak */}
          <polygon points="-10.5,-4 -14.5,-2.2 -10.5,-0.4" fill="#F97316" />
          {/* Bird Wing */}
          <path d="M 1 -1 Q 7 -7 5 3 Z" fill="#2563EB" />
          {/* Bird Tail */}
          <polygon points="7,-1 13,-4 10,3" fill="#1D4ED8" />
          {/* Bird Feet perched on pole */}
          <line x1="-3" y1="7" x2="-3" y2="14" stroke="#451A03" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="2" y1="7" x2="2" y2="14" stroke="#451A03" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* 7. FOUR WOODEN ARROW SIGN BOARDS */}

        {/* BOARD 1: READ (Tan/Yellow, Pointing RIGHT) */}
        <g transform="translate(80, 252)" filter="url(#boardShadow)">
          {/* Plank path: flat left, arrow right */}
          <path
            d="M 0 0 L 140 0 L 160 21 L 140 42 L 0 42 Z"
            fill="url(#tanPlank)"
            stroke="#B57A38"
            strokeWidth="1.6"
          />
          {/* Wood Grain Lines */}
          <path d="M 10 11 Q 60 9 130 12" fill="none" stroke="#C48440" strokeWidth="1" opacity="0.5" />
          <path d="M 14 31 Q 70 33 125 30" fill="none" stroke="#C48440" strokeWidth="1" opacity="0.5" />
          {/* Nail Rivets (Left Side) */}
          <circle cx="16" cy="14" r="2.4" fill="#4A3018" />
          <circle cx="16" cy="14" r="1.1" fill="#78522B" />
          <circle cx="16" cy="28" r="2.4" fill="#4A3018" />
          <circle cx="16" cy="28" r="1.1" fill="#78522B" />
          {/* Board Text */}
          <text
            x="72"
            y="28"
            fill="#3D2109"
            fontSize="20"
            fontWeight="900"
            fontFamily="var(--font-heading), sans-serif"
            textAnchor="middle"
          >
            Read
          </text>
        </g>

        {/* BOARD 2: LEARN (Coral Pink/Red, Pointing LEFT) */}
        <g transform="translate(78, 308)" filter="url(#boardShadow)">
          {/* Plank path: arrow left, flat right */}
          <path
            d="M 20 0 L 160 0 L 160 42 L 20 42 L 0 21 Z"
            fill="url(#pinkPlank)"
            stroke="#B84D3A"
            strokeWidth="1.6"
          />
          {/* Wood Grain Lines */}
          <path d="M 28 12 Q 80 10 148 13" fill="none" stroke="#C75C48" strokeWidth="1" opacity="0.5" />
          <path d="M 32 30 Q 90 32 144 29" fill="none" stroke="#C75C48" strokeWidth="1" opacity="0.5" />
          {/* Nail Rivets (Right Side) */}
          <circle cx="144" cy="14" r="2.4" fill="#4A1C14" />
          <circle cx="144" cy="14" r="1.1" fill="#7A3226" />
          <circle cx="144" cy="28" r="2.4" fill="#4A1C14" />
          <circle cx="144" cy="28" r="1.1" fill="#7A3226" />
          {/* Board Text */}
          <text
            x="85"
            y="28"
            fill="#3D120B"
            fontSize="20"
            fontWeight="900"
            fontFamily="var(--font-heading), sans-serif"
            textAnchor="middle"
          >
            Learn
          </text>
        </g>

        {/* BOARD 3: CREATE (Sage Green, Pointing RIGHT) */}
        <g transform="translate(80, 364)" filter="url(#boardShadow)">
          {/* Plank path: flat left, arrow right */}
          <path
            d="M 0 0 L 140 0 L 160 21 L 140 42 L 0 42 Z"
            fill="url(#greenPlank)"
            stroke="#4D7A54"
            strokeWidth="1.6"
          />
          {/* Wood Grain Lines */}
          <path d="M 10 11 Q 60 9 130 12" fill="none" stroke="#5A8C62" strokeWidth="1" opacity="0.5" />
          <path d="M 14 31 Q 70 33 125 30" fill="none" stroke="#5A8C62" strokeWidth="1" opacity="0.5" />
          {/* Nail Rivets (Left Side) */}
          <circle cx="16" cy="14" r="2.4" fill="#1C3821" />
          <circle cx="16" cy="14" r="1.1" fill="#3A6340" />
          <circle cx="16" cy="28" r="2.4" fill="#1C3821" />
          <circle cx="16" cy="28" r="1.1" fill="#3A6340" />
          {/* Board Text */}
          <text
            x="72"
            y="28"
            fill="#122916"
            fontSize="20"
            fontWeight="900"
            fontFamily="var(--font-heading), sans-serif"
            textAnchor="middle"
          >
            Create
          </text>
        </g>

        {/* BOARD 4: GROW (Sky Blue, Pointing LEFT) */}
        <g transform="translate(78, 420)" filter="url(#boardShadow)">
          {/* Plank path: arrow left, flat right */}
          <path
            d="M 20 0 L 160 0 L 160 42 L 20 42 L 0 21 Z"
            fill="url(#bluePlank)"
            stroke="#3B7396"
            strokeWidth="1.6"
          />
          {/* Wood Grain Lines */}
          <path d="M 28 12 Q 80 10 148 13" fill="none" stroke="#4882A6" strokeWidth="1" opacity="0.5" />
          <path d="M 32 30 Q 90 32 144 29" fill="none" stroke="#4882A6" strokeWidth="1" opacity="0.5" />
          {/* Nail Rivets (Right Side) */}
          <circle cx="144" cy="14" r="2.4" fill="#122B3B" />
          <circle cx="144" cy="14" r="1.1" fill="#295573" />
          <circle cx="144" cy="28" r="2.4" fill="#122B3B" />
          <circle cx="144" cy="28" r="1.1" fill="#295573" />
          {/* Board Text */}
          <text
            x="85"
            y="28"
            fill="#0D2230"
            fontSize="20"
            fontWeight="900"
            fontFamily="var(--font-heading), sans-serif"
            textAnchor="middle"
          >
            Grow
          </text>
        </g>

        {/* 8. GRASS BASE WITH PEBBLES & DAISIES UNDER SIGNPOST */}
        <g transform="translate(160, 485)">
          {/* Grey Pebbles / Rocks */}
          <ellipse cx="-24" cy="16" rx="8" ry="4.5" fill="#94A3B8" />
          <ellipse cx="-16" cy="18" rx="6" ry="3.5" fill="#64748B" />
          <ellipse cx="20" cy="17" rx="9" ry="5" fill="#94A3B8" />
          <ellipse cx="26" cy="19" rx="6" ry="3.5" fill="#64748B" />
          {/* Green Dome Mounds */}
          <path d="M -48 20 C -36 2, -6 2, 0 20 Z" fill="#6B9E78" />
          <path d="M 0 20 C 6 2, 36 2, 48 20 Z" fill="#588B65" />
          <ellipse cx="0" cy="20" rx="52" ry="8" fill="#4E7C59" />
          {/* Small White Daisies */}
          <circle cx="-30" cy="12" r="4" fill="#FFFDF9" />
          <circle cx="-30" cy="12" r="1.8" fill="#F59E0B" />
          <circle cx="30" cy="13" r="4" fill="#FFFDF9" />
          <circle cx="30" cy="13" r="1.8" fill="#F59E0B" />
          {/* Rounded Green Leaf Shoots */}
          <path d="M -18 8 Q -24 -3 -28 4 Q -20 12 -18 8 Z" fill="#88AB8E" />
          <path d="M 18 8 Q 24 -3 28 4 Q 20 12 18 8 Z" fill="#88AB8E" />
          <path d="M -38 12 Q -45 2 -48 8 Q -40 16 -38 12 Z" fill="#6B9E78" />
          <path d="M 38 12 Q 45 2 48 8 Q 40 16 38 12 Z" fill="#6B9E78" />
        </g>
      </svg>
    </div>
  );
}







