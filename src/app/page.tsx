import "./landing-reference.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LandingHero } from "@/components/home/LandingHero";
import { CuriousMindsSection } from "@/components/home/CuriousMindsSection";
import { OurStoryTeaser } from "@/components/home/OurStoryTeaser";
import { OurBooksCatalogueSection } from "@/components/home/OurBooksCatalogueSection";
import { FaqSection } from "@/components/home/FaqSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main id="main-content" className="site-canvas-outer">
      <div className="site-canvas-frame">
        <div className="reference-landing">
          <SiteHeader landing />
          <LandingHero />
        </div>
        <CuriousMindsSection />
        <OurStoryTeaser />
        <OurBooksCatalogueSection />
        <FaqSection />
        <Footer />
      </div>
    </main>
  );
}
