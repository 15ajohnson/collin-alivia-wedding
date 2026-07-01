"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

interface InViewFadeProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function InViewFade({
  children,
  className,
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
}: InViewFadeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node || isVisible) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={`${isVisible ? "in-view-fade-visible" : "in-view-fade-hidden"}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
