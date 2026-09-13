import Image from "next/image";

export function BookPreview() {
  return <div className="book-preview">
    <Image src="/books/cover-front.png" alt="Official Little Lambs English Christian Activity Book cover" width={1684} height={1191} sizes="(max-width: 600px) 80vw, 440px" />
    <p className="book-title">Little Lambs</p>
    <p>Stories, prayers and playful activities for ages 4–10.</p>
    <p className="availability-note">Ordering will be available soon.</p>
  </div>;
}
