"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBagIcon, MenuIcon } from "@/components/ui/Icons";

export function SiteHeader({ landing = false }: { landing?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="Little Lambs home">
        <Image
          src={landing ? "/brand/logo-clean.png" : "/brand/logo.png"}
          alt="Little Lambs — Made with Love"
          width={312}
          height={352}
          className="brand-logo"
          sizes="(max-width: 767px) 90px, 132px"
          priority
        />
      </Link>
      <div className="header-actions">
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuIcon />
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={menuOpen ? "main-navigation is-open" : "main-navigation"}
        >
          {landing && <Link href="/" aria-current={pathname === "/" ? "page" : undefined} onClick={() => setMenuOpen(false)}>Home</Link>}
          <Link
            href="/books"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname.startsWith("/books") ? "page" : undefined}
          >
            {landing ? "Book" : "Books"}
          </Link>
          <Link
            href="/our-story"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname === "/our-story" ? "page" : undefined}
          >
            Our story
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
          {!landing && <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>}
        </nav>
        <Link
          href="/cart"
          className="cart-pill-button"
          aria-label={landing ? "Shopping cart" : "Shopping bag, 0 items"}
        >
          {landing ? <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 4h4l4 18h16l4-13H7"/><path d="M10 22l-1 3h17"/><circle cx="12" cy="29" r="1.5"/><circle cx="25" cy="29" r="1.5"/></svg> : <><ShoppingBagIcon className="cart-pill-icon" /><span>My bag</span><span className="cart-pill-count">0</span></>}
        </Link>
      </div>
    </header>
  );
}

