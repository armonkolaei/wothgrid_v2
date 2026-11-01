import { Link } from 'react-router-dom';
import { HOME_FEATURES } from '../content/pages.js';

export function Placeholder({ label = 'Image placeholder', tall }) {
  return (
    <div className={`placeholder${tall ? ' tall' : ''}`} role="img" aria-label={label}>
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="4" y="8" width="40" height="32" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="20" r="4" fill="currentColor" />
        <path d="M6 36l12-12 8 8 6-6 10 10" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

function Eyebrow({ children }) {
  return children ? <p className="eyebrow">{children}</p> : null;
}

function Paragraphs({ items }) {
  return items?.map((p, i) => <p key={i}>{p}</p>) ?? null;
}

function Heading({ eyebrow, title, subtitle }) {
  return (
    <div className="block-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && <h2>{title}</h2>}
      {subtitle && <p className="lead">{subtitle}</p>}
    </div>
  );
}

const renderers = {
  hero: ({ eyebrow, quote, title, subtitle, cta }) => (
    <section className="page-hero">
      <div className="wrap">
        {quote && <p className="review"><span className="stars">★★★★★</span> “{quote}”</p>}
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
        {cta && <Link to={cta.to} className="btn-primary">{cta.label}</Link>}
      </div>
    </section>
  ),

  text: ({ eyebrow, title, body, quote }) => (
    <section className="block"><div className="wrap narrow">
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && <h2>{title}</h2>}
      {quote && <blockquote>{quote}</blockquote>}
      <Paragraphs items={body} />
    </div></section>
  ),

  split: ({ eyebrow, number, title, body, flip, link }) => (
    <section className="block"><div className={`wrap split${flip ? ' flip' : ''}`}>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{number && <span className="num">{number}</span>}{title}</h2>
        <Paragraphs items={body} />
        {link && <Link className="text-link" to={link.to}>{link.label} ›</Link>}
      </div>
      <Placeholder label={title} />
    </div></section>
  ),

  cards: ({ eyebrow, title, subtitle, items, cols = 3, icon }) => (
    <section className="block alt"><div className="wrap">
      <Heading eyebrow={eyebrow} title={icon ? `${icon} ${title}` : title} subtitle={subtitle} />
      <div className={`cards cols-${cols}`}>
        {items.map((c) => (
          <article className="card-item" key={c.title}>
            {c.icon && <div className="card-icon" aria-hidden="true">{c.icon}</div>}
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div>
    </div></section>
  ),

  features: ({ title }) => (
    <section className="block"><div className="wrap">
      <Heading eyebrow="The Best Stock Tracking App" title={title} />
      <ul className="chips">{HOME_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
    </div></section>
  ),

  steps: ({ items }) => (
    <section className="block"><div className="wrap cards cols-3">
      {items.map((s, i) => (
        <article className="card-item step" key={s.title}>
          <span className="step-num">{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </article>
      ))}
    </div></section>
  ),

  checklist: ({ eyebrow, title, body, items }) => (
    <section className="block alt"><div className="wrap narrow">
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && <h2>{title}</h2>}
      <Paragraphs items={body} />
      <ul className="checks">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div></section>
  ),

  stats: ({ items }) => (
    <section className="block"><div className="wrap stats">
      {items.map((s) => (
        <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
      ))}
    </div></section>
  ),

  faq: ({ eyebrow, title, intro, items }) => (
    <section className="block"><div className="wrap narrow">
      <Heading eyebrow={eyebrow} title={title} subtitle={intro} />
      {items.map((f) => (
        <details className="faq" key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div></section>
  ),

  logos: ({ title, items }) => (
    <section className="block"><div className="wrap">
      <Heading title={title} />
      <ul className="chips logos">{items.map((n) => <li key={n}>{n}</li>)}</ul>
    </div></section>
  ),

  legal: ({ intro, sections }) => (
    <section className="block"><div className="wrap narrow legal">
      <p>{intro}</p>
      {sections.map((s) => (
        <div key={s.heading}>
          <h3>{s.heading}</h3>
          <Paragraphs items={s.body} />
        </div>
      ))}
    </div></section>
  ),

  cta: ({ title, label, to }) => (
    <section className="cta-band"><div className="wrap">
      <h2>{title}</h2>
      <Link to={to} className="btn-light">{label}</Link>
    </div></section>
  ),
};

export default function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    const Render = renderers[b.type];
    return Render ? <Render key={i} {...b} /> : null;
  });
}
