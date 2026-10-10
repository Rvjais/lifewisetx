import React from 'react';
import media from './media.json';

function Action({ href = '/consultation/', children = 'Start a conversation' }) {
  return <a className="page-button" href={href}>{children}<span aria-hidden="true">↗</span></a>;
}

function ExperienceHero({ eyebrow, title, accent, description, image }) {
  return <section className="page-hero page-hero--split">
    <div className="page-hero-copy"><div className="page-breadcrumb"><a href="/">Home</a><span>/</span><span>{eyebrow}</span></div><p className="eyebrow">{eyebrow}</p><h1>{title} <em>{accent}</em></h1><p className="page-lead">{description}</p><div className="page-hero-actions"><Action /><a className="page-text-link" href="/careteam/">Meet the people behind your care ↗</a></div></div>
    <figure className="page-hero-image"><img src={image.src} alt={image.alt} style={{ objectPosition: image.position || 'center 35%' }} /></figure>
  </section>;
}

function Ending({ title, description }) {
  return <section className="page-closing"><p className="eyebrow">WHENEVER YOU’RE READY</p><h2>{title}</h2><p>{description}</p><Action>Book a complimentary consultation</Action></section>;
}

export function ApproachPage() {
  const process = [
    ['A first conversation', 'A complimentary 15-minute consultation gives us a chance to understand what you need, answer questions, and explore provider and payment options.'],
    ['Get to know your story', 'The intake session is a space to clarify your concerns and goals, understand your experiences, and begin building a working relationship.'],
    ['Look beneath the surface', 'Assessments help your provider understand symptoms, patterns, strengths, and areas that may need support.'],
    ['Build a plan together', 'You and your provider decide on treatment goals, areas of focus, and practical ways to track what is changing.'],
    ['Notice what is working', 'Ongoing sessions make room to review progress, explore barriers, and adjust the work around your needs.'],
    ['Carry the work forward', 'As goals are met, you can review what you have learned and plan for maintaining the changes that matter to you.'],
  ];
  return <div className="experience-page">
    <ExperienceHero eyebrow="OUR APPROACH" title="Care built around" accent="the person." description="You’re a person with a story, strengths, and goals. Our work begins with understanding you and building a relationship where you feel safe, respected, and heard." image={media['approach-hero']} />
    <section className="page-section experience-introduction"><div><p className="eyebrow">COME AS YOU ARE</p><h2>You don’t need<br /><em>the perfect words.</em></h2></div><div><p>Life can ask a lot of you. You don’t have to have everything figured out before reaching out. We’ll get to know what matters to you and help you find support that feels right, at a pace that works for you.</p><p>Our providers bring different backgrounds, personalities, and approaches. We consider your needs, preferences, and goals when helping you find a provider. If another type of care would better meet your needs, we’ll discuss that openly.</p><a className="page-text-link" href="/services/">Explore our services ↗</a></div></section>
    <section className="page-section experience-principles"><div className="page-section-heading"><div><p className="eyebrow">GROUNDED IN HUMAN CARE</p><h2>Your experience.<br /><em>Your voice. Your pace.</em></h2></div><p>Our trauma-informed approach centers safety, trust, choice, and collaboration.</p></div><div className="experience-principle-grid">{[
      ['Safety & trust', 'We make room to understand your experiences without reducing your story to a diagnosis or a problem to be fixed.'],
      ['Choice & collaboration', 'Your goals help shape the work. We build a plan together and keep talking about what feels useful and manageable.'],
      ['Context & understanding', 'We consider how your history, relationships, environment, and ways of coping may shape what you are experiencing now.'],
    ].map(([title, text], i) => <article key={title}><span>{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="page-section experience-human"><figure><img src={media['approach-conversation'].src} alt={media['approach-conversation'].alt} loading="lazy" /></figure><div><p className="eyebrow">THE RELATIONSHIP MATTERS</p><h2>Professional care.<br /><em>A human connection.</em></h2><p>The fit between you and your counselor matters. We speak in clear, comfortable language, take your goals seriously, and make space for the complicated parts of being human.</p><p>You can begin with what is happening now. You don’t have to describe every difficult experience before you’re ready.</p><a className="page-text-link" href="/careteam/">Get to know your care team ↗</a></div></section>
    <section className="page-section page-section--sage"><div className="page-section-heading"><div><p className="eyebrow">HOW THE WORK UNFOLDS</p><h2>A thoughtful process.<br /><em>Built together.</em></h2></div><p>Counseling stays focused on your goals, with room to review and adjust along the way.</p></div><div className="experience-process">{process.map(([title, text], i) => <article key={title}><span>{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div><a className="page-text-link experience-process-link" href="/2026/05/28/this-is-how-we-do-it-therapeutic-process-at-lifewise/">Read more about our therapeutic process ↗</a></section>
    <Ending title="A conversation is a place to begin." description="Bring your questions, your uncertainty, and whatever words you have. We’ll help you explore the next step." />
  </div>;
}

export function SanctuaryPage() {
  return <div className="experience-page sanctuary-page">
    <ExperienceHero eyebrow="THE SANCTUARY EXPERIENCE" title="A little space" accent="to settle." description="In person in North Fort Worth or connecting from your own space across Texas, care begins with warmth, dignity, and real understanding." image={media['sanctuary-garden']} />
    <section className="page-section experience-introduction"><div><p className="eyebrow">ROOM TO BREATHE</p><h2>Calm, dignity,<br /><em>and clarity.</em></h2></div><div><p>Counseling gives you a space to slow down, speak openly, and focus on what matters to you. You don’t have to have everything figured out before you arrive.</p><p>Whether you prefer in-person sessions or virtual appointments, we can help you explore the available options and find a provider who fits your needs.</p></div></section>
    <section className="page-section experience-human sanctuary-room"><figure><img src="/images/office-sanctuary.png" alt="The LifeWise counseling room with two chairs, soft lighting, and warm furnishings" loading="lazy" /></figure><div><p className="eyebrow">IN PERSON / NORTH FORT WORTH</p><h2>A welcoming room.<br /><em>A little time for you.</em></h2><p>In-person counseling is available in North Fort Worth. A complimentary consultation can help you confirm which provider and appointment format may work for you.</p><div className="sanctuary-format-note"><span aria-hidden="true">✦</span><p>In-person availability varies by provider and location. Ask us about the options before scheduling.</p></div><Action>Explore in-person care</Action></div></section>
    <section className="page-section experience-principles"><div className="page-section-heading"><div><p className="eyebrow">VIRTUAL COUNSELING THROUGHOUT TEXAS</p><h2>Thoughtful care,<br /><em>where you are.</em></h2></div><p>Online sessions offer another way to connect with your provider while you are physically located in Texas.</p></div><div className="experience-principle-grid">{[
      ['Make room for privacy', 'Choose a quiet space where you can talk comfortably and be free from interruptions.'],
      ['Settle in before you begin', 'Allow a few minutes to check your connection and get comfortable. Headphones may help you create a more private space.'],
      ['Find the right format', 'We can talk through virtual and in-person options during your consultation and help you explore what fits your life.'],
    ].map(([title, text], i) => <article key={title}><span>{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="page-section sanctuary-contact"><div><p className="eyebrow">PLAN YOUR FIRST STEP</p><h2>We’ll help you<br /><em>find your way.</em></h2><p>Start with a complimentary 15-minute consultation to discuss your needs, provider fit, appointment options, and payment.</p></div><div><a href="/consultation/">Choose a consultation time <span>↗</span></a><a href="/pricing/">Review insurance & pricing <span>↗</span></a><a href="/frequently-asked-questions/">Read frequently asked questions <span>↗</span></a><a href="mailto:lifewise@lifewisetx.com">lifewise@lifewisetx.com <span>↗</span></a></div></section>
    <Ending title="Come as you are." description="There’s room for your story. Start with a conversation and explore care that feels right for you." />
  </div>;
}
