window.addEventListener('load', function() {
  const preloader = document.getElementById('preloader');
  const main = document.getElementById('main-content');
  const topBar = document.getElementById('topInfoBar');
  
  // Get all SVG elements to animate
  const svgElements = document.querySelectorAll('#logo-svg path, #logo-svg polygon, #logo-svg polyline');
  
  console.log('Found SVG elements to animate:', svgElements.length);
  
  // Set initial states
  gsap.set(main, { opacity: 0 });
  if (topBar) gsap.set(topBar, { opacity: 0 });
  gsap.set('.preloader-text, .preloader-subtitle, .preloader-progress', { opacity: 0 });
  
  // Create timeline
  const tl = gsap.timeline();
  
  // If no SVG elements found, just do a simple fade in/out
  if (svgElements.length === 0) {
    console.warn('No SVG elements found, using fallback animation');
    
    tl.to('.preloader-text', { opacity: 1, duration: 1, y: 20 })
      .to('.preloader-progress', { opacity: 1, duration: 0.5 })
      .to('.preloader-progress-bar', { width: '100%', duration: 2 })
      .to(preloader, { opacity: 0, duration: 1, delay: 1, onComplete: () => {
        preloader.style.display = 'none';
      }})
      .to(main, { opacity: 1, duration: 1 }, '-=0.5')
      .to(topBar, { opacity: 1, duration: 0.8 }, '-=0.3');
    
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.init(), 3000);
    }
    
    // Initialize other features after preloader
    initOtherFeatures();
    return;
  }
  
  // Prepare each SVG element for drawing animation
  svgElements.forEach((element, index) => {
    // Get or set stroke color based on original class
    let strokeColor = '#ffffff';
    if (element.classList.contains('cls-1')) strokeColor = '#fec20e';
    if (element.classList.contains('cls-2')) strokeColor = '#5365af';
    if (element.classList.contains('cls-3')) strokeColor = '#6d5623';
    if (element.classList.contains('cls-4')) strokeColor = '#6e5723';
    if (element.classList.contains('cls-5')) strokeColor = '#bc9e2f';
    if (element.classList.contains('cls-6')) strokeColor = '#bd9e2f';
    if (element.classList.contains('cls-7')) strokeColor = '#5366af';
    if (element.classList.contains('cls-8')) strokeColor = '#4f3b15';
    
    gsap.set(element, {
      stroke: strokeColor,
      strokeWidth: 2,
      strokeDasharray: 2000,
      strokeDashoffset: 2000,
      fillOpacity: 0
    });
    
    // Staggered drawing animation
    tl.to(element, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'power2.inOut'
    }, index * 0.02)
    .to(element, {
      fillOpacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, index * 0.02 + 0.5);
  });
  
  // Fade in text elements
  tl.to('.preloader-text', {
    opacity: 1,
    duration: 0.8,
    ease: 'back.out(0.5)'
  }, 1.0)
  .to('.preloader-subtitle', {
    opacity: 1,
    duration: 0.6
  }, 1.3)
  .to('.preloader-progress', {
    opacity: 1,
    duration: 0.5
  }, 1.5);
  
  // Animate progress bar
  tl.to('.preloader-progress-bar', {
    width: '100%',
    duration: 1.5,
    ease: 'power2.inOut'
  }, 1.8);
  
  // Fade out preloader and show content
  tl.to(preloader, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: function() {
      preloader.style.display = 'none';
      preloader.style.pointerEvents = 'none';
      // Initialize other features after preloader completes
      initOtherFeatures();
    }
  }, 3.5)
  .to(main, {
    opacity: 1,
    duration: 1.2,
    ease: 'power2.out'
  }, 3.0);
  
  if (topBar) {
    tl.to(topBar, {
      opacity: 1,
      duration: 0.8
    }, 3.2);
  }
  
  // Initialize AOS
  tl.add(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        delay: 50,
        mirror: false
      });
    }
  });
  
  // Fallback
  setTimeout(() => {
    if (preloader.style.display !== 'none') {
      console.log('Forcing preloader completion');
      preloader.style.display = 'none';
      gsap.set(main, { opacity: 1 });
      if (topBar) gsap.set(topBar, { opacity: 1 });
      initOtherFeatures();
    }
  }, 6000);
});

// Function to initialize all other features
function initOtherFeatures() {
  console.log('Initializing other features...');
  
  // --- TOP BAR HIDE ON SCROLL ---
  const navbar = document.getElementById('navbar');
  const topBar = document.getElementById('topInfoBar');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      if (topBar) topBar.classList.add('hidden');
      if (navbar) navbar.style.top = '0';
    } else {
      if (topBar) topBar.classList.remove('hidden');
      if (navbar) navbar.style.top = '32px';
    }
    
    lastScroll = currentScroll;
  });

  // --- CAROUSEL ---
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  const slideCount = slides.length;
  let intervalId;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    indicators.forEach((ind, i) => {
      if (i === index) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slideCount;
    showSlide(next);
  }

  function startCarousel() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 4500);
  }

  if (slides.length > 0) {
    showSlide(0);
    startCarousel();
  }

  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', function() {
      clearInterval(intervalId);
      showSlide(idx);
      startCarousel();
    });
  });

  const landingSection = document.querySelector('.landing-section');
  if (landingSection) {
    landingSection.addEventListener('mouseenter', () => {
      clearInterval(intervalId);
    });
    landingSection.addEventListener('mouseleave', () => {
      startCarousel();
    });
  }

  // --- SCROLL DOWN BUTTON ---
  const scrollBtn = document.getElementById('scrollDown');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- NAVIGATION ACTIVE LINK ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // --- SERVICE CARDS CLICK (for links to new page) ---
  const serviceLinks = document.querySelectorAll('.service-link');
  serviceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card flip from interfering
      console.log('Navigate to:', this.getAttribute('href'));
      alert('In production, this would navigate to: ' + this.getAttribute('href'));
    });
  });
}

// Canvas dots animation (runs independently)
const canvas = document.getElementById('dots-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  
  const particles = [];
  const particleCount = 120;
  
  for(let i = 0; i < particleCount; i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }
  
  function animateDots() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      
      if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateDots);
  }
  
  animateDots();
  
  window.addEventListener('resize', () => {
    resizeCanvas();
    // Reposition particles on resize
    particles.forEach(p => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
    });
  });
}