"use client";
import { useState, useRef, useEffect } from "react";

export default function ShowMoreText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight);
      const contentHeight = contentRef.current.scrollHeight;
      const maxHeight = lineHeight * 5;
      
      if (contentHeight <= maxHeight) {
        setExpanded(true);
      }
    }
  }, [children]);

  return (
    <div
      ref={contentRef}
      className={`${expanded ? "" : `line-clamp-5 transition-all`} ${className ?? ""} relative`}
    >
      {children}
      {!expanded ? (
        <button
          className="text-gray-400 absolute right-0 bottom-0 cursor-pointer bg-gradient-to-l from-white from-60% to-transparent pl-14 underline"
          onClick={() => setExpanded(true)}
          type="button"
        >
          Ko&apos;proq
        </button>
      ) : null}
    </div>
  );
}