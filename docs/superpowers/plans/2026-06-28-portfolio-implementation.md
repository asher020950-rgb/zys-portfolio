# ZYS Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page scrolling portfolio site using Z/Y/S letters as skeleton, with dark/light theme, scroll animations, and tilt interactions.

**Architecture:** Pure static site built with Vite (HTML/CSS/JS). No frameworks. Zero external runtime dependencies. CSS Custom Properties for theming. Intersection Observer for scroll animations.

**Tech Stack:** HTML5, CSS3, Vanilla JS, Vite 5

## Global Constraints

- Zero external runtime dependencies (no GSAP, Three.js, jQuery)
- No blog, CMS, form backend, i18n, PWA, or analytics
- Dark/light theme via `[data-theme]` attribute + CSS custom properties
- All animations use Intersection Observer + CSS transitions/transforms
- Built with Vite, output to `dist/`
- Target: modern browsers (Chrome/Firefox/Safari/Edge latest 2 versions)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `D:\Portfolio\package.json`
- Create: `D:\Portfolio\vite.config.js`
- Create: `D:\Portfolio\assets\images\.gitkeep`
- Create: `D:\Portfolio\.gitignore`

**Interfaces:**
- Produces: Vite dev server with `npm run dev`, build with `npm run build`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "zys-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    open: true,
  },
})
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
.DS_Store
*.local
```

- [ ] **Step 4: Create placeholder assets directory**

- Create empty file `D:\Portfolio\assets\images\.gitkeep`

- [ ] **Step 5: Initialize git repo**

```bash
cd D:/Portfolio
git init
```

- [ ] **Step 6: Install dependencies**

```bash
cd D:/Portfolio
npm install
```

- [ ] **Step 7: Verify**

```bash
cd D:/Portfolio
npx vite --version
```
Expected output: `vite/6.x.x`

---

### Task 2: HTML Core Structure

**Files:**
- Create: `D:\Portfolio\index.html`

**Interfaces:**
- Produces: Semantic HTML skeleton with all sections, nav, hero, Z/Y/S content areas, footer

- [ ] **Step 1: Create index.html with full structure**

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ZYS | Portfolio</title>
  <meta name="description" content="Personal portfolio of ZYS" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='28' font-size='28'>Z</text></svg>" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar" id="navbar">
    <div class="nav-letters">
      <a href="#section-z" class="nav-letter" data-section="z">Z</a>
      <a href="#section-y" class="nav-letter" data-section="y">Y</a>
      <a href="#section-s" class="nav-letter" data-section="s">S</a>
    </div>
    <div class="nav-actions">
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <span class="icon-sun">☀️</span>
        <span class="icon-moon">🌙</span>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero section" id="hero">
    <div class="hero-letters" id="heroLetters">
      <span class="hero-letter tilt-letter" data-letter="Z">Z</span>
      <span class="hero-letter tilt-letter" data-letter="Y">Y</span>
      <span class="hero-letter tilt-letter" data-letter="S">S</span>
    </div>
    <div class="hero-content">
      <div class="hero-avatar" id="heroAvatar">
        <div class="avatar-layer layer-base"></div>
        <div class="avatar-layer layer-mid"></div>
        <div class="avatar-layer layer-front"></div>
      </div>
      <div class="hero-text">
        <h1 class="hero-name">ZYS</h1>
        <p class="hero-tagline">Creative Developer &amp; Designer</p>
        <p class="hero-bio">Building elegant digital experiences through clean code and thoughtful design.</p>
      </div>
    </div>
  </section>

  <!-- Section Z: About / Bio -->
  <section class="section content-section" id="section-z" data-section="z">
    <div class="section-sidebar">
      <span class="section-letter tilt-letter" data-letter="Z">Z</span>
    </div>
    <div class="section-body">
      <div class="bio-header">
        <div class="bio-avatar">
          <div class="avatar-layer layer-base"></div>
          <div class="avatar-layer layer-mid"></div>
          <div class="avatar-layer layer-front"></div>
        </div>
        <div class="bio-intro">
          <h2>About Me</h2>
          <p class="bio-name">ZYS</p>
          <p class="bio-desc">A passionate developer with expertise in full-stack web development, UI/UX design, and creative coding. I love turning complex problems into simple, beautiful solutions.</p>
        </div>
      </div>
      <div class="skills-section">
        <h3>Skills</h3>
        <div class="skills-grid" id="skillsGrid">
          <span class="skill-tag">HTML/CSS</span>
          <span class="skill-tag">JavaScript</span>
          <span class="skill-tag">TypeScript</span>
          <span class="skill-tag">React</span>
          <span class="skill-tag">Node.js</span>
          <span class="skill-tag">Python</span>
          <span class="skill-tag">Figma</span>
          <span class="skill-tag">Git</span>
        </div>
      </div>
      <div class="awards-section">
        <h3>Awards &amp; Recognition</h3>
        <div class="awards-timeline">
          <div class="award-item">
            <span class="award-year">2026</span>
            <div class="award-detail">
              <span class="award-title">Best Innovation Award</span>
              <span class="award-org">Tech Conference</span>
            </div>
          </div>
          <div class="award-item">
            <span class="award-year">2025</span>
            <div class="award-detail">
              <span class="award-title">Outstanding Project</span>
              <span class="award-org">Hackathon XYZ</span>
            </div>
          </div>
          <div class="award-item">
            <span class="award-year">2024</span>
            <div class="award-detail">
              <span class="award-title">First Place — Web Dev</span>
              <span class="award-org">University Competition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section Y: Projects -->
  <section class="section content-section" id="section-y" data-section="y">
    <div class="section-sidebar">
      <span class="section-letter tilt-letter" data-letter="Y">Y</span>
    </div>
    <div class="section-body">
      <h2>Projects</h2>
      <div class="projects-grid" id="projectsGrid">
        <article class="project-card">
          <div class="card-image" style="background: var(--accent); opacity: 0.3;"></div>
          <div class="card-body">
            <h3 class="card-title">Project Alpha</h3>
            <p class="card-desc">A full-stack web application built with React and Node.js.</p>
            <div class="card-tags">
              <span class="card-tag">React</span>
              <span class="card-tag">Node.js</span>
              <span class="card-tag">MongoDB</span>
            </div>
            <div class="card-links">
              <a href="#" class="card-link" target="_blank">Demo →</a>
              <a href="#" class="card-link" target="_blank">GitHub →</a>
            </div>
          </div>
        </article>
        <article class="project-card">
          <div class="card-image" style="background: var(--accent); opacity: 0.25;"></div>
          <div class="card-body">
            <h3 class="card-title">Project Beta</h3>
            <p class="card-desc">Mobile-first design system with 50+ accessible components.</p>
            <div class="card-tags">
              <span class="card-tag">TypeScript</span>
              <span class="card-tag">CSS</span>
              <span class="card-tag">Storybook</span>
            </div>
            <div class="card-links">
              <a href="#" class="card-link" target="_blank">Demo →</a>
              <a href="#" class="card-link" target="_blank">GitHub →</a>
            </div>
          </div>
        </article>
        <article class="project-card">
          <div class="card-image" style="background: var(--accent); opacity: 0.2;"></div>
          <div class="card-body">
            <h3 class="card-title">Project Gamma</h3>
            <p class="card-desc">Real-time data visualization dashboard for IoT sensors.</p>
            <div class="card-tags">
              <span class="card-tag">Python</span>
              <span class="card-tag">WebSocket</span>
              <span class="card-tag">D3.js</span>
            </div>
            <div class="card-links">
              <a href="#" class="card-link" target="_blank">Demo →</a>
              <a href="#" class="card-link" target="_blank">GitHub →</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- Section S: Contact -->
  <section class="section content-section" id="section-s" data-section="s">
    <div class="section-sidebar">
      <span class="section-letter tilt-letter" data-letter="S">S</span>
    </div>
    <div class="section-body contact-body">
      <div class="contact-intro">
        <div class="contact-avatar">
          <div class="avatar-layer layer-base"></div>
          <div class="avatar-layer layer-mid"></div>
          <div class="avatar-layer layer-front"></div>
        </div>
        <h2>Get in Touch</h2>
        <p>Have a project in mind? Let's work together.</p>
      </div>
      <div class="contact-links">
        <div class="contact-item">
          <span class="contact-label">Email</span>
          <button class="contact-value copy-email" id="copyEmail" data-email="hello@zys.dev">
            hello@zys.dev
            <span class="copy-hint">Click to copy</span>
          </button>
        </div>
        <div class="contact-item">
          <span class="contact-label">GitHub</span>
          <a href="https://github.com/zys" target="_blank" class="contact-value">github.com/zys →</a>
        </div>
        <div class="contact-item">
          <span class="contact-label">Resume</span>
          <a href="/assets/resume.pdf" class="contact-value" download>Download PDF →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Toast for copy feedback -->
  <div class="toast" id="toast" role="alert" aria-live="polite"></div>

  <!-- Footer -->
  <footer class="footer">
    <p>&copy; 2026 ZYS. All rights reserved.</p>
  </footer>

  <script type="module" src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML structure**

Open `index.html` in browser (without CSS/JS — check tag structure via DevTools).
Expected: All sections present in order: nav, hero, section-z, section-y, section-s, footer.

---

### Task 3: CSS Foundations — Reset, Variables, Theme, Typography

**Files:**
- Create: `D:\Portfolio\style.css`

**Interfaces:**
- Produces: Global CSS with custom properties, dark/light theme, reset, typography scale

- [ ] **Step 1: Write global styles**

```css
/* === Reset === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  opacity: 0.8;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

img {
  max-width: 100%;
  display: block;
}

ul, ol {
  list-style: none;
}

/* === Theme Variables === */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --text-muted: #999999;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --border: #e5e5e5;
  --card-bg: #fafafa;
  --nav-bg: rgba(255, 255, 255, 0.8);
  --toast-bg: #1a1a1a;
  --toast-text: #ffffff;
}

