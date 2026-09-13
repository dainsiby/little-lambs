import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
export function ArrowRight(props: IconProps) {
  return <svg viewBox="0 0 28 16" fill="none" aria-hidden="true" {...props}><path d="M1 8h24M19 2l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function CartIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}><path d="M2 4h5l4 17h16l3-13H8M12 16h15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="13" cy="27" r="2" stroke="currentColor" strokeWidth="1.7"/><circle cx="25" cy="27" r="2" stroke="currentColor" strokeWidth="1.7"/></svg>;
}
export function ShoppingBagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
export function MenuIcon(props: IconProps) {
  return <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" {...props}><path d="M4 7h20M4 14h20M4 21h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
export function ArrowDown(props: IconProps) {
  return <svg viewBox="0 0 54 66" fill="none" aria-hidden="true" {...props}><path d="M22 3h10v41l14-14 7 8-26 25L1 38l8-8 13 14V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
}
