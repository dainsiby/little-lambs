"use client";
import Image from "next/image";
import { useRef } from "react";
export function CoverPreview({ src, title }: { src: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <div className="gallery-preview">
    <button type="button" className="secondary-cta" onClick={() => dialog.current?.showModal()}>Enlarge cover</button>
    <dialog ref={dialog} aria-label={`${title} cover preview`} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <button type="button" className="dialog-close" onClick={() => dialog.current?.close()} autoFocus>Close preview ×</button>
      <Image src={src} alt={`${title} cover`} width={900} height={900} />
    </dialog>
  </div>;
}