[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #f5f5f5;
  --text-secondary: #999999;
  --text-muted: #666666;
  --accent: #60a5fa;
  --accent-hover: #93bbfc;
  --border: #2a2a2a;
  --card-bg: #141414;
  --nav-bg: rgba(10, 10, 10, 0.8);
  --toast-bg: #f5f5f5;
  --toast-text: #1a1a1a;
}

/* === Typography === */
h1, h2, h3 {
  line-height: 1.2;
  font-weight: 700;
}

h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); margin-bottom: 1.5rem; }
h3 { font-size: clamp(1.1rem, 2vw, 1.5rem); margin-bottom: 1rem; }

p { margin-bottom: 1rem; color: var(--text-secondary); }

/* === Sections === */
.section {
  min-height: 100vh;
  padding: 6rem 2rem 3rem;
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.section-sidebar {
  flex-shrink: 0;
  width: 80px;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  position: sticky;
  top: 6rem;
}

.section-letter {
  font-size: 5rem;
  font-weight: 900;
  color: var(--text-primary);
  opacity: 0.08;
  line-height: 1;
  user-select: none;
  transition: opacity 0.3s ease;
  display: block;
}

.section-body {
  flex: 1;
  min-width: 0;
}

/* === Reveal Animations === */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* === Toast === */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--toast-bg);
  color: var(--toast-text);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
  pointer-events: none;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* === Scrollbar === */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
