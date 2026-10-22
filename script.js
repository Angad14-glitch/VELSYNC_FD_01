// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const accent2Color = getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim();

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? accentColor : accent2Color,
      opacity: Math.random() * 0.5 + 0.1
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
  });

  // Draw connections
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = p1.color;
        ctx.globalAlpha = (1 - dist / 120) * 0.15;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  });

  ctx.globalAlpha = 1;
  animationId = requestAnimationFrame(animateParticles);
}

function initParticles() {
  resizeCanvas();
  createParticles();
  if (animationId) cancelAnimationFrame(animationId);
  animateParticles();
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

// Initialize particles after DOM ready
initParticles();

// ===== MOBILE MENU =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== THEME SYSTEM =====
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const themeSelect = document.getElementById("themeSelect");

const themes = {
  ocean: { light: "light", dark: "dark" },
  sunset: { light: "sunset", dark: "sunset" },
  forest: { light: "forest", dark: "forest" },
  midnight: { light: "midnight", dark: "midnight" }
};

let currentThemeVariant = "ocean";
let isLight = false;

function applyTheme(variant, light) {
  currentThemeVariant = variant;
  isLight = light;
  const theme = light ? themes[variant].light : themes[variant].dark;
  root.setAttribute("data-theme", theme);
  themeSelect.value = variant;
  try {
    localStorage.setItem("theme", JSON.stringify({ variant, light }));
  } catch (e) {}
  // Recreate particles with new colors
  createParticles();
}

function toggleLightDark() {
  applyTheme(currentThemeVariant, !isLight);
}

themeBtn.addEventListener("click", toggleLightDark);
themeSelect.addEventListener("change", (e) => applyTheme(e.target.value, isLight));

// Load saved theme
try {
  const saved = JSON.parse(localStorage.getItem("theme") || "{}");
  if (saved.variant && themes[saved.variant]) {
    applyTheme(saved.variant, saved.light || false);
  }
} catch (e) {}

// ===== TYPING EFFECT =====
const roles = ["Web Developer", "Data Analyst", "Python Builder", "Project Coordinator"];
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
  const word = roles[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);
  if (!deleting && charIdx < word.length) {
    charIdx++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (charIdx > 0) {
    charIdx--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll(".stat-num");
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    update();
  });
}

// ===== RADAR CHART =====
function drawRadarChart() {
  const canvas = document.getElementById("radarChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = Math.min(300, canvas.parentElement.offsetWidth);
  canvas.width = size;
  canvas.height = size;

  const center = size / 2;
  const radius = size * 0.4;
  const skills = [
    { name: "Frontend", value: 85 },
    { name: "Python", value: 90 },
    { name: "Data Viz", value: 80 },
    { name: "Backend", value: 75 },
    { name: "Tools", value: 80 },
    { name: "Design", value: 70 }
  ];

  const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
  const accent2 = getComputedStyle(root).getPropertyValue('--accent-2').trim();
  const border = getComputedStyle(root).getPropertyValue('--border').trim();
  const muted = getComputedStyle(root).getPropertyValue('--muted').trim();

  // Draw grid
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  for (let level = 1; level <= 5; level++) {
    const r = (radius / 5) * level;
    ctx.beginPath();
    for (let i = 0; i < skills.length; i++) {
      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Draw axes
  ctx.beginPath();
  skills.forEach((_, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    ctx.moveTo(center, center);
    ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw skill labels
  ctx.fillStyle = muted;
  ctx.font = "12px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  skills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
    const x = center + Math.cos(angle) * (radius + 25);
    const y = center + Math.sin(angle) * (radius + 25);
    ctx.fillText(skill.name, x, y);
  });

  // Draw data polygon
  ctx.beginPath();
  skills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
    const r = (skill.value / 100) * radius;
    const x = center + Math.cos(angle) * r;
    const y = center + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();

  // Gradient fill
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
  gradient.addColorStop(0, accent + "80");
  gradient.addColorStop(1, accent2 + "20");
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw stroke
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw points
  ctx.fillStyle = accent;
  skills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
    const r = (skill.value / 100) * radius;
    const x = center + Math.cos(angle) * r;
    const y = center + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ===== SCROLL REVEAL WITH STAGGER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");

    // Stagger children
    const children = entry.target.querySelectorAll(".skill, .card, .t-item, .highlight, .stat, .skill-group");
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
      child.style.opacity = "1";
      child.style.transform = "none";
    });

    // Animate skill bars
    entry.target.querySelectorAll(".skill").forEach((s) => {
      const level = s.dataset.level;
      if (level) {
        setTimeout(() => {
          s.querySelector("i").style.width = level + "%";
        }, 300);
      }
    });

    // Animate counters in hero
    if (entry.target.id === "home") {
      setTimeout(animateCounters, 500);
    }

    // Draw radar chart when skills section visible
    if (entry.target.id === "skills") {
      setTimeout(drawRadarChart, 500);
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

// Initialize reveal elements
document.querySelectorAll(".reveal").forEach((el) => {
  // Pre-set children for stagger
  const children = el.querySelectorAll(".skill, .card, .t-item, .highlight, .stat, .skill-group");
  children.forEach((child) => {
    child.style.opacity = "0";
    child.style.transform = "translateY(20px)";
    child.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });
  observer.observe(el);
});

// Also observe timeline items separately for horizontal stagger
document.querySelectorAll(".t-item").forEach((item, i) => {
  item.style.transitionDelay = `${i * 150}ms`;
});
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".t-item").forEach(item => timelineObserver.observe(item));

// ===== PROJECT FILTERING =====
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".card[data-tags]");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const tags = card.dataset.tags.split(" ");
      const match = filter === "all" || tags.includes(filter);
      card.style.display = match ? "flex" : "none";
      card.style.opacity = match ? "1" : "0";
      card.style.transform = match ? "translateY(0)" : "translateY(20px)";
    });
  });
});

