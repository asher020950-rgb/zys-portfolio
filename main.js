import './style.css'

// === Navigation scroll effect ===
const navbar = document.getElementById('navbar')

function handleNavScroll() {
  if (!navbar) return
  const scrollY = window.scrollY
  if (scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true })
handleNavScroll()

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
updateActiveSection()

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

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme')
    setTheme(current === 'dark' ? 'light' : 'dark')
  })
}

// Initialize theme
setTheme(getPreferredTheme())

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
