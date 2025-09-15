import React, { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Education from './components/Education';
import Skills from './components/Skills';
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
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'light');
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
          <ul className="nav-list">
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#achievements">Achievements</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#skills">Skills</a></li>
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

      <footer className="site-footer" role="contentinfo">
        <p>
          © {new Date().getFullYear()} {data.name}. Built with React & Vite.
        </p>
      </footer>
    </div>
  );
};

export default App;
