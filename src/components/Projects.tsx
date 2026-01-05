import React from 'react';
import type { ProjectItem } from '../App';
import { TechChip } from './Chips';
import { Brain } from 'lucide-react';
import FlippableCard from './FlippableCard';
// Assumptions: map project names to images available in /assets. Fallback to placeholder.
// - sentichat.png -> Senti Chat
// - notes.png -> Crypto Notes DApp
// - tasks.png -> Agile Project Management App
// - remove_neuron.png -> Image Restoration (ML)
// - WCGA.png -> WhatsApp Group Chat Analysis
// - project.png -> generic for data/ML when no specific image
// - Swipe to shop.png -> Swipe-to-Shop Fashion PWA

const Projects: React.FC<{ items: ProjectItem[] }> = ({ items }) => {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <h2 id="projects-title" className="section-title"><Brain size={18}/> Projects</h2>
        <p className="section-intro">Selected builds with measurable impact.</p>
        <div className="grid">
          {items.map((p) => {
            const img = projectImage(p.name);
            const front = (
              <div className="project-front">
                {img ? (
                  <div className="project-cover">
                    <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
                    <div className="project-overlay">
                      <div className="badges">
                        {p.tech.slice(0,4).map((t) => (
                          <TechChip key={t}>{t}</TechChip>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="image-placeholder" aria-hidden="true" />
                )}
                <header className="card-header">
                  <h3 className="card-title">{p.name}</h3>
                  {p.date && <p className="card-meta">{p.date}</p>}
                </header>
              </div>
            );
            const back = (
              <div className="project-back">
                <header className="card-header">
                  <h3 className="card-title">{p.name}</h3>
                </header>
                {/* Detailed description with emphasized metrics and tech; plus explicit tech stack line */}
                <div>
                  {renderSummaryWithEmphasis(p.summary, p.tech)}
                </div>
                {/* Highlights removed to avoid duplication with narrative. */}
                <footer className="card-actions">
                  {p.links.demo && (
                    <a className="btn btn-tertiary" href={p.links.demo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} demo`}>
                      Open demo
                    </a>
                  )}
                  {p.links.repo && (
                    <a className="btn" href={p.links.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} repository`}>
                      View code
                    </a>
                  )}
                </footer>
              </div>
            );
            return (
              <FlippableCard
                key={p.name}
                className="flip-card--project"
                front={front}
                back={back}
                ariaLabel={`Flip ${p.name} card`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

function projectImage(name: string): { src: string; alt: string } | null {
  const n = name.toLowerCase();
  // Use Vite asset URLs so dev and prod (with base) work consistently
  if (n.includes('market') && n.includes('risk')) return { src: new URL('../../assets/images/Market Risk Forecasting Dashboard.png', import.meta.url).href, alt: 'Market Risk Forecasting Dashboard' };
  if (n.includes('whatsapp') && n.includes('chat')) return { src: new URL('../../assets/images/WhatsApp Group Chat Analysis.png', import.meta.url).href, alt: 'WhatsApp Group Chat Analysis' };
  if (n.includes('clustering') && n.includes('script')) return { src: new URL('../../assets/images/Image Clustering for Script Digitalization.png', import.meta.url).href, alt: 'Image Clustering for Script Digitalization' };
  if (n.includes('restoration')) return { src: new URL('../../assets/images/Image Restoration of Natural Images.png', import.meta.url).href, alt: 'Image Restoration of Natural Images' };
  if (n.includes('senti') && n.includes('chat')) return { src: new URL('../../assets/sentichat.png', import.meta.url).href, alt: 'Senti Chat' };
  if (n.includes('crypto') && n.includes('notes')) return { src: new URL('../../assets/images/Crypto Notes DApp.png', import.meta.url).href, alt: 'Crypto Notes DApp' };
  if (n.includes('safe') && n.includes('python')) return { src: new URL('../../assets/images/Safe Python Execution Service.png', import.meta.url).href, alt: 'Safe Python Execution Service' };
  if (n.includes('haas')) return { src: new URL('../../assets/images/HAAS (Heuristic Algorithmic Analysis System).png', import.meta.url).href, alt: 'HAAS (Heuristic Algorithmic Analysis System)' };
  if (n.includes('pokemon')) return { src: new URL('../../assets/images/Pokemon Game Engine.png', import.meta.url).href, alt: 'Pokémon Game Engine' };
  if (n.includes('agile') && n.includes('project')) return { src: new URL('../../assets/images/Agile Project Management App (kanban concept.png', import.meta.url).href, alt: 'Agile Project Management App' };
  if (n.includes('swipe') && n.includes('shop')) return { src: new URL('../../assets/images/Swipe to shop.png', import.meta.url).href, alt: 'Swipe-to-Shop Fashion PWA' };
  if (n.includes('fluidfill')) return { src: new URL('../../assets/images/fluidfill_cover.png', import.meta.url).href, alt: 'FluidFill — AI Document Automation' };
  if (n.includes('realtime') && n.includes('study')) return { src: new URL('../../assets/images/REaltime_study.png', import.meta.url).href, alt: 'Realtime Study Rooms' };
  if (n.includes('fluxrate') || (n.includes('adaptive') && n.includes('pricing'))) return { src: new URL('../../assets/images/FluxRate.png', import.meta.url).href, alt: 'FluxRate Adaptive Pricing Engine' };
  // Generic fallback
  return { src: new URL('../../assets/images/replace-me.svg', import.meta.url).href, alt: `${name} illustration placeholder` };
}

// Reuse emphasis helper similar to Experience to bold metrics and tech terms
function renderSummaryWithEmphasis(text: string, tech: string[]) {
  const paras = text.split(/\n\s*\n/);
  const items = paras.map((par, i) => (
    <p key={i} className="summary-par" dangerouslySetInnerHTML={{ __html: emphasize(par.trim(), tech) }} />
  ));
  const techLine = (
    <p key="tech" className="summary-par tech-line"><strong>Tech stack:</strong> {tech.join(' · ')}</p>
  );
  return [ ...items, techLine ];
}

function emphasize(s: string, tech: string[]) {
  let out = escapeHtml(s);
  out = out.replace(/(~?\d+(?:\.\d+)?\s?(?:%|dB|ms|GB|TB))|(\b\d+\+\b)/gi, '<strong>$&</strong>');
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

export default Projects;
