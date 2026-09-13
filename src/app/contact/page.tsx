"use client";

import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
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
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>Publisher:</strong>
                    <p>Atma Books</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <span className="contact-icon">✨</span>
                  <div>
                    <strong>Creator:</strong>
                    <p>SMYM Elanji Unit</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <strong>Official Email:</strong>
                    <p><a href="mailto:atmabooks@gmail.com" className="contact-email-link">atmabooks@gmail.com</a></p>
                  </div>
                </div>

                <div className="contact-detail-item pending-box">
                  <span className="contact-icon">⚙️</span>
                  <div>
                    <strong>Direct Store Support:</strong>
                    <p className="pending-text">Pending store configuration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessible Contact Form */}
            <div className="contact-form-card">
              <h2>Send a Message</h2>
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
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
                  Send Message
                </button>
                <p className="form-note">
                  * Note: Message processing integration will be enabled in the upcoming storefront release.
                </p>
              </form>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
