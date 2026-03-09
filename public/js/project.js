// Project JavaScript for Duckhunt 2 onepage

// Hamburger menu toggle
const menuToggle = document.getElementById('menu-toggle')
const navLinks = document.getElementById('nav-links')

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active')
})

// Close menu when clicking outside
document.addEventListener('click', (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    navLinks.classList.remove('active')
  }
})

// Close menu when clicking a nav link
navLinks.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    navLinks.classList.remove('active')
  }
})

// Smooth scrolling for anchor links
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]')

allNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    const targetId = link.getAttribute('href')
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const headerHeight = document.querySelector('.site-header').offsetHeight
      const targetPosition = targetSection.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  })
})

// Active nav highlighting on scroll
const sections = document.querySelectorAll('.section')

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id')

      allNavLinks.forEach((link) => {
        link.classList.remove('active')
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active')
        }
      })
    }
  })
}, observerOptions)

sections.forEach((section) => {
  observer.observe(section)
})

// Header background change on scroll
const siteHeader = document.querySelector('.site-header')

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    siteHeader.classList.add('scrolled')
  } else {
    siteHeader.classList.remove('scrolled')
  }
})

// Update play link when difficulty select changes
const playDifficulty = document.getElementById('play-difficulty')
const playLink = document.getElementById('play-link')

if (playDifficulty && playLink) {
  playDifficulty.addEventListener('change', () => {
    const difficulty = playDifficulty.value
    playLink.href = `duckhunt.html?difficulty=${difficulty}`
  })
}
