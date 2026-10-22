import React from 'react';
import type { LinkMap } from '../App';
import { FileDown, Mail, Github, Linkedin } from 'lucide-react';

type Props = {
  name: string;
  headline: string;
  location: string;
  links: LinkMap;
  about?: { intro: string; paragraphs: string[]; tags: string[] };
};

const Hero: React.FC<Props> = ({ name, headline, location, links, about }) => {
  return (
    <section id="hero" className="section hero" aria-labelledby="hero-title">
      <div className="container">
        <p className="hero-eyebrow">Product engineer &amp; technical co-founder</p>
        <h1 id="hero-title" className="hero-title">
          <span className="name-highlight">{name}</span>
        </h1>
        <p className="hero-subtitle">{about?.intro || headline}</p>
        <p className="hero-meta" aria-label="Location">{location} · M.S. Software Engineering, ASU</p>
        <div className="hero-cta">
          <a className="btn" href={new URL('../../assets/CV.pdf', import.meta.url).href} download aria-label="Download CV"><FileDown size={16} /> Download CV</a>
          <a className="btn btn-secondary" href={`mailto:${links.email}`} aria-label="Email Harshavardhan"><Mail size={16} /> Email</a>
          <a className="btn btn-tertiary" href={links.github.startsWith('http') ? links.github : `https://github.com/${links.github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github size={16} /> GitHub</a>
          <a className="btn btn-tertiary" href={links.linkedin.startsWith('http') ? links.linkedin : `https://www.linkedin.com/in/${links.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><Linkedin size={16} /> LinkedIn</a>
        </div>
        <div className="about-layout">
          <div className="about-media">
            {/* Use the provided profile.JPG near the About section */}
            <img
              src={new URL('../../assets/profile.JPG', import.meta.url).href}
              alt="Profile photo of Harshavardhan Kuthadi"
              className="about-photo"
              loading="lazy"
              decoding="async"
            />
            <div className="developing-bubble">
              <span className="bubble-dot"></span>
              <span className="bubble-text">Building at <a href="https://pretorin.com" target="_blank" rel="noopener noreferrer" className="tappedin-link">Pretorin</a></span>
            </div>
          </div>
          <div className="about-content">
            {/* About block (revamped) */}
            <section aria-labelledby="about-title" className="about-block">
              <h2 id="about-title" className="section-title">About Me</h2>
              {(about?.paragraphs || [headline]).map((paragraph, i) => (
                <p key={i} className="about-text">{paragraph}</p>
              ))}
              {/* Tags replicated using TechChip style */}
              <div className="badges" aria-label="About tags">
                {(about?.tags && about.tags.length ? about.tags : [
                  'Web development',
                  'Cloud Computing',
                  'Machine learning',
                  'APIs & integrations',
                  'Data pipelines'
                ]).map((t) => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
