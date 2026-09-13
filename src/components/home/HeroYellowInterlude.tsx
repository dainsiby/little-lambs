import React from "react";

export function HeroYellowInterlude() {
  return (
    <section className="hero-yellow-interlude" aria-label="Little Lambs Highlights">
      <div className="yellow-interlude-container">
        {/* ITEM 1: LEFT */}
        <div className="yellow-interlude-item">
          <span className="yellow-interlude-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </span>
          <span>Learn a little prayer</span>
        </div>

        {/* ITEM 2: CENTER */}
        <div className="yellow-interlude-item">
          <span className="yellow-interlude-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.234-.706 1.704l-1.568 1.568c-.23.23-.338.556-.289.878.077.502-.093 1.026-.479 1.412l-1.568 1.568c-.386.386-.91.556-1.412.479-.322-.049-.648.059-.878.289l-1.568 1.568c-.47.47-1.087.706-1.704.706s-1.234-.235-1.704-.706l-1.568-1.568c-.23-.23-.556-.338-.878-.289-.502.077-1.026-.093-1.412-.479l-1.568-1.568c-.386-.386-.556-.91-.479-1.412.049-.322-.059-.648-.289-.878l-1.568-1.568c-.47-.47-.706-1.087-.706-1.704s.235-1.234.706-1.704l1.568-1.568c.23-.23.338-.556.289-.878-.077-.502.093-1.026.479-1.412l1.568-1.568c.386.386.556.91.479 1.412z" />
            </svg>
          </span>
          <span>Play a little game</span>
        </div>

        {/* ITEM 3: RIGHT */}
        <div className="yellow-interlude-item">
          <span className="yellow-interlude-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <span>Grow a little closer</span>
        </div>
      </div>
    </section>
  );
}
