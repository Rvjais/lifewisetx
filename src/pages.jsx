import React, { useEffect, useMemo, useState } from 'react';
import content from './content.json';
import media from './media.json';
import ServiceDetailPage from './service-pages.jsx';

export const bookingUrl = 'https://calendar.app.google/nyiYDRBgML4yuVa39';
export const providers = [
  { path: '/stacy/', name: 'Stacy Hixon', credentials: 'MA, LPC-S, CCTP, FRTP', role: 'Clinical Director', pronouns: 'she/her', format: 'In North Fort Worth & online across Texas', image: '/images/team-stacy.png', note: 'Trauma-informed care, grounded in your lived experience.', tags: ['Trauma & PTSD', 'First responders', 'Adults & couples'] },
  { path: '/martha-sharpe/', name: 'Martha Sharpe', credentials: 'LPC Associate', role: 'Licensed Professional Counselor Associate', pronouns: 'she/her', format: 'Online across Texas · Limited in-person in Montgomery', image: '/images/team-martha.png', note: 'A compassionate space to slow down and reconnect with yourself.', tags: ['Mindfulness', 'Somatic approaches', 'Self-trust'], supervised: true },
  { path: '/caity-boyd/', name: 'Caity Boyd', credentials: 'BS · Graduate Counseling Intern', role: 'Graduate Counseling Intern', pronouns: 'she/her', format: 'Online across Texas', image: '/images/team-caity.png', note: 'Collaborative support for resilience, awareness, and growth.', tags: ['Resilience', 'Adults & couples', 'Self-pay care'], supervised: true },
  { path: '/hazel-dettmer/', name: 'Hazel Dettmer', credentials: 'BSW', role: 'Group Facilitator', pronouns: 'she/her', format: 'LGBTQIA+ support group facilitation', image: '/images/team-hazel.png', note: 'An affirming space for connection, shared experience, and belonging.', tags: ['Group support', 'LGBTQIA+ affirming', 'Connection'] },
  { path: '/lynn/', name: 'Lynn Hixon III', credentials: 'MA', role: 'Director of Operations', pronouns: 'he/him', format: 'Practice operations · Nonclinical role', image: content['/lynn/'].image, note: 'Supporting the people and systems that make thoughtful care possible.', tags: ['Navy veteran', 'Leadership', 'Practice support'] },
];

export const services = [
  { path: '/anxiety-and-depression/', title: 'Anxiety & depression', image: media['card-anxiety'].src, hero: media['hero-anxiety'], label: 'A little room to breathe', desc: 'Understand what feels overwhelming, reconnect with yourself, and find a way forward.' },
  { path: '/neurodivergence/', title: 'Neurodivergent care', image: media['card-neurodivergence'].src, hero: media['hero-neurodivergence'], label: 'Care that works with your brain', desc: 'Explore ADHD, masking, sensory needs, executive functioning, and your own ways of being.' },
  { path: '/trauma/', title: 'Trauma & recovery', image: media['card-trauma'].src, hero: media['hero-trauma'], label: 'Safety at your own pace', desc: 'Make sense of survival patterns and build more room for trust, connection, and choice.' },
  { path: '/relationships/', title: 'Relationships & connection', image: media['card-relationships'].src, hero: media['hero-relationships'], label: 'Find your way back to each other', desc: 'Support for individuals, couples, and families navigating communication, conflict, and trust.' },
  { path: '/stress/', title: 'Stress & burnout', image: media['card-stress'].src, hero: media['hero-stress'], label: 'Make room for recovery', desc: 'Explore ongoing pressure, protect your energy, and develop more sustainable boundaries.' },
  { path: '/life-challenges/', title: 'Life changes & loss', image: media['card-life-challenges'].src, hero: media['hero-life-challenges'], label: 'A place for the next chapter', desc: 'Space to process grief, transitions, uncertainty, identity shifts, and difficult decisions.' },
  { path: '/lgbtq-affirmative-support/', title: 'LGBTQIA+ affirming support', image: media['card-lgbtq'].src, hero: media['hero-lgbtq'], label: 'Show up as yourself', desc: 'Welcoming care that sees the whole person and follows what matters to you.' },
];

