"use client";

import { useId, useRef, type ReactNode } from "react";

type InfoDialogProps = {
  title: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
};

export function InfoDialog({ title, trigger, children, className }: InfoDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return <>
    <button type="button" className={className} onClick={() => dialog.current?.showModal()}>{trigger}</button>
    <dialog ref={dialog} className="info-dialog" aria-labelledby={titleId} onClick={(event) => {
      if (event.target === event.currentTarget) dialog.current?.close();
    }}>
      <div className="dialog-content">
        <button type="button" className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button>
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </dialog>
  </>;
}
