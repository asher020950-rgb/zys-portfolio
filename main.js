import './style.css'

// =====================================================
// 1. THREE.JS — Floating 3D Letters (Hero + Section)
// =====================================================
async function initThreeScene() {
  const container = document.getElementById('threeScene')
  if (!container) return

  try {
    const THREE = await import('three')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 300

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Create letter textures
    function createLetterCanvas(letter, color, size = 256) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, size, size)
      ctx.fillStyle = color
      const fontSize = size * 0.7
      ctx.font = `Bold ${fontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 20
      ctx.fillText(letter, size / 2, size / 2)
      return canvas
    }

    function createLetterSprite(letter, color, size) {
      const canvas = createLetterCanvas(letter, color, 256)
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.NormalBlending,
      })
      const sprite = new THREE.Sprite(material)
      sprite.scale.set(size, size, 1)
      sprite.userData = { letter, baseSize: size, floatPhase: Math.random() * Math.PI * 2 }
      return sprite
    }

    // ─── Main Hero Letters (Z, Y, S) ───
    const heroLetters = {}
    const letters = ['Z', 'Y', 'S']
    const colors = { Z: '#d5cec7', Y: '#d5cec7', S: '#d5cec7' }
    const letterSize = 60

    letters.forEach((l) => {
      const sprite = createLetterSprite(l, colors[l], letterSize)
      // Initial spread positions for hero
      const positions = { Z: { x: -80, y: 0 }, Y: { x: 80, y: 0 }, S: { x: 0, y: -60 } }
      sprite.position.set(positions[l].x, positions[l].y, 0)
      sprite.userData.floatAmp = 8 + Math.random() * 12
      sprite.userData.floatSpeed = 0.3 + Math.random() * 0.4
      sprite.userData.homeX = positions[l].x
      sprite.userData.homeY = positions[l].y
      scene.add(sprite)
      heroLetters[l] = sprite
    })

    // ─── Ambient Small Letters ───
    const ambientLetters = []
    const ambientChars = ['Z', 'Y', 'S', 'Z', 'Y', 'S', 'Z', 'Y', 'S']
    const ambientColors = ['#d5cec7', '#f6ff93', '#d5cec7', '#f6ff93', '#d5cec7']

    ambientChars.forEach((char, i) => {
      const color = ambientColors[i % ambientColors.length]
      const size = 8 + Math.random() * 20
      const sprite = createLetterSprite(char, color, size)
      const baseOpacity = 0.1 + Math.random() * 0.25
      sprite.position.set(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 200 - 100,
      )
      sprite.material.opacity = baseOpacity
      sprite.userData = {
        baseOpacity,
        floatAmp: 3 + Math.random() * 10,
        floatSpeed: 0.1 + Math.random() * 0.3,
        floatPhase: Math.random() * Math.PI * 2,
        homeX: sprite.position.x,
        homeY: sprite.position.y,
        homeZ: sprite.position.z,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      }
      scene.add(sprite)
      ambientLetters.push(sprite)
    })

    // ─── Scroll-based letter state machine ───
    // Map sections to normalized scroll progression
    const sections = ['hero', 'bio', 'projects', 'awards', 'contact']
    const sectionBreakpoints = [0, 0.15, 0.35, 0.55, 0.8]
    // Normalized section transition width
    const transitionWidth = 0.05

    // For each section, define where each letter should be
    const letterStates = {
      hero: {
        Z: { x: -80, y: 0, z: 0, opacity: 1, scale: 1.0 },
        Y: { x: 80, y: 0, z: 0, opacity: 1, scale: 1.0 },
        S: { x: 0, y: -60, z: 0, opacity: 1, scale: 1.0 },
      },
      bio: {
        Z: { x: -220, y: 0, z: 20, opacity: 1, scale: 2.8 },
        Y: { x: 300, y: -100, z: -80, opacity: 0, scale: 0.3 },
        S: { x: 300, y: 100, z: -80, opacity: 0, scale: 0.3 },
      },
      projects: {
        Z: { x: -400, y: -100, z: -150, opacity: 0, scale: 0.2 },
        Y: { x: -220, y: 0, z: 20, opacity: 1, scale: 2.8 },
        S: { x: 400, y: 0, z: -150, opacity: 0, scale: 0.2 },
      },
      awards: {
        Z: { x: -400, y: -100, z: -150, opacity: 0, scale: 0.2 },
        Y: { x: -220, y: 0, z: 20, opacity: 0.6, scale: 1.8 },
        S: { x: 400, y: 0, z: -150, opacity: 0, scale: 0.2 },
      },
      contact: {
        Z: { x: -400, y: 0, z: -150, opacity: 0, scale: 0.2 },
        Y: { x: -400, y: 0, z: -150, opacity: 0, scale: 0.2 },
        S: { x: -220, y: 0, z: 20, opacity: 1, scale: 2.8 },
      },
    }

    // Track active sections for letter states
    let currentLetters = { Z: { ...letterStates.hero.Z }, Y: { ...letterStates.hero.Y }, S: { ...letterStates.hero.S } }

    function lerp(a, b, t) { return a + (b - a) * t }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

    function updateLetters(scrollNorm) {
      // Find which section pair we're between
      let fromIdx = 0
      let toIdx = 0
      let t = 0

      for (let i = 0; i < sectionBreakpoints.length; i++) {
        if (scrollNorm >= sectionBreakpoints[i]) {
          fromIdx = i
        }
      }
      toIdx = Math.min(fromIdx + 1, sectionBreakpoints.length - 1)

      if (fromIdx < sectionBreakpoints.length - 1) {
        const fromBP = sectionBreakpoints[fromIdx]
        const toBP = sectionBreakpoints[toIdx]
        const effectiveWidth = toBP - fromBP
        t = effectiveWidth > 0 ? clamp((scrollNorm - fromBP) / effectiveWidth, 0, 1) : 0
      } else {
        t = 1
      }

      const fromSection = sections[fromIdx]
      const toSection = sections[toIdx]

      // For each letter, interpolate between from-state and to-state
      const fromState = letterStates[fromSection]
      const toState = letterStates[toSection] || fromState

      ;['Z', 'Y', 'S'].forEach((letter) => {
        const fs = fromState[letter]
        const ts = toState[letter]

        const x = lerp(fs.x, ts.x, t)
        const y = lerp(fs.y, ts.y, t)
        const z = lerp(fs.z, ts.z, t)
        const opacity = lerp(fs.opacity, ts.opacity, t)
        const scale = lerp(fs.scale, ts.scale, t)

        const sprite = heroLetters[letter]
        if (sprite) {
          sprite.position.set(x, y, z)
          sprite.material.opacity = opacity
          sprite.scale.set(
            letterSize * scale,
            letterSize * scale,
            1,
          )
        }
      })
    }

    // ─── Animation loop ───
    function animate() {
      requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      // Hero letters gentle float (minimal, natural)
      Object.values(heroLetters).forEach((sprite) => {
        const ud = sprite.userData
        const float = Math.sin(time * ud.floatSpeed + ud.floatPhase) * ud.floatAmp * 0.2
        // Only apply float offset on top of the state-machine position
        sprite.userData.floatOffset = float
      })

      // Ambient letters float
      ambientLetters.forEach((sprite) => {
        const ud = sprite.userData
        const floatY = Math.sin(time * ud.floatSpeed + ud.floatPhase) * ud.floatAmp
        const floatX = Math.cos(time * ud.floatSpeed * 0.7 + ud.floatPhase * 1.3) * ud.floatAmp * 0.6
        sprite.position.x = ud.homeX + floatX
        sprite.position.y = ud.homeY + floatY
      })

      renderer.render(scene, camera)
    }

    animate()

    // ─── Resize handler ───
    window.addEventListener('resize', () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })

    // ─── Expose for scroll updates ───
    window.__heroLetters = heroLetters
    window.__updateLetters = updateLetters
    window.__ambientLetters = ambientLetters

  } catch (e) {
    console.warn('Three.js unavailable:', e)
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:clamp(80px,10vw,200px);font-weight:100;color:var(--color-gray);letter-spacing:0.2em;opacity:0.15;">Z Y S</div>'
  }
}

// =====================================================
// 2. NOISE OVERLAY
// =====================================================
function initNoiseOverlay() {
  const el = document.getElementById('noiseOverlay')
  if (!el) return
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(128, 128)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255
    data[i] = v; data[i + 1] = v; data[i + 2] = v; data[i + 3] = 18
  }
  ctx.putImageData(imageData, 0, 0)
  el.style.backgroundImage = `url(${canvas.toDataURL()})`
  el.style.backgroundRepeat = 'repeat'
}

// =====================================================
// 3. DESKTOP DETECTION
// =====================================================
if (window.innerWidth > 900 && !('ontouchstart' in window)) {
  document.body.classList.add('desktop')
}

// =====================================================
// 4. NAV INIT — Entrance animation
// =====================================================
function initNavAnimation() {
  const header = document.getElementById('header')
  if (header) setTimeout(() => header.classList.add('animate'), 100)
}

// =====================================================
// 5. NAV — Click scrolling
// =====================================================
const sections = {
  bio: document.getElementById('bio'),
  projects: document.getElementById('projects'),
  awards: document.getElementById('awards'),
  contact: document.getElementById('contact'),
}

document.querySelectorAll('.header__nav li a[data-section]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const section = link.dataset.section
    if (section === 'toggle') { toggleMobileMenu(); return }
    if (section === 'home') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    if (section === 'bio' || section === 'projects' || section === 'awards' || section === 'contact') {
      e.preventDefault()
      const target = sections[section]
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        if (document.body.classList.contains('nav-opened')) toggleMobileMenu()
      }
    }
  })
})

// =====================================================
// 6. MOBILE MENU TOGGLE
// =====================================================
function toggleMobileMenu() {
  document.body.classList.toggle('nav-opened')
}

// =====================================================
// 7. HEADER — Scroll state
// =====================================================
const header = document.getElementById('header')
window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > window.innerHeight * 0.5)
}, { passive: true })

// =====================================================
// 8. SCROLL — Letter state machine + active nav
// =====================================================
function getScrollNorm() {
  const docEl = document.documentElement
  const scrollTop = window.scrollY
  const scrollHeight = docEl.scrollHeight - window.innerHeight
  return scrollHeight > 0 ? scrollTop / scrollHeight : 0
}

// Track which section info zone we're in for scrollbar decoration
window.addEventListener('scroll', () => {
  const scrollNorm = getScrollNorm()

  // Update Three.js letters
  if (window.__updateLetters) {
    window.__updateLetters(scrollNorm)
  }

  // Update ambient letter opacity based on scroll
  if (window.__ambientLetters) {
    const ambientOpacity = scrollNorm < 0.1 ? 1 : Math.max(0, 1 - (scrollNorm - 0.1) / 0.15)
    window.__ambientLetters.forEach((s) => {
      s.material.opacity = s.userData.baseOpacity != null ? s.userData.baseOpacity * ambientOpacity : s.material.opacity
    })
  }

  // Active nav section
  const offset = window.innerHeight * 0.3
  let current = 'home'
  for (const [name, el] of Object.entries(sections)) {
    if (!el) continue
    const top = el.offsetTop
    const height = el.offsetHeight
    if (window.scrollY + offset >= top && window.scrollY + offset < top + height) {
      current = name; break
    }
  }
  document.querySelectorAll('.header__nav li a[data-section]').forEach((link) => {
    link.classList.toggle('active', link.dataset.section === current)
  })
}, { passive: true })

// =====================================================
// 9. SCROLL REVEAL — Intersection Observer
// =====================================================
function initRevealAnimations() {
  const els = document.querySelectorAll(
    '.bio__intro, .bio__columns, .bio__image, .bio__text, .projects__title, .projects__list, .awards .h1-style, .awards__list, .contact__inner'
  )
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear-translate-in-visible-active')
        entry.target.classList.remove('appear-translate-in-invisible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  els.forEach((el) => {
    el.classList.add('appear-translate-in-invisible')
    observer.observe(el)
  })
}

// =====================================================
// 10. EMAIL COPY
// =====================================================
const toast = document.getElementById('toast') || (() => {
  const t = document.createElement('div')
  t.id = 'toast'
  t.className = 'toast'
  document.body.appendChild(t)
  return t
})()

let toastTimer = null
function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.textContent = msg
  toast.classList.add('show')
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500)
}

document.querySelectorAll('.copy-email').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault()
    const email = link.dataset.email
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      showToast('Courriel copié!')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      showToast(ok ? 'Courriel copié!' : 'Échec de la copie')
    }
  })
})

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavAnimation()
  initRevealAnimations()
})

initThreeScene()
initNoiseOverlay()

// Initial scroll update
setTimeout(() => {
  window.dispatchEvent(new Event('scroll'))
}, 200)
