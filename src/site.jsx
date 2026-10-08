import React, { useEffect, useRef, useState } from 'react';

const consultation = 'https://lifewisetx.com/consultation/';
const team = [
  { name: 'Stacy Hixon', role: 'Clinical Director', image: '/images/team-stacy.png', href: 'https://lifewisetx.com/stacy/' },
  { name: 'Martha Sharpe', role: 'LPC Associate', image: '/images/team-martha.png', href: 'https://lifewisetx.com/martha-sharpe/' },
  { name: 'Caity Boyd', role: 'Graduate Counseling Intern', image: '/images/team-caity.png', href: 'https://lifewisetx.com/caity-boyd/' },
  { name: 'Hazel Dettmer', role: 'Group Facilitator', image: '/images/team-hazel.png', href: 'https://lifewisetx.com/hazel-dettmer/' },
];
const areas = [
  {
    num: '01',
    title: 'Individual Counseling & Anxiety',
    desc: 'Support for anxiety, panic, depression, burnout, chronic stress, and navigating high-pressure life transitions.',
    image: '/images/service-anxiety.png',
    badge: 'Virtual & In-Person',
    tags: ['Panic & Worry', 'Burnout Recovery', 'Somatic Soothing', 'Life Transitions'],
  },
  {
    num: '02',
    title: 'Neurodivergent & Affirming Care',
    desc: 'Respectful, neurodiversity-affirming counseling for ADHDers, autistic adults, late-diagnosed individuals, and LGBTQIA+ clients.',
    image: '/images/service-neurodivergence.png',
    badge: 'Affirming & Unmasking',
    tags: ['ADHD & Autism', 'Late Diagnosis', 'Unmasking Safely', 'Sensory Grounding'],
  },
  {
    num: '03',
    title: 'Trauma & EMDR Processing',
    desc: 'Somatic, grounded support to process deep emotional wounds, PTSD, relational trauma, and rebuild a sense of safety.',
    image: '/images/service-trauma.png',
    badge: 'Somatic & EMDR',
    tags: ['PTSD & Flashbacks', 'Relational Wounds', 'EMDR Processing', 'Nervous System Safety'],
  },
  {
    num: '04',
    title: 'Couples & Relationship Health',
    desc: 'Make room for clearer communication, de-escalating recurring conflict, and cultivating authentic emotional intimacy.',
    image: '/images/service-relationships.png',
    badge: 'Couples & Families',
    tags: ['Conflict De-escalation', 'Emotional Intimacy', 'Communication Habits', 'Secure Attachment'],
  },
];

const reflections = [
  {
    title: 'Why Counselors Need Therapy Too',
    date: 'OCTOBER 2026',
    readTime: '4 MIN READ',
    author: 'Clinical Practice Note',
    category: 'COUNSELOR WELLNESS',
    desc: 'The importance of secondary trauma awareness, emotional sustainability, and walking the walk as helping professionals.',
    image: '/images/reflection-counseling.jpeg',
    href: 'https://lifewisetx.com/reflections/',
  },
  {
    title: 'We Create Our Identity',
    date: 'SEPTEMBER 2026',
    readTime: '5 MIN READ',
    author: 'Identity & Boundaries',
    category: 'IDENTITY & BOUNDARIES',
    desc: 'Navigating family roles, establishing healthy boundaries, and shedding old narratives to build a grounded sense of self.',
    image: '/images/reflection-identity.jpeg',
    href: 'https://lifewisetx.com/reflections/',
  },
  {
    title: 'Sitting With Discomfort & Mindfulness',
    date: 'SEPTEMBER 2026',
    readTime: '6 MIN READ',
    author: 'Somatic Regulation',
    category: 'EMOTIONAL REGULATION',
    desc: 'Understanding how somatic mindfulness and nervous system soothing help us weather life’s harder emotional seasons.',
    image: '/images/reflection-mindfulness.jpeg',
    href: 'https://lifewisetx.com/reflections/',
  },
];

function SectionDivider({ tone = 'light' }) {
  return (
    <div className={`section-divider section-divider--${tone}`} aria-hidden="true">
      <span className="section-divider-ornament">
        <svg viewBox="0 0 72 36" fill="none" focusable="false">
          <path className="divider-stem" d="M36 28C26 27 16 20 9 10M36 28C46 27 56 20 63 10" />
          <path className="divider-leaf" d="M16 18C9 18 7 13 8 8C14 9 17 12 16 18ZM23 23C17 26 12 24 10 20C15 17 20 19 23 23ZM24 23C21 18 23 13 27 11C30 16 29 20 24 23ZM56 18C63 18 65 13 64 8C58 9 55 12 56 18ZM49 23C55 26 60 24 62 20C57 17 52 19 49 23ZM48 23C51 18 49 13 45 11C42 16 43 20 48 23Z" />
          <path className="divider-seed" d="M36 17L39 21L36 25L33 21Z" />
        </svg>
      </span>
    </div>
  );
}

