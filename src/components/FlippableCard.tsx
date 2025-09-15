import React, { useState, useCallback, useEffect, useRef } from 'react';

type Props = {
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  ariaLabel?: string;
};

// Accessible flippable card with three interactions:
// - Hover: flips while hovering, reverts on leave
// - Click/Enter/Space: toggles a "locked" state that keeps the card flipped until clicked again
// - Mobile (coarse pointer): flips while in viewport using IntersectionObserver (unless locked)
const FlippableCard: React.FC<Props> = ({ className = '', front, back, ariaLabel }) => {
  const ref = useRef<HTMLElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine mobile/coarse pointer
  useEffect(() => {
    const update = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 720);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Observe viewport visibility for mobile flip-on-scroll
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Compute flipped state based on interaction mode
  useEffect(() => {
    if (locked) {
      setFlipped(true);
    } else if (isMobile) {
      setFlipped(inView);
    } else {
      setFlipped(hovering);
    }
  }, [locked, isMobile, inView, hovering]);

  const toggleLock = useCallback(() => setLocked((v) => !v), []);
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