```

- [ ] **Step 2: Verify CSS loads**

Run `npx vite` (or check dev server), view page in browser. Body should show the dark background (#0a0a0a) with white text.

---

### Task 4: Navigation Bar

**Files:**
- Modify: `D:\Portfolio\style.css` (append navbar styles)
- Modify: `D:\Portfolio\main.js` (create file, add nav logic)

**Interfaces:**
- Consumes: CSS variables from Task 3
- Produces: `.navbar` with scroll-aware background and active letter highlighting

- [ ] **Step 1: Add navbar CSS to style.css**

```css
/* === Navigation === */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}

.navbar.scrolled {
  background-color: var(--nav-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-letters {
  display: flex;
  gap: 1.5rem;
}

.nav-letter {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  position: relative;
}

.nav-letter::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.nav-letter:hover {
  color: var(--text-primary);
}

.nav-letter.active {
  color: var(--accent);
}

.nav-letter.active::after {
  transform: scaleX(1);
}

.theme-toggle {
  font-size: 1.1rem;
  padding: 0.4rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.theme-toggle:hover {
  background-color: var(--bg-secondary);
}

[data-theme="dark"] .icon-sun { display: inline; }
[data-theme="dark"] .icon-moon { display: none; }
[data-theme="light"] .icon-sun { display: none; }
[data-theme="light"] .icon-moon { display: inline; }
```

- [ ] **Step 2: Create main.js with nav scroll + theme logic**

```js
import './style.css'

// === Navigation scroll effect ===
const navbar = document.getElementById('navbar')
let lastScrollY = 0

function handleNavScroll() {
  const scrollY = window.scrollY
  if (scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
  lastScrollY = scrollY
}

window.addEventListener('scroll', handleNavScroll, { passive: true })

// === Section active state ===
const navLetters = document.querySelectorAll('.nav-letter')
const sections = document.querySelectorAll('.content-section')

function updateActiveSection() {
  const scrollY = window.scrollY + 200
  let currentSection = ''

  sections.forEach((section) => {
    const top = section.offsetTop
    const height = section.offsetHeight
    if (scrollY >= top && scrollY < top + height) {
      currentSection = section.dataset.section
    }
  })

  navLetters.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === currentSection)
  })
}

window.addEventListener('scroll', updateActiveSection, { passive: true })

// === Theme toggle ===
const themeToggle = document.getElementById('themeToggle')
const html = document.documentElement

function getPreferredTheme() {
  const stored = localStorage.getItem('theme')
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme')
  setTheme(current === 'dark' ? 'light' : 'dark')
})

