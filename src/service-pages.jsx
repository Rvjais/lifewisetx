import React, { useMemo } from 'react';

const headlines = {
  '/anxiety-and-depression/': ['A little room', 'to breathe.'],
  '/neurodivergence/': ['Care that works', 'with your brain.'],
  '/trauma/': ['Your story. Your pace.', 'A way forward.'],
  '/relationships/': ['Make room for', 'connection.'],
  '/stress/': ['You can pause.', 'You can exhale.'],
  '/life-challenges/': ['When life changes,', 'find your footing.'],
  '/lgbtq-affirmative-support/': ['All of you', 'is welcome here.'],
};

function BotanicalRule({ dark = false }) {
  return <div className={`service-rule${dark ? ' service-rule--dark' : ''}`} aria-hidden="true"><span /><svg viewBox="0 0 72 36" fill="none"><path d="M36 28C26 27 16 20 9 10M36 28C46 27 56 20 63 10" /><path d="M16 18C9 18 7 13 8 8C14 9 17 12 16 18ZM23 23C17 26 12 24 10 20C15 17 20 19 23 23ZM24 23C21 18 23 13 27 11C30 16 29 20 24 23ZM56 18C63 18 65 13 64 8C58 9 55 12 56 18ZM49 23C55 26 60 24 62 20C57 17 52 19 49 23ZM48 23C51 18 49 13 45 11C42 16 43 20 48 23Z" /><path d="M36 17L39 21L36 25L33 21Z" /></svg><span /></div>;
}

function Action({ href = '/consultation/', children = 'Start a conversation', light = false }) {
  return <a className={`service-action${light ? ' service-action--light' : ''}`} href={href}>{children}<span aria-hidden="true">↗</span></a>;
}

function linesFrom(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
  return clone.textContent.replace('Low energy Disconnection', 'Low energy\nDisconnection').split('\n').map(line => line.trim()).filter(Boolean);
}

function parseContent(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const sections = [];
  let current;
  for (const element of doc.body.children) {
    if (/^H[234]$/.test(element.tagName)) {
      if (!element.textContent.trim()) continue;
      current = { title: element.textContent.trim().replace('shows uP', 'shows up'), id: element.id, nodes: [] };
      sections.push(current);
    } else if (current && element.textContent.trim()) current.nodes.push(element);
    else if (current && element.tagName === 'HR') current.nodes.push(element);
  }
  const first = sections.shift();
  const firstDivider = first.nodes.findIndex(node => node.tagName === 'HR');
  const intro = first.nodes.slice(0, firstDivider === -1 ? first.nodes.length : firstDivider).filter(node => node.tagName === 'P');
  const experience = first.nodes.slice(firstDivider + 1);
  const symptoms = experience.filter(node => node.querySelectorAll('br').length >= 2).flatMap(linesFrom).filter(line => !line.endsWith(':'));
  const notes = experience.filter(node => node.tagName === 'P' && !node.querySelector('br') && node.textContent.trim() !== node.querySelector('strong')?.textContent.trim());
  const helpIndex = sections.findIndex(section => /how counseling can help/i.test(section.title));
  const help = sections[helpIndex];
  const cards = help.nodes.filter(node => node.tagName === 'P' && node.querySelector('strong')).map(node => {
    const title = node.querySelector('strong').textContent;
    return { title, text: node.textContent.slice(title.length).trim() };
  });
  return { first, intro, symptoms, notes, before: sections.slice(0, helpIndex), cards, after: sections.slice(helpIndex + 1, -1), closing: sections.at(-1) };
}

