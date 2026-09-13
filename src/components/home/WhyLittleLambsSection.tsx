import React from "react";

export function WhyLittleLambsSection() {
  const pillars = [
    {
      number: "01",
      title: "Playful Faith Learning",
      desc: "Faith flourishes when learning feels joyful. Our activities blend scripture learning with playful exercises that keep children engaged.",
    },
    {
      number: "02",
      title: "Age-Appropriate Design",
      desc: "Thoughtfully crafted for children ages 4 to 10 with clear typography, comfortable spacing, and relatable illustrations.",
    },
    {
      number: "03",
      title: "Family & Sunday School Friendly",
      desc: "Perfect for family prayer times, weekend quiet hours, and Sunday school classrooms.",
    },
  ];

  return (
    <section className="why-little-lambs-section" aria-label="Why Little Lambs">
      <div className="why-container">
        <div className="why-grid">
          <div className="why-text-col">
            <span className="section-badge">Our Mission</span>
            <h2 className="section-title left-aligned">Why Parents &amp; Educators Choose Little Lambs</h2>
            <p className="why-lead-p">
              We believe that early faith formation should be warm, approachable, and creative. Little Lambs gives parents and teachers a beautiful resource to share Christian values with young children.
            </p>
          </div>

          <div className="why-pillars-col">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="why-pillar-card">
                <span className="pillar-num">{pillar.number}</span>
                <div className="pillar-body">
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
