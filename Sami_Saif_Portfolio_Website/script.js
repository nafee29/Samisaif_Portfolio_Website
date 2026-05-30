/* ===== TOPOGRAPHIC CANVAS ANIMATION ===== */
(function initTopoCanvas() {
    const canvas = document.getElementById('topoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, time = 0, animId;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const lines = 18;
        for (let i = 0; i < lines; i++) {
            ctx.beginPath();
            const alpha = 0.025 + i * 0.006;
            ctx.strokeStyle = `rgba(160, 180, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            const baseY = (h / (lines - 1)) * i;
            for (let x = 0; x <= w; x += 3) {
                const y = baseY
                    + Math.sin(x * 0.0025 + time * 0.4 + i * 0.6) * 28
                    + Math.sin(x * 0.006 + time * 0.25 + i * 0.35) * 14
                    + Math.sin(x * 0.0012 + time * 0.15 + i * 0.2) * 22;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        time += 0.008;
        animId = requestAnimationFrame(draw);
    }
    draw();
})();

/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== MOBILE NAV TOGGLE ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

/* ===== PORTFOLIO TABS ===== */
const tabs = document.querySelectorAll('.tab-item');
const grids = document.querySelectorAll('.video-grid');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const cat = tab.dataset.category;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        grids.forEach(g => {
            g.classList.remove('active');
            if (g.dataset.grid === cat) g.classList.add('active');
        });
    });
});

/* ===== VIEW ALL WORK BUTTON ===== */
const viewAllBtn = document.getElementById('viewAllBtn');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        grids.forEach(g => g.classList.add('active'));
        grids.forEach(g => g.style.display = 'grid');
        tabs.forEach(t => t.classList.add('active'));
        viewAllBtn.style.display = 'none';
    });
}

/* ===== VIDEO MODAL ===== */
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
        const src = card.querySelector('video').getAttribute('src');
        modalVideo.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalVideo.play();
    });
});

function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('video-modal')) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ===== VIDEO CARD HOVER PREVIEW ===== */
document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

/* ===== SCROLL REVEAL ANIMATIONS ===== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});



/* ===== SMOOTH SCROLL FOR CTA ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== LOAD VIDEO THUMBNAILS ===== */
document.querySelectorAll('.video-card video').forEach(video => {
    video.preload = 'metadata';
    video.addEventListener('loadedmetadata', () => {
        // Seek to 1 second or 10% of duration to get a good thumbnail
        video.currentTime = Math.min(1, video.duration * 0.1);
    });
    video.addEventListener('seeked', () => {
        video.pause();
    });
    // Force load for videos not yet triggered
    if (video.readyState === 0) {
        video.load();
    }
});

/* ===== PARALLAX EFFECT ON HERO IMAGE ===== */
const heroImage = document.querySelector('.hero-image-wrapper');
if (heroImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
        }
    });
}
