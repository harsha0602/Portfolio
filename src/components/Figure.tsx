import React from 'react';

type Props = { src: string; alt: string; caption?: string };

const Figure: React.FC<Props> = ({ src, alt, caption }) => (
  <figure>
    <img src={src} alt={alt} loading="lazy" decoding="async" />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

export default Figure;

