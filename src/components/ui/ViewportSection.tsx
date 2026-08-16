// src/components/ui/ViewportSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ViewportSectionProps {
  children: React.ReactNode;
  className?: string;
  defaultInView?: boolean;
}

export default function ViewportSection({
  children,
  className = '',
  defaultInView = false,
}: ViewportSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInFocus, setIsInFocus] = useState(defaultInView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInFocus(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: '-8% 0px -8% 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isInFocus
          ? 'opacity-100 scale-100 filter-none pointer-events-auto'
          : 'opacity-25 scale-[0.99] filter blur-[0.3px] pointer-events-none sm:pointer-events-auto'
      } ${className}`}
    >
      {children}
    </div>
  );
}