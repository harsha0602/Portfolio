import React from 'react';
import type { AchievementItem } from '../App';
import { DateChip } from './Chips';
import { Award } from 'lucide-react';

const Achievements: React.FC<{ items: AchievementItem[] }> = ({ items }) => (
  <section id="achievements" className="section" aria-labelledby="achievements-title">
    <div className="container">
      <h2 id="achievements-title" className="section-title"><Award size={18}/> Achievements &amp; Milestones</h2>
      <p className="section-intro">Products shipped, team wins, and recognition.</p>
      <div className="grid">
        {items.map((a) => (
          <article key={`${a.title}-${a.date}`} className="card">
            <header className="card-header">
              <h3 className="card-title">{a.title} {a.date && <DateChip>{a.date}</DateChip>}</h3>
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