const legalPaths = ['/client-rights/', '/good-faith-estimate/', '/website-privacy-policy/', '/terms-of-use/', '/client-information-and-website-disclosures/'];
const resourceLinks = [
  ['/pricing/', 'Insurance & pricing'], ['/frequently-asked-questions/', 'Frequently asked questions'],
  ['/client-rights/', 'Client rights'], ['/good-faith-estimate/', 'Good Faith Estimate'],
  ['/client-information-and-website-disclosures/', 'Credentials & disclosures'],
  ['/website-privacy-policy/', 'Website privacy'], ['/terms-of-use/', 'Terms of use'],
];

export function normalizePath(path) {
  let result = decodeURI(path).replace(/\/+/g, '/');
  if (result === '/index.html') return '/';
  if (result.endsWith('.html')) result = result.slice(0, -5).replace(/__/g, '/');
  if (result === '/featured-in-the-dallas-voyager/') return '/2026/04/09/featured-in-the-dallas-voyager/';
  return result.endsWith('/') ? result : result + '/';
}

export function usePageNavigation() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  useEffect(() => {
    const sync = () => setPath(normalizePath(window.location.pathname));
    const navigate = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || /\.(pdf|png|jpg|jpeg|mp4)$/.test(url.pathname)) return;
      const next = normalizePath(url.pathname);
      if (next === normalizePath(window.location.pathname) && url.hash) return;
      event.preventDefault();
      window.history.pushState({}, '', url.pathname + url.search + url.hash);
      setPath(next);
      if (next === normalizePath(window.location.pathname) && !url.hash) window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', sync);
    document.addEventListener('click', navigate);
    return () => { window.removeEventListener('popstate', sync); document.removeEventListener('click', navigate); };
  }, []);
  useEffect(() => {
    const page = content[path];
    document.title = path === '/' ? 'LifeWise Counseling | Texas & North Fort Worth' : `${page?.title || (path === '/reflections/' ? 'Reflections' : 'Page not found')} | LifeWise Counseling`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page?.excerpt || 'Thoughtful counseling and wellness in North Fort Worth and throughout Texas.');
    const frame = requestAnimationFrame(() => {
      if (window.location.hash) {
        document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
      document.querySelector('main')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [path]);
  return path;
}

function Button({ href = '/consultation/', children = 'Start a conversation', secondary = false, external = false }) {
  return <a className={`page-button${secondary ? ' page-button--outline' : ''}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}<span aria-hidden="true">↗</span></a>;
}

function Hero({ eyebrow, title, accent, description, image, imageAlt, children, compact = false }) {
  return <section className={`page-hero${image ? ' page-hero--split' : ''}${compact ? ' page-hero--compact' : ''}`}>
    <div className="page-hero-copy">
      <div className="page-breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>{eyebrow}</span></div>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}{accent && <> <em>{accent}</em></>}</h1>
      {description && <p className="page-lead">{description}</p>}
      {children && <div className="page-hero-actions">{children}</div>}
    </div>
    {image && <figure className="page-hero-image"><img src={image} alt={imageAlt || ''} /><figcaption>LifeWise Counseling & Wellness <span>Texas</span></figcaption></figure>}
  </section>;
}

function Closing({ professional = false }) {
  return <section className="page-closing"><p className="eyebrow">{professional ? 'GROW WITH LIFEWISE' : 'WHENEVER YOU’RE READY'}</p><h2>{professional ? 'Let’s build something meaningful.' : 'A conversation is a place to begin.'}</h2><p>{professional ? 'Reach out about supervision, counselor development, or professional collaboration.' : 'You don’t need the perfect words. We’ll help you find your next step.'}</p><Button href={professional ? 'mailto:lifewise@lifewisetx.com?subject=Professional%20inquiry' : '/consultation/'}>{professional ? 'Contact LifeWise' : 'Book a complimentary consultation'}</Button></section>;
}

function ServicesPage() {
  return <><Hero eyebrow="OUR SERVICES" title="Support for the life" accent="you’re living." description="You don’t have to know exactly what kind of support you need. We’ll help you find the care and the person that feel right for you." image={media['services-overview'].src} imageAlt={media['services-overview'].alt}><Button /><a className="page-text-link" href="/careteam/">Meet your care team ↗</a></Hero>
    <section className="page-section"><div className="page-section-heading"><div><p className="eyebrow">ROOM FOR YOUR STORY</p><h2>Different needs.<br /><em>Thoughtful care.</em></h2></div><p>Individual, couples, and family counseling for adults. Online throughout Texas, with in-person care in select locations.</p></div>
      <div className="service-page-grid">{services.map((service, i) => <a className="service-page-card" href={service.path} key={service.path}><div className="service-page-image"><img src={service.image} alt="" loading="lazy" /><span>{String(i + 1).padStart(2, '0')}</span></div><div className="service-page-copy"><p className="eyebrow">{service.label}</p><h3>{service.title}<span aria-hidden="true">↗</span></h3><p>{service.desc}</p><span className="page-text-link">Explore this care</span></div></a>)}</div>
    </section><section className="page-section page-section--sage"><div className="page-section-heading"><div><p className="eyebrow">BEYOND THE COUNSELING ROOM</p><h2>Care for those<br /><em>who care for others.</em></h2></div></div><div className="page-two-grid"><a className="page-feature" href="/supervision/"><span className="eyebrow">FOR DEVELOPING COUNSELORS</span><h3>Supervision & career development</h3><p>Build clinical confidence, ethical judgment, and a sustainable counseling career.</p><span className="page-text-link">Explore the program ↗</span></a><a className="page-feature" href="https://steelarmormindset.com/" target="_blank" rel="noopener noreferrer"><span className="eyebrow">FIRST RESPONDERS & VETERANS</span><h3>Steel Armor Mindset</h3><p>Nonclinical resilience and mental readiness programming for service-oriented communities.</p><span className="page-text-link">Visit Steel Armor Mindset ↗</span></a></div></section><Closing /></>;
}

function TeamPage() {
  return <><Hero eyebrow="OUR CARE TEAM" title="Real people." accent="Room for your story." description="Different backgrounds, personalities, and approaches. One shared commitment to thoughtful, human care." compact><Button>Help me find a provider</Button></Hero><section className="page-section team-page-section"><div className="provider-grid">{providers.map((person) => <a className="provider-card" href={person.path} key={person.path}><div className="provider-portrait"><img src={person.image} alt={person.name} loading="lazy" /><span>{person.pronouns}</span></div><div className="provider-copy"><p className="eyebrow">{person.role}</p><h2>{person.name}<span aria-hidden="true">↗</span></h2><p className="provider-credentials">{person.credentials}</p>{person.supervised && <p className="provider-supervision">Supervised by Stacy Hixon, LPC-S</p>}<p>{person.note}</p><div className="page-tags">{person.tags.map(tag => <span key={tag}>{tag}</span>)}</div><small>{person.format}</small></div></a>)}</div></section><Closing /></>;
}

function ProfilePage({ person, page }) {
  const headings = [...page.html.matchAll(/<h[234] id="([^"]+)">(.+?)<\/h[234]>/g)];
  return <><Hero eyebrow="MEET THE TEAM" title={person.name} description={person.note} image={person.image} imageAlt={person.name}><div className="profile-intro"><p>{person.credentials} <span>· {person.pronouns}</span></p><p>{person.role}</p>{person.supervised && <p>Supervised by Stacy Hixon, LPC-S</p>}<p>{person.format}</p></div><Button>{person.path === '/lynn/' || person.path === '/hazel-dettmer/' ? 'Connect with LifeWise' : 'Find your next step'}</Button><a className="page-text-link" href="/careteam/">← Our care team</a></Hero>
    <section className="page-editorial-layout"><aside className="page-sidebar"><p className="eyebrow">GET TO KNOW {person.name.split(' ')[0]}</p>{headings.map(([_, id, title]) => <a href={`#${id}`} key={id}>{title.replace(/<[^>]+>/g, '')}</a>)}<div className="page-sidebar-note"><p className="eyebrow">YOUR FIRST STEP</p><p>A complimentary consultation can help you explore the right fit.</p><a href="/consultation/">Start a conversation ↗</a></div></aside><div className="page-prose" dangerouslySetInnerHTML={{ __html: page.html }} /></section><Closing /></>;
}

const rates = [
  { title: 'Licensed Professional Counselor', subtitle: 'Independently licensed clinical care', name: 'Stacy Hixon', individual: 165, couples: 185, path: '/stacy/', label: 'LPC' },
  { title: 'LPC Associate', subtitle: 'Licensed care under clinical supervision', name: 'Martha Sharpe', individual: 135, couples: 155, path: '/martha-sharpe/', label: 'LPC ASSOCIATE' },
  { title: 'Graduate Counseling Intern', subtitle: 'Graduate-level care with close supervision', name: 'Caity Boyd', individual: 70, couples: 85, path: '/caity-boyd/', label: 'COUNSELING INTERN' },
];
const insurers = ['Aetna', 'Aetna Medicare Advantage', 'Anthem EAP (Standard & Expanded)', 'Ascension Smart Health', 'Blue Cross / Blue Shield (MA & TX)', 'Carelon', 'Cigna', 'Curative', 'Devoted Health Medicare Advantage', 'Horizon Blue Cross / Blue Shield (NJ)', 'Humana Medicare Advantage', 'Optum (Oscar, Oxford & United Health Care)', 'Providence Health Plan (Medicare Advantage)', 'TRICARE', 'TriWest'];
function PricingPage() {
  return <><Hero eyebrow="INSURANCE & PRICING" title="Clear from" accent="the beginning." description="Fees vary by provider level. Insurance participation varies by clinician and plan. Let’s make the financial side of care easier to understand." compact><Button>Talk through your options</Button></Hero><section className="page-section"><div className="page-section-heading"><div><p className="eyebrow">STANDARD PRIVATE PAY</p><h2>A path to care<br /><em>that fits your needs.</em></h2></div><p>Choose the provider level that fits your needs. Fees below are per counseling session.</p></div><div className="pricing-grid">{rates.map(rate => <article className="pricing-page-card" key={rate.label}><p className="eyebrow">{rate.label}</p><h3>{rate.title}</h3><p>{rate.subtitle}</p><div className="rate-row"><span>Individual counseling</span><strong>${rate.individual}<small> / session</small></strong></div><div className="rate-row"><span>Couples counseling</span><strong>${rate.couples}<small> / session</small></strong></div><a className="page-text-link" href={rate.path}>Meet {rate.name} ↗</a>{rate.individual === 70 && <small className="rate-note">Intern sessions are self-pay only and are not billable to insurance.</small>}</article>)}</div></section><section className="page-section page-section--sage" id="insurance"><div className="page-section-heading"><div><p className="eyebrow">INSURANCE PARTICIPATION</p><h2>Understand<br /><em>your coverage.</em></h2></div><p>Verify network status, eligibility, copays, deductibles, and coinsurance with your insurance company before beginning services.</p></div><div className="page-two-grid"><article className="insurance-page-card"><h3>Licensed Professional Counselor</h3><ul className="insurer-list">{insurers.map(name => <li key={name}>{name}</li>)}</ul><a className="page-text-link" href="/stacy/">Meet your provider ↗</a></article><article className="insurance-page-card"><h3>LPC Associate</h3><ul className="insurer-list"><li>Aetna</li><li>Blue Cross Blue Shield of Texas</li><li>Cigna</li></ul><p>A listed company does not guarantee that every provider is in network with every plan. Coverage depends on your individual provider and plan.</p><a className="page-text-link" href="/martha-sharpe/">Meet your provider ↗</a><div className="estimate-note"><p className="eyebrow">PLANNING AHEAD</p><h4>Good Faith Estimates</h4><p>Uninsured or choosing to self-pay? You may request an estimate of expected charges before scheduling services.</p><a href="/good-faith-estimate/">Read about your estimate ↗</a></div></article></div></section><Closing /></>;
}

function ConsultationPage() {
  return <><Hero eyebrow="COMPLIMENTARY CONSULTATION" title="Start with" accent="a conversation." description="A little time to ask questions, share what you’re looking for, and explore the support that may fit your life." image={media['hero-consultation'].src} imageAlt={media['hero-consultation'].alt}><Button href={bookingUrl} external>Choose a consultation time</Button><span className="consultation-note">15 minutes · Complimentary · With Stacy Hixon</span></Hero><section className="page-section"><div className="page-section-heading"><div><p className="eyebrow">A FIRST STEP, AT YOUR PACE</p><h2>You don’t need to have<br /><em>it all figured out.</em></h2></div><p>Our Clinical Director helps match you with the LifeWise provider who may be the best fit.</p></div><div className="consultation-steps">{[['01', 'Tell us a little', 'Share what brings you here and what you’re hoping to find in counseling.'], ['02', 'Ask your questions', 'Talk about provider approaches, availability, fees, and insurance options.'], ['03', 'Explore the next step', 'Get help choosing a provider and understanding how to begin.']].map(([num, title, text]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="consultation-detail"><div><h3>Before we connect</h3><p>A consultation is not a therapy session and does not establish a therapeutic relationship. Please provide 24 hours’ notice for cancellation or rescheduling.</p><a className="page-text-link" href="/pricing/">Review insurance & pricing ↗</a></div><div className="consultation-contact"><p className="eyebrow">PREFER TO REACH OUT?</p><a href="mailto:lifewise@lifewisetx.com">lifewise@lifewisetx.com</a><a href="tel:+18176028520">817.602.8520</a><p>Please keep initial messages to contact and scheduling information.</p><Button href={bookingUrl} external>Open the booking calendar</Button></div></div></section></>;
}

function FaqPage({ page }) {
  const questions = useMemo(() => {
    const doc = new DOMParser().parseFromString(page.html, 'text/html');
    const result = [];
    let question;
    for (const element of doc.body.children) {
      if (/^H[234]$/.test(element.tagName) || (element.tagName === 'P' && element.textContent.trim().endsWith('?'))) {
        question = { title: element.textContent, answer: '' }; result.push(question);
      } else if (question) question.answer += element.outerHTML;
    }
    return result;
  }, [page]);
  return <><Hero eyebrow="FREQUENTLY ASKED QUESTIONS" title="Good questions." accent="Clear answers." description="A few things you may be wondering before you begin. If your question isn’t here, there’s room for it in a conversation." compact /><section className="page-editorial-layout"><aside className="page-sidebar"><p className="eyebrow">HERE TO HELP</p><p>You don’t have to choose a counselor on your own.</p><Button /><a href="/pricing/">Insurance & pricing ↗</a></aside><div className="page-faq-list">{questions.map((q, i) => <details key={q.title} open={i === 0}><summary>{q.title}</summary><div className="page-prose" dangerouslySetInnerHTML={{ __html: q.answer }} /></details>)}</div></section><Closing /></>;
}

const articles = Object.entries(content).filter(([, page]) => page.article).map(([path, page]) => ({ ...page, path }));
function ArticleCard({ article }) {
  return <a className={`journal-card${article.image ? "" : " journal-card--text"}`} href={article.path}>{article.image && <div className="journal-card-image"><img src={article.image} alt="" loading="lazy" /><span>{article.category}</span></div>}<div className="journal-card-copy"><time dateTime={article.date}>{formatDate(article.date)}</time>{!article.image && <p className="journal-card-category">{article.category}</p>}<h2>{article.title}</h2><p>{article.excerpt.slice(0, 150)}{article.excerpt.length > 150 ? '…' : ''}</p><span className="page-text-link">Read reflection ↗</span></div></a>;
}
function formatDate(date) { return date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'LifeWise Reflections'; }

function ReflectionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All reflections');
  const [shown, setShown] = useState(9);
  const categories = ['All reflections', ...new Set(articles.flatMap(a => a.categories))];
  const filtered = articles.filter(a => (category === 'All reflections' || a.categories.includes(category)) && `${a.title} ${a.excerpt}`.toLowerCase().includes(search.toLowerCase()));
  return <><Hero eyebrow="LIFEWISE REFLECTIONS" title="A moment to pause." accent="A little perspective." description="Thoughts on being human, from the people behind your care. Explore relationships, identity, emotional wellbeing, and the work of finding your way." compact /><section className="page-section journal-section"><div className="journal-toolbar"><div className="journal-filters" aria-label="Filter reflections">{categories.map(c => <button type="button" className={category === c ? 'active' : ''} aria-pressed={category === c} key={c} onClick={() => { setCategory(c); setShown(9); }}>{c}</button>)}</div><label className="journal-search"><span className="sr-only">Search reflections</span><input type="search" placeholder="Find a reflection…" value={search} onChange={e => { setSearch(e.target.value); setShown(9); }} /><span aria-hidden="true">⌕</span></label></div><p className="journal-results" role="status">{filtered.length} {filtered.length === 1 ? 'reflection' : 'reflections'}{search ? ` matching “${search}”` : ' to explore'}</p><div className="journal-grid">{filtered.slice(0, shown).map(article => <ArticleCard article={article} key={article.path} />)}</div>{!filtered.length && <div className="journal-empty"><h2>No reflections found.</h2><p>Try a different word, or explore the full collection.</p><button className="page-button" onClick={() => { setSearch(''); setCategory('All reflections'); }}>Show all reflections</button></div>}{shown < filtered.length && <div className="journal-more"><button className="page-button page-button--outline" onClick={() => setShown(n => n + 9)}>Load more reflections <span>↓</span></button></div>}</section><Closing /></>;
}

function ArticlePage({ page, path }) {
  const currentIndex = articles.findIndex(article => article.path === path);
  const related = Array.from({ length: Math.min(3, articles.length - 1) }, (_, index) => articles[(currentIndex + index + 1) % articles.length]);
  return <><Hero eyebrow={page.category || 'REFLECTIONS'} title={page.title} compact><div className="article-meta"><time dateTime={page.date}>{formatDate(page.date)}</time><span>LifeWise Reflections</span></div></Hero>{page.image && <div className="article-cover"><img src={page.image} alt={page.title} /></div>}<article className="page-article"><a className="page-text-link" href="/reflections/">← All reflections</a><div className="page-prose" dangerouslySetInnerHTML={{ __html: page.html }} /><div className="article-end"><span>LifeWise Counseling & Wellness</span><a href="/reflections/">Keep exploring ↗</a></div></article><section className="page-section page-section--sage"><div className="page-section-heading"><div><p className="eyebrow">A LITTLE MORE PERSPECTIVE</p><h2>Continue <em>reflecting.</em></h2></div></div><div className="journal-grid">{related.map(a => <ArticleCard article={a} key={a.path} />)}</div></section></>;
}

function EditorialPage({ page, path }) {
  const service = services.find(s => s.path === path);
  const legal = legalPaths.includes(path);
  const professional = path === '/supervision/' || path === '/lifewise-career-development-program-2/' || path === '/referral-partners/';
  const professionalImage = { '/supervision/': media['hero-supervision'], '/lifewise-career-development-program-2/': media['hero-career'], '/referral-partners/': media['hero-referrals'] }[path];
  const headings = [...page.html.matchAll(/<h[234] id="([^"]+)">(.+?)<\/h[234]>/g)];
  return <><Hero eyebrow={legal ? 'CLIENT INFORMATION' : professional ? 'PROFESSIONAL & COMMUNITY SUPPORT' : 'OUR SERVICES'} title={service?.title || page.title} description={service?.desc || (professional ? page.excerpt : undefined)} image={service?.hero.src || professionalImage?.src} imageAlt={service?.hero.alt || professionalImage?.alt} compact={legal}>{!legal && <Button href={professional ? 'mailto:lifewise@lifewisetx.com?subject=Professional%20inquiry' : '/consultation/'}>{professional ? 'Connect with LifeWise' : 'Find support'}</Button>}{service && <a className="page-text-link" href="/services/">← All services</a>}</Hero><section className="page-editorial-layout"><aside className="page-sidebar"><p className="eyebrow">{legal ? 'HELPFUL INFORMATION' : 'ON THIS PAGE'}</p>{(legal ? resourceLinks : headings.map(([_, id, text]) => ['#' + id, text.replace(/<[^>]+>/g, '')])).map(([href, label]) => <a aria-current={href === path ? 'page' : undefined} href={href} key={href}>{label}</a>)}{!legal && <div className="page-sidebar-note"><p className="eyebrow">A THOUGHTFUL NEXT STEP</p><p>{professional ? 'Explore our clinical supervision and counselor development program.' : 'Not sure where to begin? We can help you find the right provider.'}</p><a href={professional ? '/lifewise-career-development-program-2/' : '/careteam/'}>{professional ? 'Career development program' : 'Meet the care team'} ↗</a></div>}</aside><div className="page-prose" dangerouslySetInnerHTML={{ __html: page.html }} /></section>{!legal && <Closing professional={professional} />}</>;
}

export default function InteriorPage({ path }) {
  const page = content[path];
  let view;
  if (path === '/services/') view = <ServicesPage />;
  else if (path === '/careteam/') view = <TeamPage />;
  else if (path === '/pricing/') view = <PricingPage />;
  else if (path === '/consultation/') view = <ConsultationPage />;
  else if (path === '/frequently-asked-questions/') view = <FaqPage page={page} />;
  else if (path === '/reflections/' || path.startsWith('/category/')) view = <ReflectionsPage />;
  else if (providers.some(p => p.path === path)) view = <ProfilePage page={page} person={providers.find(p => p.path === path)} />;
  else if (page?.article) view = <ArticlePage page={page} path={path} />;
  else if (services.some(service => service.path === path)) view = <ServiceDetailPage page={page} service={services.find(service => service.path === path)} otherServices={services} />;
  else if (page) view = <EditorialPage page={page} path={path} />;
  else view = <Hero eyebrow="PAGE NOT FOUND" title="Let’s find your" accent="way back." description="The page you’re looking for isn’t here. Explore our services or return home." compact><Button href="/">Return home</Button><a className="page-text-link" href="/services/">Explore services ↗</a></Hero>;
  return <main id="page-content" className="interior-page" tabIndex={-1} key={path}>{view}</main>;
}
