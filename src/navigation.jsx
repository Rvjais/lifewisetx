import React, { useEffect, useRef, useState } from 'react';

export default function SiteHeader({ path, scrolled, services }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const serviceButtonRef = useRef(null);
  const menuButtonRef = useRef(null);
  const hoverCloseRef = useRef(null);
  const allowHover = () => window.matchMedia('(min-width: 1201px) and (hover: hover) and (pointer: fine)').matches;
  const openOnHover = () => {
    if (!allowHover()) return;
    clearTimeout(hoverCloseRef.current);
    setServicesOpen(true);
  };
  const closeAfterHover = () => {
    if (!allowHover()) return;
    clearTimeout(hoverCloseRef.current);
    hoverCloseRef.current = setTimeout(() => setServicesOpen(false), 180);
  };
  useEffect(() => () => clearTimeout(hoverCloseRef.current), []);
  useEffect(() => {
    const layout = window.matchMedia('(min-width: 1201px)');
    const reset = () => { clearTimeout(hoverCloseRef.current); setMenuOpen(false); setServicesOpen(false); };
    layout.addEventListener('change', reset);
    return () => layout.removeEventListener('change', reset);
  }, []);
  const isService = path === '/services/' || services.some(service => service.path === path);
  useEffect(() => { clearTimeout(hoverCloseRef.current); setMenuOpen(false); setServicesOpen(false); }, [path]);
  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => { if (navRef.current) navRef.current.scrollTop = 0; });
    return () => cancelAnimationFrame(frame);
  }, [menuOpen, servicesOpen]);
  useEffect(() => {
    const dismiss = event => {
      if (event.type === 'keydown' && event.key === 'Escape') {
        if (servicesOpen) { setServicesOpen(false); serviceButtonRef.current?.focus(); }
        else if (menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); }
      } else if (event.type === 'pointerdown' && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false); setServicesOpen(false);
      }
    };
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', dismiss);
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', dismiss); };
  }, [menuOpen, servicesOpen]);
  return <header ref={headerRef} className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <div className="header-inner">
      <a className="brand" href="/" aria-label="LifeWise home"><img src="/images/lifewise-logo.png" alt="LifeWise Counseling and Wellness" /></a>
      <nav ref={navRef} id="main-navigation" aria-label="Main navigation" className={`nav-links${menuOpen ? ' open' : ''}`}>
        <div className={`nav-service-group${servicesOpen ? ' expanded' : ''}${isService ? ' is-current' : ''}`} onPointerEnter={openOnHover} onPointerLeave={closeAfterHover}>
          <div className="nav-service-trigger"><a href="/services/" aria-current={isService ? 'page' : undefined}>Services</a><button ref={serviceButtonRef} type="button" aria-label="Explore services" aria-controls="service-navigation" aria-expanded={servicesOpen} onClick={event => setServicesOpen(open => allowHover() && event.detail > 0 ? true : !open)}><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></button></div>
          <div className="nav-service-menu" id="service-navigation" hidden={!servicesOpen} onPointerEnter={openOnHover} onPointerLeave={closeAfterHover}>
            <div className="nav-menu-intro"><p className="eyebrow">CARE THAT MEETS YOU WHERE YOU ARE</p><h2>A little support.<br /><em>A way forward.</em></h2><p>Explore what feels right for you. We can help you find a place to begin.</p><a href="/consultation/">Start a conversation <span aria-hidden="true">↗</span></a></div>
            <div className="nav-service-options">{services.map((service, i) => <a href={service.path} aria-current={path === service.path ? 'page' : undefined} key={service.path}><small>{String(i + 1).padStart(2, '0')}</small><span>{service.title}</span><b aria-hidden="true">↗</b></a>)}<a className="nav-all-services" href="/services/"><span>Explore all services</span><b aria-hidden="true">↗</b></a></div>
          </div>
        </div>
        <a href="/careteam/" aria-current={path === '/careteam/' ? 'page' : undefined}>Our team</a>
        <a href="/our-approach/" aria-current={path === '/our-approach/' ? 'page' : undefined}>Our approach</a>
        <a href="/sanctuary/" aria-current={path === '/sanctuary/' ? 'page' : undefined}>Sanctuary</a>
        <a href="/reflections/" aria-current={path === '/reflections/' || path.startsWith('/2026/') ? 'page' : undefined}>Reflections</a>
        <a href="/pricing/" aria-current={path === '/pricing/' ? 'page' : undefined}>Insurance & pricing</a>
        <div className="nav-mobile-footer"><a href="/sanctuary/">Discover our Sanctuary <span aria-hidden="true">↗</span></a><a href="/consultation/">Book a consultation <span aria-hidden="true">↗</span></a><p>In North Fort Worth. Online across Texas.</p></div>
      </nav>
      <div className="header-actions"><a className="nav-button" href="/consultation/">Let’s talk <span aria-hidden="true">↗</span></a><button ref={menuButtonRef} className="menu-toggle" type="button" onClick={() => { setMenuOpen(open => !open); setServicesOpen(false); }} aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><span /><span /></button></div>
    </div>
  </header>;
}
