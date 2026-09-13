import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main-row">
        {/* LEFT BRAND & COPYRIGHT */}
        <div className="footer-brand-col">
          <Link href="/" aria-label="Little Lambs home">
            <Image
              src="/brand/logo.png"
              alt="Little Lambs — Made with Love"
              width={140}
              height={150}
              className="footer-logo"
            />
          </Link>
          <p className="footer-copy-text">
            &copy; {currentYear} Little Lambs. All rights reserved.
          </p>
        </div>

        {/* CENTER NAVIGATION */}
        <nav className="footer-nav-col" aria-label="Footer navigation">
          <Link href="/books">Books</Link>
          <Link href="/our-story">Our story</Link>
          <Link href="/contact">FAQs</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* RIGHT SOCIAL PLACEHOLDERS & QUOTE */}
        <div className="footer-right-col">
          <div className="footer-social-placeholders" aria-hidden="true">
            {/* Instagram Icon Placeholder */}
            <span className="social-icon-box" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </span>
            {/* Facebook Icon Placeholder */}
            <span className="social-icon-box" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </span>
            {/* YouTube Icon Placeholder */}
            <span className="social-icon-box" title="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </span>
          </div>

          <p className="footer-script-quote">
            Made with love <br />
            for little hearts. ♡
          </p>
        </div>
      </div>

      <div className="footer-credits-line">
        <p>A project by SMYM Elanji Unit &nbsp;|&nbsp; Published by Atma Books, Kozhikode</p>
      </div>
    </footer>
  );
}

