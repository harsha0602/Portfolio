import React, { useEffect, useMemo, useRef, useState } from 'react';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Education from './components/Education';
import Skills from './components/Skills';
import { Briefcase, Brain, Award, GraduationCap, Instagram, Twitter, Phone, Mail, MessageCircle, MessageSquare, Menu } from 'lucide-react';
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
  date?: string; // Optional project date or timeframe
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
  const sortedProjects = useMemo(() => {
    const monthMap: Record<string, number> = {
      jan: 1, january: 1,
      feb: 2, february: 2,
      mar: 3, march: 3,
      apr: 4, april: 4,
      may: 5,
      jun: 6, june: 6,
      jul: 7, july: 7,
      aug: 8, august: 8,
      sep: 9, sept: 9, september: 9,
      oct: 10, october: 10,
      nov: 11, november: 11,
      dec: 12, december: 12,
    };
    const toNum = (s?: string) => {
      if (!s) return 0;
      const rx = /(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t)?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})/gi;
      let m: RegExpExecArray | null;
      let best = 0;
      while ((m = rx.exec(s))) {
        const mon = monthMap[m[1].toLowerCase()];
        const yr = Number(m[2]);
        if (mon && yr) {
          const val = yr * 100 + mon;
          if (val > best) best = val;
        }
      }
      // If no month-year found, try plain YYYY
      if (!best) {
        const yr = Number((s.match(/\b(20\d{2})\b/) || [])[1]);
        if (yr) best = yr * 100 + 1;
      }
      return best;
    };
    return [...data.projects].sort((a, b) => toNum(b.date) - toNum(a.date));
  }, [data.projects]);

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
  }, [data.links.email, data.links.github, data.links.linkedin, data.name]);

  return (
    <div>
      <a className="skip-link" href="#experience">Skip to content</a>
      <header className="site-header" role="banner">
        <nav className="site-nav" aria-label="Primary">
          <a className="brand" href="#hero">{data.name}</a>
          <div className="spacer" />
          {/* Collapsed navigation for very small screens */}
          <MobileMenu />
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
        <Projects items={sortedProjects} />
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

// MobileMenu: single dropdown trigger for very small screens
const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: any) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as any)) setOpen(false);
    };
    const onKey = (e: any) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="mobile-menu" ref={ref}>
      <button
        className="menu-button"
        aria-label="Open navigation menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Menu size={18} />
      </button>
      {open && (
        <ul className="menu-dropdown" role="menu" aria-label="Sections">
          <li role="none"><a role="menuitem" href="#experience" onClick={() => setOpen(false)}>Experience</a></li>
          <li role="none"><a role="menuitem" href="#projects" onClick={() => setOpen(false)}>Projects</a></li>
          <li role="none"><a role="menuitem" href="#education" onClick={() => setOpen(false)}>Education</a></li>
          <li role="none"><a role="menuitem" href="#achievements" onClick={() => setOpen(false)}>Achievements</a></li>
          <li role="none"><a role="menuitem" href="#skills" onClick={() => setOpen(false)}>Skills</a></li>
          <li role="none"><a role="menuitem" href="#contact" onClick={() => setOpen(false)}>Contact</a></li>
        </ul>
      )}
    </div>
  );
};
