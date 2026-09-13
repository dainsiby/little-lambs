import React from "react";
import { SiteHeader } from "./SiteHeader";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <div className="inner-page-hero">
      <SiteHeader />
      <div className="inner-hero-content">
        {badge && <span className="inner-hero-badge">{badge}</span>}
        <h1 className="inner-hero-title">{title}</h1>
        {subtitle && <p className="inner-hero-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
