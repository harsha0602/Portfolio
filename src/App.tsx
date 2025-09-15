import React, { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Education from './components/Education';
import Skills from './components/Skills';
import { Briefcase, Brain, Award, GraduationCap, Instagram, Twitter, Phone, Mail, MessageCircle, MessageSquare } from 'lucide-react';
import profile from '../data/profile.json';

export type LinkMap = { email: string; github: string; linkedin: string };
export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  start: string; // ISO YYYY-MM
  end: string; // ISO YYYY-MM or "Present"
  highlights: string[];
  tech: string[];
};
export type ProjectItem = {
  name: string;
  summary: string;
  tech: string[];
  highlights: string[];
  links: { repo?: string; demo?: string };
};
export type AchievementItem = {
  title: string;
  issuer: string;
  date: string; // ISO YYYY-MM
  summary: string;
};
export type EducationItem = {
  school: string;
  degree: string;
  start: string; // ISO YYYY-MM
  end: string; // ISO YYYY-MM
  details: string;
};
export type Profile = {
  name: string;
  headline: string;
  location: string;
  links: LinkMap;
  about?: { intro: string; paragraphs: string[]; tags: string[] };
  skills: { Languages: string[]; 'Frameworks/Tools': string[]; 'Cloud/Databases': string[] };
  experience: ExperienceItem[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  education: EducationItem[];
};

function useTheme() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  return { theme, setTheme } as const;
}

const App: React.FC = () => {
  const data = profile as Profile;
  const { theme, setTheme } = useTheme();
  const sortedExp = useMemo(() => {
    // Sort newest first by start date
    const toNum = (d: string) => (d === 'Present' ? 999999 : Number(d.replace('-', '')));
    return [...data.experience].sort((a, b) => toNum(b.start) - toNum(a.start));
  }, [data.experience]);

  useEffect(() => {
    // Inject structured data for Person and Projects
    const ld = document.getElementById('ld-placeholder');
    const sameAs = [data.links.github && `https://github.com/${data.links.github.split('/').pop()}`,
      data.links.linkedin && data.links.linkedin.startsWith('http') ? data.links.linkedin : `https://www.linkedin.com/in/${data.links.linkedin}`].filter(Boolean);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      email: `mailto:${data.links.email}`,
      url: window.location.origin,
      sameAs,
      jobTitle: 'Software Engineer',
    };
    if (ld) ld.textContent = JSON.stringify(jsonLd);
  }, []);

  return (
    <div>
      <a className="skip-link" href="#experience">Skip to content</a>
      <header className="site-header" role="banner">
        <nav className="site-nav" aria-label="Primary">
          <a className="brand" href="#hero">{data.name}</a>
          <div className="spacer" />
          {/* Icon-only quick nav for mobile */}
          <ul className="nav-icons" aria-label="Quick navigation">
            <li>
              <a href="#experience" aria-label="Experience" title="Experience" className="nav-icon">
                <Briefcase size={20} />
              </a>
            </li>
            <li>
              <a href="#projects" aria-label="Projects" title="Projects" className="nav-icon">
                <Brain size={20} />
              </a>
            </li>
            <li>
              <a href="#education" aria-label="Education" title="Education" className="nav-icon">
                <GraduationCap size={20} />
              </a>
            </li>
            <li>
              <a href="#achievements" aria-label="Achievements" title="Achievements" className="nav-icon">
                <Award size={20} />
              </a>
            </li>
            <li>
              <a href="#contact" aria-label="Contact" title="Contact" className="nav-icon">
                <Mail size={20} />
              </a>
            </li>
          </ul>
          <ul className="nav-list">
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#achievements">Achievements</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button className="theme-toggle" aria-label="Toggle dark mode" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>

      <main id="main" role="main">
        <Hero
          name={data.name}
          headline={data.headline}
          location={data.location}
          links={data.links}
          about={data.about}
        />
        <Experience items={sortedExp} />
        <Projects items={data.projects} />
        <Achievements items={data.achievements} />
        <Education items={data.education} />
        <Skills skills={data.skills} />
      </main>

      <footer id="contact" className="site-footer" role="contentinfo">
        <div className="container">
          <h3 className="contact-title">Contact Me</h3>
          <ul className="contact-links" aria-label="Contact methods">
            <li>
              <a className="contact-link" href="https://www.instagram.com/harshavardhankuthadi/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} /> <span>@harshavardhankuthadi</span>
              </a>
            </li>
            <li>
              <a className="contact-link" href="https://x.com/HVKuthadi?t=Jrs9RHi-i4JFqHLgIFU1jw&s=09" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <Twitter size={18} /> <span>@HVKuthadi</span>
              </a>
            </li>
            <li>
              <a className="contact-link" href="https://wa.me/919902831555" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageSquare size={18} /> <span>WhatsApp</span>
              </a>
            </li>
            <li>
              <a className="contact-link" href="tel:+16027414354" aria-label="Call">
                <Phone size={18} /> <span>+1 602 741-4354</span>
              </a>
            </li>
            <li>
              <a className="contact-link" href="sms:+16027414354" aria-label="Text message">
                <MessageCircle size={18} /> <span>Text me</span>
              </a>
            </li>
            <li>
              <a className="contact-link" href="mailto:harshavardhankuthadi2@gmail.com" aria-label="Email">
                <Mail size={18} /> <span>harshavardhankuthadi2@gmail.com</span>
              </a>
            </li>
          </ul>
          <p className="footer-note">© {new Date().getFullYear()} {data.name}. Built with React & Vite.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
