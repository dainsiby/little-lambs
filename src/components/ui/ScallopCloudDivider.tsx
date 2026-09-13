import React from 'react';

interface ScallopCloudDividerProps {
  fillColor?: string;
  className?: string;
}

/**
 * ScallopCloudDivider creates a soft, organic storybook cloud scallop curve transition
 * between background sections (e.g. Hero Sky to Canvas Cream body).
 */
export default function ScallopCloudDivider({
  fillColor = '#F7F1E2',
  className = '',
}: ScallopCloudDividerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="relative block w-full h-12 sm:h-16 md:h-20"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0 
             C 60 45, 120 45, 180 15 
             C 240 45, 300 45, 360 15 
             C 420 45, 480 45, 540 15 
             C 600 45, 660 45, 720 15 
             C 780 45, 840 45, 900 15 
             C 960 45, 1020 45, 1080 15 
             C 1140 45, 1170 30, 1200 0 
             V 120 H 0 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
