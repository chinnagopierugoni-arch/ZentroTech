import React, { useState } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Menu, X, Code2, BrainCircuit, PanelsTopLeft,
  Workflow, Cloud, HeartPulse, Factory, ShoppingBag, Truck, Rocket,
  BriefcaseBusiness, Check, Plus, Minus, ChevronDown, Mail, Phone,
  MapPin, Linkedin, Instagram, Github, Sparkles, ShieldCheck, Zap,
  Globe2, Layers3, Target, Send, Clock3, MessageCircle, Building2, PlayCircle
} from 'lucide-react';
import { company, services, industries, projects } from './config';
import { submitEnquiry } from './enquiry';
import { api } from './services/api';

const iconMap = { Code2, BrainCircuit, PanelsTopLeft, Workflow, Cloud, HeartPulse, Factory, ShoppingBag, Truck, Rocket, BriefcaseBusiness };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: .11 } } };

function ScrollTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function Logo({ light = false }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Zentro Technologies home">
    <span className="brand-mark"><span></span><span></span><span></span></span>
    <span className="brand-copy"><strong>ZENTRO</strong><small>TECHNOLOGIES</small></span>
  </Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
  const loc = useLocation();
  React.useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 50);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);
  React.useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [loc.pathname]);
  React.useEffect(() => {
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);
  const dropdowns = [
    { label: 'About', path: '/about', items: [['Company overview', '/about'], ['Our approach', '/about'], ['Team', '/about']] },
    { label: 'Services', path: '/services', items: [['Custom Software', '/services'], ['AI & Machine Learning', '/services'], ['Web & Mobile Apps', '/services'], ['Business Automation', '/services']] }
  ];
  const links = [['Home','/'],['Industries','/industries'],['Portfolio','/portfolio'],['Product Demos','/products'],['Careers','/careers']];
  const closeMenus = () => {
    setOpen(false);
    setActiveDropdown(null);
  };
  return <header className={`header ${isScrolled ? 'is-scrolled' : ''}`}>
    <div className="container nav-wrap">
      <Logo />
      <nav id="primary-navigation" aria-label="Primary navigation" className={`nav-links ${open ? 'nav-open' : ''}`}>
        <NavLink to="/" end onClick={closeMenus}>Home</NavLink>
        {dropdowns.map(({ label, path, items }) => {
          const expanded = activeDropdown === label;
          const current = loc.pathname.startsWith(path);
          const menuId = `nav-${label.toLowerCase()}-menu`;
          return <div
            className={`nav-dropdown ${expanded ? 'is-open' : ''}`}
            key={label}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null);
            }}
          >
            <button
              type="button"
              className={`nav-dropdown-trigger ${current ? 'active' : ''}`}
              aria-expanded={expanded}
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={() => setActiveDropdown(expanded ? null : label)}
            >
              {label}<ChevronDown size={14} aria-hidden="true"/>
            </button>
            <div className="nav-dropdown-menu" id={menuId}>
              {items.map(([item, itemPath]) => <NavLink
                key={item}
                to={itemPath}
                onClick={closeMenus}
              >{item}</NavLink>)}
            </div>
          </div>;
        })}
        {links.slice(1).map(([label, path]) => <NavLink key={path} to={path} onClick={closeMenus}>{label}</NavLink>)}
        <Link to="/contact" className="nav-mobile-cta" onClick={closeMenus}>Start a Project <ArrowUpRight size={16}/></Link>
      </nav>
      <Link to="/contact" className="button button-small nav-cta">Start a Project <ArrowUpRight size={16}/></Link>
      <button
        className="menu-toggle"
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="primary-navigation"
      >{open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-brand"><Logo light/><p>We turn complex challenges into clear, capable digital solutions.</p>
          <div className="socials"><a href={company.linkedin} aria-label="LinkedIn"><Linkedin/></a><a href={company.instagram} aria-label="Instagram"><Instagram/></a><a href={company.github} aria-label="GitHub"><Github/></a></div>
        </div>
        <div className="footer-col"><strong>Explore</strong><Link to="/about">About us</Link><Link to="/services">Services</Link><Link to="/industries">Industries</Link><Link to="/portfolio">Portfolio</Link><Link to="/products">Product demos</Link></div>
        <div className="footer-col"><strong>What we do</strong><Link to="/services">Custom software</Link><Link to="/services">AI & machine learning</Link><Link to="/services">Web & mobile apps</Link><Link to="/services">Business automation</Link></div>
        <div className="footer-col"><strong>Get in touch</strong><a href={`mailto:${company.email}`}>{company.email}</a><a href={`tel:${company.phone.replaceAll(' ','')}`}>{company.phone}</a><span>{company.location}</span><Link to="/contact" className="footer-contact">Discuss a project <ArrowUpRight size={15}/></Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Zentro Technologies. All rights reserved.</span><span>Built for what's next.</span></div>
    </div>
  </footer>;
}

