"use client";

import { MapPin, Sparkles, Mail } from "lucide-react";


import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  const [draft, setDraft] = useState("");
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Get in Touch"
          subtitle="We would love to hear from parents, teachers, and parish coordinators."
          badge="Contact &amp; Enquiries"
        />

        <article className="contact-container">
          <div className="contact-grid">
            {/* Direct Contact Information Box */}
            <div className="contact-info-card">
              <h2>Contact Information</h2>
              <p>For book distribution, bulk copies for Sunday schools, or general enquiries:</p>

              <div className="contact-detail-group">
                <div className="contact-detail-item">
                  <span className="contact-icon"><MapPin size={24} aria-hidden="true" /></span>
                  <div>
                    <strong>Publisher:</strong>
                    <p>Atma Books</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <span className="contact-icon"><Sparkles size={24} aria-hidden="true" /></span>
                  <div>
                    <strong>Creator:</strong>
                    <p>SMYM Elanji Unit</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <span className="contact-icon"><Mail size={24} aria-hidden="true" /></span>
                  <div>
                    <strong>Official Email:</strong>
                    <p><a href="mailto:atmabooks@gmail.com" className="contact-email-link">atmabooks@gmail.com</a></p>
                  </div>
                </div>


              </div>
            </div>

            {/* Accessible Contact Form */}
            <div className="contact-form-card">
              <h2>Send a Message</h2>
              <form className="contact-form" onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const subject = String(form.get("subject") || "Little Lambs enquiry");
                const body = `${form.get("message")}\n\nFrom: ${form.get("name")}\nReply to: ${form.get("email")}`;
                setDraft(`mailto:atmabooks@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
              }}>
                <div className="form-group">
                  <label htmlFor="contact-name">Your Full Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    placeholder="e.g. Mary Joseph"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder="e.g. mary@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    placeholder="e.g. Bulk Order Enquiry for Sunday School"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Write your query or enquiry here..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="primary-cta contact-submit-btn">
                  Prepare email
                </button>
                <p className="form-note">
                  Prepare your message, then open it in your email app to review and send.
                </p>
                {draft && <div role="status"><p>Your draft is ready. Nothing has been sent.</p><a className="secondary-cta" href={draft}>Open email draft</a></div>}
              </form>
            </div>
          </div>
        </article>

        <section className="contact-container store-faq" aria-labelledby="enquiry-faq-title">
          <h2 id="enquiry-faq-title">A few helpful answers</h2>
          <details><summary>Who is the book for?</summary><p>Children aged 4–10, with grown-up guidance for younger readers.</p></details>
          <details><summary>Can I enquire about copies for a parish?</summary><p>Yes. Include your quantity and location in your message to the publisher.</p></details>
          <details><summary>Can I pay online?</summary><p>Online ordering is not available yet. Please enquire before making any payment.</p></details>
        </section>
        <Footer inner />
      </div>
    </main>
  );
}
