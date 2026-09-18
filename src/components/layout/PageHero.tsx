import "./inner-pages.css";
import React from "react";
import Image from "next/image";
import { SiteHeader } from "./SiteHeader";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  rightImage?: string;
}

export function PageHero({ title, subtitle, badge, rightImage }: PageHeroProps) {
  return (
    <div className="inner-page-hero">
      <SiteHeader />
      <div className={`inner-hero-content ${rightImage ? "has-right-image" : ""}`}>
        <div className="inner-hero-text">
          {badge && <span className="inner-hero-badge">{badge}</span>}
          <h1 className="inner-hero-title">{title}</h1>
          {subtitle && <p className="inner-hero-subtitle">{subtitle}</p>}
        </div>
        {rightImage && (
          <div className="inner-hero-visual-accent">
            <Image
              src={rightImage}
              alt="Little Lambs storybook illustration"
              width={260}
              height={200}
              className="inner-hero-accent-img"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
