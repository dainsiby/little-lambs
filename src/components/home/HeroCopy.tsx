import { ArrowRight } from "@/components/ui/Icons";
import { InfoDialog } from "@/components/ui/InfoDialog";
import { BookPreview } from "./BookPreview";

export function HeroCopy() {
  return <div className="hero-copy">
    <h1 id="hero-title"><span>A little book</span><span>for growing</span><span className="underlined">hearts &amp; minds.<svg viewBox="0 0 460 22" preserveAspectRatio="none" aria-hidden="true"><path d="M5 15C106 2 304 0 452 11L457 17C319 13 135 12 7 21Z" fill="currentColor"/><path d="M12 15C151 4 315 8 440 17" stroke="currentColor" strokeWidth="3" fill="none"/></svg></span></h1>
    <p className="hero-description">Stories, prayers and playful activities for <span className="whitespace-nowrap">ages 4–10.</span></p>
    <div className="product-cta" id="book">
      <span className="product-label">Little Lambs</span>
      <InfoDialog title="A little book, made with love." className="primary-cta" trigger={<>Get your copy <ArrowRight /></>}><BookPreview /></InfoDialog>
    </div>
  </div>;
}
