import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const consultation = 'https://lifewisetx.com/consultation/';
const team = [
  { name: 'Stacy Hixon', role: 'Clinical Director', image: '/images/team-stacy.png', href: 'https://lifewisetx.com/stacy/' },
  { name: 'Martha Sharpe', role: 'LPC Associate', image: '/images/team-martha.png', href: 'https://lifewisetx.com/martha-sharpe/' },
  { name: 'Caity Boyd', role: 'Graduate Counseling Intern', image: '/images/team-caity.png', href: 'https://lifewisetx.com/caity-boyd/' },
  { name: 'Hazel Dettmer', role: 'Group Facilitator', image: '/images/team-hazel.png', href: 'https://lifewisetx.com/hazel-dettmer/' },
];
const areas = [
  ['01', 'Individual counseling', 'Support for anxiety, depression, trauma, stress, burnout, and life transitions.'],
  ['02', 'Neurodivergent & affirming care', 'Respectful counseling for neurodivergent adults and LGBTQIA+ clients.'],
  ['03', 'Couples & relationships', 'Make room for clearer communication, connection, and understanding.'],
];

function ModelStage({ onReady }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 3000);
    camera.position.z = 390;
    const hemi = new THREE.HemisphereLight(0xf7f6ee, 0x315e53, 2.25);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffedce, 3.2);
    key.position.set(-110, 160, 220);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xc9e1dc, 2.1);
    fill.position.set(140, -80, 120);
    scene.add(fill);
    const modelMaterials = [];
    let currentDarkTheme = document.documentElement.dataset.theme === 'dark';
    const applyModelTheme = (dark) => {
      currentDarkTheme = dark;
      modelMaterials.forEach((material) => material.color.set(dark ? 0xffffff : 0x253f4d));
      hemi.color.set(dark ? 0xffffff : 0xf7f6ee);
      hemi.groundColor.set(dark ? 0x18212a : 0x315e53);
      hemi.intensity = dark ? 1.35 : 2.25;
      key.color.set(dark ? 0xffffff : 0xffedce);
      key.intensity = dark ? 1.9 : 3.2;
      fill.color.set(dark ? 0xc8d6e2 : 0xc9e1dc);
      fill.intensity = dark ? 0.8 : 2.1;
    };
    const onThemeChange = (event) => applyModelTheme(Boolean(event.detail?.dark));
    window.addEventListener('lifewise-theme-change', onThemeChange);
    applyModelTheme(document.documentElement.dataset.theme === 'dark');
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pulseOrigin = { value: new THREE.Vector3() };
    const pulseStart = { value: -10 };
    const pulseNow = { value: 0 };
    const latestHitPoint = new THREE.Vector3();
    let hoveringModel = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previousFrameTime = 0;
    let motionTime = 0;

    let model;
    let frame;
    let disposed = false;
    const loader = new OBJLoader();
    loader.load('/models/female_bust.obj', (object) => {
      if (disposed) return;
      const bounds = new THREE.Box3().setFromObject(object);
      const dimensions = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      // Keep the whole bust visible within the viewport, without a surrounding card.
      const scale = 300 / Math.max(dimensions.x, dimensions.y, dimensions.z);
      object.position.sub(center.multiplyScalar(scale));
      object.scale.setScalar(scale);
      object.traverse((part) => {
        if (!part.isMesh) return;
        const material = new THREE.MeshStandardMaterial({ color: currentDarkTheme ? 0xffffff : 0x253f4d, roughness: 0.7, metalness: 0.04, side: THREE.DoubleSide });
        modelMaterials.push(material);
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uPulseOrigin = pulseOrigin;
          shader.uniforms.uPulseStart = pulseStart;
          shader.uniforms.uPulseNow = pulseNow;
          shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vPulseWorldPosition;');
          shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvPulseWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;');
          shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vPulseWorldPosition;\nuniform vec3 uPulseOrigin;\nuniform float uPulseStart;\nuniform float uPulseNow;');
          shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
            float pulseAge = uPulseNow - uPulseStart;
            float pulseRadius = pulseAge * 220.0;
            float pulseBand = 1.0 - smoothstep(0.0, 13.0, abs(length(vPulseWorldPosition - uPulseOrigin) - pulseRadius));
            float pulseFade = 1.0 - smoothstep(1.0, 1.75, pulseAge);
            outgoingLight += vec3(0.28, 0.92, 0.48) * pulseBand * pulseFade * 2.2;
            #include <opaque_fragment>`);
        };
        part.material = material;
        part.geometry.computeVertexNormals();
      });
      model = object;
      scene.add(model);
      model.updateMatrixWorld(true);
      setStatus('ready');
      requestAnimationFrame(() => requestAnimationFrame(onReady));
    }, undefined, (error) => {
      console.error('The 3D model could not be loaded.', error);
      setStatus('error');
      onReady();
    });

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = window.innerWidth < 700 ? 430 : 390;
      camera.updateProjectionMatrix();
    };
    const onPointerMove = (event) => {
      if (!model) return;
      const rect = canvas.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(model, true)[0];
      if (hit) latestHitPoint.copy(hit.point);
      if (hit && !hoveringModel) {
        pulseOrigin.value.copy(latestHitPoint);
        pulseStart.value = performance.now() / 1000;
      }
      hoveringModel = Boolean(hit);
    };
    const onPointerLeave = () => { hoveringModel = false; };
    // Keep the same canvas in view through the intro, then fade it before the service cards.
    const tick = () => {
      const frameTime = performance.now() / 1000;
      const delta = previousFrameTime ? Math.min(frameTime - previousFrameTime, 0.05) : 0;
      previousFrameTime = frameTime;
      if (!prefersReducedMotion) motionTime += delta;
      const scrollProgress = window.scrollY / Math.max(window.innerHeight, 1);
      const progress = THREE.MathUtils.clamp(scrollProgress, 0, 1);
      pulseNow.value = frameTime;
      if (model) {
        // A restrained idle sway gives the bust life without making it spin in place.
        // Its breathing drift fades out as the scroll-led transition takes over.
        const idleWeight = prefersReducedMotion ? 0 : 1 - THREE.MathUtils.smoothstep(progress, 0.04, 0.34);
        const slowBreath = Math.sin(motionTime * 0.72);
        const quietSway = Math.sin(motionTime * 0.43 + 0.8);
        model.position.x = THREE.MathUtils.lerp(0, -135, progress);
        model.position.y = THREE.MathUtils.lerp(-105, -65, progress) + slowBreath * 2.4 * idleWeight;
        const baseScale = THREE.MathUtils.lerp(1, 0.82, progress);
        model.scale.setScalar(baseScale * (1 + slowBreath * 0.004 * idleWeight));
        model.rotation.y = progress * 1.15 + quietSway * 0.045 * idleWeight;
        model.rotation.x = slowBreath * 0.012 * idleWeight;
        model.rotation.z = progress * -0.05 + quietSway * 0.008 * idleWeight;
      }
      if (hoveringModel && pulseNow.value - pulseStart.value >= 1.75) {
        pulseOrigin.value.copy(latestHitPoint);
        pulseStart.value = pulseNow.value;
      }
      canvas.parentElement.style.opacity = String(THREE.MathUtils.clamp((2.05 - scrollProgress) / 0.18, 0, 1));
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', onPointerLeave);
    tick();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onPointerLeave);
      window.removeEventListener('lifewise-theme-change', onThemeChange);
      if (model) model.traverse((part) => { if (part.isMesh) { part.geometry.dispose(); part.material.dispose(); } });
      renderer.dispose();
    };
  }, []);

  return <div className={`model-stage ${status}`} aria-label="Three dimensional model artwork">
    <canvas ref={canvasRef} />
    {status !== 'ready' && <div className="model-fallback">{status === 'loading' ? 'PREPARING THE ARTWORK' : 'A SPACE TO PAUSE AND BEGIN'}</div>}
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return window.localStorage.getItem('lifewise-theme') === 'dark'; }
    catch { return false; }
  });
  const [siteLoading, setSiteLoading] = useState(true);
  const finishLoading = useCallback(() => setSiteLoading(false), []);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    try { window.localStorage.setItem('lifewise-theme', darkMode ? 'dark' : 'light'); } catch { /* Storage may be disabled. */ }
    window.dispatchEvent(new CustomEvent('lifewise-theme-change', { detail: { dark: darkMode } }));
  }, [darkMode]);
  const toggleTheme = (event) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextDarkMode = !darkMode;

    // Apply theme immediately (updates DOM + storage + 3-D model colours).
    const applyTheme = () => {
      setDarkMode(nextDarkMode);
    };

    // No View Transitions support or reduced-motion: switch instantly.
    if (prefersReduced || !document.startViewTransition) {
      applyTheme();
      return;
    }

    // Compute the clip-path origin from the toggle button centre.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Expose the origin to CSS via custom properties on <html>.
    document.documentElement.style.setProperty('--vt-x', `${x}px`);
    document.documentElement.style.setProperty('--vt-y', `${y}px`);
    document.documentElement.style.setProperty('--vt-r', `${endRadius}px`);

    const transition = document.startViewTransition(applyTheme);

    // Clean up custom properties once the transition is fully done.
    transition.finished.then(() => {
      document.documentElement.style.removeProperty('--vt-x');
      document.documentElement.style.removeProperty('--vt-y');
      document.documentElement.style.removeProperty('--vt-r');
    });
  };
  useEffect(() => {
    if (!siteLoading) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [siteLoading]);
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll('.intro-tag, .intro > div:last-child, .area-card, .coverage > div, .closing .eyebrow, .closing h2, .closing > p:not(.eyebrow), .closing > a, .team-person, .faq-list details, .recognition, .referrals > div, .referrals > a, .crisis > div, .crisis > a, .coverage-card, .section-head, .team-heading, .population-row, .faq-heading');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 6) * 80}ms`);
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);
  return <>
    <div className="topline"><span>COUNSELING &amp; WELLNESS</span><i /> Serving Texans virtually, with in-person care in North Fort Worth <a href={consultation}>Begin with a complimentary 15-minute conversation <b>↗</b></a></div>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="LifeWise home"><img src="/images/lifewise-logo.png" alt="LifeWise Counseling and Wellness" /></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#support" onClick={() => setMenuOpen(false)}>Services</a><a href="#team" onClick={() => setMenuOpen(false)}>Our team</a><a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a><a href="#coverage" onClick={() => setMenuOpen(false)}>Insurance &amp; pricing</a><a className="nav-button" href={consultation}>Book a consultation <b>↗</b></a>
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 14.2A8.4 8.4 0 0 1 9.8 3.2 8.8 8.8 0 1 0 20.8 14.2Z"/></svg>}
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><span /><span /></button>
      </div>
    </header>

    <ModelStage onReady={finishLoading} />
    <div className={`loader-screen${siteLoading ? ' is-loading' : ' is-loaded'}`} aria-hidden={!siteLoading}>
      <div className="loader-center"><div className="loader-orbit"><i /></div><p>MAKING A LITTLE SPACE TO BEGIN</p></div>
      <div className="loader-bottom"><span>COUNSELING ACROSS TEXAS</span><span className="loader-line"><i /></span><span>LOADING YOUR EXPERIENCE</span></div>
    </div>
    <main id="home">
  <section className="hero"><div className="hero-arc" aria-hidden="true" />
    <div className="hero-meta">ADULTS, COUPLES &amp; FAMILIES <i /> TEXAS</div>
    <h1 className="hero-title title-one">Come<br />as you are.</h1>
    <div className="hero-title title-two">We&apos;ll meet<br /><em>you there.</em></div>
    <aside className="hero-aside"><span>✳</span><p>Support for anxiety, trauma, neurodivergence, relationships, and life&apos;s harder seasons.</p></aside>
    <div className="hero-locations"><span>VIRTUAL COUNSELING</span><b>ACROSS TEXAS</b><span>IN PERSON</span><b>NORTH FORT WORTH</b></div>
    <a className="hero-cta" href={consultation}>START WITH A 15-MINUTE CONVERSATION <b>↗</b></a>
    <div className="scroll-hint"><i /> SCROLL TO EXPLORE</div>
  </section>
  <section className="intro" id="approach">
    <div className="intro-tag">01 — A PLACE TO START, AS YOU ARE</div>
    <div><p className="eyebrow">YOU DON&apos;T NEED THE PERFECT WORDS</p><h2>We&apos;ll listen, and find a way forward <em>together.</em></h2><p className="intro-copy">Life can ask a lot of you. You don&apos;t have to have everything figured out before reaching out. We&apos;ll get to know what matters to you and help you find support that feels right, at a pace that works for you.</p><a className="under-link" href={consultation}>Start with a conversation <span>↗</span></a></div>
  </section>
  <section className="support" id="support"><div className="section-head"><div><p className="eyebrow">COUNSELING THAT MEETS YOU WHERE YOU ARE</p><h2>Support for the life<br />you&apos;re living.</h2></div><p>Practical, affirming counseling for the things you&apos;re carrying and the people you care about.</p></div><div className="area-grid">{areas.map(([n, title, desc]) => <article className="area-card" key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p><i>↗</i></article>)}</div><div className="population-row"><p className="eyebrow">CARE THAT UNDERSTANDS YOUR WORLD</p><p>First responders <i /> Military members &amp; veterans <i /> Helping professionals <i /> LGBTQIA+ clients <i /> Neurodivergent adults</p></div></section>
  <section className="recognition"><span className="recognition-star">✳</span><p>Grounded, human care. <a href="https://lifewisetx.com/featured-in-the-dallas-voyager/">Read our feature in Dallas Voyager <b>↗</b></a></p></section>
  <section className="team-section" id="team"><div className="team-heading"><div><p className="eyebrow">THE PEOPLE BEHIND YOUR CARE</p><h2>A team with room<br />for <em>your story.</em></h2></div><div><p>Our team brings different personalities, backgrounds, strengths, and approaches to the work. We can help you find a provider who feels right for you.</p><a className="under-link" href="https://lifewisetx.com/careteam/">Get to know the team <span>↗</span></a></div></div><div className="team-grid">{team.map((person, index) => <a className="team-person" key={person.name} href={person.href}><div className={`team-photo team-photo-${index + 1}`}><img src={person.image} alt={person.name} loading="lazy" /></div><div className="team-person-copy"><div><h3>{person.name}</h3><p>{person.role}</p></div><span aria-hidden="true">↗</span></div></a>)}</div></section>
  <section className="coverage" id="coverage"><div><p className="eyebrow">MAKING CARE MORE ACCESSIBLE</p><h2>Let&apos;s start with<br /><em>what works.</em></h2><p>See accepted insurance plans and self-pay information, then reach out if you would like help checking your benefits.</p><a className="under-link" href="https://lifewisetx.com/pricing/">Insurance &amp; pricing <span>↗</span></a></div><div className="coverage-card"><small>INSURANCE &amp; PAYMENT</small><h3>A clearer path to care.</h3><ul><li>Accepted insurance plans</li><li>Benefits and coverage information</li><li>Self-pay rates and Good Faith Estimate details</li><li>Questions about your plan? Ask us before scheduling</li></ul></div></section>
  <section className="faq" id="faq"><div className="faq-heading"><p className="eyebrow">A FEW THINGS YOU MAY BE WONDERING</p><h2>Good questions.<br /><em>Clear answers.</em></h2><a className="under-link" href="https://lifewisetx.com/frequently-asked-questions/">More frequently asked questions <span>↗</span></a></div><div className="faq-list">
    <details><summary>Do you offer virtual counseling throughout Texas?</summary><p>Yes. LifeWise offers virtual counseling across Texas.</p></details>
    <details><summary>Do you offer in-person appointments?</summary><p>In-person care is available in North Fort Worth.</p></details>
    <details><summary>Do you accept insurance or EAP benefits?</summary><p>Plan participation can vary. Check the current insurance information, or ask us to help confirm your benefits before scheduling.</p></details>
    <details><summary>How do I know which provider may be a good fit?</summary><p>Start with a complimentary 15-minute conversation. We&apos;ll learn what you&apos;re looking for and help you explore a provider who may fit your needs.</p></details>
    <details><summary>Do I have to talk about everything right away?</summary><p>No. You can move at a pace that feels manageable and share only what you&apos;re ready to share.</p></details>
  </div></section>
  <section className="referrals"><div><p className="eyebrow">FOR PROFESSIONALS &amp; FUTURE COUNSELORS</p><h2>Let&apos;s make a thoughtful connection.</h2><p>Contact us to ask about professional referrals, LPC supervision, and counselor development opportunities. We&apos;ll share the appropriate next steps before you send client information.</p></div><a href="mailto:lifewise@lifewisetx.com?subject=Professional%20inquiry">Contact LifeWise <span>↗</span></a></section>
  <section className="crisis"><div><p className="eyebrow">NEED SUPPORT RIGHT NOW?</p><h2>If you&apos;re in immediate danger or facing a medical emergency, call 911.</h2><p>If you or someone you know is in crisis, call or text 988, or chat with the 988 Lifeline.</p></div><a href="https://988lifeline.org/get-help/" target="_blank" rel="noreferrer">988 Lifeline <span>↗</span></a></section>
  <section className="closing"><p className="eyebrow">WHENEVER YOU&apos;RE READY</p><h2>A small first conversation can help you see what comes next.</h2><p>No pressure to have everything figured out.</p><a href={consultation}>Choose a consultation time <span>↗</span></a></section>
</main>
<footer><div className="footer-main"><div className="footer-brand-block"><a className="footer-logo" href="#home" aria-label="LifeWise home"><img src="/images/lifewise-logo.png" alt="LifeWise Counseling and Wellness" /></a><p>Virtual counseling throughout Texas, with in-person care in North Fort Worth.</p></div><div className="footer-column"><h2>Explore</h2><a href="#support">Services</a><a href="#approach">Our approach</a><a href="#team">Meet the team</a><a href="#faq">FAQs</a></div><div className="footer-column"><h2>Helpful information</h2><a href="https://lifewisetx.com/pricing/">Insurance &amp; pricing</a><a href="https://lifewisetx.com/referral-partners/">Professional referrals</a><a href="https://lifewisetx.com/supervision/">LPC supervision</a><a href="https://lifewisetx.com/website-privacy-policy/">Privacy</a><a href="https://lifewisetx.com/client-information-and-website-disclosures/">Client rights &amp; disclosures</a></div><div className="footer-column footer-contact"><h2>Start a conversation</h2><a className="footer-book" href={consultation}>Book a consultation <span>↗</span></a><a href="tel:+18176028520">817.602.8520</a><a href="mailto:lifewise@lifewisetx.com">lifewise@lifewisetx.com</a><small>For emergencies call 911. For immediate crisis support call or text 988.</small></div></div><div className="footer-bottom"><small>© 2026 LifeWise Counseling and Wellness, PLLC. All rights reserved.</small><a href="https://988lifeline.org/get-help/">988 Lifeline <span>↗</span></a></div></footer>
  </>;
}

export default App;