// Initialize theme
setTheme(getPreferredTheme())
```

- [ ] **Step 3: Verify nav behavior**

Run `npm run dev`, scroll page. Nav should get blurred background after 50px scroll. Click letters: they scroll to sections. Theme toggle works and persists.

---

### Task 5: Hero Section — Full Layout

**Files:**
- Modify: `D:\Portfolio\style.css` (append hero styles)

- [ ] **Step 1: Add hero CSS**

```css
/* === Hero Section === */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 4rem;
  gap: 3rem;
  position: relative;
  overflow: hidden;
}

.hero-letters {
  display: flex;
  gap: 2rem;
  perspective: 800px;
}

.hero-letter {
  font-size: clamp(5rem, 15vw, 12rem);
  font-weight: 900;
  line-height: 1;
  color: var(--text-primary);
  user-select: none;
  transition: color 0.3s ease;
  display: inline-block;
  transform-style: preserve-3d;
  will-change: transform;
}

.hero-letter:nth-child(1) { color: var(--accent); }
.hero-letter:nth-child(2) { color: var(--text-primary); }
.hero-letter:nth-child(3) { color: var(--text-secondary); }

.hero-content {
  display: flex;
  align-items: center;
  gap: 3rem;
  max-width: 600px;
  width: 100%;
}

.hero-avatar {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
}

.avatar-layer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transition: transform 0.3s ease-out;
}

.avatar-layer.layer-base {
  background: var(--accent);
  opacity: 0.15;
  transform: translate(0, 0);
}

.avatar-layer.layer-mid {
  background: var(--accent);
  opacity: 0.25;
  transform: translate(4px, -4px);
}

.avatar-layer.layer-front {
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent);
  transform: translate(-4px, 4px);
}

.avatar-layer.layer-front::after {
  content: 'Z';
}

.hero-text {
  flex: 1;
}

.hero-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.hero-tagline {
  font-size: 1.05rem;
  color: var(--accent);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.hero-bio {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
}
```

- [ ] **Step 2: Verify hero layout**

View hero in browser. Three large Z/Y/S letters should display with accent/primary/secondary colors. Avatar circles stack with parallax. Text reads clearly.

---

### Task 6: Section Z — Bio, Skills & Awards

**Files:**
- Modify: `D:\Portfolio\style.css` (append Z-section styles)

- [ ] **Step 1: Add Z-section CSS**

```css
/* === Bio Section (Z) === */
.bio-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
}

.bio-avatar {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
}

.bio-intro {
  flex: 1;
}

.bio-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.bio-desc {
  font-size: 0.95rem;
  line-height: 1.7;
}

/* === Skills === */
.skills-section {
  margin-bottom: 3rem;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--accent);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 20px;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, var(--bg-secondary));
}

