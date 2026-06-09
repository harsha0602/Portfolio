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

const Hero: React.FC<Props> = ({ name, headline: _headline, location, links, about }) => {
  return (
    <section id="hero" className="section hero" aria-labelledby="hero-title">
      <div className="container">
        {/* Replace hero/about content per request. */}
        <h1 id="hero-title" className="hero-title">
          {/* Assumption: Use `name` dynamically and highlight it for quick scannability. */}
          Hi, my name is <span className="name-highlight">{name}</span>. {about?.intro || 'I engineer systems that bring hardware to life and teach machines to think.'}
        </h1>
        <p className="hero-meta" aria-label="Location">{location} • MS Software Engineering @ ASU</p>
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
              <span className="bubble-text">developing <a href="https://pretorin.com" target="_blank" rel="noopener noreferrer" className="tappedin-link">Pretorin</a></span>
            </div>
          </div>
          <div className="about-content">
            {/* About block (revamped) */}
            <section aria-labelledby="about-title" className="about-block">
              <h2 id="about-title" className="section-title">About Me</h2>
              {about?.paragraphs && about.paragraphs.length > 0 ? (
                about.paragraphs.map((p, i) => (
                  <p key={i} className="about-text">{p}</p>
                ))
              ) : (
                <>
                  {/* Fallback text if about is not provided in data/profile.json */}
                  <p className="about-text">
                    I am a software engineer and master’s student in Software Engineering at Arizona State University with 3+ years of industry experience across startups and large-scale organizations, including Amazon Web Services. I have built and operated production systems spanning distributed backend services, large-scale data pipelines, cloud infrastructure, and applied machine learning, with work adopted by multiple teams and used in real-world workflows.
                  </p>
                  <p className="about-text">
                    I specialize in taking ambiguous problems to shipped solutions. As both an engineer and a founder/CTO, I have owned systems end-to-end -- from design and implementation to deployment, monitoring, and iteration with users. I thrive in forward-deployed environments that require deep technical judgment, fast iteration, and close collaboration with product, customers, and stakeholders to deliver measurable impact.
                  </p>
                  <p className="about-text">
                    My focus: designing efficient, reliable systems that think, learn, and scale. My drive: solving complex problems, debugging relentlessly, and delivering impact.
                  </p>
                </>
              )}
              {/* Tags replicated using TechChip style */}
              <div className="badges" aria-label="About tags">
                {(about?.tags && about.tags.length ? about.tags : [
                  'Full‑Stack Development',
                  'Cloud Computing',
                  'Machine Learning & AI',
                  'Logic Programming',
                  'DSA'
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
