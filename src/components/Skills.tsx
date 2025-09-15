import React from 'react';
import { Wrench } from 'lucide-react';

type Props = {
  skills: {
    Languages: string[];
    'Frameworks/Tools': string[];
    'Cloud/Databases': string[];
  };
};

const Skills: React.FC<Props> = ({ skills }) => {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <h2 id="skills-title" className="section-title"><Wrench size={18}/> Skills</h2>
        <p className="section-intro">Tools I use often.</p>
        <div className="skills-grid">
          {Object.entries(skills).map(([group, list]) => (
            <div className="skills-card" key={group}>
              <h3 className="skills-title">{group}</h3>
              <div className="badges">
                {list.map((s) => (
                  <span key={s} className="badge">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
