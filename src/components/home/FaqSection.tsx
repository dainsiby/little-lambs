"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Who is Little Lambs for?",
    answer: "Little Lambs is designed for curious children aged 4 to 10. It is crafted for gentle independent exploration or shared reading alongside parents, grandparents, and Sunday school teachers.",
  },
  {
    question: "What will children find in the book?",
    answer: "Children will discover guided daily prayers, Bible story reflections, interactive word searches, creative coloring pages, puzzles, mazes, and playful faith activities.",
  },
  {
    question: "Is this part of a series?",
    answer: "Yes! Volume 1 (English Activity Book) is our flagship release, created by SMYM Elanji Unit and published by Atma Books. Additional volumes in the Little Lambs series are currently planned.",
  },
  {
    question: "When can I order?",
    answer: "You can explore book details and order Volume 1 (₹100) directly through our storefront catalog page.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="faq-section" aria-labelledby="faq-title">
      <div className="faq-container">
        <div className="faq-header-col">
          <span className="section-eyebrow">FOR THE GROWN-UPS</span>
          <h2 id="faq-title" className="faq-headline">
            Little questions, <br />
            helpful answers.
          </h2>
          <p className="faq-subtext">
            Everything you need to know about the book, the series and ordering.
          </p>
        </div>

        <div className="faq-accordion-col" role="region" aria-label="Frequently Asked Questions">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-answer-${idx}`;
            const headerId = `faq-header-${idx}`;

            return (
              <div key={idx} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <button
                  id={headerId}
                  type="button"
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleFaq(idx)}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-chevron-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`faq-answer-panel ${isOpen ? "is-visible" : ""}`}
                  hidden={!isOpen}
                >
                  <p className="faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