/* === Awards === */
.awards-section {
  margin-bottom: 2rem;
}

.awards-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.award-item {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.award-item:last-child {
  border-bottom: none;
}

.award-year {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
  min-width: 3.5rem;
}

.award-detail {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.award-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.award-org {
  font-size: 0.85rem;
  color: var(--text-muted);
}
```

- [ ] **Step 2: Verify Z section**

Scroll to Z section (or nav click). Large Z appears on left sidebar. Bio header, skills tags, and award timeline render correctly.

---

### Task 7: Section Y — Project Cards

**Files:**
- Modify: `D:\Portfolio\style.css` (append Y-section styles)

- [ ] **Step 1: Add Y-section CSS**

```css
/* === Projects Section (Y) === */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.card-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.card-tag {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.card-links {
  display: flex;
  gap: 1rem;
}

.card-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--accent);
  transition: color 0.2s ease;
}

.card-link:hover {
  color: var(--accent-hover);
}
```

- [ ] **Step 2: Verify Y section**

Scroll to Y section. Three project cards display in responsive grid. Hover lifts card with shadow.

---

### Task 8: Section S — Contact & Footer

**Files:**
- Modify: `D:\Portfolio\style.css` (append S-section + footer styles)
- Modify: `D:\Portfolio\main.js` (add email copy + toast logic)

- [ ] **Step 1: Add contact section CSS**

```css
/* === Contact Section (S) === */
.contact-body {
  max-width: 600px;
}

.contact-intro {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.contact-intro .contact-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  margin-bottom: 1rem;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-value {
  font-size: 1rem;
  color: var(--text-primary);
  transition: color 0.2s ease;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-value:hover {
  color: var(--accent);
}

.copy-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
}

/* === Footer === */
.footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
}
```

- [ ] **Step 2: Add email copy + toast logic to main.js**

Append to `D:\Portfolio\main.js`:

```js
// === Copy email to clipboard ===
const copyBtn = document.getElementById('copyEmail')
const toast = document.getElementById('toast')

copyBtn.addEventListener('click', async () => {
  const email = copyBtn.dataset.email
  try {
    await navigator.clipboard.writeText(email)
    showToast('Email copied to clipboard!')
  } catch {
    // Fallback
    const textArea = document.createElement('textarea')
    textArea.value = email
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast('Email copied to clipboard!')
  }
})

function showToast(message) {
  toast.textContent = message
  toast.classList.add('show')
  setTimeout(() => {
    toast.classList.remove('show')
  }, 2500)
}
```

- [ ] **Step 3: Verify contact & footer**

Scroll to S section. Email copy button works (click shows toast). GitHub link and resume link display. Footer copyright shows.

---

### Task 9: Scroll Animations — Intersection Observer Reveals

**Files:**
- Modify: `D:\Portfolio\style.css` (reveal animation classes already exist from Task 3)
- Modify: `D:\Portfolio\main.js` (add Intersection Observer logic)

- [ ] **Step 1: Add reveal attributes to HTML (already done in index.html)**
  - All sections have `.reveal` class structure ready for activation

- [ ] **Step 2: Add Intersection Observer logic to main.js**

Append to `D:\Portfolio\main.js`:

```js
// === Scroll reveal animations ===
const revealElements = document.querySelectorAll('.reveal')

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, observerOptions)

revealElements.forEach((el) => revealObserver.observe(el))
```

- [ ] **Step 3: Add `reveal` classes to HTML sections**

Add `.reveal` class and optional delay classes in `index.html`:

To `.bio-header` → `<div class="bio-header reveal">`
To `.skills-section` → `<section class="skills-section reveal reveal-delay-1">`
To `.awards-section` → `<section class="awards-section reveal reveal-delay-2">`
To each `.project-card` → add `reveal reveal-delay-N` (delay-1, delay-2, delay-3)
To `.contact-intro` → `reveal`
To `.contact-links` → `reveal reveal-delay-1`

- [ ] **Step 4: Verify animations**

Scroll down the page. Each section should fade in + slide up on scroll.

---

### Task 10: Mouse Tilt Interaction on ZYS Letters

**Files:**
- Modify: `D:\Portfolio\main.js` (add tilt logic)
- Modified style already: `.tilt-letter` has `transform-style: preserve-3d; will-change: transform;`

- [ ] **Step 1: Add tilt interaction to main.js**

Append to `D:\Portfolio\main.js`:

```js
// === Tilt effect on ZYS letters ===
const tiltLetters = document.querySelectorAll('.tilt-letter')

