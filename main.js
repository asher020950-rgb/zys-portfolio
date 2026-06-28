import './style.css'

// =====================================================
// 1. THREE.JS — 3D Inflated Balloon Letters (TextGeometry)
// =====================================================
async function initThreeScene() {
  const container = document.getElementById('threeScene')
  if (!container) return

  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js')
    const { TextGeometry } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/TextGeometry.js')
    const { FontLoader } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FontLoader.js')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 300)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    container.appendChild(renderer.domElement)

    // ─── Generate Environment Map ───
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const envScene = new THREE.Scene()
    envScene.background = null
    const lightSphere = new THREE.SphereGeometry(2, 16, 16)
    const addEnvLight = (color, x, y, z) => {
      const m = new THREE.Mesh(lightSphere, new THREE.MeshBasicMaterial({ color }))
      m.position.set(x, y, z)
      envScene.add(m)
    }
    addEnvLight(0xbbbbee, 0, 18, 0)
    addEnvLight(0x7799dd, 25, 0, 8)
    addEnvLight(0xdd9999, -18, -8, 12)
    addEnvLight(0x888899, 0, -22, 0)
    addEnvLight(0xeeeeee, 0, 0, -30)
    const envMap = pmremGenerator.fromScene(envScene, 0, 0.1, 100).texture
    scene.environment = envMap
    pmremGenerator.dispose()

    // ─── Scene lights — high-contrast for oily wet-look reflections ───
    const keyLight = new THREE.DirectionalLight(0xddddff, 2.5)
    keyLight.position.set(10, 15, 20)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0x8899bb, 1.2)
    fillLight.position.set(-15, -5, 10)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0x99aacc, 1.0)
    rimLight.position.set(0, 5, -25)
    scene.add(rimLight)
    const bottomLightObj = new THREE.DirectionalLight(0x667799, 0.8)
    bottomLightObj.position.set(0, -20, 5)
    scene.add(bottomLightObj)

    // ─── Load Font and Create 3D Balloon Letters ───
    const loader = new FontLoader()
    const font = await loader.loadAsync('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json')

    const heroLetters = {}
    const letters = ['Z', 'Y', 'S']
    // True black balloon color — very dark gray so 3D shading is visible
    const colorHex = 0x222222
    // Z Y S spread across full screen horizontally
    const letterSize = 56
    const letterPositions = {
      Z: { x: -160, y: 0 },
      Y: { x: 0, y: 0 },
      S: { x: 160, y: 0 },
    }

    for (const l of letters) {
      // Inflated balloon geometry — rounded bevel + vertex bulge for puffy 3D look
      const geo = new TextGeometry(l, {
        font: font,
        size: letterSize,
        height: 18,
        curveSegments: 64,
        bevelEnabled: true,
        bevelThickness: 18,
        bevelSize: 16,
        bevelSegments: 64,
      })
      geo.center()
      geo.computeVertexNormals()

      // Inflate: bulge front/back faces outward like a balloon
      const posAttr = geo.attributes.position
      const normAttr = geo.attributes.normal
      const inflateAmt = 6
      for (let i = 0; i < posAttr.count; i++) {
        const nz = normAttr.getZ(i)
        const absNz = Math.abs(nz)
        if (absNz > 0.2) {
          // Vertices pointing straight out (center of face) bulge most;
          // vertices near edges (sideways normals) stay in place
          const bulge = inflateAmt * Math.pow(absNz, 1.5) * (nz > 0 ? 1 : -1)
          posAttr.setZ(i, posAttr.getZ(i) + bulge)
        }
      }
      posAttr.needsUpdate = true
      geo.computeVertexNormals()

      // Oily balloon: superslick wet-look gloss like greased rubber
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        metalness: 0.0,
        roughness: 0.08,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
        reflectivity: 1.0,
        envMapIntensity: 2.0,
        emissive: new THREE.Color(0x111111),
        emissiveIntensity: 0.01,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        envMap: envMap,
      })

      const mesh = new THREE.Mesh(geo, mat)

      // Wrap in a group so hover tilt (XY) doesn't fight base Z rotation
      const group = new THREE.Group()
      const pos = letterPositions[l]
      group.position.set(pos.x, pos.y, 0)

      // Hero rotation offset on mesh only: Z tilts right, S tilts left
      if (l === 'Z') mesh.rotation.z = THREE.MathUtils.degToRad(30)
      if (l === 'S') mesh.rotation.z = THREE.MathUtils.degToRad(-30)
      group.add(mesh)

      const baseScale = 1.0
      group.scale.set(baseScale, baseScale, baseScale)
      mesh.scale.set(1, 1, 1)

      group.userData = {
        letter: l,
        floatAmp: 6 + Math.random() * 4,
        floatSpeed: 0.3 + Math.random() * 0.15,
        floatPhase: Math.random() * Math.PI * 2,
        hoverScale: 0,
        tiltX: 0,
        tiltY: 0,
        baseX: pos.x,
        baseY: pos.y,
        baseZ: 0,
        baseScale: baseScale,
        targetScale: 1,
        baseRotZ: 0,
        mesh: mesh,
      }
      scene.add(group)
      heroLetters[l] = group
    }

    // ─── Mouse Hover — zone-based tilt (on window for reliable capture) ───
    const pointer = { x: 0, y: 0 }
    let hoveredLetter = null

    window.addEventListener('pointermove', (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Zone-based detection: divide screen into 3 horizontal strips
      let newHovered = null
      if (pointer.x < -0.25) newHovered = heroLetters['Z']
      else if (pointer.x < 0.25) newHovered = heroLetters['Y']
      else newHovered = heroLetters['S']

      if (newHovered !== hoveredLetter) {
        if (hoveredLetter) hoveredLetter.userData.hoverScale = 0
        if (newHovered) newHovered.userData.hoverScale = 1
        hoveredLetter = newHovered
      }
    })

    function updateHover() {
      // Detection happens in pointermove handler; tilt animation in animate loop
    }

    // ─── Scroll State Machine ───
    const sectionNames = ['hero', 'bio', 'projects', 'awards', 'contact']
    const sectionBreakpoints = [0, 0.15, 0.35, 0.55, 0.8]

    // Right-adjusted positions so the staying letter is fully visible
    const letterStates = {
      hero: {
        Z: { x: -120, y: 10, z: 0, opacity: 1, scale: 1.4, rotZ: 30 },
        Y: { x: 0, y: -65, z: 0, opacity: 1, scale: 1.15, rotZ: 0 },
        S: { x: 120, y: 60, z: 0, opacity: 1, scale: 1.7, rotZ: -30 },
      },
      bio: {
        Z: { x: -120, y: 0, z: 20, opacity: 1, scale: 2.2, rotZ: 0 },
        Y: { x: 350, y: -140, z: -80, opacity: 0, scale: 0.3, rotZ: 0 },
        S: { x: 350, y: 140, z: -80, opacity: 0, scale: 0.3, rotZ: 0 },
      },
      projects: {
        Z: { x: -420, y: -120, z: -150, opacity: 0, scale: 0.2, rotZ: 0 },
        Y: { x: -100, y: 0, z: 20, opacity: 1, scale: 2.2, rotZ: 0 },
        S: { x: 420, y: 0, z: -150, opacity: 0, scale: 0.2, rotZ: 0 },
      },
      awards: {
        Z: { x: -420, y: -120, z: -150, opacity: 0, scale: 0.2, rotZ: 0 },
        Y: { x: -100, y: 0, z: 20, opacity: 0.6, scale: 1.6, rotZ: 0 },
        S: { x: 420, y: 0, z: -150, opacity: 0, scale: 0.2, rotZ: 0 },
      },
      contact: {
        Z: { x: -420, y: 0, z: -150, opacity: 0, scale: 0.2, rotZ: 0 },
        Y: { x: -420, y: 0, z: -150, opacity: 0, scale: 0.2, rotZ: 0 },
        S: { x: -100, y: 0, z: 20, opacity: 1, scale: 2.2, rotZ: 0 },
      },
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

    function updateLetters(scrollNorm) {
      let fromIdx = 0
      for (let i = 0; i < sectionBreakpoints.length; i++) {
        if (scrollNorm >= sectionBreakpoints[i]) fromIdx = i
      }
      const toIdx = Math.min(fromIdx + 1, sectionBreakpoints.length - 1)
      let t = 0
      if (fromIdx < sectionBreakpoints.length - 1) {
        const w = sectionBreakpoints[toIdx] - sectionBreakpoints[fromIdx]
        t = w > 0 ? clamp((scrollNorm - sectionBreakpoints[fromIdx]) / w, 0, 1) : 0
      } else { t = 1 }

      const fromSt = letterStates[sectionNames[fromIdx]]
      const toSt = letterStates[sectionNames[toIdx]] || fromSt
      const et = t * t * (3 - 2 * t)

      ;['Z', 'Y', 'S'].forEach((letter) => {
        const fs = fromSt[letter], ts = toSt[letter]
        const x = lerp(fs.x, ts.x, et)
        const y = lerp(fs.y, ts.y, et)
        const z = lerp(fs.z, ts.z, et)
        const opacity = lerp(fs.opacity, ts.opacity, et)
        const scale = lerp(fs.scale, ts.scale, et)
        const rotZ = lerp(fs.rotZ || 0, ts.rotZ || 0, et)

        const group = heroLetters[letter]
        if (!group) return
        group.userData.baseX = x
        group.userData.baseY = y
        group.userData.baseZ = z
        group.userData.mesh.material.opacity = opacity
        group.userData.targetScale = scale
        group.userData.baseRotZ = rotZ
        group.userData.rotationFactor = opacity
      })
    }

    // ─── Animation Loop ───
    function animate() {
      requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      // Update hover detection
      updateHover()

      Object.values(heroLetters).forEach((group) => {
        const ud = group.userData
        const m = ud.mesh

        // Gentle float
        const floatY = Math.sin(time * ud.floatSpeed + ud.floatPhase) * ud.floatAmp
        const swayX = Math.cos(time * ud.floatSpeed * 0.4 + ud.floatPhase * 1.7) * ud.floatAmp * 0.2
        const depthBob = Math.sin(time * ud.floatSpeed * 0.3 + ud.floatPhase) * 2
        if (ud.baseY !== undefined) {
          group.position.x = ud.baseX + swayX
          group.position.y = ud.baseY + floatY
          group.position.z = (ud.baseZ || 0) + depthBob
        }

        // Hover tilt on GROUP — letter leans toward mouse pointer
        if (ud.hoverScale > 0) {
          ud.tiltX += (-pointer.y * 20 - ud.tiltX) * 0.12
          ud.tiltY += (pointer.x * 20 - ud.tiltY) * 0.12
        } else {
          ud.tiltX += (0 - ud.tiltX) * 0.06
          ud.tiltY += (0 - ud.tiltY) * 0.06
        }
        group.rotation.x = THREE.MathUtils.degToRad(ud.tiltX)
        group.rotation.y = THREE.MathUtils.degToRad(ud.tiltY)

        // Base Z rotation on MESH (hero tilt)
        if (ud.baseRotZ !== undefined) {
          m.rotation.z = THREE.MathUtils.degToRad(ud.baseRotZ)
        }

        // Scale: only scroll state (no hover puff)
        if (ud.targetScale != null) {
          const current = group.scale.x / ud.baseScale
          const s = current + (ud.targetScale - current) * 0.06
          const uniform = ud.baseScale * s
          group.scale.set(uniform, uniform, uniform)
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    window.__heroLetters = heroLetters
    window.__updateLetters = updateLetters

  } catch (e) {
    console.warn('Three.js 3D text unavailable:', e)
    const d = document.getElementById('threeScene')
    if (d) d.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:clamp(80px,10vw,200px);font-weight:100;color:var(--color-gray);letter-spacing:0.2em;opacity:0.15;">Z Y S</div>'
  }
}

// =====================================================
// 2-10: (unchanged from previous)
// =====================================================
// eslint-disable-next-line no-unused-vars
const UNCHANGED = true

function initNoiseOverlay() {
  const el = document.getElementById('noiseOverlay')
  if (!el) return
  const canvas = document.createElement('canvas')
  canvas.width = 128; canvas.height = 128
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

if (window.innerWidth > 900 && !('ontouchstart' in window)) {
  document.body.classList.add('desktop')
}

function initNavAnimation() {
  const header = document.getElementById('header')
  if (header) setTimeout(() => header.classList.add('animate'), 100)
}

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

function toggleMobileMenu() { document.body.classList.toggle('nav-opened') }

const header = document.getElementById('header')
window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > window.innerHeight * 0.5)
}, { passive: true })

function getScrollNorm() {
  const docEl = document.documentElement
  const scrollTop = window.scrollY
  const scrollHeight = docEl.scrollHeight - window.innerHeight
  return scrollHeight > 0 ? scrollTop / scrollHeight : 0
}

window.addEventListener('scroll', () => {
  const scrollNorm = getScrollNorm()
  if (window.__updateLetters) window.__updateLetters(scrollNorm)
  const offset = window.innerHeight * 0.3
  let current = 'home'
  for (const [name, el] of Object.entries(sections)) {
    if (!el) continue
    const top = el.offsetTop; const height = el.offsetHeight
    if (window.scrollY + offset >= top && window.scrollY + offset < top + height) { current = name; break }
  }
  document.querySelectorAll('.header__nav li a[data-section]').forEach((link) => {
    link.classList.toggle('active', link.dataset.section === current)
  })
}, { passive: true })

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
  els.forEach((el) => { el.classList.add('appear-translate-in-invisible'); observer.observe(el) })
}

const toast = document.getElementById('toast') || (() => {
  const t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); return t
})()

let toastTimer = null
function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.textContent = msg; toast.classList.add('show')
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500)
}

document.querySelectorAll('.copy-email').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault()
    const email = link.dataset.email
    if (!email) return
    try { await navigator.clipboard.writeText(email); showToast('Courriel copié!') } catch {
      const ta = document.createElement('textarea')
      ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      const ok = document.execCommand('copy'); document.body.removeChild(ta)
      showToast(ok ? 'Courriel copié!' : 'Échec de la copie')
    }
  })
})

document.addEventListener('DOMContentLoaded', () => { initNavAnimation(); initRevealAnimations() })
initThreeScene()
initNoiseOverlay()
setTimeout(() => { window.dispatchEvent(new Event('scroll')) }, 200)
