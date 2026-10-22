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
        <p className="section-intro">Things I have built, from class projects to apps.</p>
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
                  {p.overview && <p className="card-overview-text">{p.overview}</p>}
                </header>
              </div>
            );
            const back = (
              <div className="project-back">
                <header className="card-header">
                  <h3 className="card-title">{p.name}</h3>
                </header>
                <p className="summary-par">{p.summary}</p>
                <ul className="highlights">
                  {p.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <p className="tech-line">Built with: {p.tech.join(', ')}</p>
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
  if (n.includes('clozyt') || (n.includes('swipe') && n.includes('shop'))) return { src: new URL('../../assets/images/Swipe to shop.png', import.meta.url).href, alt: 'Swipe-to-Shop Fashion PWA' };
  if (n.includes('fluidfill')) return { src: new URL('../../assets/images/fluidfill_cover.png', import.meta.url).href, alt: 'FluidFill document forms' };
  if (n.includes('realtime') && n.includes('study')) return { src: new URL('../../assets/images/Realtime_study.png', import.meta.url).href, alt: 'Realtime Study Rooms' };
  if (n.includes('fluxrate') || (n.includes('adaptive') && n.includes('pricing'))) return { src: new URL('../../assets/images/FluxRate.png', import.meta.url).href, alt: 'FluxRate parking simulation' };
  // Generic fallback
  return { src: new URL('../../assets/images/replace-me.svg', import.meta.url).href, alt: `${name} illustration placeholder` };
}

export default Projects;
