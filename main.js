import './style.css'

// =====================================================
// 1. THREE.JS — Floating 3D Letters
// =====================================================
async function initThreeScene() {
  const container = document.getElementById('threeScene')
  if (!container) return

  try {
    const THREE = await import('three')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 250

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Create letter textures on canvas
    function createLetterTexture(letter, color, size = 128) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, size, size)
      ctx.fillStyle = color
      ctx.font = `Bold ${size * 0.65}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(letter, size / 2, size / 2)
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    const colors = ['#d5cec7', '#f6ff93', '#d5cec7', '#f6ff93', '#d5cec7']
    const chars = ['Z', 'Y', 'S', 'Z', 'Y', 'S', 'Z', 'Y', 'S', 'Z', 'Y', 'S']
    const meshes = []

    // Create clusters of letters
    for (let cluster = 0; cluster < 4; cluster++) {
      chars.forEach((char, i) => {
        const hue = cluster % 2 === 0 ? '#d5cec7' : '#f6ff93'
        const color = i % 2 === 0 ? '#d5cec7' : (i % 3 === 0 ? '#f6ff93' : '#d5cec7')
        const tex = createLetterTexture(char, color)
        const material = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide,
          opacity: 0.15 + Math.random() * 0.35,
          depthWrite: false,
        })
        const size = 10 + Math.random() * 45
        const geometry = new THREE.PlaneGeometry(size, size)
        const mesh = new THREE.Mesh(geometry, material)

        const spreadX = 350
        const spreadY = 350
        const spreadZ = 200

        mesh.position.set(
          (Math.random() - 0.5) * spreadX,
          (Math.random() - 0.5) * spreadY,
          (Math.random() - 0.5) * spreadZ,
        )

        mesh.rotation.set(
          (Math.random() - 0.5) * Math.PI,
          (Math.random() - 0.5) * Math.PI,
          (Math.random() - 0.5) * Math.PI,
        )

        mesh.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.008,
          rotSpeedY: (Math.random() - 0.5) * 0.008,
          rotSpeedZ: (Math.random() - 0.5) * 0.008,
          floatSpeed: 0.2 + Math.random() * 0.4,
          floatOffset: Math.random() * Math.PI * 2,
          floatAmount: 3 + Math.random() * 12,
          initialX: mesh.position.x,
          initialY: mesh.position.y,
          initialZ: mesh.position.z,
          phase: Math.random() * Math.PI * 2,
        }

        scene.add(mesh)
        meshes.push(mesh)
      })
    }

    function animate() {
      requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      meshes.forEach((mesh) => {
        const ud = mesh.userData
        mesh.position.x = ud.initialX + Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmount
        mesh.position.y = ud.initialY + Math.cos(time * ud.floatSpeed * 0.7 + ud.floatOffset + ud.phase) * ud.floatAmount * 0.8
        mesh.position.z = ud.initialZ + Math.sin(time * ud.floatSpeed * 0.5 + ud.floatOffset + ud.phase) * ud.floatAmount * 0.5

        mesh.rotation.x += ud.rotSpeedX
        mesh.rotation.y += ud.rotSpeedY
        mesh.rotation.z += ud.rotSpeedZ
      })

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    window.addEventListener('resize', () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })

    // Dim on mobile
    if (window.innerWidth <= 900) {
      meshes.forEach((m) => { m.material.opacity *= 0.6 })
    }
  } catch (e) {
    console.warn('Three.js scene not available:', e)
    // Fallback: simple CSS floating letters
    const fallback = document.createElement('div')
    fallback.className = 'fallback-letters'
    fallback.textContent = 'Z Y S'
    container.appendChild(fallback)
  }
}

// =====================================================
// 2. NOISE OVERLAY — generated canvas texture
// =====================================================
function initNoiseOverlay() {
  const el = document.getElementById('noiseOverlay')
  if (!el) return

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(256, 256)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 20
  }
  ctx.putImageData(imageData, 0, 0)
  el.style.backgroundImage = `url(${canvas.toDataURL()})`
  el.style.backgroundRepeat = 'repeat'
}

// =====================================================
// 3. DESKTOP DETECTION
// =====================================================
const isDesktop = window.innerWidth > 900 && !('ontouchstart' in window)
if (isDesktop) document.body.classList.add('desktop')

// =====================================================
// 4. NAVIGATION — Scroll reveal animation
// =====================================================
function initNavAnimation() {
  const header = document.getElementById('header')
  if (!header) return
  // Trigger the initial slide-in animation after a short delay
  setTimeout(() => {
    header.classList.add('animate')
  }, 100)
}

// =====================================================
// 5. NAVIGATION — Section scrolling
// =====================================================
const navLinks = document.querySelectorAll('.header__nav li a[data-section]')
const sections = {
  bio: document.getElementById('bio'),
  projects: document.getElementById('projects'),
  awards: document.getElementById('awards'),
  contact: document.getElementById('contact'),
}

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const section = link.dataset.section
    if (section === 'toggle') {
      toggleMobileMenu()
      return
    }
    if (section === 'home' || section === 'bio' || section === 'projects' || section === 'awards' || section === 'contact') {
      e.preventDefault()
      const target = sections[section]
      if (section === 'home' || !target) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      // Close mobile menu if open
      if (document.body.classList.contains('nav-opened')) {
        toggleMobileMenu()
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
// 7. HEADER — Scroll state (logo visibility)
// =====================================================
const header = document.getElementById('header')

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  if (scrollY > window.innerHeight * 0.5) {
    header.classList.add('header--scrolled')
  } else {
    header.classList.remove('header--scrolled')
  }
}, { passive: true })

// =====================================================
// 8. NAVIGATION — Active section highlighting
// =====================================================
function updateActiveSection() {
  const scrollY = window.scrollY + window.innerHeight * 0.3

  let current = 'home'
  for (const [name, el] of Object.entries(sections)) {
    if (!el) continue
    const top = el.offsetTop
    const height = el.offsetHeight
    if (scrollY >= top && scrollY < top + height) {
      current = name
      break
    }
  }

  document.querySelectorAll('.header__nav li a[data-section]').forEach((link) => {
    const section = link.dataset.section
    link.classList.toggle('active', section === current)
  })
}

window.addEventListener('scroll', updateActiveSection, { passive: true })
// Initial call
setTimeout(updateActiveSection, 200)

// =====================================================
// 9. SCROLL REVEAL — Intersection Observer appear animations
// =====================================================
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.bio__intro, .bio__columns, .bio__image, .bio__text, .projects__title, .projects__list, .awards .h1-style, .awards__list, .contact__inner')

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear-translate-in-visible-active')
        entry.target.classList.remove('appear-translate-in-invisible')
        revealObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  revealElements.forEach((el) => {
    el.classList.add('appear-translate-in-invisible')
    revealObserver.observe(el)
  })
}

// =====================================================
// 10. PARALLAX — For bio image grid
// =====================================================
function initParallax() {
  const bioImage = document.getElementById('bioImage')
  if (!bioImage) return

  window.addEventListener('scroll', () => {
    const rect = bioImage.getBoundingClientRect()
    const progress = rect.top / window.innerHeight
    const items = bioImage.querySelectorAll('.bio__image__item')
    items.forEach((item, i) => {
      const offset = (i - 3) * 5
      const translateY = Math.max(-20, Math.min(20, progress * offset * 2))
      item.style.transform = `translateY(${translateY}px)`
    })
  }, { passive: true })
}

// =====================================================
// 11. EMAIL COPY TO CLIPBOARD
// =====================================================
const copyLinks = document.querySelectorAll('.copy-email')
const toast = document.getElementById('toast') || createToast()

function createToast() {
  const t = document.createElement('div')
  t.id = 'toast'
  t.className = 'toast'
  document.body.appendChild(t)
  return t
}

let toastTimer = null

copyLinks.forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault()
    const email = link.dataset.email
    if (!email) return

    try {
      await navigator.clipboard.writeText(email)
      showToast('Courriel copié!')
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = email
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      showToast(success ? 'Courriel copié!' : 'Échec de la copie')
    }
  })
})

function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.textContent = msg
  toast.classList.add('show')
  toastTimer = setTimeout(() => {
    toast.classList.remove('show')
  }, 2500)
}

// =====================================================
// 12. RESIZE HANDLER — Desktop detection update
// =====================================================
let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    const wasDesktop = isDesktop
    const nowDesktop = window.innerWidth > 900 && !('ontouchstart' in window)
    if (nowDesktop) document.body.classList.add('desktop')
    else document.body.classList.remove('desktop')
  }, 200)
})

// =====================================================
// INIT — Boot sequence
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavAnimation()
  initRevealAnimations()
  initParallax()
})

// Start Three.js scene (loads async)
initThreeScene()

// Generate noise overlay immediately
initNoiseOverlay()
