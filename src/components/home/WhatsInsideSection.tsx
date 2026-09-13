import React from "react";

export function WhatsInsideSection() {
  const categories = [
    {
      icon: "✝️",
      title: "Daily Prayers",
      desc: "Gentle Christian prayers to teach children daily devotion, gratitude, and reflection.",
    },
    {
      icon: "📖",
      title: "Bible Learning",
      desc: "Engaging Bible stories rewritten for early readers with memory verses and key takeaways.",
    },
    {
      icon: "🎨",
      title: "Coloring & Drawing",
      desc: "Beautiful outline art and creative drawing prompts that inspire artistic expression.",
    },
    {
      icon: "🧩",
      title: "Word Puzzles & Mazes",
      desc: "Fun crosswords, word searches, and line mazes designed to sharpen problem-solving skills.",
    },
    {
      icon: "🎲",
      title: "Games & Matching",
      desc: "Playful matching games and memory challenges centered around Christian values.",
    },
    {
      icon: "✏️",
      title: "Faith Activities",
      desc: "Hands-on family activities and reflections that bring faith into everyday moments.",
    },
  ];

  return (
    <section className="whats-inside-section" aria-label="What's Inside">
      <div className="whats-inside-container">
        <div className="section-header-center">
          <span className="section-badge">Interactive Learning</span>
          <h2 className="section-title">What&apos;s Inside Little Lambs?</h2>
          <p className="section-subtitle">
            A rich blend of faith-building activities designed to inspire young hearts and minds.
          </p>
        </div>

        <div className="whats-inside-grid">
          {categories.map((cat, idx) => (
            <div key={idx} className="whats-inside-card">
              <span className="whats-inside-icon">{cat.icon}</span>
              <h3 className="whats-inside-card-title">{cat.title}</h3>
              <p className="whats-inside-card-desc">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