tiltLetters.forEach((letter) => {
  letter.addEventListener('mousemove', (e) => {
    const rect = letter.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const tiltX = ((y - centerY) / centerY) * -15
    const tiltY = ((x - centerX) / centerX) * 15

    letter.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  })

  letter.addEventListener('mouseleave', () => {
    letter.style.transform = 'rotateX(0deg) rotateY(0deg)'
  })
})
```

- [ ] **Step 2: Verify tilt effect**

Hover over any Z/Y/S letter (hero + section sidebars). Letter tilts following mouse position. Returns to flat on mouse leave.

---

### Task 11: Avatar Parallax Effect

**Files:**
- Modify: `D:\Portfolio\main.js` (add avatar parallax logic)

- [ ] **Step 1: Add avatar parallax to main.js**

Append to `D:\Portfolio\main.js`:

```js
// === Avatar parallax effect ===
const avatarGroups = document.querySelectorAll('.hero-avatar, .bio-avatar, .contact-avatar')

avatarGroups.forEach((group) => {
  const layers = group.querySelectorAll('.avatar-layer')

  group.addEventListener('mousemove', (e) => {
    const rect = group.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    layers.forEach((layer, index) => {
      const depth = (index + 1) * 4
      const moveX = ((x - centerX) / centerX) * depth
      const moveY = ((y - centerY) / centerY) * depth
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`
    })
  })

  group.addEventListener('mouseleave', () => {
    layers.forEach((layer, index) => {
      layer.style.transform = ''
    })
  })
})
```

- [ ] **Step 2: Verify parallax**

Hover over avatar circles in hero, bio, and contact sections. Layers shift at different speeds creating depth.

---

### Task 12: Responsive Design & Final Polish

**Files:**
- Modify: `D:\Portfolio\style.css` (add responsive breakpoints)
- Modify: `D:\Portfolio\main.js` (final cleanup)

**Interfaces:**
- Produces: Production-ready build

- [ ] **Step 1: Add responsive breakpoints to style.css**

```css
/* === Responsive === */
@media (max-width: 768px) {
  .section {
    flex-direction: column;
    padding: 5rem 1.25rem 2rem;
    gap: 1rem;
  }

  .section-sidebar {
    width: 100%;
    position: static;
    padding-top: 0;
  }

  .section-letter {
    font-size: 3rem;
    opacity: 0.06;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-letters {
    gap: 1rem;
  }

  .hero-letter {
    font-size: clamp(4rem, 20vw, 8rem);
  }

  .bio-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .nav-letters {
    gap: 1rem;
  }

  .navbar {
    padding: 0.75rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .hero-letter {
    font-size: clamp(3rem, 25vw, 5rem);
  }

  .section {
    padding: 4rem 1rem 2rem;
  }

  .hero-content {
    gap: 1.5rem;
  }

  .hero-avatar {
    width: 100px;
    height: 100px;
  }
}
```

- [ ] **Step 2: Build and verify production output**

```bash
cd D:/Portfolio && npm run build
```

Expected: `dist/` folder with `index.html`, `assets/` subfolder with hashed CSS/JS files.

- [ ] **Step 3: Preview production build**

```bash
cd D:/Portfolio && npm run preview
```

Open preview URL. All features work: theme toggle, scroll nav, tilt, parallax, copy email.

- [ ] **Step 4: Make initial git commit**

```bash
cd D:/Portfolio
git add .
git commit -m "feat: initial portfolio site with Z/Y/S letter skeleton

- Vite + vanilla HTML/CSS/JS setup
- Dark/light theme with CSS custom properties
- Navigation with scroll-aware highlight
- Hero section with tilt-interactive letters
- Z section: bio, skills tags, award timeline
- Y section: responsive project cards grid
- S section: contact with email copy
- Intersection Observer scroll reveals
- Avatar mouse parallax effect
- Responsive design for mobile/tablet

Co-Authored-By: Claude <noreply@anthropic.com>"
```