function PageShell({ children }) {
  return <><ScrollTop/><Header/><main>{children}</main><Footer/><a className="whatsapp-float" href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hello Zentro Technologies, I would like to discuss a project.')}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={21}/></a></>;
}

function Eyebrow({ children }) { return <div className="eyebrow"><span></span>{children}</div>; }
function SectionHeading({ eyebrow, title, text, center = false }) {
  return <div className={`section-heading ${center ? 'text-center' : ''}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}
function PrimaryLink({ to='/contact', children='Start a conversation' }) { return <Link to={to} className="button">{children}<ArrowUpRight size={17}/></Link>; }

function HeroVisual() {
  return <div className="hero-visual" aria-label="Abstract digital network illustration">
    <div className="visual-orbit orbit-one"></div><div className="visual-orbit orbit-two"></div><div className="visual-orbit orbit-three"></div>
    <div className="visual-core"><div className="core-inner"><span className="core-symbol">Z</span><span className="core-label">INTELLIGENCE<br/>IN MOTION</span></div></div>
    <div className="float-card float-card-a"><span className="float-icon"><BrainCircuit size={18}/></span><div><b>AI-powered</b><small>Intelligent systems</small></div><span className="live-dot"></span></div>
    <div className="float-card float-card-b"><span className="float-icon"><Layers3 size={18}/></span><div><b>Built to scale</b><small>Future-ready platforms</small></div></div>
    <div className="float-card float-card-c"><span className="float-icon"><Zap size={18}/></span><div><b>Connected</b><small>People · Process · Data</small></div></div>
    <div className="visual-grid"></div>
  </div>;
}

function Home() {
  return <>
    <section className="hero">
      <div className="hero-glow"></div><div className="container hero-grid">
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}><Eyebrow>Technology that moves business forward</Eyebrow></motion.div>
          <motion.h1 variants={fadeUp}>Engineering intelligence.<br/><span>Building what's next.</span></motion.h1>
          <motion.p variants={fadeUp}>We design and develop purposeful digital solutions — from custom software and AI to connected platforms that help ambitious organisations move forward.</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}><PrimaryLink>Let's build together</PrimaryLink><Link to="/services" className="text-link">Explore our capabilities <ArrowRight size={16}/></Link></motion.div>
          <motion.div className="hero-proof" variants={fadeUp}><div className="proof-avatars"><i>Z</i><i>+</i><i>AI</i></div><span><b>One partner.</b> From idea to impact.</span></motion.div>
        </motion.div>
        <motion.div className="hero-art" initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .2 }}><HeroVisual/></motion.div>
      </div>
      <div className="hero-bottom container"><span>SCROLL TO EXPLORE</span><div className="scroll-line"></div><span>01 / 06</span></div>
    </section>
    <section className="trust-strip"><div className="container trust-inner"><span>TECHNOLOGY FOR</span><b>Healthcare</b><b>Manufacturing</b><b>Commerce</b><b>Startups</b><b>Enterprise</b></div></section>
    <section className="section section-light">
      <div className="container">
        <div className="split-heading"><SectionHeading eyebrow="What we do" title={<>Technology should solve<br/><span className="blue-text">real-world problems.</span></>} text="We bring strategy, design and engineering together to create technology that works for people and performs for business."/></div>
        <div className="service-grid">{services.slice(0,4).map((s,i)=>{const Icon=iconMap[s.icon];return <motion.div className="service-card" key={s.number} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true, amount:.2}} transition={{delay:i*.06}}><div className="card-top"><span className="icon-box"><Icon size={22}/></span><span className="card-number">{s.number}</span></div><h3>{s.title}</h3><p>{s.description}</p><Link to="/services" className="circle-arrow"><ArrowUpRight size={18}/></Link></motion.div>})}</div>
        <div className="section-link"><Link to="/services" className="text-link">Explore all capabilities <ArrowRight size={16}/></Link></div>
      </div>
    </section>
    <section className="section section-navy">
      <div className="container"><div className="two-col-intro"><SectionHeading eyebrow="Our approach" title={<>Clarity first.<br/><span className="gradient-text">Possibility next.</span></>} text="Great technology starts with understanding. We work closely with your team to identify the right problem, shape a practical solution and build it with care."/><div className="approach-points">
        {[['01','Understand the challenge','We listen, map the workflow and define what success looks like.'],['02','Design the right solution','We shape a clear roadmap around your goals, users and constraints.'],['03','Build, launch and improve','We deliver in focused milestones and stay alongside you as needs evolve.']].map(x=><div className="approach-row" key={x[0]}><span>{x[0]}</span><div><h3>{x[1]}</h3><p>{x[2]}</p></div><ArrowUpRight size={18}/></div>)}
      </div></div></div>
    </section>
    <section className="section section-light">
      <div className="container"><div className="section-heading-row"><SectionHeading eyebrow="Selected work" title={<>Ideas made <span className="blue-text">useful.</span></>} text="A snapshot of product thinking and digital experiences across different domains."/><Link to="/portfolio" className="text-link">View portfolio <ArrowRight size={16}/></Link></div>
        <div className="project-grid">{projects.slice(0,3).map((p,i)=><ProjectCard project={p} key={p.name} index={i}/>)}</div>
      </div>
    </section>
    <section className="section industries-band"><div className="container industries-content"><div><Eyebrow>Industries we empower</Eyebrow><h2>Different challenges.<br/><span className="gradient-text">One thoughtful approach.</span></h2></div><div className="industry-chips">{industries.map((i)=><span key={i.title}>{i.title}<ArrowUpRight size={14}/></span>)}</div></div></section>
    <CTASection/>
  </>;
}

function ProjectCard({ project, index=0 }) {
  return <motion.article className={`project-card project-${project.accent}`} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.08}}>
    <div className="project-art">
      {project.image
        ? <img className={`project-preview${project.imagePosition ? ` project-preview-${project.imagePosition}` : ''}`} src={project.image} alt={`${project.name} product preview`}/>
        : <><div className="project-art-glow"></div><div className="project-window"><div className="window-bar"><i></i><i></i><i></i><span>{project.category}</span></div><div className="window-content"><div className="window-mark">{project.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div><div className="window-lines"><i></i><i></i><i></i></div><div className="window-tiles"><i></i><i></i><i></i></div></div></div><span className="project-orbit"></span></>}
    </div>
    <div className="project-info"><div className="project-meta"><span>{project.type}</span><span>{project.status}</span></div><h3>{project.name}</h3><p>{project.description}</p><Link to="/contact" className="text-link">Discuss a similar project <ArrowUpRight size={15}/></Link></div>
  </motion.article>;
}

function CTASection() {
  return <section className="cta-section"><div className="container cta-box"><div className="cta-glow"></div><div className="cta-copy"><Eyebrow>Have a challenge in mind?</Eyebrow><h2>Let's make your next<br/><span className="gradient-text">move a meaningful one.</span></h2><p>Tell us what you're working towards. We'll help you explore the right next step.</p><PrimaryLink>Start a conversation</PrimaryLink></div><div className="cta-mark"><span>Z</span><i></i><i></i></div></div></section>;
}

function PageHero({ eyebrow, title, text }) {
  return <section className="page-hero"><div className="container page-hero-inner"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{text}</p></div><div className="page-hero-orb"></div></section>;
}

function About() {
  return <>
    <PageHero eyebrow="About Zentro" title={<>Curiosity to craft.<br/><span className="gradient-text">Ideas to impact.</span></>} text="We are a technology team focused on building useful, dependable digital solutions for organisations ready to move forward."/>
    <section className="section section-light"><div className="container about-grid"><div><SectionHeading eyebrow="Who we are" title={<>A technology partner<br/>built around <span className="blue-text">your goals.</span></>} text="Zentro Technologies brings software engineering, product thinking and emerging technology together. We believe the best solutions are not the most complicated — they are the ones that make a meaningful difference."/></div><div className="about-stat-panel"><div className="stat-orbit"></div><span className="stat-kicker">OUR PRINCIPLE</span><strong>Make technology<br/><em>make sense.</em></strong><p>Practical thinking. Thoughtful engineering. Long-term partnership.</p></div></div></section>
    <section className="section section-navy"><div className="container"><SectionHeading eyebrow="What guides us" title={<>Principles behind<br/><span className="gradient-text">every build.</span></>} text="The way we work matters as much as what we deliver."/><div className="values-grid">{[['01','Stay curious','We keep learning, questioning and exploring better ways to solve problems.'],['02','Build with purpose','Every feature, interaction and decision should serve a clear need.'],['03','Own the outcome','We value reliability, transparency and accountability from start to finish.'],['04','Grow together','We work as partners, sharing context and progress along the way.']].map(v=><div className="value-card" key={v[0]}><span>{v[0]}</span><h3>{v[1]}</h3><p>{v[2]}</p></div>)}</div></div></section>
    <CTASection/>
  </>;
}

function Services() {
  return <>
    <PageHero eyebrow="Our capabilities" title={<>Technology built<br/><span className="gradient-text">around your ambition.</span></>} text="From a focused digital product to a connected enterprise platform, we bring the right mix of strategy, design and engineering."/>
    <section className="section section-light"><div className="container"><div className="service-list">{services.map((s,i)=>{const Icon=iconMap[s.icon];return <motion.div className="service-detail" key={s.number} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><div className="service-detail-number">{s.number}</div><div className="service-detail-icon"><Icon size={25}/></div><div className="service-detail-copy"><h2>{s.title}</h2><p>{s.description}</p><div className="tag-list">{s.tags.map(t=><span key={t}>{t}</span>)}</div></div><Link to="/contact" className="circle-arrow"><ArrowUpRight size={18}/></Link></motion.div>})}</div></div></section>
    <section className="section section-navy"><div className="container"><SectionHeading eyebrow="How we engage" title="A delivery model that stays clear."/><div className="process-grid">{[['Discover','Understand users, workflows and outcomes.'],['Define','Agree scope, milestones and success measures.'],['Develop','Build in focused, reviewable iterations.'],['Deliver','Launch, support and continuously improve.']].map((x,i)=><div className="process-card" key={x[0]}><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p></div>)}</div></div></section><CTASection/>
  </>;
}

function Industries() {
  return <>
    <PageHero eyebrow="Industries" title={<>Built for the way<br/><span className="gradient-text">your world works.</span></>} text="Every industry has its own pace, pressure and possibilities. We shape digital solutions around the realities of your business."/>
    <section className="section section-light"><div className="container"><div className="industry-grid">{industries.map((it,i)=>{const Icon=iconMap[it.icon];return <motion.div className="industry-card" key={it.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><div className="industry-icon"><Icon size={25}/></div><span className="card-number">0{i+1}</span><h3>{it.title}</h3><p>{it.description}</p><Link to="/contact" className="text-link">Explore a solution <ArrowUpRight size={15}/></Link></motion.div>})}</div></div></section><CTASection/>
  </>;
}

function Portfolio() {
  const [portfolioProjects, setPortfolioProjects] = useState(projects);
  React.useEffect(() => {
    let active = true;
    api.portfolio.list().then(data => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      setPortfolioProjects(data.map(project => {
        const fallback = projects.find(item => item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === project.slug);
        return { ...fallback, ...project, image: project.image || fallback?.image, imagePosition: project.imagePosition || fallback?.imagePosition };
      }));
    }).catch(error => console.warn('Portfolio API unavailable; using the existing portfolio content.', error));
    return () => { active = false; };
  }, []);
  return <>
    <PageHero eyebrow="Selected work & product thinking" title={<>Thoughtful ideas.<br/><span className="gradient-text">Useful outcomes.</span></>} text="Explore a selection of product initiatives and digital experiences connected to our technology ecosystem. Project descriptions reflect showcase concepts and should be confirmed before publication."/>
    <section className="section section-light"><div className="container"><div className="portfolio-note"><Sparkles size={18}/><span>We believe in showing the thinking behind the work — not just the final screen.</span></div><div className="project-grid portfolio-grid">{portfolioProjects.map((p,i)=><ProjectCard project={p} key={p.slug || p.name} index={i}/>)}</div></div></section><CTASection/>
  </>;
}

function Careers() {
  const [role,setRole] = useState('General interest');
  const [email,setEmail] = useState('');
  const [applicantName,setApplicantName] = useState('');
  const [resume,setResume] = useState(null);
  const [openings,setOpenings] = useState([]);
  const [applicationStatus,setApplicationStatus] = useState('idle');
  const [applicationNotice,setApplicationNotice] = useState('');
  React.useEffect(() => {
    let active = true;
    api.jobs.list().then(data => {
      if (active && Array.isArray(data)) setOpenings(data);
    }).catch(error => console.warn('Careers API unavailable; using the existing introduction form.', error));
    return () => { active = false; };
  }, []);
  async function handleApplication(event) {
    event.preventDefault();
    if (resume && resume.size > 5 * 1024 * 1024) {
      setApplicationStatus('error');
      setApplicationNotice('Resume files must be 5 MB or smaller.');
      return;
    }
    const formElement = event.currentTarget;
    setApplicationStatus('sending');
    setApplicationNotice('');
    try {
      const selectedOpening = openings.find(opening => opening.id === role);
      await api.jobs.apply({
        role: selectedOpening?.title || role,
        job_id: selectedOpening?.id,
        applicant_name: applicantName,
        email,
        website: formElement.elements.submission_marker.value
      }, resume);
      setApplicationStatus('success');
      setApplicationNotice('Thank you. Your application has been received.');
      setApplicantName('');
      setEmail('');
      setResume(null);
      formElement.elements.resume.value = '';
    } catch (error) {
      setApplicationStatus('error');
      setApplicationNotice(error.message || 'Unable to send your application. Please try again.');
    }
  }
  return <>
    <PageHero eyebrow="Careers at Zentro" title={<>Build what matters.<br/><span className="gradient-text">Grow with curiosity.</span></>} text="We value people who enjoy solving meaningful problems, learning continuously and building thoughtful technology."/>
    <section className="section section-light"><div className="container careers-grid">
      <div><SectionHeading eyebrow="Life at Zentro" title="Good work is a team effort." text="We believe in clear communication, ownership, experimentation and learning by building. If that sounds like your kind of environment, we'd like to hear from you."/></div>
      <div className="career-panel">
        <div className="career-icon"><Rocket size={25}/></div>
        <h3>Open to conversations</h3>
        <p>We are building our team and welcome thoughtful introductions from developers, designers, product thinkers and technology enthusiasts.</p>
        <form onSubmit={handleApplication}>
          <div className="honeypot-field" aria-hidden="true"><input name="submission_marker" tabIndex="-1" autoComplete="off"/></div>
          <label htmlFor="career-role">Area of interest</label>
          <select id="career-role" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="General interest">General interest</option><option value="Frontend development">Frontend development</option><option value="Backend development">Backend development</option><option value="AI / Machine Learning">AI / Machine Learning</option><option value="UI/UX design">UI/UX design</option><option value="Sales & business development">Sales & business development</option>
            {openings.map(opening=><option key={opening.id} value={opening.id}>{opening.title}</option>)}
          </select>
          <label htmlFor="career-name">Your name</label>
          <input id="career-name" required value={applicantName} onChange={e=>setApplicantName(e.target.value)} placeholder="Full name"/>
          <label htmlFor="career-email">Email address</label>
          <input id="career-email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          <label htmlFor="career-resume">Resume (PDF, optional)</label>
          <input id="career-resume" name="resume" type="file" accept=".pdf,application/pdf" onChange={e=>setResume(e.target.files?.[0] || null)}/>
          <button className="button button-full" disabled={applicationStatus==='sending'}>{applicationStatus==='sending'?'Sending...':'Introduce yourself'} <ArrowUpRight size={16}/></button>
          {applicationNotice && <div className={`form-notice ${applicationStatus}`} role="status">{applicationNotice}</div>}
        </form>
      </div>
    </div></section><CTASection/>
  </>;
}

function Contact() {
  const emptyForm = {name:'',email:'',phone:'',company:'',industry:'',service:'Custom Software',budget:'',message:''};
  const [form,setForm] = useState(emptyForm);
  const [status,setStatus] = useState('idle');
  const [notice,setNotice] = useState('');
  const update = e => setForm({...form,[e.target.name]:e.target.value});
  async function handleSubmit(e) {
    e.preventDefault(); setStatus('sending'); setNotice('');
    try {
      const result = await submitEnquiry({ ...form, website: e.currentTarget.elements.submission_marker.value });
      setStatus('success');
      setNotice(result.mode === 'email' ? 'Your email app should open with the enquiry prefilled. Send the email to complete your enquiry.' : 'Thank you. Your enquiry has been submitted successfully. Our team will get back to you.');
      if (result.mode !== 'email') setForm(emptyForm);
    } catch (err) { setStatus('error'); setNotice(err.message || 'Something went wrong. Please try again.'); }
  }
  return <>
    <PageHero eyebrow="Let's talk" title={<>A good next step<br/><span className="gradient-text">starts with a conversation.</span></>} text="Tell us a little about what you're looking to build, improve or explore. We'll get back to you to understand the opportunity."/>
    <section className="section section-light"><div className="container contact-grid">
      <div className="contact-info"><SectionHeading eyebrow="Get in touch" title="Let's find the right way forward." text="Whether you have a clear brief or just an early idea, we're happy to listen and help you shape the next step."/><div className="contact-method"><span><Mail size={19}/></span><div><small>Email us</small><a href={`mailto:${company.email}`}>{company.email}</a></div></div><div className="contact-method"><span><Phone size={19}/></span><div><small>Call us</small><a href={`tel:${company.phone.replaceAll(' ','')}`}>{company.phone}</a></div></div><div className="contact-method"><span><MapPin size={19}/></span><div><small>Based in</small><b>{company.location}</b></div></div><div className="contact-promise"><ShieldCheck size={19}/><span>Your information is used only to respond to your enquiry. Please do not include sensitive patient or personal data.</span></div></div>
      <div className="contact-form-wrap"><div className="form-heading"><span>PROJECT ENQUIRY</span><small><i></i> Usually responds within 1–2 business days</small></div><form className="contact-form" onSubmit={handleSubmit}>
        <div className="honeypot-field" aria-hidden="true"><input name="submission_marker" tabIndex="-1" autoComplete="off"/></div>
        <div className="form-row"><div className="field"><label htmlFor="name">Your name *</label><input id="name" name="name" required value={form.name} onChange={update} placeholder="Full name"/></div><div className="field"><label htmlFor="email">Work email *</label><input id="email" name="email" type="email" required value={form.email} onChange={update} placeholder="you@company.com"/></div></div>
        <div className="form-row"><div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" value={form.phone} onChange={update} placeholder="+91"/></div><div className="field"><label htmlFor="company">Company</label><input id="company" name="company" value={form.company} onChange={update} placeholder="Company name"/></div></div>
        <div className="form-row"><div className="field"><label htmlFor="industry">Industry</label><select id="industry" name="industry" value={form.industry} onChange={update}><option value="">Select an industry</option><option>Healthcare</option><option>Manufacturing</option><option>Retail & Commerce</option><option>Logistics & Distribution</option><option>Startups & SaaS</option><option>Professional Services</option><option>Other</option></select></div><div className="field"><label htmlFor="budget">Project budget</label><input id="budget" name="budget" value={form.budget} onChange={update} placeholder="Flexible / to be discussed"/></div></div>
        <div className="field"><label htmlFor="service">What can we help with? *</label><select id="service" name="service" value={form.service} onChange={update}><option>Custom Software</option><option>AI & Machine Learning</option><option>Web & Mobile Applications</option><option>Business Automation / ERP</option><option>Healthcare Technology</option><option>Cloud & DevOps</option><option>UI/UX & Product Design</option><option>Other</option></select></div>
        <div className="field"><label htmlFor="message">Tell us about your project *</label><textarea id="message" name="message" required minLength="10" rows="5" value={form.message} onChange={update} placeholder="A little context about your goals, challenges or timeline..."/></div>
        <button className="button button-full" disabled={status==='sending'}>{status==='sending'?'Sending...':'Send enquiry'} <Send size={16}/></button>
        {notice && <div className={`form-notice ${status}`}>{notice}</div>}
        <small className="form-privacy">By submitting, you agree that Zentro Technologies may contact you about this enquiry.</small>
      </form></div>
    </div></section>
  </>;
}

const demoProducts = [
  { id:'hospital-management', name:'Hospital Management System', category:'Healthcare', description:'Manage patient registration, appointments, doctors, billing and day-to-day hospital operations.', features:['Patient registration','Appointment scheduling','Doctor dashboard','Billing & reports'], video:'/videos/hospital-management-demo.mp4' },
  { id:'restaurant-management', name:'Restaurant Management System', category:'Food & Hospitality', description:'Connect menu management, table reservations, orders, kitchen workflows and customer enquiries.', features:['Digital menu','Table reservations','Order management','Kitchen workflow'] },
  { id:'erp-management', name:'ERP Management System', category:'Enterprise', description:'Bring inventory, purchasing, sales, finance and operational reporting into one connected workspace.', features:['Inventory control','Purchase & sales','Finance workflows','Business reports'], video:'/videos/erp-management-demo.mp4' },
  { id:'crm-software', name:'CRM Software', category:'Sales', description:'Track leads, customer conversations, follow-ups, opportunities and sales performance.', features:['Lead management','Follow-up reminders','Sales pipeline','Customer history'], video:'/videos/crm-demo.mp4' },
  { id:'hr-payroll', name:'HR & Payroll Management', category:'Human Resources', description:'Simplify employee records, attendance, leave requests, payroll and HR reporting.', features:['Employee records','Attendance','Leave management','Payroll summaries'], video:'/videos/hr-payroll-demo.mp4' },
  { id:'ecommerce-platform', name:'E-commerce Platform', category:'Digital Commerce', description:'Create a digital storefront with product catalogues, cart, order tracking and admin tools.', features:['Product catalogue','Shopping cart','Order tracking','Admin dashboard'] },
  { id:'ai-automation', name:'AI Automation Solutions', category:'Artificial Intelligence', description:'Automate repetitive tasks and turn business data into useful workflows and insights.', features:['Workflow automation','AI-assisted tasks','Data insights','System integrations'] },
  { id:'custom-business-software', name:'Custom Business Software', category:'Custom Development', description:'Purpose-built software designed around your organisation’s processes and requirements.', features:['Requirement discovery','Custom dashboards','Role-based access','API integrations'] }
];

function getVideoSource(value) {
  if (!value) return null;
  const yt = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type:'embed', url:`https://www.youtube-nocookie.com/embed/${yt[1]}` };
  const vm = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type:'embed', url:`https://player.vimeo.com/video/${vm[1]}` };
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(value)) return { type:'file', url:value };
  return null;
}

