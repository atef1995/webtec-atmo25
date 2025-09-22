/**
 * TechFlow One-Page Website JavaScript
 * Hamburger menu, smooth scrolling, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {

  // ==========================================================================
  // HAMBURGER MENU FUNCTIONALITY
  // ==========================================================================

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });

    // Close menu when clicking on a link (mobile)
    navLinks.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('show');
      }
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('show');
      }
    });
  }

  // ==========================================================================
  // SMOOTH SCROLLING FOR NAVIGATION LINKS
  // ==========================================================================

  const navigationLinks = document.querySelectorAll('a[href^="#"]');

  navigationLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // ACTIVE NAVIGATION HIGHLIGHTING
  // ==========================================================================

  function updateActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all nav items
        navItems.forEach(item => {
          item.classList.remove('active');
        });

        // Add active class to current section nav item
        const activeNavItem = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeNavItem) {
          activeNavItem.classList.add('active');
        }
      }
    });
  }

  // Update navigation on scroll
  window.addEventListener('scroll', updateActiveNavigation);

  // Initial call
  updateActiveNavigation();

  // ==========================================================================
  // HEADER BACKGROUND ON SCROLL
  // ==========================================================================

  const header = document.querySelector('.site-header');

  function updateHeaderBackground() {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', updateHeaderBackground);

  // ==========================================================================
  // TESTIMONIALS HORIZONTAL SCROLL IMPROVEMENTS
  // ==========================================================================

  const testimonialsContainer = document.querySelector('.testimonials-scroll');

  if (testimonialsContainer) {
    // Add mouse wheel horizontal scrolling
    testimonialsContainer.addEventListener('wheel', function(e) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        this.scrollLeft += e.deltaY;
      }
    });

    // Add touch/drag scrolling for better mobile experience
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsContainer.addEventListener('mousedown', function(e) {
      isDown = true;
      startX = e.pageX - this.offsetLeft;
      scrollLeft = this.scrollLeft;
      this.style.cursor = 'grabbing';
    });

    testimonialsContainer.addEventListener('mouseleave', function() {
      isDown = false;
      this.style.cursor = 'grab';
    });

    testimonialsContainer.addEventListener('mouseup', function() {
      isDown = false;
      this.style.cursor = 'grab';
    });

    testimonialsContainer.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.offsetLeft;
      const walk = (x - startX) * 2;
      this.scrollLeft = scrollLeft - walk;
    });
  }

  // ==========================================================================
  // ANIMATED COUNTERS OR STATS (if needed in future)
  // ==========================================================================

  function animateValue(element, start, end, duration) {
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));

    const timer = setInterval(function() {
      current += increment;
      element.textContent = current;
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  // ==========================================================================
  // FORM HANDLING (if contact form is added)
  // ==========================================================================

  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      // Here you would typically send the data to a server
      console.log('Form submitted:', formObject);

      // Show success message
      alert('Tack för ditt meddelande! Vi återkommer till dig inom kort.');

      // Reset form
      this.reset();
    });
  }

  // ==========================================================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ==========================================================================

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for fade-in animation
  const animatedElements = document.querySelectorAll('.service-card, .team-member, .portfolio-item, .testimonial-card');

  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });

  // ==========================================================================
  // SET CURRENT YEAR IN FOOTER
  // ==========================================================================

  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // LAZY LOADING FOR IMAGES (if needed)
  // ==========================================================================

  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ==========================================================================
  // KEYBOARD NAVIGATION ACCESSIBILITY
  // ==========================================================================

  document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      menuToggle.focus();
    }
  });

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================

  // Debounce function for performance optimization
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimized scroll handler
  const optimizedScrollHandler = debounce(function() {
    updateActiveNavigation();
    updateHeaderBackground();
  }, 10);

  // Replace individual scroll listeners with optimized version
  window.removeEventListener('scroll', updateActiveNavigation);
  window.removeEventListener('scroll', updateHeaderBackground);
  window.addEventListener('scroll', optimizedScrollHandler);

  console.log('TechFlow website JavaScript loaded successfully');
});