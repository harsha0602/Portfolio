import React from 'react';
import type { ExperienceItem } from '../App';
import { TechChip } from './Chips';
import FlippableCard from './FlippableCard';
import { Briefcase, Cloud, Bot, Building2, Server, Music, ExternalLink } from 'lucide-react';

// Robust YYYY-MM formatter that avoids timezone shifts (e.g., '05' showing as April).
// We parse year/month and format in UTC so local offsets can't roll back the month.
const formatDate = (iso: string) => {
  if (iso === 'Present') return 'Present';
  const [y, m] = iso.split('-').map(Number);
  if (!y || !m) return iso;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

// Extend item shape at runtime: optional summary string wired from JSON if present.
type ItemWithSummary = ExperienceItem & { summary?: string };

const Experience: React.FC<{ items: ItemWithSummary[] }> = ({ items }) => {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <h2 id="experience-title" className="section-title"><Briefcase size={18}/> Experience</h2>
        <p className="section-intro">What I built, shipped, and improved.</p>
        <div className="grid">
          {items.map((exp) => {
            const img = logoPath(exp.company.toLowerCase());
            const front = img ? (
              <div className="experience-front">
                <div className="experience-cover">
                  <img src={img} alt={`${exp.company} cover`} loading="lazy" decoding="async" />
                  <div className="experience-overlay">
                    <div className="badges" aria-label="Tech stack">
                      {exp.tech.slice(0,4).map((t) => (
                        <TechChip key={t}>{t}</TechChip>
                      ))}
                    </div>
                  </div>
                </div>
                <header className="card-header">
                  <h3 className="card-title">{exp.company}</h3>
                  <p className="card-subtitle">{exp.role}</p>
                  <p className="card-subtitle card-location">{exp.location}</p>
                  <p className="card-meta">{formatDate(exp.start)} – {formatDate(exp.end)}</p>
                </header>
              </div>
            ) : (
              <div>
                <header className="card-header">
                  <h3 className="card-title">
                    <span aria-hidden="true" style={{marginRight: '.35rem', verticalAlign: 'middle'}}>{companyIcon(exp.company)}</span>
                    {exp.company}
                  </h3>
                  <p className="card-subtitle">{exp.role}</p>
                  <p className="card-subtitle card-location">{exp.location}</p>
                  <p className="card-meta">{formatDate(exp.start)} – {formatDate(exp.end)}</p>
                  <div className="badges" aria-label="Tech stack">
                    {exp.tech.map((t) => (
                      <TechChip key={t}>{t}</TechChip>
                    ))}
                  </div>
                </header>
              </div>
            );
            const back = (
              <div>
                {exp.summary && renderSummaryWithEmphasis(exp.summary, exp.tech)}
                <div className="stat-badges" aria-label="Stats">
                  {companyBadges(exp.company).map((b, i) => (
                    <span key={i} className="stat-badge"><strong>{b.label}:</strong> {b.value}</span>
                  ))}
                </div>
                {companyLink(exp.company) && (
                  <div className="card-actions">
                    <a href={companyLink(exp.company)!} target="_blank" rel="noopener noreferrer" className="btn" style={{background: '#20C997', color: '#000'}} onClick={(e) => e.stopPropagation()}>
                      Visit Site <ExternalLink size={14} style={{marginLeft: '.3rem'}} />
                    </a>
                  </div>
                )}
              </div>
            );
            return (
              <FlippableCard
                key={`${exp.company}-${exp.role}-${exp.start}`}
                className="flip-card--experience"
                front={front}
                back={back}
                ariaLabel={`Flip ${exp.company} ${exp.role} card`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Very small heuristic to create impact chips from the sentence. Keeps WCAG contrast via CSS.
// Previously used to auto-extract impact chips; not needed now.

export default Experience;

// Map company names to lucide icons as lightweight "logos".
// Assumptions:
// - AWS: Cloud icon
// - Handshake AI Solutions: Bot icon to represent LLM/AI
// - o9 Solutions: Building2 icon as a corporate mark
// - OpenNets: Server icon to indicate networking/systems
function companyIcon(company: string) {
  const c = company.toLowerCase();
  // Prefer image logos if available in assets/images
  const logo = logoPath(c);
  if (logo) return <img src={logo} alt="" className="company-logo" loading="lazy" decoding="async" />;
  if (c.includes('amazon') || c.includes('aws')) return <Cloud size={18} aria-label="AWS" />;
  if (c.includes('handshake')) return <Bot size={18} aria-label="Handshake AI" />;
  if (c.includes('o9')) return <Building2 size={18} aria-label="o9 Solutions" />;
  if (c.includes('opennets')) return <Server size={18} aria-label="OpenNets" />;
  if (c.includes('tappedin') || c.includes('tapped')) return <Music size={18} aria-label="TappedIn" />;
  return <Briefcase size={18} aria-label="Company" />;
}

function logoPath(c: string): string | null {
  if (c.includes('tappedin') || c.includes('tapped')) return new URL('../../assets/images/tappedin_last_frame.png', import.meta.url).href;
  if (c.includes('amazon') || c.includes('aws')) return new URL('../../assets/images/AWSimage.webp', import.meta.url).href;
  if (c.includes('handshake')) return new URL('../../assets/images/HandshakeImage.webp', import.meta.url).href;
  // Corrected extension to .png (file on disk is O9image.png)
  if (c.includes('o9')) return new URL('../../assets/images/O9image.png', import.meta.url).href;
  if (c.includes('opennets')) return new URL('../../assets/images/opennetsImage.png', import.meta.url).href;
  return null;
}

// Render summary paragraphs from a single string allowing double newlines to break paragraphs
function renderSummaryWithEmphasis(text: string, tech: string[]) {
  const paras = text.split(/\n\s*\n/);
  const items = paras.map((par, i) => (
    <p key={i} className="summary-par" dangerouslySetInnerHTML={{ __html: emphasize(par.trim(), tech) }} />
  ));
  // Always include a tech stack line to surface all technologies used.
  const techLine = (
    <p key="tech" className="summary-par tech-line"><strong>Tech stack:</strong> {tech.join(' · ')}</p>
  );
  return [ ...items, techLine ];
}

function emphasize(s: string, tech: string[]) {
  let out = escapeHtml(s);
  // Bold numbers/metrics like 95%, 5.2 dB, 300ms, 10+, 250+
  out = out.replace(/(~?\d+(?:\.\d+)?\s?(?:%|dB|ms|GB|TB))|(\b\d+\+\b)/gi, '<strong>$&</strong>');
  // Bold tech tokens from the list
  for (const t of tech) {
    const rx = new RegExp(`\\b${escapeReg(t)}\\b`, 'gi');
    out = out.replace(rx, (m) => `<strong>${m}</strong>`);
  }
  return out;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function companyLink(company: string): string | null {
  const c = company.toLowerCase();
  if (c.includes('tappedin') || c.includes('tapped')) return 'https://tappedinapp.com/';
  return null;
}

function companyBadges(company: string): { label: string; value: string }[] {
  const c = company.toLowerCase();
  const arr: { label: string; value: string }[] = [];
  if (c.includes('o9')) {
    arr.push({ label: 'Bugs Fixed', value: '250+' });
    arr.push({ label: 'Code Commits', value: '600+' });
    arr.push({ label: 'Features', value: '10+' });
  }
  if (c.includes('opennets')) {
    arr.push({ label: 'Bugs Fixed', value: '100+' });
    arr.push({ label: 'Code Commits', value: '150+' });
    arr.push({ label: 'Features', value: '4' });
  }
  if (c.includes('amazon') || c.includes('aws')) {
    arr.push({ label: 'Code Commits', value: '50+' });
    arr.push({ label: 'Solution Architecture', value: 'Built from scratch' });
  }
  if (c.includes('tappedin') || c.includes('tapped')) {
    arr.push({ label: 'Test Cases', value: '~950' });
    arr.push({ label: 'Beta Users', value: '44' });
    arr.push({ label: 'Dev Time', value: '~5 weeks' });
  }
  return arr;
}
