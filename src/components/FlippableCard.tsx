import React, { useId, useState } from 'react';
import { ArrowUpRight, ChevronUp } from 'lucide-react';

type Props = {
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  ariaLabel?: string;
};

// Explicit disclosure keeps details accessible on touch screens and keyboards.
// Cards grow with their content, without hover or scroll changing what is shown.
const FlippableCard: React.FC<Props> = ({ className = '', front, back, ariaLabel }) => {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const title = ariaLabel?.replace(/^Flip /, '').replace(/ card$/, '') || 'card';

  return (
    <article className={`card flip-card ${className}`.trim()}>
      <div className="card-overview">{front}</div>
      <div id={detailsId} className="card-details" hidden={!expanded}>
        {back}
      </div>
      <button
        type="button"
        className="card-toggle"
        aria-expanded={expanded}
        aria-controls={detailsId}
        aria-label={`${expanded ? 'Hide' : 'Read'} details for ${title}`}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Hide details' : 'Read details'}
        {expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}
      </button>
    </article>
  );
};

export default FlippableCard;
