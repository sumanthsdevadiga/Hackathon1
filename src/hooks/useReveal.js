import { useEffect, useRef } from 'react';

/**
 * Custom hook to trigger subtle fade-in animations on mount or scroll.
 */
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add('reveal-init');
    const timer = setTimeout(() => {
      el.classList.add('reveal-active');
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return ref;
}
