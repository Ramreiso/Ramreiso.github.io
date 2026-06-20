import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import SkillsCloud from './SkillsCloud';

const projects = [
  {
    id: 1,
    title: 'LocalMart',
    category: '',
    description: 'Multi-role marketplace web app with buyer, seller, and admin workflows for product discovery, seller onboarding, product management, order tracking, and marketplace monitoring.',
    points: [
      'Implemented NextAuth with email OTP login, Google sign-in, and role-based access control.',
      'Built protected dashboards and server-side API routes for marketplace operations.',
      'Integrated Mongoose, Cloudinary, Nodemailer, and browser push notifications.',
    ],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'NextAuth', 'Mongoose'],
    highlight: 'Multi-role commerce flows with protected dashboards',
    demoUrl: 'https://localmart-wine.vercel.app',
    githubUrl: '#',
    featured: true,
    visual: 'marketplace',
    thumbnail: new URL('../images/localmart.webp', import.meta.url).href,
  },
  {
    id: 2,
    title: 'BookwormsGuide.com',
    category: '',
    description: 'Responsive educational platform for poem explanations, novel summaries, personal growth notes, and student-friendly study materials.',
    points: [
      'Created reusable, themeable lesson grids and study library sections.',
      'Improved UX with Framer Motion animations and semantic, SEO-friendly page structure.',
      'Added dynamic OpenGraph metadata for stronger link sharing previews.',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lucide React', 'SEO'],
    highlight: 'Data-driven content UI with SEO and OpenGraph polish',
    demoUrl: 'https://bookwormsguide.com',
    githubUrl: '#',
    featured: true,
    visual: 'content',
    thumbnail: new URL('../images/Bookwormsguide.webp', import.meta.url).href,
  },
  {
    id: 3,
    title: 'Personal Portfolio Website',
    category: '',
    description: 'Personal portfolio for presenting selected web projects, technical skills, open-source contributions, and contact links in a fast responsive interface.',
    points: [
      'Developed a data-driven React portfolio with reusable sections for projects, skills, open-source work, and contact paths.',
      'Built an interactive React Three Fiber skills section with texture-based logos and controlled drag-to-rotate behavior.',
      'Added responsive project previews, accessible external links, reduced-motion support, and scroll-triggered section transitions.',
    ],
    tech: ['React', 'Vite', 'Three.js', 'React Three Fiber', 'Drei', 'JavaScript', 'CSS'],
    highlight: 'Responsive portfolio with interactive skills and maintainable React components',
    demoUrl: 'https://ramreiso.github.io',
    githubUrl: 'https://github.com/Ramreiso/Ramreiso.github.io',
    featured: true,
    visual: 'portfolio',
    thumbnail: new URL('../images/Portfolio.webp', import.meta.url).href,
  },
  {
    id: 4,
    title: 'SMS Spam Detection',
    category: 'Machine Learning',
    description: 'SMS spam detection project comparing NLP and deep learning approaches for message classification accuracy and efficiency.',
    points: [
      'Built and compared TensorFlow/Keras models using LSTM and BiLSTM architectures.',
      'Applied text preprocessing and model evaluation to classify spam messages.',
    ],
    tech: ['Python', 'NLP', 'TensorFlow', 'Keras', 'LSTM', 'BiLSTM'],
    highlight: 'Deep learning comparison for text classification',
    demoUrl: '#',
    githubUrl: '#',
    featured: false,
    visual: 'ml',
  },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Ramreiso', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ramreiso-kashung', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:ramreisog24@gmail.com', icon: 'email', external: false },
];

const snowColors = [
  { fill: 'rgba(240, 249, 255, 0.76)', glow: 'rgba(125, 211, 252, 0.26)' },
  { fill: 'rgba(186, 230, 253, 0.72)', glow: 'rgba(56, 189, 248, 0.24)' },
  { fill: 'rgba(207, 250, 254, 0.68)', glow: 'rgba(34, 211, 238, 0.22)' },
  { fill: 'rgba(254, 240, 138, 0.42)', glow: 'rgba(251, 191, 36, 0.18)' },
];