function App() {
  const heroVideoRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showConcierge, setShowConcierge] = useState(false);
  const [dismissConcierge, setDismissConcierge] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const closeOutsideHeader = (event) => {
      if (!event.target.closest('.site-header')) setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutsideHeader);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutsideHeader);
    };
  }, [menuOpen]);

  useEffect(() => {
    const video = heroVideoRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (motionPreference.matches) video.pause();
      else video.play().catch(() => { /* Keep the hero usable if autoplay is blocked. */ });
    };
    updatePlayback();
    motionPreference.addEventListener('change', updatePlayback);
    return () => motionPreference.removeEventListener('change', updatePlayback);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      setScrollProgress(progress);
      if (window.scrollY > 480) {
        setShowConcierge(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll('.intro-visual, .intro > div:last-child, .area-card, .coverage > div:not(.section-divider), .closing .eyebrow, .closing h2, .closing > p:not(.eyebrow), .closing > a, .team-person, .faq-list details, .recognition, .referrals > div:not(.section-divider), .referrals > a, .crisis > div, .crisis > a, .coverage-card, .section-head, .team-heading, .population-row, .faq-heading, .sanctuary-banner, .reflection-card, .philosophy-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 3) * 45}ms`);
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);
  return <>
    <div className="reading-progress-track" aria-hidden="true">
      <div className="reading-progress-bar" style={{ transform: `scaleX(${scrollProgress})` }} />
    </div>

    <div className="topline">
      <div className="topline-inner">
        <span className="live-status-pill"><span className="pulse-dot" /> ACCEPTING CLIENTS ACROSS TEXAS</span>
        <i className="topline-divider" />
        <span className="topline-sub">Statewide Telehealth &bull; In-Person Sanctuary in North Fort Worth</span>
        <a href={consultation} className="topline-cta">Complimentary 15-Minute Consultation <b>↗</b></a>
      </div>
    </div>

    <header className={scrollProgress > 0 ? 'site-header is-scrolled' : 'site-header'}>
      <a className="brand" href="#home" aria-label="LifeWise home"><img src="/images/lifewise-logo.png" alt="LifeWise Counseling and Wellness" /></a>
      <nav id="main-navigation" aria-label="Main navigation" className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#support" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#team" onClick={() => setMenuOpen(false)}>Our team</a>
        <a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a>
        <a href="#sanctuary" onClick={() => setMenuOpen(false)}>Sanctuary</a>
        <a href="#reflections" onClick={() => setMenuOpen(false)}>Reflections</a>
        <a href="#coverage" onClick={() => setMenuOpen(false)}>Insurance &amp; pricing</a>
        <a className="nav-button" href={consultation} onClick={() => setMenuOpen(false)}>Book a consultation <b aria-hidden="true">↗</b></a>
      </nav>
      <div className="header-actions">
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><span /><span /></button>
      </div>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-backdrop" aria-hidden="true">
          <video ref={heroVideoRef} className="hero-background-video" autoPlay muted loop playsInline preload="metadata" tabIndex={-1}>
            <source src="/lightTheme.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-eyebrow">COUNSELING &amp; WELLNESS IN TEXAS</p>
          <h1 className="hero-heading"><span className="hero-opening">Come</span>{' '}<em>as you are.</em></h1>
          <p className="hero-description">We&apos;ll meet you where you are.<span>And find a way forward, together.</span></p>
          <p className="hero-care-format">In person in North Fort Worth. Online across Texas.</p>
          <a className="hero-action" href={consultation}>Start a conversation <span aria-hidden="true">↗</span></a>
          <p className="hero-consultation-note">A complimentary 15-minute consultation.</p>
        </div>
      </section>

      <section className="intro" id="approach">
        <SectionDivider />
        <div className="intro-visual">
          <div className="intro-tag"><span className="outline-num">01</span> A PLACE TO START, AS YOU ARE</div>
          <figure className="intro-nature-frame">
            <img src="/images/woodland-path.png" alt="A quiet woodland path surrounded by green ferns and soft golden sunlight" width="1024" height="1536" loading="lazy" decoding="async" />
          </figure>
        </div>
        <div>
          <p className="eyebrow">YOU DON&apos;T NEED THE PERFECT WORDS</p>
          <h2>We&apos;ll listen, and find a way forward <em>together.</em></h2>
          <p className="intro-copy">Life can ask a lot of you. You don&apos;t have to have everything figured out before reaching out. We&apos;ll get to know what matters to you and help you find support that feels right, at a pace that works for you.</p>
          
          <div className="intro-media-grid">
            <div className="intro-media-card">
              <div className="intro-media-frame">
                <img src="/images/office-sanctuary.png" alt="LifeWise In-Person Counseling Office in North Fort Worth" loading="lazy" />
              </div>
              <div className="intro-media-label">
                <strong>In-Person Sanctuary</strong>
                <span>North Fort Worth, TX</span>
              </div>
            </div>
            <div className="intro-media-card">
              <div className="intro-media-frame">
                <img src="/images/community-care.png" alt="Care Built Around the Person" loading="lazy" />
              </div>
              <div className="intro-media-label">
                <strong>Care Built Around You</strong>
                <span>Diverse, Affirming Approaches</span>
              </div>
            </div>
          </div>

          <a className="under-link" href={consultation}>Start with a conversation <span>↗</span></a>
        </div>
      </section>

      {/* ── Luxury Philosophy Editorial Section ── */}
      <section className="philosophy-section">
        <div className="philosophy-glow" aria-hidden="true" />
        <div className="philosophy-inner">
          <span className="philosophy-symbol">“</span>
          <blockquote className="philosophy-quote">
            Healing is not about fixing what is broken. It is about remembering who you are when you no longer have to carry it all alone.
          </blockquote>
          <div className="philosophy-meta">
            <span className="philosophy-gold-line" />
            <p className="philosophy-caption">LIFEWISE CLINICAL PRACTICE &bull; NORTH FORT WORTH &amp; STATEWIDE TEXAS</p>
          </div>
        </div>
      </section>

      <section className="support" id="support">
        <SectionDivider />
        <div className="section-head">
          <div>
            <p className="eyebrow">COUNSELING THAT MEETS YOU WHERE YOU ARE</p>
            <h2>Support for the life{' '}you&apos;re living.</h2>
          </div>
          <p>Practical, affirming counseling for the things you&apos;re carrying and the people you care about.</p>
        </div>
        <div className="area-grid">
          {areas.map((area) => (
            <article className="area-card" key={area.num}>
              <div className="area-card-thumb">
                <img src={area.image} alt={area.title} loading="lazy" />
                <span className="area-badge">{area.badge}</span>
              </div>
              <div className="area-card-body">
                <div className="area-card-header">
                  <span className="area-card-num">{area.num}</span>
                  <span className="area-card-arrow">↗</span>
                </div>
                <h3>{area.title}</h3>
                <p>{area.desc}</p>
                <div className="area-card-tags">
                  {area.tags.map((tag) => (
                    <span key={tag} className="area-tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="population-row">
          <p className="eyebrow">CARE THAT UNDERSTANDS YOUR WORLD</p>
          <p>First responders <i /> Military members &amp; veterans <i /> Helping professionals <i /> LGBTQIA+ clients <i /> Neurodivergent adults</p>
        </div>
      </section>

      <section className="recognition">
        <span className="recognition-star">✳</span>
        <p>Grounded, human care. <a href="https://lifewisetx.com/featured-in-the-dallas-voyager/">Read our feature in Dallas Voyager <b>↗</b></a></p>
      </section>

      <section className="team-section" id="team">
        <SectionDivider />
        <div className="team-heading">
          <div>
            <p className="eyebrow">THE PEOPLE BEHIND YOUR CARE</p>
            <h2>A team with room{' '}for <em>your story.</em></h2>
          </div>
          <div>
            <p>Our team brings different personalities, backgrounds, strengths, and approaches to the work. We can help you find a provider who feels right for you.</p>
            <a className="under-link" href="https://lifewisetx.com/careteam/">Get to know the team <span>↗</span></a>
          </div>
        </div>
        <div className="team-grid">
          {team.map((person, index) => (
            <a className="team-person" key={person.name} href={person.href}>
              <div className={`team-photo team-photo-${index + 1}`}>
                <img src={person.image} alt={person.name} loading="lazy" />
              </div>
              <div className="team-person-copy">
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>
      
      {/* ── Elevated Sanctuary Experience ── */}
      <section className="sanctuary-banner" id="sanctuary">
        <SectionDivider tone="dark" />
        <div className="sanctuary-backdrop">
          <img src="/images/atrium-banner.png" alt="LifeWise Calming Atrium Sanctuary" loading="lazy" />
          <div className="sanctuary-gradient" />
        </div>
        <div className="sanctuary-content">
          <div className="sanctuary-prestige-tag"><span>✦</span> THE SANCTUARY EXPERIENCE</div>
          <h2>A space designed for{' '}<em>calm, dignity &amp; clarity.</em></h2>
          <p>Whether connecting from the privacy of your home across Texas or stepping through our doors in North Fort Worth, our care is anchored in unhurried presence, warmth, and real understanding.</p>
          
          <div className="sanctuary-features-grid">
            <div className="sanctuary-feature-card">
              <div className="feature-icon">✦</div>
              <h4>Unhurried Sessions</h4>
              <p>Care structured with room to breathe, uncompressed by standard clinical rush or sterile environments.</p>
            </div>
            <div className="sanctuary-feature-card">
              <div className="feature-icon">✦</div>
              <h4>Acoustic Privacy</h4>
              <p>Discrete, sound-insulated counseling suites in North Fort Worth with calming natural textures and hospitality.</p>
            </div>
            <div className="sanctuary-feature-card">
              <div className="feature-icon">✦</div>
              <h4>Statewide Telehealth</h4>
              <p>Bank-grade encrypted, high-fidelity video appointments available across all 254 Texas counties.</p>
            </div>
          </div>

          <div className="sanctuary-actions">
            <a className="sanctuary-cta" href={consultation}>Experience thoughtful counseling <b>↗</b></a>
            <span className="sanctuary-note">No waitlists &bull; Complimentary initial conversation</span>
          </div>
        </div>
      </section>

      {/* ── The LifeWise Journal / Reflections ── */}
      <section className="reflections-section" id="reflections">
        <SectionDivider />
        <div className="section-head">
          <div>
            <p className="eyebrow">THE LIFEWISE JOURNAL &bull; BETWEEN SESSIONS</p>
            <h2>Perspectives from{' '}<em>our counselors.</em></h2>
          </div>
          <p>Thoughtful writings on identity, mental health, emotional boundaries, and the human side of healing.</p>
        </div>
        <div className="reflections-grid">
          {reflections.map((ref) => (
            <article className="reflection-card" key={ref.title}>
              <div className="reflection-media">
                <img src={ref.image} alt={ref.title} loading="lazy" />
                <span className="reflection-pill">{ref.category}</span>
              </div>
              <div className="reflection-body">
                <div className="reflection-meta-top">
                  <time>{ref.date}</time>
                  <span className="reflection-read-time">{ref.readTime}</span>
                </div>
                <h3>{ref.title}</h3>
                <p>{ref.desc}</p>
                <div className="reflection-footer">
                  <span className="reflection-author">{ref.author}</span>
                  <a className="reflection-link" href={ref.href}>Read reflection <span>↗</span></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="coverage" id="coverage">
        <div>
          <p className="eyebrow">MAKING CARE MORE ACCESSIBLE</p>
          <h2>Let&apos;s start with{' '}<em>what works.</em></h2>
          <p>See accepted insurance plans and self-pay information, then reach out if you would like help checking your benefits.</p>
          <a className="under-link" href="https://lifewisetx.com/pricing/">Insurance &amp; pricing <span>↗</span></a>
        </div>
        <div className="coverage-card">
          <small>INSURANCE &amp; PAYMENT</small>
          <h3>A clearer path to care.</h3>
          <ul>
            <li>Accepted insurance plans</li>
            <li>Benefits and coverage information</li>
            <li>Self-pay rates and Good Faith Estimate details</li>
            <li>Questions about your plan? Ask us before scheduling</li>
          </ul>
        </div>
        <SectionDivider />
      </section>

      <section className="faq" id="faq">
        <SectionDivider />
        <div className="faq-heading">
          <p className="eyebrow">A FEW THINGS YOU MAY BE WONDERING</p>
          <h2>Good questions.{' '}<em>Clear answers.</em></h2>
          <a className="under-link" href="https://lifewisetx.com/frequently-asked-questions/">More frequently asked questions <span>↗</span></a>
        </div>
        <div className="faq-list">
          <details><summary>Do you offer virtual counseling throughout Texas?</summary><p>Yes. LifeWise offers virtual counseling across Texas.</p></details>
          <details><summary>Do you offer in-person appointments?</summary><p>In-person care is available in North Fort Worth.</p></details>
          <details><summary>Do you accept insurance or EAP benefits?</summary><p>Plan participation can vary. Check the current insurance information, or ask us to help confirm your benefits before scheduling.</p></details>
          <details><summary>How do I know which provider may be a good fit?</summary><p>Start with a complimentary 15-minute conversation. We&apos;ll learn what you&apos;re looking for and help you explore a provider who may fit your needs.</p></details>
          <details><summary>Do I have to talk about everything right away?</summary><p>No. You can move at a pace that feels manageable and share only what you&apos;re ready to share.</p></details>
        </div>
      </section>

      <section className="referrals">
        <SectionDivider />
        <div>
          <p className="eyebrow">FOR PROFESSIONALS &amp; FUTURE COUNSELORS</p>
          <h2>Let&apos;s make a thoughtful connection.</h2>
          <p>Contact us to ask about professional referrals, LPC supervision, and counselor development opportunities. We&apos;ll share the appropriate next steps before you send client information.</p>
        </div>
        <a href="mailto:lifewise@lifewisetx.com?subject=Professional%20inquiry">Contact LifeWise <span>↗</span></a>
      </section>

      <section className="crisis">
        <div>
          <p className="eyebrow">NEED SUPPORT RIGHT NOW?</p>
          <h2>If you&apos;re in immediate danger or facing a medical emergency, call 911.</h2>
          <p>If you or someone you know is in crisis, call or text 988, or chat with the 988 Lifeline.</p>
        </div>
        <a href="https://988lifeline.org/get-help/" target="_blank" rel="noreferrer">988 Lifeline <span>↗</span></a>
      </section>

      <section className="closing">
        <SectionDivider tone="dark" />
        <p className="eyebrow">WHENEVER YOU&apos;RE READY</p>
        <h2>A small first conversation can help you see what comes next.</h2>
        <p>No pressure to have everything figured out.</p>
        <a href={consultation}>Choose a consultation time <span>↗</span></a>
      </section>
    </main>

    {/* ── Luxury Concierge Capsule Dock ── */}
    {showConcierge && !dismissConcierge && (
      <aside className="concierge-dock" aria-label="LifeWise concierge consultation access">
        <div className="concierge-inner">
          <div className="concierge-status">
            <span className="concierge-dot" />
            <div className="concierge-info">
              <strong>LifeWise Concierge</strong>
              <span>Complimentary 15-Minute Consultation</span>
            </div>
          </div>
          <a className="concierge-btn" href={consultation}>Reserve Time ↗</a>
          <button className="concierge-close" onClick={() => setDismissConcierge(true)} aria-label="Close concierge banner" title="Close">✕</button>
        </div>
      </aside>
    )}

    <footer>
      <div className="footer-main">
        <div className="footer-brand-block">
          <a className="footer-logo" href="#home" aria-label="LifeWise home"><img src="/images/lifewise-logo.png" alt="LifeWise Counseling and Wellness" /></a>
          <p>Virtual counseling throughout Texas, with in-person care in North Fort Worth.</p>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <a href="#support">Services</a>
          <a href="#approach">Our approach</a>
          <a href="#team">Meet the team</a>
          <a href="#faq">FAQs</a>
        </div>
        <div className="footer-column">
          <h2>Helpful information</h2>
          <a href="https://lifewisetx.com/pricing/">Insurance &amp; pricing</a>
          <a href="https://lifewisetx.com/referral-partners/">Professional referrals</a>
          <a href="https://lifewisetx.com/supervision/">LPC supervision</a>
          <a href="https://lifewisetx.com/website-privacy-policy/">Privacy</a>
          <a href="https://lifewisetx.com/client-information-and-website-disclosures/">Client rights &amp; disclosures</a>
        </div>
        <div className="footer-column footer-contact">
          <h2>Start a conversation</h2>
          <a className="footer-book" href={consultation}>Book a consultation <span>↗</span></a>
          <a href="tel:+18176028520">817.602.8520</a>
          <a href="mailto:lifewise@lifewisetx.com">lifewise@lifewisetx.com</a>
          <small>For emergencies call 911. For immediate crisis support call or text 988.</small>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© 2026 LifeWise Counseling and Wellness, PLLC. All rights reserved.</small>
        <a href="https://988lifeline.org/get-help/">988 Lifeline <span>↗</span></a>
      </div>
    </footer>
  </>;
}

export default App;
