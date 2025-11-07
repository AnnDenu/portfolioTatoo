// ===== Custom Cursor (optimized, disabled on touch/reduced-motion) =====
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

if (!isTouch && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    }, { passive: true });
} else {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// Smooth cursor outline movement
function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    requestAnimationFrame(animateCursor);
}
if (!isTouch && !prefersReducedMotion) animateCursor();

// Cursor interaction effects
const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .filter-btn, .telegram-button');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'scale(1.5)';
        cursorOutline.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'scale(1)';
        cursorOutline.style.transform = 'scale(1)';
    });
});

// ===== Echo Effect on Click =====
document.addEventListener('click', (e) => {
    const echo = document.createElement('div');
    echo.className = 'echo-circle';
    echo.style.left = e.clientX + 'px';
    echo.style.top = e.clientY + 'px';
    document.body.appendChild(echo);
    
    setTimeout(() => {
        echo.remove();
    }, 600);
});

// ===== Navigation =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu on link click (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Optimized scroll (single rAF loop)
const sections = document.querySelectorAll('section[id]');
let scrollScheduled = false;
function onScrollOptimized() {
    const scrollY = window.pageYOffset;
    if (scrollY > 100) {
        nav.style.background = 'rgba(17, 17, 17, 0.96)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.25)';
    } else {
        nav.style.background = 'rgba(17, 17, 17, 0.9)';
        nav.style.boxShadow = 'none';
    }
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const inView = rect.top <= 120 && rect.bottom >= 120;
        if (inView) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
        }
    });
    const hero = document.querySelector('.hero');
    if (hero) hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    scrollScheduled = false;
}
window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(onScrollOptimized);
    }
}, { passive: true });

// ===== Portfolio Filters =====
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                }, 300);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Initialize portfolio items with transition
portfolioItems.forEach(item => {
    item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
});

// ===== Portfolio Hover Effects =====
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const overlay = item.querySelector('.portfolio-overlay');
        const info = item.querySelector('.portfolio-info');
        
        if (info) {
            info.style.transform = 'translateY(0)';
            info.style.opacity = '1';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        const info = item.querySelector('.portfolio-info');
        if (info) {
            info.style.transform = 'translateY(10px)';
            info.style.opacity = '0';
        }
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form handling removed - users now contact via Telegram directly

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateElements = document.querySelectorAll('.portfolio-item, .process-step, .about-content, .contact-content');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ===== Portfolio Item Click Animation =====
portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            animation: rippleExpand 0.6s ease-out;
            z-index: 1000;
        `;
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Magic Focus (lighter effect) =====
if (!prefersReducedMotion && !isTouch) {
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.boxShadow = '0 12px 36px rgba(26, 26, 26, 0.25)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.boxShadow = 'none';
        });
    });
}

// ===== Tactile Interface - Micro interactions =====
const tactileElements = document.querySelectorAll('button, .form-input, .nav-link');
tactileElements.forEach(el => {
    el.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    el.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1)';
    });
    
    el.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleExpand {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// (Parallax handled in optimized scroll loop)

// ===== Breathing Animation for Stats =====
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach((stat, index) => {
    stat.addEventListener('mouseenter', () => {
        stat.style.animation = 'pulse 0.6s ease-in-out';
    });
    
    stat.addEventListener('animationend', () => {
        stat.style.animation = '';
    });
});

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(pulseStyle);

console.log('✨ Живой холст - Портфолио тату-мастера загружено');

