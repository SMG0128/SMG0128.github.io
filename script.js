const CONFIG = {
  birthDate: "2007-01-28",
  graduationDate: "2029-06-30",
  missionProgress: 72,
  githubUser: "SMG0128",
  identities: [
    "Student Developer",
    "AIoT Explorer",
    "EEG Builder",
    "OpenHarmony Developer",
    "Project Creator"
  ]
};

const dayMs = 24 * 60 * 60 * 1000;

function updateLifeCounters() {
  const today = new Date();
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const birth = new Date(`${CONFIG.birthDate}T00:00:00`);
  const graduation = new Date(`${CONFIG.graduationDate}T00:00:00`);

  const daysSinceBirth = Math.floor((localToday - birth) / dayMs);
  const daysUntilGraduation = Math.ceil((graduation - localToday) / dayMs);

  document.getElementById("days-since-birth").textContent = Math.max(daysSinceBirth, 0).toLocaleString();
  document.getElementById("days-until-graduation").textContent = Math.max(daysUntilGraduation, 0).toLocaleString();
}

function startIdentityLoop() {
  const identityEl = document.getElementById("dynamic-identity");
  let index = 0;

  setInterval(() => {
    identityEl.classList.add("switching");
    window.setTimeout(() => {
      index = (index + 1) % CONFIG.identities.length;
      identityEl.textContent = CONFIG.identities[index];
      identityEl.classList.remove("switching");
    }, 520);
  }, 2600);
}

function setMissionProgress() {
  const progress = Math.min(Math.max(CONFIG.missionProgress, 0), 100);
  const bar = document.getElementById("mission-progress-bar");
  const label = document.getElementById("mission-progress-label");
  const track = bar.closest(".progress-track");

  label.textContent = `${progress}%`;
  track.setAttribute("aria-valuenow", String(progress));
  requestAnimationFrame(() => {
    bar.style.width = `${progress}%`;
  });
}

async function loadGitHubDashboard() {
  const statusEl = document.getElementById("github-status");
  const fields = {
    public_repos: document.getElementById("repo-count"),
    followers: document.getElementById("followers-count"),
    following: document.getElementById("following-count")
  };

  try {
    const response = await fetch(`https://api.github.com/users/${CONFIG.githubUser}`, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    fields.public_repos.textContent = Number(data.public_repos ?? 0).toLocaleString();
    fields.followers.textContent = Number(data.followers ?? 0).toLocaleString();
    fields.following.textContent = Number(data.following ?? 0).toLocaleString();
    statusEl.textContent = "Live public GitHub data.";
  } catch (error) {
    fields.public_repos.textContent = "--";
    fields.followers.textContent = "--";
    fields.following.textContent = "--";
    statusEl.textContent = "GitHub signal is temporarily unavailable.";
  }
}

function duplicateStackTrack() {
  const track = document.getElementById("stack-track");
  Array.from(track.children).forEach((item) => {
    track.appendChild(item.cloneNode(true));
  });
}

function setupRevealAnimation() {
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealEls.forEach((el) => observer.observe(el));
}

function setupPointerGlow() {
  const field = document.querySelector(".space-field");

  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 28;
    const y = (event.clientY / window.innerHeight - 0.5) * 28;
    field.style.setProperty("--mx", `${x}px`);
    field.style.setProperty("--my", `${y}px`);
  }, { passive: true });
}

function setupParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(Math.floor(width / 18), 90);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.35,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      alpha: Math.random() * 0.38 + 0.1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 248, 255, ${particle.alpha})`;
      ctx.fill();
    });

    animationFrame = requestAnimationFrame(draw);
  }

  resize();
  if (!prefersReducedMotion) {
    draw();
  }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resize();
    if (!prefersReducedMotion) {
      draw();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateLifeCounters();
  startIdentityLoop();
  setMissionProgress();
  loadGitHubDashboard();
  duplicateStackTrack();
  setupRevealAnimation();
  setupPointerGlow();
  setupParticles();
});