function ProjectVisual({ project }) {
  const visualClassName = `project-visual project-visual-${project.visual}${project.thumbnail ? ' project-visual-thumbnail' : ''}`;

  if (project.thumbnail) {
    return (
      <div className={visualClassName}>
        <img className="project-thumbnail" src={project.thumbnail} alt={`${project.title} project preview`} loading="lazy" />
      </div>
    );
  }

  return (
    <div className={visualClassName} aria-hidden="true">
      <div className="project-depth-grid" />
      <div className="project-device">
        <span className="project-device-top" />
        <span className="project-device-line project-device-line-wide" />
        <span className="project-device-line" />
        <span className="project-device-pill" />
      </div>
      <span className="project-cube project-cube-one" />
      <span className="project-cube project-cube-two" />
      <span className="project-ring" />
    </div>
  );
}

function ProjectLinks({ project }) {
  const hasLiveDemo = project.demoUrl && project.demoUrl !== '#';
  const showGithub = project.title === 'Personal Portfolio Website' && project.githubUrl && project.githubUrl !== '#';

  if (!hasLiveDemo && !showGithub) {
    return null;
  }

  return (
    <div className="project-buttons">
      {hasLiveDemo && (
        <a href={project.demoUrl} className="btn-link" target="_blank" rel="noreferrer">
          Live Demo
        </a>
      )}
      {showGithub && (
        <a href={project.githubUrl} className="btn-link" target="_blank" rel="noreferrer">
          GitHub
        </a>
      )}
    </div>
  );
}

function SocialIcon({ icon }) {
  if (icon === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1.1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.9 1.1.8-.2 1.7-.3 2.6-.3s1.8.1 2.6.3c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.8 0 3.9-2.3 4.7-4.5 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2Z" />
      </svg>
    );
  }

  if (icon === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.5h15C20.3 6.5 21 7.2 21 8v8c0 .8-.7 1.5-1.5 1.5h-15C3.7 17.5 3 16.8 3 16V8c0-.8.7-1.5 1.5-1.5Zm.3 1.7 7.2 5 7.2-5H4.8Zm14.7 1.5-7.1 4.9c-.2.2-.6.2-.8 0L4.5 9.7V16h15V9.7Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.2 8.9h3.4V20H5.2V8.9Zm1.7-5.4c1.1 0 1.9.8 1.9 1.8S8 7.1 6.9 7.1 5 6.3 5 5.3s.8-1.8 1.9-1.8ZM10.7 8.9H14v1.5h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.1 2.3 4.1 5.2V20h-3.4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20h-3.4V8.9Z" />
    </svg>
  );
}

function useSectionReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const sections = Array.from(document.querySelectorAll('.reveal-section'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!sections.length) return undefined;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return undefined;
    }

    sections.forEach((section, index) => {
      section.style.setProperty('--reveal-delay', `${Math.min(index * 80, 240)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
}

export default function App() {
  useSectionReveal();

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);
  
  const skillList = [
    { label: 'React', icon: new URL('../images/react-icon.png', import.meta.url).href },
    { label: 'Next.js', icon: new URL('../images/nextjs-icon.png', import.meta.url).href },
    { label: 'TypeScript', icon: new URL('../images/typescript-icon.png', import.meta.url).href },
    { label: 'Tailwind CSS', icon: new URL('../images/tailwind-icon.png', import.meta.url).href },
    { label: 'JavaScript', icon: new URL('../images/javascript.png', import.meta.url).href },
    { label: 'MongoDB', icon: new URL('../images/mongodb-icon.png', import.meta.url).href },
    { label: 'Vercel', icon: new URL('../images/vercel-icon.png', import.meta.url).href },
    { label: 'VS Code', icon: new URL('../images/vscode-icon.png', import.meta.url).href },
    { label: 'Python', icon: new URL('../images/python.jpg', import.meta.url).href },
    { label: 'HTML5', icon: new URL('../images/html5.jpg', import.meta.url).href },
    { label: 'CSS3', icon: new URL('../images/css3.jpg', import.meta.url).href },
    { label: 'Git', icon: new URL('../images/git.png', import.meta.url).href },
    { label: 'GitHub', icon: new URL('../images/github.png', import.meta.url).href },
    { label: 'C++', icon: new URL('../images/cpp.png', import.meta.url).href },
    { label: 'TensorFlow', icon: new URL('../images/tensorflow.png', import.meta.url).href },
    { label: 'NumPy', icon: new URL('../images/numpy.png', import.meta.url).href },
    { label: 'Pandas', icon: new URL('../images/pandas.png', import.meta.url).href },
  ];

  const skillGroups = [
    {
      title: 'Full Stack Development',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'API Routes', 'REST APIs', 'MongoDB', 'Mongoose', 'SQL', 'Vercel'],
    },
    {
      title: 'Auth, APIs & Integrations',
      items: ['NextAuth', 'Email OTP', 'Google Sign-in', 'Cloudinary', 'Nodemailer', 'Web Push'],
    },
    {
      title: 'Developer Workflow',
      items: ['VS Code', 'Git', 'GitHub', 'Linux', 'Open Source', 'Responsive UI'],
    },
    {
      title: 'Data & Machine Learning',
      items: ['Python', 'C++', 'NLP', 'TensorFlow', 'Keras', 'NumPy', 'Pandas'],
    },
  ];

  return (
    <div className="app-shell">
      <div className="page-snow" aria-hidden="true">
        {Array.from({ length: 36 }).map((_, index) => {
          const snowColor = snowColors[index % snowColors.length];
          const snowStyle = {
            '--x': `${(index * 29) % 100}%`,
            '--size': `${2 + (index % 5)}px`,
            '--delay': `-${(index * 0.34).toFixed(2)}s`,
            '--duration': `${9 + (index % 8) * 1.15}s`,
            '--drift': `${((index % 11) - 5) * 14}px`,
            '--opacity': `${0.18 + (index % 7) * 0.055}`,
            '--snow-color': snowColor.fill,
            '--snow-glow': snowColor.glow,
          };

          return <span key={index} style={snowStyle} />;
        })}
      </div>

      <header className="hero-section">
        <div className="hero-background" aria-hidden="true">
          <div className="hero-ambient hero-ambient-one" />
          <div className="hero-ambient hero-ambient-two" />
        </div>

        <div className="hero-copy">
          <span className="eyebrow">Web Developer</span>
          <h1 className="hero-name">Ramreiso Kashung</h1>
          <p className="contact-line">India · Ramreisog24@gmail.com</p>
          <p>
            Web Developer with a B.Tech in Computer Science and Engineering and hands-on experience building responsive,
            SEO-friendly web applications using Next.js, React, TypeScript, Tailwind CSS, and MongoDB. 

          </p>
          <div className="hero-buttons">
            <a href="#projects" className="button button-primary">View Projects</a>
            <a href="#contact" className="button button-secondary">Contact Me</a>
          </div>
          <div className="hero-highlights">
            <div>
              <strong>Problem Solving</strong>
              <span>Turning complex issues into smooth user flows</span>
            </div>
            <div>
              <strong>Communication</strong>
              <span>Clear updates for remote teamwork</span>
            </div>
            <div>
              <strong>Time Management</strong>
              <span>Patient, consistent delivery</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="projects" className="content-block accent-block reveal-section">
          <span className="section-label">Work</span>
          <h2>Featured Web Development Projects</h2>
          
          <div className="project-grid featured-grid">
            {featuredProjects.map((project) => (
              <article key={project.id} className="project-card project-card-3d featured-card">
                <ProjectVisual project={project} />
                <div className="project-header">
                  <h3>{project.title}</h3>
                  {project.category && <span className="project-category">{project.category}</span>}
                </div>
                <p className="project-description">{project.description}</p>
                <ul className="project-points">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="project-highlight">
                  <strong>{project.highlight}</strong>
                </div>
                <div className="tech-stack">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <ProjectLinks project={project} />
              </article>
            ))}
          </div>

          <h3 className="other-projects-title">Other Projects</h3>
          <div className="project-grid">
            {otherProjects.map((project) => (
              <article key={project.id} className="project-card project-card-3d">
                <ProjectVisual project={project} />
                <div className="project-header">
                  <h3>{project.title}</h3>
                  {project.category && <span className="project-category">{project.category}</span>}
                </div>
                <p className="project-description">{project.description}</p>
                <ul className="project-points">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="tech-stack">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-badge tech-badge-sm">{tech}</span>
                  ))}
                </div>
                <ProjectLinks project={project} />
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="content-block skills-section reveal-section">
          <div className="skills-heading">
            <span className="section-label">Technical Skills</span>
            <h2>Tools I use to build production-ready web apps</h2>
            <p>
              A focused full-stack toolkit for responsive UI, secure authentication, API routes, MongoDB-backed features,
              clean deployments, and maintainable project workflows.
            </p>
          </div>

          <div className="skills-showcase">
            <div className="skills-copy-panel">
              <p className="skills-kicker">Built around real project work</p>
              <div className="skills-stack-list">
                {skillGroups.map((group) => (
                  <div className="skills-stack-row" key={group.title}>
                    <h3>{group.title}</h3>
                    <div>
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="skills-visual" aria-label="Interactive 3D orbit of Ramreiso's technical skills">
              <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                camera={{ position: [0, 0.42, 10.3], fov: 42 }}
              >
                <Suspense fallback={null}>
                  <SkillsCloud skills={skillList} />
                </Suspense>
              </Canvas>
              <div className="skills-orbit-hint" aria-hidden="true">Drag to rotate</div>
            </div>
          </div>
        </section>

        <section id="opensource" className="content-block accent-block reveal-section">
          <span className="section-label">Open Source Experience</span>
          <h2>Contributions</h2>
          <div className="project-grid">
            <article className="project-card">
              <h3>LibreOffice</h3>
              <p>Contributed to a large C++ codebase and completed 6 contributions while working with code review and collaborative open-source practices.</p>
              <div className="tech-stack">
                <span className="tech-badge">C++</span>
                <span className="tech-badge">Gerrit</span>
                <span className="tech-badge">Git</span>
                <span className="tech-badge">GitHub</span>
              </div>
            </article>
            <article className="project-card">
              <h3>Meshery.io</h3>
              <p>Fixed a frontend UI visibility issue, contributed documentation/workflows, and added the Cilium Service Mesh adapter as an Alpha adapter.</p>
              <div className="tech-stack">
                <span className="tech-badge">HTML</span>
                <span className="tech-badge">CSS</span>
                <span className="tech-badge">GitHub</span>
              </div>
            </article>
          </div>
        </section>

        <section id="contact" className="content-block contact-block reveal-section">
          <div>
            <span className="section-label">Contact</span>
            <h2>Let's build something together.</h2>
            <p>
             I’m open to remote web development roles and opportunities to build practical full-stack or frontend applications.
            </p>
          </div>
          <a className="button button-primary" href="mailto:ramreisog24@gmail.com">Email Me</a>
        </section>
      </main>

      <footer className="site-footer reveal-section">
        <p>Ramreiso Kashung · Web Developer</p>
        <nav className="footer-links" aria-label="Profile links">
          {socialLinks.map((link) => {
            const externalProps = link.external === false ? {} : { target: '_blank', rel: 'noreferrer' };

            return (
              <a key={link.label} href={link.href} aria-label={link.label} title={link.label} {...externalProps}>
                <SocialIcon icon={link.icon} />
              </a>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
