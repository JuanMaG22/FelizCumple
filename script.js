// PERSONALIZA AQUÍ el nombre que aparece en la portada.
const CONFIG = {
  nombre: "mi princesa hermosa"
};

document.getElementById("partnerName").textContent = CONFIG.nombre;

// Fondo de estrellas dibujado con Canvas.
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];
let width = 0;
let height = 0;
let animationFrame;

function resizeStarfield() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(190, Math.floor((width * height) / 6500));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.5 + 0.9,
    alpha: Math.random() * 0.85 + 0.15,
    speed: Math.random() * 0.012 + 0.003,
    phase: Math.random() * Math.PI * 2
  }));
}
function drawStars(time = 0) {
  ctx.clearRect(0, 0, width, height);
  for (const star of stars) {
    const twinkle = (Math.sin(time * star.speed + star.phase) + 1) / 2;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244, 230, 255, ${Math.min(1, star.alpha * (0.5 + twinkle * 0.65))})`;
    ctx.shadowBlur = 7 + twinkle * 13;
    ctx.shadowColor = "rgba(220, 174, 255, 0.95)";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  animationFrame = requestAnimationFrame(drawStars);
}
window.addEventListener("resize", resizeStarfield);
resizeStarfield();
drawStars();

// Al tocar el regalo, se abre y el pastel se construye desde la base hasta las velas.
const giftButton = document.getElementById("startButton");
const giftHint = document.getElementById("giftHint");
const birthdayReveal = document.getElementById("birthdayReveal");
const introCake = document.getElementById("introCake");
const continueButton = document.getElementById("continueButton");

giftButton.addEventListener("click", () => {
  if (giftButton.classList.contains("opening")) return;
  giftButton.classList.add("opening");
  giftButton.disabled = true;
  giftHint.textContent = "¡Tu sorpresa está apareciendo... ✨";
  startFireworks();
  window.setTimeout(() => {
    giftButton.hidden = true;
    giftHint.hidden = true;
    birthdayReveal.hidden = false;
    introCake.classList.add("build");
    launchConfetti(36);
    // Enfoca automáticamente el pastel para que la animación se vea completa.
    window.setTimeout(() => birthdayReveal.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }, 750);
});

continueButton.addEventListener("click", () => {
  // Los fuegos artificiales continúan activos durante toda la experiencia.
  document.getElementById("recuerdos").scrollIntoView({ behavior: "smooth" });
});

// Muestra las secciones suavemente al entrar en pantalla.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(section => revealObserver.observe(section));

// Música: el navegador suele exigir que el usuario pulse primero.
const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
const musicIcon = document.getElementById("musicIcon");

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicLabel.textContent = "Pausar música";
      musicIcon.textContent = "♫";
      musicButton.setAttribute("aria-pressed", "true");
    } catch (error) {
      musicLabel.textContent = "Añade musica/cancion.mp3";
      musicButton.setAttribute("aria-pressed", "false");
    }
  } else {
    music.pause();
    musicLabel.textContent = "Activar música";
    musicIcon.textContent = "♫";
    musicButton.setAttribute("aria-pressed", "false");
  }
});

// Fuegos artificiales: empiezan al abrir el regalo y se detienen al continuar.
const fireworksCanvas = document.getElementById("fireworks");
const fireworksCtx = fireworksCanvas.getContext("2d");
let fireworksWidth=0, fireworksHeight=0, fireworksFrame=null, fireworksActive=false, fireworksParticles=[], lastBurstTime=0;
function resizeFireworks(){
  const dpr=Math.min(window.devicePixelRatio||1,2); fireworksWidth=innerWidth; fireworksHeight=innerHeight;
  fireworksCanvas.width=Math.floor(fireworksWidth*dpr); fireworksCanvas.height=Math.floor(fireworksHeight*dpr);
  fireworksCanvas.style.width=`${fireworksWidth}px`; fireworksCanvas.style.height=`${fireworksHeight}px`;
  fireworksCtx.setTransform(dpr,0,0,dpr,0,0);
}
addEventListener("resize",resizeFireworks); resizeFireworks();
function createFireworkBurst(){
  const x=fireworksWidth*(.12+Math.random()*.76), y=fireworksHeight*(.10+Math.random()*.48);
  const hue=[285,315,330,260,42,190][Math.floor(Math.random()*6)], count=45+Math.floor(Math.random()*25);
  for(let i=0;i<count;i++){const a=Math.PI*2*i/count+Math.random()*.12, s=1.1+Math.random()*3.5;
    fireworksParticles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:55+Math.random()*30,max:85,size:1.3+Math.random()*2,hue:hue+Math.random()*18});}
}
function drawFireworks(time=0){
  if(!fireworksActive)return; fireworksCtx.clearRect(0,0,fireworksWidth,fireworksHeight);
  if(time-lastBurstTime>620){createFireworkBurst();if(Math.random()>.45)createFireworkBurst();lastBurstTime=time;}
  fireworksParticles=fireworksParticles.filter(p=>p.life>0);
  for(const p of fireworksParticles){p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy=p.vy*.985+.018;p.life--;
    const alpha=Math.max(0,p.life/p.max);fireworksCtx.beginPath();fireworksCtx.arc(p.x,p.y,p.size*alpha,0,Math.PI*2);
    fireworksCtx.fillStyle=`hsla(${p.hue},100%,76%,${alpha})`;fireworksCtx.shadowBlur=12;fireworksCtx.shadowColor=`hsla(${p.hue},100%,70%,${alpha})`;fireworksCtx.fill();}
  fireworksCtx.shadowBlur=0;fireworksFrame=requestAnimationFrame(drawFireworks);
}
function startFireworks(){if(fireworksActive)return;fireworksActive=true;fireworksParticles=[];lastBurstTime=0;document.body.classList.add("fireworks-active");fireworksFrame=requestAnimationFrame(drawFireworks);}
function stopFireworks(){fireworksActive=false;document.body.classList.remove("fireworks-active");if(fireworksFrame!==null)cancelAnimationFrame(fireworksFrame);fireworksFrame=null;fireworksParticles=[];fireworksCtx.clearRect(0,0,fireworksWidth,fireworksHeight);}

// Apagar las velas y lanzar una lluvia de pequeñas partículas.
const cakeScene = document.getElementById("cakeScene");
const blowButton = document.getElementById("blowButton");
const wishMessage = document.getElementById("wishMessage");
let candlesOut = false;

blowButton.addEventListener("click", () => {
  candlesOut = !candlesOut;
  cakeScene.classList.toggle("blown-out", candlesOut);
  if (candlesOut) {
    blowButton.textContent = "Volver a encender ✨";
    wishMessage.textContent = "¡Que todos tus deseos encuentren su camino hasta ti y se hagan realidad! 💜🪼";
    launchConfetti(65);
  } else {
    blowButton.textContent = "Apagar las velas ✨";
    wishMessage.textContent = "Que este nuevo año te acerque a todo lo que sueñas.";
  }
});

function launchConfetti(amount = 45) {
  const symbols = ["✦", "✧", "♡", "·", "✺"];
  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");
    particle.className = "confetti";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.color = ["#ffc2e7", "#d7c2ff", "#fff0bd", "#ffffff"][Math.floor(Math.random() * 4)];
    particle.style.fontSize = `${Math.random() * 15 + 9}px`;
    particle.style.animationDuration = `${Math.random() * 2.5 + 2.3}s`;
    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

// Mensaje secreto.
const secretStar = document.getElementById("secretStar");
const secretMessage = document.getElementById("secretMessage");
secretStar.addEventListener("click", () => {
  secretMessage.hidden = false;
  secretStar.setAttribute("aria-expanded", "true");
  secretStar.innerHTML = "<span>♡</span><i></i>";
  launchConfetti(28);
  secretMessage.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Volver al inicio.
document.getElementById("replayButton").addEventListener("click", () => {
  giftButton.hidden = false;
  giftButton.disabled = false;
  giftButton.classList.remove("opening");
  giftHint.hidden = false;
  giftHint.textContent = "Toca el regalo para ver tu sorpresa ✨";
  birthdayReveal.hidden = true;
  introCake.classList.remove("build");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
