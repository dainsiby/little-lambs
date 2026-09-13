import React from "react";

export function CuriousMindsSection() {
  return (
    <section id="curious-minds" className="curious-minds-section" aria-labelledby="curious-minds-title">
      <div className="curious-minds-header">
        <div className="curious-minds-title-col">
          <span className="section-eyebrow">FOR CURIOUS LITTLE MINDS</span>
          <h2 id="curious-minds-title" className="curious-minds-headline">
            Faith begins with <br />
            a little curiosity.
          </h2>
        </div>
        <div className="curious-minds-copy-col">
          <p>
            Turn time together into little moments of learning, with activities children can enjoy alongside a grown-up.
          </p>
        </div>
      </div>

      <div className="primary-cards-grid">
        {/* CARD 01 / PRAY */}
        <article className="activity-card card-peach">
          <div className="card-top-row">
            <span className="card-label">01 / PRAY</span>
            <span className="card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
          </div>

          <h3 className="card-title">
            Little words. <br />
            Heartfelt prayers.
          </h3>

          <p className="card-body">
            Help children become familiar with Catholic prayers in a gentle, playful way.
          </p>

          <div className="card-footer-divider" />

          <footer className="card-footer">
            A moment to pause, together.
          </footer>
        </article>

        {/* CARD 02 / PLAY */}
        <article className="activity-card card-sage">
          <div className="card-top-row">
            <span className="card-label">02 / PLAY</span>
            <span className="card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.234-.706 1.704l-1.568 1.568c-.23.23-.338.556-.289.878.077.502-.093 1.026-.479 1.412l-1.568 1.568c-.386.386-.91.556-1.412.479-.322-.049-.648.059-.878.289l-1.568 1.568c-.47.47-1.087.706-1.704.706s-1.234-.235-1.704-.706l-1.568-1.568c-.23-.23-.556-.338-.878-.289-.502.077-1.026-.093-1.412-.479l-1.568-1.568c-.386-.386-.556-.91-.479-1.412.049-.322-.059-.648-.289-.878l-1.568-1.568c-.47-.47-.706-1.087-.706-1.704s.235-1.234.706-1.704l1.568-1.568c.23-.23.338-.556.289-.878-.077-.502.093-1.026.479-1.412l1.568-1.568c.386-.386.91-.556 1.412-.479.322.049.648-.059.878-.289l1.568-1.568c.47-.47 1.087-.706 1.704-.706s1.234.235 1.704.706l1.568 1.568c.23.23.556.338.878.289.502-.077 1.026.093 1.412.479l1.568 1.568c.386.386.556.91.479 1.412z" />
              </svg>
            </span>
          </div>

          <h3 className="card-title">
            Ready, set... <br />
            let&apos;s discover!
          </h3>

          <p className="card-body">
            Explore faith through games and activities made for little learners.
          </p>

          <div className="card-footer-divider" />

          <footer className="card-footer">
            Make room for a little fun.
          </footer>
        </article>

        {/* CARD 03 / LEARN */}
        <article className="activity-card card-powder">
          <div className="card-top-row">
            <span className="card-label">03 / LEARN</span>
            <span className="card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8l6 6" />
                <path d="M4 14e1 0 0 1 0-2h12" />
                <path d="M2 5h12" />
                <path d="M7 2h1" />
                <path d="M22 22l-5-10-5 10" />
                <path d="M14 18h6" />
              </svg>
            </span>
          </div>

          <h3 className="card-title">
            New words. <br />
            Growing wonder.
          </h3>

          <p className="card-body">
            Introduce Bible words and start simple conversations about faith.
          </p>

          <div className="card-footer-divider" />

          <footer className="card-footer">
            One small discovery at a time.
          </footer>
        </article>
      </div>

      {/* SIGNATURE FOOTER BELOW CARDS */}
      <div className="curious-minds-signature">
        <svg className="signature-wave-left" width="80" height="12" viewBox="0 0 80 12" fill="none">
          <path d="M1 6C20 1 40 11 79 6" stroke="#eca90b" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>Small steps. A brighter tomorrow. ♡</span>
        <svg className="signature-wave-right" width="80" height="12" viewBox="0 0 80 12" fill="none">
          <path d="M1 6C20 1 40 11 79 6" stroke="#eca90b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
