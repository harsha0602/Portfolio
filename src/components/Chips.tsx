import React from 'react';

export const ImpactChip: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="chip chip--impact">{children}</span>
);

export const TechChip: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="badge">{children}</span>
);

export const DateChip: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="chip chip--date">{children}</span>
);

