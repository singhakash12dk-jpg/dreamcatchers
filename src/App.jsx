import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import emailjs from "@emailjs/browser";

gsap.registerPlugin(ScrollTrigger);

/* BACKGROUND PARTICLES */
function Particles() {
  const ref = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const particleCount = 6000;
  const particles = new Float32Array(particleCount * 3).map(() => (Math.random() - 0.5) * 15);

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0001;
    ref.current.position.x += (mouse.current.x * 0.8 - ref.current.position.x) * 0.01;
    ref.current.position.y += (mouse.current.y * 0.8 - ref.current.position.y) * 0.01;
  });

  return (
    <Points ref={ref} positions={particles}>
      <PointMaterial size={0.012} color="#ffffff" transparent opacity={0.35} />
    </Points>
  );
}

/* CAMERA */
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    const handleScroll = () => {
      gsap.to(camera.position, { z: 5 + window.scrollY * 0.001, duration: 1.5, ease: "power3.out" });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [camera]);

  useFrame(() => {
    camera.rotation.y += (mouse.current.x * 0.05 - camera.rotation.y) * 0.02;
    camera.rotation.x += (-mouse.current.y * 0.05 - camera.rotation.x) * 0.02;
  });

  return null;
}

/* NAVBAR */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-container">
        <a href="#hero" className="nav-brand">DreamCatcher Studio</a>
        <button className={`nav-toggle ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
      </div>
    </nav>
  );
}

/* HERO WITH ROTATING WORDS */
function Hero() {
  const sectionRef = useRef();
  const [activeWord, setActiveWord] = useState(0);

  const heroWords = [
    { word: "ILLUMINATE", desc: "We design immersive projection experiences that captivate attention and transform ordinary spaces into extraordinary visual spectacles." },
    { word: "IMMERSE", desc: "Through creativity and cutting-edge technology, we produce dynamic moments that spark wonder and inspire lasting connections." },
    { word: "INSPIRE", desc: "We transform bold ideas into groundbreaking realities, pushing the limits of projection mapping and experiential design." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % heroWords.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-logo-small", { scale: 0.6, opacity: 0, rotateY: -25 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 1.8, delay: 0.2, ease: "elastic.out(1, 0.6)", immediateRender: false });
      gsap.fromTo(".hero-word-container", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: "power3.out", immediateRender: false });
      gsap.fromTo(".hero-desc", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out", immediateRender: false });
      gsap.fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.1, ease: "power3.out", immediateRender: false });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <div className="hero-content">
        <img src="./images/logo.png" alt="DreamCatcher Logo" className="hero-logo-small" />
        <div className="hero-word-container">
          {heroWords.map((item, i) => (
            <h1 key={i} className={`hero-word ${i === activeWord ? "active" : ""}`}>{item.word}</h1>
          ))}
        </div>
        <div className="hero-cta">
          <a href="#work" className="btn-primary">View Our Work</a>
          <a href="#contact" className="btn-outline">Get In Touch</a>
        </div>
      </div>
      <div className="hero-scroll-line">
        <div className="scroll-line-inner"></div>
      </div>
    </section>
  );
}

/* HERO TAGLINE */
function HeroTagline() {
  const ref = useRef();
  const [activeWord, setActiveWord] = useState(0);

  const descriptions = [
    "We design immersive projection experiences that captivate attention and transform ordinary spaces into extraordinary visual spectacles.",
    "Through creativity and cutting-edge technology, we produce dynamic moments that spark wonder and inspire lasting connections.",
    "We transform bold ideas into groundbreaking realities, pushing the limits of projection mapping and experiential design.",
    "From concept to execution, we craft stunning visual narratives that leave audiences breathless and redefine what's possible.",
    "We blend art with technology to deliver large-scale projection shows that turn buildings into living, breathing canvases.",
    "Our team creates immersive brand activations and interactive installations that engage every sense and tell powerful stories.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % descriptions.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-tagline-text", { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1, ease: "power3.out", immediateRender: false });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-tagline-section" ref={ref}>
      <p className="hero-tagline-text">{descriptions[activeWord]}</p>
    </section>
  );
}

/* SHOWREEL */
function Showreel() {
  const ref = useRef();
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".showreel-text", { y: 60, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out", immediateRender: false });
    }, ref);
    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="showreel-section" ref={ref}>
      <h2 className="showreel-text" onClick={togglePlay}>
        <span className="showreel-play-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            {isPlaying
              ? <><rect x="5" y="4" width="5" height="16" rx="1" fill="#FF8C00" /><rect x="14" y="4" width="5" height="16" rx="1" fill="#FF8C00" /></>
              : <path d="M6 3L20 12L6 21V3Z" fill="#FF8C00" />}
          </svg>
        </span>
        <span className="showreel-label">Showreel</span>
      </h2>
      <div className={`showreel-video-wrap ${isPlaying ? "active" : ""}`}>
        <video
          ref={videoRef}
          src="./videos/facade.mp4"
          muted
          loop
          playsInline
          className="showreel-video"
        />
      </div>
    </section>
  );
}

/* ABOUT */
function About() {
  const ref = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".section-label-about", { x: -30, opacity: 0 },
        { scrollTrigger: { trigger: ".about-inner", start: "top 85%", toggleActions: "play none none none" },
          x: 0, opacity: 1, duration: 0.8, immediateRender: false });
      gsap.fromTo(".about-heading", { y: 60, opacity: 0 },
        { scrollTrigger: { trigger: ".about-inner", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out", immediateRender: false });
      gsap.fromTo(".about-text", { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".about-inner", start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1, ease: "power3.out", immediateRender: false });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="about-section" id="about" ref={ref}>
      <div className="about-inner">
        <span className="section-label section-label-about">About Us</span>
        <h2 className="about-heading">Crafting Immersive<br />Digital Experiences</h2>
        <p className="about-text">
          At DreamCatcher Studio, we are pioneers in the art of projection mapping,
          immersive installations, and interactive experiences. Founded with a passion for
          blending technology and creativity, we transform ordinary spaces into extraordinary
          visual spectacles that captivate audiences worldwide.
        </p>
        <p className="about-text">
          From large-scale building facades to intimate brand activations, our multidisciplinary
          team of artists, engineers, and storytellers works hand-in-hand with clients to bring
          bold visions to life. We harness the latest in real-time rendering, spatial computing,
          and audiovisual design to deliver experiences that leave lasting impressions.
        </p>
        <p className="about-text">
          Whether it&#39;s a product launch that demands the wow factor, an immersive room that
          transports visitors to another world, or a live event that fuses light, sound, and motion &mdash;
          DreamCatcher Studio is where imagination meets execution.
        </p>
      </div>
    </div>
  );
}

/* SCROLLING IMAGE MARQUEE */
function ImageMarquee() {
  const row1 = [
    "./images/facade.jpeg",
    "./images/PH3_4191.jpg.jpeg",
    "./images/Work07.png",
    "./images/WhatsApp Image 2026-04-08 at 1.50.34 PM.jpeg",
    "./images/Work01.png",
    "./images/WhatsApp Image 2026-04-08 at 1.50.35 PM (1).jpeg",
    "./images/product.png",
    "./images/Work03.png",
    "./images/WhatsApp Image 2026-04-08 at 1.50.36 PM.jpeg",
    "./images/Work.png",
<<<<<<< HEAD
    "./images/Work05.png",
=======
    "./images/Work01.png",
>>>>>>> e5509161db253a2d5199b17863449063a7465874
  ];

  const row2 = [
    "./images/WhatsApp Image 2026-04-08 at 1.50.35 PM.jpeg",
    "./images/WhatsApp Image 2026-04-08 at 1.50.35 PM (2).jpeg",
    "./images/Work02.png",
    "./images/PH3_5237.jpg.jpeg",
    "./images/WhatsApp Image 2026-04-08 at 1.50.36 PM (1).jpeg",
    "./images/Work04.png",
    "./images/WhatsApp Image 2026-04-08 at 1.50.36 PM (2).jpeg",
    "./images/Work06.png",
    "./images/WhatsApp Image 2026-04-08 at 1.50.35 PM (3).jpeg",
    "./images/Work08.png",
    "./images/WhatsApp Image 2026-04-08 at 1.50.37 PM.jpeg",
    "./images/Work02.png",
  ];

  const renderRow = (images, direction) => {
    const doubled = [...images, ...images];
    return (
      <div className={`marquee-track marquee-${direction}`}>
        {doubled.map((src, i) => (
          <div key={i} className="marquee-item">
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="marquee-section">
      <div className="marquee-fade-left"></div>
      <div className="marquee-fade-right"></div>
      {renderRow(row1, "left")}
      {renderRow(row2, "right")}
    </section>
  );
}

/* PROJECTS / WORK */
function Projects() {
  const [image, setImage] = useState(null);
  const ref = useRef();

  const projects = [
    { img: "./images/facade.jpeg", title: "Facade Mapping", tags: ["Projection Mapping", "Event Design"] },
    { img: "./images/product.png", title: "Product Launch", tags: ["Brand Experience", "Content Creation"] },
    { img: "./images/interactive.jpeg", title: "Immersive Room", tags: ["Interactive Installation", "Experience Design"] },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".work-label", { x: -30, opacity: 0 },
        { scrollTrigger: { trigger: ".work-section", start: "top 85%", toggleActions: "play none none none" },
          x: 0, opacity: 1, duration: 0.8, immediateRender: false });
      gsap.fromTo(".work-heading", { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: ".work-section", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1, ease: "power3.out", immediateRender: false });
      ref.current.querySelectorAll(".project-card").forEach((card) => {
        gsap.fromTo(card, { y: 80, opacity: 0 },
          { scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
            y: 0, opacity: 1, duration: 1, ease: "power3.out", immediateRender: false });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="work-section" ref={ref}>
      <div className="section-header">
        <div>
          <span className="section-label work-label">Selected Work</span>
          <h2 className="section-heading work-heading">OUR WORK</h2>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((p, i) => (
          <div key={i} className={`project-card ${i === 0 ? "project-card-large" : ""}`} onClick={() => setImage(p.img)}>
            <div className="project-card-image">
              <img src={p.img} alt={p.title} />
              <div className="project-card-overlay">
                <div className="project-card-tags">
                  {p.tags.map((tag, j) => (
                    <span key={j} className="project-tag">{tag}</span>
                  ))}
                </div>
                <h3 className="project-card-title">{p.title}</h3>
                <span className="project-card-more">View Project &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {image && (
        <div className="fullscreen" onClick={() => setImage(null)}>
          <img src={image} alt="Full View" />
        </div>
      )}
    </section>
  );
}

/* SERVICES */
function Services() {
  const [video, setVideo] = useState(null);
  const ref = useRef();

  const services = [
    { title: "Projection Mapping", desc: "Large-scale facade mapping \u2022 Building projections \u2022 Architectural lighting \u2022 Outdoor spectacles", img: "./images/facade.jpeg", vid: "./videos/facade.mp4" },
    { title: "Brand Experiences", desc: "Product launches \u2022 Brand activations \u2022 Experiential marketing \u2022 Corporate events", img: "./images/product.png", vid: "./videos/product.mp4" },
    { title: "Immersive Installations", desc: "Interactive rooms \u2022 Spatial experiences \u2022 Sensor-driven art \u2022 Museum installations", img: "./images/interactive.jpeg", vid: null },
    { title: "Content Production", desc: "Real-time rendering \u2022 Motion graphics \u2022 VFX \u2022 Anamorphic content \u2022 Visual packaging", img: "./images/Robot.png", vid: "./videos/Robot_Intro_1.mp4" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".services-label", { x: -30, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          x: 0, opacity: 1, duration: 0.8, immediateRender: false });
      gsap.fromTo(".services-heading", { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1, ease: "power3.out", immediateRender: false });
      const cards = ref.current?.querySelectorAll(".service-card");
      if (cards?.length) {
        gsap.fromTo(cards, { y: 80, opacity: 0 },
          { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
            y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out", immediateRender: false });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="services-section" ref={ref}>
      <div>
        <span className="section-label services-label">What We Do</span>
        <h2 className="section-heading services-heading">OUR SERVICES</h2>
      </div>

      <div className="services-grid">
        {services.map((s, i) => {
          const isVideoThumb = s.img && s.img.endsWith(".mp4");
          return (
          <div key={i} className={`service-card ${s.img ? "has-media" : ""}`}
            onClick={() => s.vid && setVideo(s.vid)}>
            {s.img && (
              <div className="service-media">
                {isVideoThumb
                  ? <video src={s.img} muted loop playsInline autoPlay className="service-thumb-video" />
                  : <img src={s.img} alt={s.title} />}
                {s.vid && !isVideoThumb && (
                  <video src={s.vid} muted loop playsInline
                    onMouseEnter={(e) => e.target.play().catch(() => {})}
                    onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }} />
                )}
              </div>
            )}
            <div className="service-content">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="service-arrow">&rarr;</span>
            </div>
          </div>
          );
        })}
      </div>

      {video && (
        <div className="fullscreen" onClick={() => setVideo(null)}>
          <video src={video} autoPlay controls />
        </div>
      )}
    </section>
  );
}

/* CTA SECTION */
/* TEAM / OUR ARTISTS */
function Team() {
  const ref = useRef();
  const [activeCard, setActiveCard] = useState(null);

  const team = [
    {
      name: "Aman Jajoria",
      role: "Founder & Creative Director",
      img: "./images/Aman Jajoria.jpeg",
      responsibilities: [
        "Overall creative vision and direction for all projects",
        "Client relationship management and project strategy",
        "Leading large-scale projection mapping productions",
        "Overseeing content creation and visual storytelling",
        "Business development and brand partnerships",
        "Mentoring the creative team and fostering innovation",
      ],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".team-label", { x: -30, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          x: 0, opacity: 1, duration: 0.8, immediateRender: false });
      gsap.fromTo(".team-heading", { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1, ease: "power3.out", immediateRender: false });
      ref.current.querySelectorAll(".team-card").forEach((card) => {
        gsap.fromTo(card, { y: 60, opacity: 0 },
          { scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
            y: 0, opacity: 1, duration: 1, ease: "power3.out", immediateRender: false });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="team-section" id="team" ref={ref}>
      <div>
        <span className="section-label team-label">The Visionaries</span>
        <h2 className="section-heading team-heading">OUR TEAM</h2>
      </div>
      <div className="team-grid">
        {team.map((m, i) => (
          <div key={i} className="team-card" onClick={() => setActiveCard(activeCard === i ? null : i)}>
            <div className="team-img-wrap">
              <img src={m.img} alt={m.name} />
              <div className="team-img-overlay"></div>
            </div>
            <div className="team-info">
              <h3 className="team-name">{m.name}</h3>
              <span className="team-role">{m.role}</span>
            </div>
          </div>
        ))}
      </div>

      {activeCard !== null && (
        <div className="team-modal-backdrop" onClick={() => setActiveCard(null)}>
          <div className="team-modal" onClick={(e) => e.stopPropagation()}>
            <button className="team-modal-close" onClick={() => setActiveCard(null)}>&times;</button>
            <div className="team-modal-header">
              <img src={team[activeCard].img} alt={team[activeCard].name} className="team-modal-img" />
              <div>
                <h3 className="team-modal-name">{team[activeCard].name}</h3>
                <span className="team-modal-role">{team[activeCard].role}</span>
              </div>
            </div>
            <div className="team-modal-body">
              <h4 className="team-modal-subtitle">Roles &amp; Responsibilities</h4>
              <ul className="team-modal-list">
                {team[activeCard].responsibilities.map((r, j) => (
                  <li key={j}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CTASection() {
  const ref = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-heading", { y: 60, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out", immediateRender: false });
      gsap.fromTo(".cta-btn", { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", immediateRender: false });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cta-section" ref={ref}>
      <div className="cta-inner">
        <h2 className="cta-heading">LIKED OUR WORK?<br />LET&apos;S WORK TOGETHER!</h2>
        <a href="#contact" className="btn-primary cta-btn">Contact Us</a>
      </div>
    </section>
  );
}

/* CONTACT */
function Contact() {
  const ref = useRef();
  const formRef = useRef();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    emailjs.sendForm(
      "service_00kooet",
      "template_slxtvgm",
      formRef.current,
      "4dDSYjkqhA0pvPyjh"
    ).then(() => {
      setSent(true);
      setSending(false);
      formRef.current.reset();
      setTimeout(() => setSent(false), 5000);
    }).catch(() => {
      setSending(false);
      alert("Something went wrong. Please try again.");
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-label", { x: -30, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          x: 0, opacity: 1, duration: 0.8, immediateRender: false });
      gsap.fromTo(".contact-heading", { y: 60, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out", immediateRender: false });
      gsap.fromTo(".form-group, .form-row", { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".contact-form", start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out", immediateRender: false });
      gsap.fromTo(".contact-form button", { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ".contact-form", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", immediateRender: false });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact-section" id="contact" ref={ref}>
      <div className="contact-inner">
        <span className="section-label contact-label">Get In Touch</span>
        <h2 className="contact-heading">Let&apos;s Create<br />Something Unreal</h2>
        <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="from_name" placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="from_email" placeholder="your@email.com" required />
            </div>
          </div>
          <div className="form-group">
            <label>Tell us about your project</label>
            <textarea rows="5" name="message" placeholder="Describe your vision..." required />
          </div>
          <button type="submit" disabled={sending}>
            <span>{sent ? "Message Sent ✓" : sending ? "Sending..." : "Submit"}</span>
            {!sent && !sending && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
          </button>
        </form>

        <div className="map-section">
          <div className="map-address">
            <span className="section-label">Our Location</span>
            <p className="address-text">
              A-126, Sector 30<br />
              Noida, Uttar Pradesh<br />
              Gautam Buddha Nagar, 201303
            </p>
            <div className="contact-socials">
              <a href="https://www.instagram.com/dreamcatcherstudios19/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon social-ig">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><defs><radialGradient id="igGrad" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="5%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#igGrad)" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="url(#igGrad)" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.25" fill="url(#igGrad)"/></svg>
              </a>
              <a href="https://www.youtube.com/@dreamcatcherstudios19" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon social-yt">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" fill="#FF0000"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>
              </a>
              <a href="https://in.linkedin.com/company/dreamcatcher-studios" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon social-li">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="1" y="1" width="22" height="22" rx="3" fill="#0A66C2"/><path d="M8 10v8M8 7v.01M12 18v-5a2 2 0 1 1 4 0v5M16 18v-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="7" r="1" fill="#fff"/><rect x="6.5" y="10" width="3" height="8" rx="0.5" fill="#fff"/></svg>
              </a>
              <a href="https://www.facebook.com/dreamcatcherstudios07" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon social-fb">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="1" y="1" width="22" height="22" rx="3" fill="#1877F2"/><path d="M16.5 3.5H14c-1.66 0-3 1.34-3 3v2h-2v3h2v7h3v-7h2.5l.5-3H14v-2c0-.55.45-1 1-1h1.5V3.5z" fill="#fff"/></svg>
              </a>
            </div>
          </div>
          <div className="map-embed">
            <iframe
              title="DreamCatcher Studio Location"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=A-126,+Sector+30,+Noida,+Uttar+Pradesh,+Gautam+Buddha+Nagar,+201303&zoom=17"
              width="100%" height="100%" style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* FOOTER */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand-col">
          <img src="./images/logo.png" alt="DreamCatcher Logo" className="footer-logo" />
          <span className="footer-brand-name">DREAMCATCHER<br />STUDIO</span>
          <div className="footer-socials">
            <a href="https://www.instagram.com/dreamcatcherstudios19/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://www.youtube.com/@dreamcatcherstudios19" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
            <a href="https://in.linkedin.com/company/dreamcatcher-studios" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://www.facebook.com/dreamcatcherstudios07" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} DreamCatcher Studio.<br />All rights reserved.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#hero">Home</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#services">Projection Mapping</a>
          <a href="#services">Brand Experiences</a>
          <a href="#services">Immersive Installations</a>
          <a href="#services">Content Production</a>
        </div>
        <div className="footer-col">
          <h4>Location</h4>
          <p>A-126, Sector 30<br />Noida, Uttar Pradesh<br />201303</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>Designed with passion by DreamCatcher Studio</span>
        </div>
      </div>
    </footer>
  );
}

/* MAIN APP */
/* LOADING SCREEN */
function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef();

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 12 + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: onFinish,
          });
        }, 400);
      }
      setProgress(Math.min(Math.round(current), 100));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-screen" ref={loaderRef}>
      <div className="loader-content">
        <div className="loader-reels">
          <svg className="loader-reel loader-reel-big" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="56" stroke="rgba(255,140,0,0.3)" strokeWidth="2" />
            <circle cx="60" cy="60" r="56" stroke="url(#reelGrad)" strokeWidth="3" strokeDasharray="8 12" />
            <circle cx="60" cy="60" r="12" fill="rgba(255,140,0,0.15)" stroke="#FF8C00" strokeWidth="1.5" />
            <circle cx="60" cy="26" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="89" cy="43" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="89" cy="77" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="60" cy="94" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="31" cy="77" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="31" cy="43" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <defs><linearGradient id="reelGrad" x1="0" y1="0" x2="120" y2="120"><stop stopColor="#FF8C00" /><stop offset="1" stopColor="#FFB347" /></linearGradient></defs>
          </svg>
          <svg className="loader-reel loader-reel-small" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="56" stroke="rgba(255,140,0,0.3)" strokeWidth="2" />
            <circle cx="60" cy="60" r="56" stroke="url(#reelGrad2)" strokeWidth="3" strokeDasharray="8 12" />
            <circle cx="60" cy="60" r="12" fill="rgba(255,140,0,0.15)" stroke="#FF8C00" strokeWidth="1.5" />
            <circle cx="60" cy="26" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="89" cy="43" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="89" cy="77" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="60" cy="94" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="31" cy="77" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <circle cx="31" cy="43" r="10" fill="rgba(255,140,0,0.08)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
            <defs><linearGradient id="reelGrad2" x1="0" y1="0" x2="120" y2="120"><stop stopColor="#FF8C00" /><stop offset="1" stopColor="#FFB347" /></linearGradient></defs>
          </svg>
          <div className="loader-film-strip">
            <div className="film-cell"></div><div className="film-cell"></div><div className="film-cell"></div>
            <div className="film-cell"></div><div className="film-cell"></div><div className="film-cell"></div>
          </div>
        </div>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="loader-percent">{progress}%</span>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <Canvas
            style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
            camera={{ position: [0, 0, 5] }}
          >
            <CameraController />
            <Particles />
          </Canvas>

          <Navbar />
          <Hero />
          <HeroTagline />
          <Showreel />
          <About />
          <ImageMarquee />
          <Projects />
          <Services />
          <Team />
          <CTASection />
          <Contact />
          <Footer />
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* LOADER */
        .loader-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .loader-reels {
          position: relative;
          width: 200px;
          height: 160px;
        }

        .loader-reel {
          position: absolute;
          filter: drop-shadow(0 0 15px rgba(255,140,0,0.3));
        }

        .loader-reel-big {
          width: 130px;
          height: 130px;
          top: 0;
          left: 0;
          animation: reelSpin 2s linear infinite;
        }

        .loader-reel-small {
          width: 95px;
          height: 95px;
          bottom: 0;
          right: 0;
          animation: reelSpin 1.5s linear infinite reverse;
        }

        .loader-film-strip {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          animation: filmSlide 1.2s linear infinite;
        }

        .film-cell {
          width: 18px;
          height: 14px;
          border: 1px solid rgba(255,140,0,0.25);
          border-radius: 2px;
          background: rgba(255,140,0,0.05);
        }

        @keyframes reelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes filmSlide {
          0% { transform: translateX(-50%) translateX(-20px); opacity: 0.4; }
          50% { opacity: 1; }
          100% { transform: translateX(-50%) translateX(20px); opacity: 0.4; }
        }

        .loader-bar-track {
          width: 220px;
          height: 2px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }

        .loader-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF8C00, #FFB347);
          border-radius: 2px;
          transition: width 0.15s ease;
          box-shadow: 0 0 10px rgba(255,140,0,0.5);
        }

        .loader-percent {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.4);
        }

        ::selection {
          background: rgba(255,140,0,0.3);
          color: #fff;
        }

        html {
          scroll-behavior: initial;
        }

        html.lenis, html.lenis body {
          height: auto;
        }

        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }

        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }

        body {
          background: #0a0a0a;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* NAVBAR */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 24px 40px;
          transition: all 0.6s cubic-bezier(0.16,1,0.3,1);
        }

        .nav-scrolled {
          padding: 16px 40px;
          background: rgba(10,10,10,0.92);
          backdrop-filter: blur(30px) saturate(1.5);
          -webkit-backdrop-filter: blur(30px) saturate(1.5);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .nav-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          font-size: 18px;
          font-weight: 600;
          color: #FF8C00;
          text-decoration: none;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: opacity 0.3s ease;
        }

        .nav-brand:hover {
          opacity: 0.8;
        }

        .nav-links {
          display: flex;
          gap: 50px;
        }

        .nav-links a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: color 0.4s ease;
          position: relative;
        }

        .nav-links a:hover {
          color: #fff;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 1px;
          background: #FF8C00;
          transition: width 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .nav-socials {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: 8px;
        }

        .nav-socials a {
          color: rgba(255,255,255,0.5);
          transition: color 0.3s ease, transform 0.3s ease;
          display: flex;
        }

        .nav-socials a:hover {
          color: #FF8C00;
          transform: translateY(-2px);
        }

        .nav-socials a::after {
          display: none;
        }

        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 1001;
        }

        .nav-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .nav-toggle.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .nav-toggle.active span:nth-child(2) {
          opacity: 0;
        }

        .nav-toggle.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* HERO */
        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 0 60px;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 1000px;
        }

        .hero-logo-small {
           width: 100%;
           max-width: 720px;
          height: auto;
          object-fit: contain;
          margin-bottom: 40px;
          filter: drop-shadow(0 0 60px rgba(255,140,0,0.15));
          animation: logoFloat 6s ease-in-out infinite, logoGlow 4s ease-in-out infinite alternate;
          perspective: 800px;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(0.5deg); }
          50% { transform: translateY(-6px) rotate(0deg); }
          75% { transform: translateY(-14px) rotate(-0.5deg); }
        }

        @keyframes logoGlow {
          0% { filter: drop-shadow(0 0 40px rgba(255,140,0,0.1)) drop-shadow(0 0 80px rgba(255,140,0,0.05)); }
          100% { filter: drop-shadow(0 0 60px rgba(255,140,0,0.3)) drop-shadow(0 0 120px rgba(255,140,0,0.1)); }
        }

        .hero-word-container {
          position: relative;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .hero-word {
          position: absolute;
          font-size: 120px;
          font-weight: 800;
          letter-spacing: -2px;
          text-transform: uppercase;
          background: linear-gradient(135deg, #FF8C00 0%, #FFB347 50%, #FF8C00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.6s cubic-bezier(0.16,1,0.3,1);
          white-space: nowrap;
        }

        .hero-word.active {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-cta {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-top: 20px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          background: #FF8C00;
          color: #0a0a0a;
          border: none;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
          font-family: inherit;
        }

        .btn-primary:hover {
          background: #FFB347;
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(255,140,0,0.3);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          background: transparent;
          color: #FF8C00;
          border: 1px solid rgba(255,140,0,0.4);
          border-radius: 50px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
          font-family: inherit;
        }

        .btn-outline:hover {
          border-color: #FF8C00;
          background: rgba(255,140,0,0.08);
          transform: translateY(-3px);
        }

        .hero-scroll-line {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 60px;
          overflow: hidden;
        }

        .scroll-line-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #FF8C00, transparent);
          animation: scrollPulse 2.5s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.4) translateY(-30%); }
          50% { opacity: 0.8; transform: scaleY(1) translateY(0); }
        }

        /* SECTION LABELS */
        .section-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #FF8C00;
          margin-bottom: 20px;
          position: relative;
          padding-left: 36px;
        }

        .section-label::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 24px;
          height: 1px;
          background: #FF8C00;
        }

        .section-heading {
          font-size: 52px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.15;
          margin-bottom: 60px;
          text-transform: uppercase;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        /* ABOUT */
        .about-section {
          padding: 160px 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .about-inner {
          max-width: 800px;
        }

        .about-heading {
          font-size: 52px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 40px;
          letter-spacing: -1px;
          background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-text {
          font-size: 17px;
          font-weight: 300;
          line-height: 2;
          color: rgba(255,255,255,0.5);
          max-width: 650px;
          margin-bottom: 20px;
        }

        /* HERO TAGLINE */
        .hero-tagline-section {
          padding: 60px 60px 40px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-tagline-text {
          font-size: 18px;
          font-weight: 300;
          line-height: 1.9;
          color: rgba(255,255,255,0.5);
          transition: opacity 0.4s ease;
          min-height: 60px;
        }

        /* SHOWREEL */
        .showreel-section {
          padding: 60px 60px 100px;
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .showreel-text {
          font-size: 72px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          transition: all 0.4s ease;
          user-select: none;
          padding: 20px 50px;
          border: none;
          border-radius: 50px;
          position: relative;
          overflow: hidden;
        }

        .showreel-label {
          position: relative;
          z-index: 2;
          background: linear-gradient(135deg, #FF8C00 0%, #FFB347 50%, #FF8C00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .showreel-play-icon {
          position: relative;
          z-index: 2;
        }

        .showreel-text::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: 50%;
          left: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 55%,
            rgba(255,140,0,0.1) 65%,
            rgba(255,140,0,0.4) 72%,
            #FF8C00 78%,
            #fff 80%,
            #FF8C00 82%,
            rgba(255,140,0,0.4) 88%,
            rgba(255,140,0,0.1) 95%,
            transparent 100%
          );
          animation: saber-rotate 3s linear infinite;
          z-index: 0;
        }

        .showreel-text::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: 48px;
          background: #0a0a0a;
          z-index: 1;
        }

        @keyframes saber-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .showreel-text:hover {
          filter: brightness(1.2);
          transform: scale(1.02);
        }

        .showreel-text:hover::before {
          animation-duration: 1.5s;
          filter: blur(4px);
        }

        .showreel-text:hover::after {
          box-shadow: inset 0 0 30px rgba(255,140,0,0.05);
        }

        .showreel-play-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border: 2px solid #FF8C00;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.4s ease;
        }

        .showreel-text:hover .showreel-play-icon {
          background: rgba(255,140,0,0.1);
          box-shadow: 0 0 40px rgba(255,140,0,0.2);
        }

        .showreel-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          max-height: 0;
          opacity: 0;
          transition: max-height 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease;
        }

        .showreel-video-wrap.active {
          max-height: 900px;
          opacity: 1;
        }

        .showreel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* IMAGE MARQUEE */
        .marquee-section {
          padding: 80px 0;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .marquee-fade-left,
        .marquee-fade-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 200px;
          z-index: 2;
          pointer-events: none;
        }

        .marquee-fade-left {
          left: 0;
          background: linear-gradient(to right, #0a0a0a 0%, transparent 100%);
        }

        .marquee-fade-right {
          right: 0;
          background: linear-gradient(to left, #0a0a0a 0%, transparent 100%);
        }

        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
        }

        .marquee-left {
          animation: marqueeLeft 40s linear infinite;
        }

        .marquee-right {
          animation: marqueeRight 45s linear infinite;
        }

        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .marquee-item {
          flex-shrink: 0;
          width: 360px;
          height: 240px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
        }

        .marquee-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .marquee-item:hover img {
          transform: scale(1.08);
        }

        .marquee-item::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none;
          transition: border-color 0.4s ease;
        }

        .marquee-item:hover::after {
          border-color: rgba(255,140,0,0.2);
        }

        /* WORK / PROJECTS */
        .work-section {
          padding: 140px 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .project-card-large {
          grid-column: 1 / -1;
        }

        .project-card {
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }

        .project-card-image {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          aspect-ratio: 16 / 10;
        }

        .project-card-large .project-card-image {
          aspect-ratio: 21 / 9;
        }

        .project-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .project-card:hover .project-card-image img {
          transform: scale(1.06);
        }

        .project-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .project-card:hover .project-card-overlay {
          opacity: 1;
        }

        .project-card-tags {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .project-tag {
          padding: 6px 16px;
          border: 1px solid rgba(255,140,0,0.4);
          border-radius: 50px;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #FF8C00;
        }

        .project-card-title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .project-card-more {
          font-size: 13px;
          font-weight: 400;
          color: #FF8C00;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .project-card:hover .project-card-more {
          transform: translateX(8px);
        }

        /* SERVICES */
        .services-section {
          padding: 140px 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .service-card {
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
          background: rgba(255,255,255,0.02);
          position: relative;
        }

        .service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(255,140,0,0.04) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
          z-index: 1;
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-card:hover {
          border-color: rgba(255,140,0,0.2);
          transform: translateY(-6px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,140,0,0.05);
        }

        .service-media {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }

        .service-media img,
        .service-thumb-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .service-card:hover .service-media img,
        .service-card:hover .service-thumb-video {
          transform: scale(1.08);
        }

        .service-media video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .service-card:hover .service-media video {
          opacity: 1;
        }

        .service-content {
          padding: 32px 36px;
          position: relative;
          z-index: 2;
        }

        .service-content h3 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 14px;
          letter-spacing: 0.5px;
          transition: color 0.4s ease;
        }

        .service-card:hover .service-content h3 {
          color: #FF8C00;
        }

        .service-content p {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255,255,255,0.4);
        }

        .service-arrow {
          display: inline-block;
          margin-top: 18px;
          font-size: 20px;
          color: rgba(255,140,0,0.3);
          transition: all 0.4s ease;
        }

        .service-card:hover .service-arrow {
          color: #FF8C00;
          transform: translateX(8px);
        }

        /* TEAM SECTION */
        .team-section {
          padding: 140px 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .team-grid {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .team-card {
          width: 300px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          transition: all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .team-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,140,0,0.2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255,140,0,0.05);
        }

        .team-img-wrap {
          position: relative;
          height: 360px;
          overflow: hidden;
        }

        .team-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .team-card:hover .team-img-wrap img {
          transform: scale(1.06);
        }

        .team-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.9) 100%);
        }

        .team-info {
          padding: 24px 28px 28px;
          text-align: center;
        }

        .team-name {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 6px;
          color: #fff;
        }

        .team-role {
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #FF8C00;
        }

        .team-card {
          cursor: pointer;
        }

        /* TEAM MODAL */
        .team-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .team-modal {
          background: #111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          max-width: 520px;
          width: 100%;
          padding: 40px;
          position: relative;
          animation: modalSlideUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .team-modal-close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 28px;
          cursor: pointer;
          transition: color 0.3s;
          line-height: 1;
        }

        .team-modal-close:hover {
          color: #FF8C00;
        }

        .team-modal-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .team-modal-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,140,0,0.3);
        }

        .team-modal-name {
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .team-modal-role {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #FF8C00;
        }

        .team-modal-subtitle {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
        }

        .team-modal-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .team-modal-list li {
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          padding-left: 20px;
          position: relative;
        }

        .team-modal-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF8C00;
        }

        /* CTA SECTION */
        .cta-section {
          padding: 160px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,140,0,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-inner {
          position: relative;
          z-index: 1;
        }

        .cta-heading {
          font-size: 64px;
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1.2;
          margin-bottom: 50px;
          background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* FULLSCREEN */
        .fullscreen {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(30px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5000;
          cursor: pointer;
          animation: fadeIn 0.4s ease;
        }

        .fullscreen img, .fullscreen video {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          border-radius: 12px;
          animation: zoomIn 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoomIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* CONTACT */
        .contact-section {
          padding: 160px 60px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .contact-heading {
          font-size: 52px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 60px;
          letter-spacing: -1px;
          background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        input, textarea {
          padding: 18px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-family: inherit;
          font-size: 16px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.5s ease;
          border-radius: 0;
        }

        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.15);
        }

        input:focus, textarea:focus {
          border-color: rgba(255,140,0,0.6);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .contact-form button {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 20px 40px;
          border: 1px solid rgba(255,140,0,0.35);
          background: transparent;
          color: #FF8C00;
          cursor: pointer;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
          align-self: flex-start;
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .contact-form button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,140,0,0.1), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 50px;
        }

        .contact-form button:hover::before {
          opacity: 1;
        }

        .contact-form button:hover {
          border-color: #FF8C00;
          transform: translateX(8px);
          box-shadow: 0 0 40px rgba(255,140,0,0.1);
        }

        .contact-form button svg {
          transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .contact-form button:hover svg {
          transform: translateX(6px);
        }

        /* MAP */
        .map-section {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
          margin-top: 80px;
          align-items: start;
        }

        .map-address {
          padding-top: 10px;
        }

        .address-text {
          font-size: 17px;
          font-weight: 300;
          line-height: 2;
          color: rgba(255,255,255,0.5);
        }

        .contact-socials {
          display: flex;
          gap: 18px;
          margin-top: 20px;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.15);
        }

        .social-ig:hover {
          background: rgba(225,48,108,0.1);
          box-shadow: 0 8px 25px rgba(225,48,108,0.2);
        }

        .social-yt:hover {
          background: rgba(255,0,0,0.1);
          box-shadow: 0 8px 25px rgba(255,0,0,0.2);
        }

        .social-li:hover {
          background: rgba(10,102,194,0.1);
          box-shadow: 0 8px 25px rgba(10,102,194,0.2);
        }

        .social-fb:hover {
          background: rgba(24,119,242,0.1);
          box-shadow: 0 8px 25px rgba(24,119,242,0.2);
        }

        .map-embed {
          height: 350px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .map-embed iframe {
          filter: invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2);
        }

        /* FOOTER */
        .footer {
          padding: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: 0;
          background: rgba(255,255,255,0.02);
        }

        .footer-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 60px 60px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 60px;
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
        }

        .footer-logo {
          width: 60px;
          height: auto;
          margin-bottom: 16px;
          filter: brightness(0.8);
        }

        .footer-brand-name {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .footer-socials {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .footer-socials a {
          color: rgba(255,255,255,0.4);
          transition: color 0.3s ease, transform 0.3s ease;
          display: flex;
        }

        .footer-socials a:hover {
          color: #FF8C00;
          transform: translateY(-2px);
        }

        .footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          line-height: 1.6;
        }

        .footer-col h4 {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 24px;
        }

        .footer-col a {
          display: block;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-size: 14px;
          font-weight: 300;
          margin-bottom: 14px;
          transition: color 0.3s ease;
        }

        .footer-col a:hover {
          color: #FF8C00;
        }

        .footer-col p {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255,255,255,0.35);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .footer-bottom-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 60px;
          text-align: center;
        }

        .footer-bottom span {
          font-size: 12px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 1px;
        }

        /* ========== RESPONSIVE ========== */

        @media (max-width: 1024px) {
          .hero-logo-wrap {
            max-width: 400px;
          }
          .hero-logo-small {
            max-width: 560px;
          }

          .hero-word {
            font-size: 80px;
          }

          .hero-word-container {
            height: 100px;
          }

          .section-heading,
          .about-heading,
          .contact-heading {
            font-size: 42px;
          }

          .cta-heading {
            font-size: 48px;
          }

          .showreel-text {
            font-size: 56px;
          }

          .footer-inner {
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 40px;
          }

          .footer-inner .footer-col:last-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .nav {
            padding: 16px 24px;
          }

          .nav-scrolled {
            padding: 12px 24px;
          }

          .nav-brand {
            font-size: 14px;
            letter-spacing: 1px;
          }

          .nav-toggle {
            display: flex;
          }

          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            max-width: 300px;
            height: 100vh;
            height: 100dvh;
            background: rgba(10,10,10,0.98);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 40px;
            transition: right 0.4s cubic-bezier(0.16,1,0.3,1);
            z-index: 1000;
          }

          .nav-links.nav-open {
            right: 0;
          }

          .nav-links a {
            font-size: 16px;
            letter-spacing: 3px;
          }

          .nav-links a::after {
            display: none;
          }

          .hero {
            padding: 0 24px;
            min-height: 100vh;
            min-height: 100dvh;
          }

          .hero-logo-wrap {
            max-width: 360px;
            margin-bottom: 24px;
          }
          .hero-logo-small {
            max-width: 500px;
          }
          .logo-orbit-particle {
            display: none;
          }

          .hero-word {
            font-size: 48px;
          }

          .hero-word-container {
            height: 65px;
            margin-bottom: 20px;
          }

          .hero-cta {
            flex-direction: column;
            gap: 14px;
            width: 100%;
            max-width: 320px;
          }

          .btn-primary, .btn-outline {
            padding: 16px 32px;
            font-size: 12px;
            width: 100%;
            justify-content: center;
          }

          .hero-tagline-section {
            padding: 40px 24px 30px;
          }

          .hero-tagline-text {
            font-size: 16px;
          }

          .showreel-section {
            padding: 40px 24px 60px;
          }

          .showreel-text {
            font-size: 36px;
            gap: 16px;
          }

          .showreel-play-icon {
            width: 44px;
            height: 44px;
          }

          .showreel-play-icon svg {
            width: 20px;
            height: 20px;
          }

          .about-section {
            padding: 80px 24px;
          }

          .section-heading,
          .about-heading,
          .contact-heading {
            font-size: 32px;
          }

          .about-text {
            font-size: 15px;
            line-height: 1.8;
          }

          .marquee-item {
            width: 260px;
            height: 180px;
          }

          .marquee-fade-left,
          .marquee-fade-right {
            width: 80px;
          }

          .work-section {
            padding: 80px 24px;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .project-card-overlay {
            opacity: 1;
            padding: 24px;
          }

          .project-card-title {
            font-size: 22px;
          }

          .services-section {
            padding: 80px 24px;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .cta-section {
            padding: 100px 24px;
          }

          .cta-heading {
            font-size: 34px;
          }

          .contact-section {
            padding: 80px 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .map-section {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .map-embed {
            height: 280px;
          }

          .footer-inner {
            grid-template-columns: 1fr 1fr;
            padding: 60px 24px 40px;
            gap: 40px;
          }

          .footer-brand-col {
            grid-column: 1 / -1;
          }

          .footer-bottom-inner {
            padding: 20px 24px;
          }
        }

        @media (max-width: 480px) {
          .nav {
            padding: 14px 16px;
          }

          .nav-brand {
            font-size: 12px;
            letter-spacing: 0.5px;
          }

          .hero {
            padding: 0 16px;
          }

          .hero-logo-wrap {
            max-width: 300px;
            margin-bottom: 16px;
          }
          .hero-logo-small {
            max-width: 400px;
          }

          .hero-word {
            font-size: 34px;
            letter-spacing: -1px;
          }

          .hero-word-container {
            height: 48px;
            margin-bottom: 16px;
          }

          .btn-primary, .btn-outline {
            padding: 14px 24px;
            font-size: 11px;
          }

          .hero-tagline-section {
            padding: 30px 16px 20px;
          }

          .hero-tagline-text {
            font-size: 14px;
            line-height: 1.7;
          }

          .showreel-section {
            padding: 30px 16px 40px;
          }

          .showreel-text {
            font-size: 26px;
            gap: 10px;
          }

          .showreel-play-icon {
            width: 36px;
            height: 36px;
          }

          .showreel-play-icon svg {
            width: 16px;
            height: 16px;
          }

          .showreel-video-wrap {
            border-radius: 12px;
          }

          .about-section {
            padding: 60px 16px;
          }

          .section-heading,
          .about-heading,
          .contact-heading {
            font-size: 26px;
          }

          .section-heading {
            margin-bottom: 40px;
          }

          .about-text {
            font-size: 14px;
          }

          .marquee-section {
            padding: 40px 0;
          }

          .marquee-item {
            width: 200px;
            height: 140px;
            border-radius: 10px;
          }

          .marquee-fade-left,
          .marquee-fade-right {
            width: 40px;
          }

          .work-section {
            padding: 60px 16px;
          }

          .section-label {
            font-size: 10px;
            letter-spacing: 3px;
            padding-left: 28px;
          }

          .section-label::before {
            width: 18px;
          }

          .project-card-image {
            aspect-ratio: 4 / 3;
          }

          .project-card-large .project-card-image {
            aspect-ratio: 4 / 3;
          }

          .project-card-overlay {
            padding: 20px;
          }

          .project-card-title {
            font-size: 18px;
          }

          .project-tag {
            font-size: 9px;
            padding: 4px 10px;
          }

          .services-section {
            padding: 60px 16px;
          }

          .service-content {
            padding: 24px;
          }

          .service-content h3 {
            font-size: 18px;
          }

          .service-content p {
            font-size: 13px;
          }

          .cta-section {
            padding: 80px 16px;
          }

          .cta-heading {
            font-size: 24px;
          }

          .cta-section::before {
            width: 300px;
            height: 300px;
          }

          .contact-section {
            padding: 60px 16px;
          }

          .contact-form {
            gap: 28px;
          }

          .contact-form button {
            width: 100%;
            justify-content: center;
            padding: 18px 32px;
          }

          .map-section {
            margin-top: 50px;
          }

          .map-embed {
            height: 240px;
          }

          .footer-inner {
            grid-template-columns: 1fr;
            padding: 40px 16px 30px;
            gap: 30px;
          }

          .footer-brand-col {
            grid-column: auto;
          }

          .footer-bottom-inner {
            padding: 16px;
          }

          .footer-bottom span {
            font-size: 11px;
          }
        }
`}</style>
    </>
  );
}
