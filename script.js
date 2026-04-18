// script.js - With AOS initialization and preloader
window.addEventListener('load', function() {
  // --- SLOWER PRELOADER ANIMATION ---
  const preloader = document.getElementById('preloader');
  const left = document.getElementById('preloaderLeft');
  const right = document.getElementById('preloaderRight');
  const leftContent = document.getElementById('leftContent');
  const rightContent = document.getElementById('rightContent');
  const main = document.getElementById('main-content');
  const topBar = document.getElementById('topInfoBar');

  gsap.set([leftContent, rightContent], { opacity: 0, scale: 0.9 });
  gsap.set(main, { opacity: 0 });
  gsap.set(preloader, { opacity: 1, display: 'flex' });
  gsap.set(topBar, { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' }
  });

  tl.to([leftContent, rightContent], {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    stagger: 0.2
  })
  .to([leftContent, rightContent], {
    opacity: 0,
    scale: 0.8,
    duration: 1.0,
    delay: 2.0
  })
  .to(left, {
    x: '-100%',
    duration: 2.0,
    ease: 'power4.inOut'
  }, 0)
  .to(right, {
    x: '100%',
    duration: 2.0,
    ease: 'power4.inOut'
  }, 0)
  .to(preloader, {
    opacity: 0,
    duration: 0.6,
    onComplete: function() {
      preloader.style.display = 'none';
      preloader.style.pointerEvents = 'none';
    }
  }, 1.8)
  .to(main, {
    opacity: 1,
    duration: 1.5
  }, 1.0)
  .to(topBar, {
    opacity: 1,
    duration: 1.0
  }, 1.5)
  .add(() => {
    // Initialize AOS after preloader with modern settings
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
      delay: 50,
      mirror: false
    });
  });

  // --- TOP BAR HIDE ON SCROLL ---
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      topBar.classList.add('hidden');
      navbar.style.top = '0';
    } else {
      topBar.classList.remove('hidden');
      navbar.style.top = '32px';
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
  landingSection.addEventListener('mouseenter', () => {
    clearInterval(intervalId);
  });
  landingSection.addEventListener('mouseleave', () => {
    startCarousel();
  });

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
      // In a real implementation, you would navigate to the actual page
      // window.location.href = this.getAttribute('href');
      console.log('Navigate to:', this.getAttribute('href'));
      alert('In production, this would navigate to: ' + this.getAttribute('href'));
    });
  });
});


const canvas = document.getElementById('dots-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 120;

for(let i=0; i<particleCount; i++){
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random()-0.5)*0.5,
    dy: (Math.random()-0.5)*0.5
  });
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,255,255,0.4)';
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

