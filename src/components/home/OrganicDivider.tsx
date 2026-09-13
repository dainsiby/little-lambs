export function OrganicDivider() {
  return <>
    <svg className="desktop-divider" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0H350C337 149 500 274 477 421S352 696 371 817S406 935 411 1000H0Z" fill="var(--paper)" />
      <path d="M350 0C337 149 500 274 477 421S352 696 371 817S406 935 411 1000" fill="none" stroke="var(--paper)" strokeWidth="15" />
      <path d="M347 0C334 149 497 274 474 421S349 696 368 817S403 935 408 1000" fill="none" stroke="var(--gold)" strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
    </svg>
    <svg className="mobile-divider" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0H400V6C354 75 79 0 0 99Z" fill="var(--paper)" />
      <path d="M0 99C79 0 354 75 400 6" fill="none" stroke="var(--paper)" strokeWidth="12" />
      <path d="M0 92C79 -7 354 68 400 -1" fill="none" stroke="var(--gold)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  </>;
}