function ProductDemos() {
  const [selected, setSelected] = useState('all');
  const [products,setProducts] = useState(demoProducts);
  React.useEffect(() => {
    let active = true;
    api.products.list().then(data => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      setProducts(data.map(product => {
        const fallback = demoProducts.find(item => item.id === product.id);
        return {
          ...fallback,
          ...product,
          video: product.video || fallback?.video || '',
          features: product.features?.length ? product.features : fallback?.features || []
        };
      }));
    }).catch(error => console.warn('Product API unavailable; using the existing product demo content.', error));
    return () => { active = false; };
  }, []);
  const categories = ['all', ...new Set(products.map(p=>p.category))];
  const visible = selected === 'all' ? products : products.filter(p=>p.category === selected);
  return <>
    <PageHero eyebrow="Product demo center" title={<>See what technology<br/><span className="gradient-text">can do for your business.</span></>} text="Explore our software solutions and product workflows. Select a product to view its demo video, key capabilities and request a walkthrough with the Zentro team."/>
    <section className="section section-light"><div className="container">
      <div className="demo-intro"><div><Eyebrow>Explore our solutions</Eyebrow><h2>One place for every product demo.</h2><p>Published product demos appear here when available.</p></div><Link to="/contact" className="button">Request a live demo <ArrowUpRight size={16}/></Link></div>
      <div className="demo-filters">{categories.map(c=><button key={c} className={selected===c?'active':''} onClick={()=>setSelected(c)}>{c==='all'?'All products':c}</button>)}</div>
      <div className="demo-grid">{visible.map((product,i)=>{
        const source = getVideoSource(product.video || '');
        return <motion.article className="demo-card" key={product.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%4)*.05}}>
          <div className="demo-player">{source?.type==='file' ? <video controls preload="metadata" src={source.url} poster={product.demos?.[0]?.thumbnail || product.image || undefined} /> : source?.type==='embed' ? <iframe src={source.url} title={`${product.name} demo video`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <div className="demo-placeholder"><span><PlayCircle size={34}/></span><b>Demo video coming soon</b><small>Add an MP4, WebM, YouTube or Vimeo link to enable playback.</small></div>}</div>
          <div className="demo-card-body"><div className="demo-meta"><span>{product.category}</span><small>PRODUCT DEMO {String(products.indexOf(product)+1).padStart(2,'0')}</small></div><h3>{product.name}</h3><p>{product.description}</p><div className="demo-features">{product.features.map(f=><span key={f}><Check size={13}/>{f}</span>)}</div><Link className="button button-full" to={`/contact?product=${encodeURIComponent(product.name)}`}>Request this product demo <ArrowUpRight size={16}/></Link></div>
        </motion.article>;
      })}</div>
    </div></section>
    <CTASection/>
  </>;
}

function NotFound() { return <PageHero eyebrow="404 — Page not found" title={<>This page took<br/><span className="gradient-text">a different route.</span></>} text="The page you're looking for may have moved. Let's get you back on track."/>; }

export default function App() {
  return <PageShell><AnimatePresence mode="wait"><Routes>
    <Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/services" element={<Services/>}/><Route path="/industries" element={<Industries/>}/><Route path="/portfolio" element={<Portfolio/>}/><Route path="/products" element={<ProductDemos/>}/><Route path="/careers" element={<Careers/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/>
  </Routes></AnimatePresence></PageShell>;
}