function RichBlocks({ nodes, className = '' }) {
  const html = nodes.filter(node => node.tagName !== 'HR').map(node => {
    if (node.tagName === 'P' && node.querySelectorAll('br').length >= 2) {
      return `<ul class="service-detail-list">${linesFrom(node).map(line => {
        const span = document.createElement('span'); span.textContent = line;
        return `<li>${span.innerHTML}</li>`;
      }).join('')}</ul>`;
    }
    return node.outerHTML;
  }).join('');
  return <div className={`service-copy ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ServiceDetailPage({ service, page, otherServices }) {
  const data = useMemo(() => parseContent(page.html), [page.html]);
  const [opening, accent] = headlines[service.path];
  const related = otherServices.filter(item => item.path !== service.path).slice(0, 3);
  const closingNodes = data.closing.nodes.filter(node => node.tagName === 'P' && !/^schedule a 15/i.test(node.textContent));
  return <div className="service-detail">
    <section className="service-hero">
      <figure className="service-hero-photo"><img src={service.hero.src} alt={service.hero.alt} style={{ objectPosition: service.hero.position || "center 35%" }} /><figcaption>{service.label}</figcaption></figure>
      <div className="service-hero-shade" aria-hidden="true" />
      <div className="service-hero-inner">
        <div className="service-breadcrumb"><a href="/">Home</a><span>/</span><a href="/services/">Our services</a><span>/</span><span>{service.title}</span></div>
        <p className="eyebrow">{service.title}</p>
        <h1>{opening}<br /><em>{accent}</em></h1>
        <p className="service-hero-description">{service.desc}</p>
        <div className="service-hero-actions"><Action light /><a href="#your-experience" className="service-discover">Explore this care <span aria-hidden="true">↓</span></a></div>
        <div className="service-hero-note"><span aria-hidden="true">✦</span> Thoughtful care. At a pace that works for you.</div>
      </div>
    </section>

    <div className="service-care-strip"><span><i aria-hidden="true" /> Online throughout Texas</span><span>In-person care in select locations</span><a href="/consultation/">Complimentary 15-minute consultation <b aria-hidden="true">↗</b></a></div>

    <section className="service-introduction service-section" id="your-experience">
      <BotanicalRule />
      <div className="service-intro-heading"><p className="eyebrow">01 / A PLACE TO BE UNDERSTOOD</p><h2>{data.first.title}</h2><span className="service-small-rule" aria-hidden="true" /></div>
      <RichBlocks nodes={data.intro} />
    </section>

    <section className="service-experience service-section">
      <div className="service-experience-heading"><p className="eyebrow">YOU MAY RECOGNIZE SOME OF THIS</p><h2>Whatever you’re carrying,<br /><em>there’s room for it here.</em></h2>{data.notes.length > 0 && <RichBlocks nodes={data.notes} />}</div>
      <div className="service-topics-panel"><div className="service-topics-label"><span aria-hidden="true">✦</span><span>{service.title}</span></div><ul className="service-topics">{data.symptoms.map(item => <li key={item}>{item}</li>)}</ul><p>You don’t need to have the perfect words before reaching out.</p></div>
    </section>

    <section className="service-understanding service-section">
      <div className="service-understanding-photo"><img src={service.image} alt={service.imageAlt} style={{ objectPosition: "center 35%" }} loading="lazy" /><span className="service-photo-seal" aria-hidden="true">ROOM TO<br /><em>be you.</em></span></div>
      <div className="service-story-stack"><p className="eyebrow">02 / UNDERSTANDING YOUR EXPERIENCE</p>{data.before.map(section => <article className="service-story" id={section.id} key={section.id}><h2>{section.title}</h2><RichBlocks nodes={section.nodes} /></article>)}</div>
    </section>

    <section className="service-counseling service-section" id="how-counseling-can-help">
      <BotanicalRule dark />
      <div className="service-counseling-heading"><p className="eyebrow">03 / HOW COUNSELING CAN HELP</p><h2>Small shifts.<br /><em>More room to live.</em></h2><p>We’ll work together to understand your patterns and build support around what matters to you.</p></div>
      <div className="service-methods">{data.cards.map((card, index) => <article key={card.title}><div className="service-method-top"><span>{String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">✦</span></div><h3>{card.title}</h3><p>{card.text}</p></article>)}</div>
      <a className="service-counseling-link" href="/careteam/">Find the person behind your care <span aria-hidden="true">↗</span></a>
    </section>

    {data.after.length > 0 && <section className="service-more service-section"><div className="service-more-heading"><p className="eyebrow">CARE THAT SEES THE WHOLE PERSON</p><h2>There’s more to you<br /><em>than what brings you here.</em></h2></div><div className="service-more-grid">{data.after.map(section => <article key={section.id} id={section.id}><span className="service-more-mark" aria-hidden="true">✧</span><h3>{section.title}</h3><RichBlocks nodes={section.nodes} /></article>)}</div></section>}

    <section className="service-ending service-section">
      <BotanicalRule />
      <p className="eyebrow">WHENEVER YOU’RE READY</p><h2>{data.closing.title}</h2><RichBlocks nodes={closingNodes} /><Action>Book a complimentary consultation</Action><p className="service-ending-note">A small first conversation. No pressure to have everything figured out.</p>
    </section>

    <section className="service-related service-section"><div><p className="eyebrow">OTHER WAYS WE CAN HELP</p><h2>Explore more <em>support.</em></h2></div><div className="service-related-links">{related.map(item => <a key={item.path} href={item.path}><span>{item.title}</span><b aria-hidden="true">↗</b></a>)}<a href="/services/" className="service-related-all">All LifeWise services <b aria-hidden="true">↗</b></a></div></section>
  </div>;
}
