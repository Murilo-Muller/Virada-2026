// ================= CONFIG =================
const TEST_MODE = false; // true pra testar rápido

// ================= ELEMENTOS =================
const startScreen = document.getElementById("startScreen");
const container = document.querySelector(".container");
const yearEl = document.getElementById("year");
const countdownEl = document.getElementById("countdown");
const messageEl = document.getElementById("message");

// 🎵 MÚSICAS
const musicAmbient = document.getElementById("musicAmbient");
const musicCountdown = document.getElementById("musicCountdown");
const musicFinal = document.getElementById("musicFinal");

// ================= DATA (forma robusta) =================
const targetDate = TEST_MODE
  ? new Date(Date.now() + 30000)
  : new Date(2026, 0, 1, 0, 0, 0);

// ================= ESTADO =================
let started = false;
let countdownStarted = false;

// ================= START =================
startScreen.onclick = () => {
  startScreen.classList.add("hidden");
  container.classList.remove("hidden");
  started = true;

  show2025();

  // Música ambiente
  musicAmbient.volume = 0.5;
  musicAmbient.play();

  // 🔑 Desbloqueia a música da contagem (truque clássico)
  musicCountdown.volume = 0.8;
  musicCountdown.play();
  musicCountdown.pause();
  musicCountdown.currentTime = 0;
};

// ================= MOSTRA 2025 =================
function show2025() {
  yearEl.textContent = "2025";
  yearEl.classList.remove("hidden");
  yearEl.classList.add("enter");
}

// ================= CONTAGEM =================
function startCountdown() {
  let counter = 10;
  countdownStarted = true;

  countdownEl.textContent = counter;
  countdownEl.classList.remove("hidden");

  const cd = setInterval(() => {
    counter--;
    countdownEl.textContent = counter;

    if (counter <= 1) {
      clearInterval(cd);
      setTimeout(() => {
        countdownEl.classList.add("hidden");
        startFinale();
      }, 800);
    }
  }, 1000);
}

// ================= FINAL =================
function startFinale() {
  musicCountdown.pause();
  musicCountdown.currentTime = 0;

  musicFinal.volume = 0.7;
  musicFinal.play();

  startFireworks();
  writeYear2026();
}

// ================= TIMER GLOBAL =================
setInterval(() => {
  if (!started || countdownStarted) return;

  const diff = Math.floor((targetDate - new Date()) / 1000);

  if (diff <= 10 && diff > 0) {
    musicAmbient.pause();
    musicAmbient.currentTime = 0;

    // ⏳ pequeno delay = compatibilidade garantida
    setTimeout(() => {
      musicCountdown.currentTime = 0;
      musicCountdown.play();
    }, 200);

    yearEl.classList.add("hidden");
    startCountdown();
  }
}, 500);

// ================= FOGOS =================
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function firework() {
  const x = random(100, canvas.width - 100);
  const y = random(50, canvas.height / 2);

  for (let i = 0; i < 120; i++) {
    particles.push({
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      speed: random(2, 7),
      alpha: 1,
      color: `hsl(${random(0, 360)},100%,60%)`
    });
  }
}

function startFireworks() {
  setInterval(firework, 350);
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.alpha -= 0.015;

    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (p.alpha <= 0) particles.splice(i, 1);
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

animate();



