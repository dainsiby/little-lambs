import Image from "next/image";

export function StorybookScene() {
  return <div className="storybook-scene" id="storybook" role="img" aria-label="Jesus reading with three children beneath a leafy tree, with a lamb, meadow flowers and a church in the countryside.">
    <Image src="/illustrations/storybook-scene.png" alt="" fill sizes="(max-width: 767px) 100vw, 70vw" preload className="scene-image" />
    <svg className="reading-book-cover" viewBox="0 0 1122 1402" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <image href="/books/cover-front.png" width="162" height="115" preserveAspectRatio="xMidYMid meet" transform="matrix(.88,-.18,-.2,1.08,543,900)" />
    </svg>
  </div>;
}
