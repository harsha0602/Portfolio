import React from 'react';
import type { EducationItem } from '../App';
import { GraduationCap } from 'lucide-react';

// Format YYYY-MM in UTC to avoid timezone month rollbacks.
const fmt = (iso: string) => {
  const [y, m] = iso.split('-').map(Number);
  if (!y || !m) return iso;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const Education: React.FC<{ items: EducationItem[] }> = ({ items }) => (
  <section id="education" className="section" aria-labelledby="education-title">
    <div className="container">
      <h2 id="education-title" className="section-title"><GraduationCap size={18}/> Education</h2>
      <div className="grid">
        {items.map((e) => (
          <article key={`${e.school}-${e.degree}`} className="card">
            <header className="card-header">
              <h3 className="card-title">{e.school}</h3>
              <p className="card-subtitle">{e.degree}</p>
              <p className="card-meta">{fmt(e.start)} – {fmt(e.end)}</p>
            </header>
            <p>{e.details}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Education;
