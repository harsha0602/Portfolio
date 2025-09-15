// Simple content validation for data/profile.json
// - Required fields exist
// - Dates sort correctly (experience newest first by start)
import fs from 'node:fs';
import path from 'node:path';

const p = path.resolve('data/profile.json');
const raw = fs.readFileSync(p, 'utf8');
const data = JSON.parse(raw);

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

// Required top-level fields
for (const key of ['name', 'headline', 'location', 'links', 'skills', 'experience', 'projects', 'achievements', 'education']) {
  assert(key in data, `Missing field: ${key}`);
}

// Links
assert(typeof data.links.email === 'string', 'links.email required');
assert(data.links.github, 'links.github required');
assert(data.links.linkedin, 'links.linkedin required');

// Experience fields
assert(Array.isArray(data.experience) && data.experience.length > 0, 'experience array required');
data.experience.forEach((e, i) => {
  for (const k of ['company', 'role', 'location', 'start', 'end', 'highlights', 'tech']) {
    assert(k in e, `experience[${i}].${k} required`);
  }
  assert(Array.isArray(e.highlights) && e.highlights.length > 0, `experience[${i}] highlights empty`);
  assert(Array.isArray(e.tech), `experience[${i}] tech must be array`);
});

// Experience date ordering (newest first)
const toNum = (d) => (d === 'Present' ? 999999 : Number(String(d).replace('-', '')));
const sorted = [...data.experience].sort((a, b) => toNum(b.start) - toNum(a.start));
assert(
  sorted.every((e, i) => e === data.experience[i]),
  'experience not sorted newest-first by start date'
);

// Projects
assert(Array.isArray(data.projects) && data.projects.length > 0, 'projects array required');
data.projects.forEach((p, i) => {
  for (const k of ['name', 'summary', 'tech', 'highlights', 'links']) {
    assert(k in p, `projects[${i}].${k} required`);
  }
});

// Achievements: date optional; if present, must be YYYY-MM.
data.achievements.forEach((a, i) => {
  if (a.date != null && a.date !== '') {
    assert(/^[0-9]{4}-[0-9]{2}$/.test(a.date), `achievements[${i}].date must be YYYY-MM when provided`);
  }
});

// Education dates
data.education.forEach((e, i) => {
  for (const k of ['school', 'degree', 'start', 'end', 'details']) {
    assert(k in e, `education[${i}].${k} required`);
  }
  assert(/^[0-9]{4}-[0-9]{2}$/.test(e.start) && /^[0-9]{4}-[0-9]{2}$/.test(e.end), `education[${i}] dates must be YYYY-MM`);
});

console.log('OK: data/profile.json valid');
