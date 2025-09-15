import React from 'react';
import type { AchievementItem } from '../App';
import { DateChip } from './Chips';
import { Award } from 'lucide-react';

const fmt = (iso: string) => {
  const [y, m] = iso.split('-').map(Number);
  if (!y || !m) return iso;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const Achievements: React.FC<{ items: AchievementItem[] }> = ({ items }) => (
  <section id="achievements" className="section" aria-labelledby="achievements-title">
    <div className="container">
      <h2 id="achievements-title" className="section-title"><Award size={18}/> Achievements</h2>
      <p className="section-intro">A few highlights along the way.</p>
      <div className="grid">
        {items.map((a) => (
          <article key={`${a.title}-${a.date}`} className="card">
            <header className="card-header">
              <h3 className="card-title">{a.title} <DateChip>{a.date || ''}</DateChip></h3>
              <p className="card-subtitle">{a.issuer}</p>
            </header>
            <p>{a.summary}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Achievements;