// ===== IMAGE UPLOAD =====
const profileImg = document.getElementById("profileImg");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const imageUpload = document.getElementById("imageUpload");

imagePlaceholder.addEventListener("click", (e) => {
  if (e.target !== imageUpload) imageUpload.click();
});

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be less than 5MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    profileImg.src = event.target.result;
    profileImg.classList.add("loaded");
    imagePlaceholder.style.display = "none";
    try {
      localStorage.setItem("profileImage", event.target.result);
    } catch (e) {}
  };
  reader.readAsDataURL(file);
});

// Load saved image
try {
  const savedImg = localStorage.getItem("profileImage");
  if (savedImg) {
    profileImg.src = savedImg;
    profileImg.classList.add("loaded");
    imagePlaceholder.style.display = "none";
  }
} catch (e) {}

// ===== CONTACT FORM =====
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [
    { id: "name", validate: v => v.trim().length >= 2 },
    { id: "email", validate: v => /^\S+@\S+\.\S+$/.test(v) },
    { id: "subject", validate: v => v !== "" },
    { id: "message", validate: v => v.trim().length >= 10 }
  ];

  let valid = true;
  fields.forEach(({ id, validate }) => {
    const field = document.getElementById(id);
    const ok = validate(field.value);
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    statusEl.textContent = "Please fill in all fields with valid details.";
    statusEl.className = "status err";
    return;
  }

  // Simulate sending
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Sending...</span><svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>';
  submitBtn.disabled = true;

  setTimeout(() => {
    statusEl.textContent = "Thanks! Your message has been sent successfully.";
    statusEl.className = "status ok";
    form.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 1500);
});

// ===== PARALLAX EFFECT ON HERO =====
let ticking = false;
function handleParallax() {
  const scrollY = window.scrollY;
  const hero = document.getElementById("home");
  if (!hero) return;

  const orbs = hero.querySelectorAll(".orb");
  orbs.forEach((orb, i) => {
    const speed = 0.1 * (i + 1);
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });

  const rings = hero.querySelectorAll(".ring");
  rings.forEach((ring, i) => {
    const speed = 0.05 * (i + 1);
    ring.style.transform = `rotate(${scrollY * speed}deg)`;
  });

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(handleParallax);
    ticking = true;
  }
}, { passive: true });

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = document.querySelector(".nav").offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: "smooth" });
    }
  });
});

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll("section[id]");
const navLinks_a = document.querySelectorAll(".nav a[href^='#']");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks_a.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}, { rootMargin: "-50% 0px -50% 0px", threshold: 0.1 });

sections.forEach(section => navObserver.observe(section));

// Add active style to nav
const style = document.createElement("style");
style.textContent = `
  nav a.active { color: var(--accent) !important; }
  nav a.active::after { width: 100% !important; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// ===== REDRAW RADAR ON THEME CHANGE =====
const originalApplyTheme = applyTheme;
applyTheme = function(variant, light) {
  originalApplyTheme(variant, light);
  setTimeout(drawRadarChart, 100);
};

// Initial radar draw when skills section loads
setTimeout(() => {
  const skillsSection = document.getElementById("skills");
  if (skillsSection && skillsSection.classList.contains("visible")) {
    drawRadarChart();
  }
}, 1000);