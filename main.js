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
