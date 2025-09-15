import React, { useState, useCallback, useEffect, useRef } from 'react';

type Props = {
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  ariaLabel?: string;
};

// Accessible flippable card with three interactions:
// - Hover (desktop): flips while hovering, reverts on leave
// - Click/Enter/Space: toggles a "locked" state; on mobile, tap toggles flip directly
// - Mobile (coarse pointer): auto-flips on downward scroll when 100% visible; does not auto-flip on upward scroll
//   When a new card auto-flips while scrolling down, the previous auto-flipped card flips back (unless locked)
const FlippableCard: React.FC<Props> = ({ className = '', front, back, ariaLabel }) => {
  const ref = useRef<HTMLElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Unique id per card for coordination
  const idRef = useRef<number>(0);
  const autoFlippedRef = useRef(false);
  const isMobileRef = useRef(false);
  const lockedRef = useRef(false);
  const hoveringRef = useRef(false);

  // Global scroll direction tracker (module-local)
  // We intentionally guard initialization to one-time per page load.
  const SCROLL_EVENT = 'autoFlipScrollInit';
  const AUTO_FLIP_EVENT = 'autoFlipCard';
  // Use module-level flags via window to avoid duplicate listeners across instances
  useEffect(() => {
    // Assign a unique incremental id
    if (!idRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.__flipCardNextId = (window.__flipCardNextId || 0) + 1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      idRef.current = window.__flipCardNextId;
    }

    let lastY = window.scrollY;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!window.__flipScrollInited) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.__flipScrollInited = true;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.__flipScrollDir = 'down';
      window.addEventListener(
        'scroll',
        () => {
          const y = window.scrollY;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.__flipScrollDir = y > lastY ? 'down' : 'up';
          lastY = y;
        },
        { passive: true }
      );
      window.dispatchEvent(new Event(SCROLL_EVENT));
    }
  }, []);

  // Determine mobile/coarse pointer
  useEffect(() => {
    const update = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 720);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Keep refs in sync for use inside passive listeners/observers
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);
  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { hoveringRef.current = hovering; }, [hovering]);

  // Observe viewport visibility for mobile flip-on-scroll (direction-aware, 100% threshold)
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 1;
        setInView(visible);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const dir = (window.__flipScrollDir as 'down' | 'up') || 'down';
        if (!isMobileRef.current || lockedRef.current) return;
        if (visible && dir === 'down') {
          // Auto-flip this card and notify others to unflip
          setFlipped(true);
          autoFlippedRef.current = true;
          window.dispatchEvent(new CustomEvent(AUTO_FLIP_EVENT, { detail: { id: idRef.current } }));
        }
        // Do not auto-flip on upward scroll; also do not auto-unflip on leave.
      },
      { threshold: [0, 1] }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Listen for auto-flip broadcasts to unflip previous auto-flipped cards
  useEffect(() => {
    const handler = (e: Event) => {
      const anyEvent = e as CustomEvent<{ id: number }>;
      const incomingId = anyEvent?.detail?.id;
      if (incomingId == null) return;
      if (incomingId !== idRef.current && autoFlippedRef.current && !lockedRef.current) {
        setFlipped(false);
        autoFlippedRef.current = false;
      }
    };
    window.addEventListener(AUTO_FLIP_EVENT, handler as EventListener);
    return () => window.removeEventListener(AUTO_FLIP_EVENT, handler as EventListener);
  }, []);

  // Compute flipped state based on interaction mode (desktop hover, mobile lock)
  useEffect(() => {
    if (!isMobile) {
      // Desktop: hover or locked keeps flipped
      setFlipped(locked || hovering);
    } else {
      // Mobile: locked enforces flipped; otherwise Observer/event logic controls state
      if (locked) setFlipped(true);
    }
  }, [locked, isMobile, hovering]);

  const toggleLock = useCallback(() => {
    setLocked((prev) => {
      const next = !prev;
      if (isMobileRef.current) {
        // On mobile, tapping should directly toggle the flipped state
        setFlipped(next);
        if (!next) autoFlippedRef.current = false; // now user-controlled off
      }
      return next;
    });
  }, []);
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLock();
    }
  }, [toggleLock]);

  return (
    <article
      ref={ref as any}
      className={`card flip-card ${className}`.trim()}
      data-flipped={flipped || undefined}
      role="button"
      tabIndex={0}
      aria-pressed={locked}
      aria-label={ariaLabel || 'Flip card to see details'}
      onClick={toggleLock}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flip-inner" aria-hidden={false}>
        <div className="flip-face flip-front">{front}</div>
        <div className="flip-face flip-back">{back}</div>
      </div>
    </article>
  );
};

export default FlippableCard;
