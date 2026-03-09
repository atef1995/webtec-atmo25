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
