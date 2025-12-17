document.addEventListener('DOMContentLoaded', () => {
    // Configuramos el botón de inicio
    const startBtn = document.getElementById('start-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const video = document.getElementById('main-video');

    startBtn.addEventListener('click', () => {
        // 1. Ocultar pantalla de bienvenida
        welcomeScreen.classList.add('hidden');
        
        // 2. Iniciar Video CON SONIDO (El navegador ahora lo permite porque hubo click)
        if(video) {
            video.muted = false; // Aseguramos que tenga sonido
            video.play().catch(e => console.log("Error al reproducir:", e));
        }

        // 3. Iniciar el resto de animaciones (Texto, Pétalos, Fecha)
        setTimeout(() => {
            showDedicationText();
            startFloatingObjects();
            showCountdown();
        }, 500); // Pequeño retraso estético
    });
});

/* --- FUNCIONES --- */

function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Efecto máquina de escribir
function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida: Lizbeth\n\nDesde el primer momento supe que eras tú. Tu sonrisa, tu voz, tu forma de ser… todo en ti me hace sentir bien.\n\nGracias por acompañarme en cada paso, por entenderme incluso en smomentos dificeles, y por llenar mis días de amor.\n\nTe amo más de lo que las palabras pueden expresar.`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  
  const container = document.getElementById('dedication-text');
  container.style.opacity = '1'; 
  container.textContent = ""; 
  
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 300 : 50);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Firma
function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = document.getElementById('signature');
  
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor, Joel Coronel";
  signature.style.opacity = '1';
}

// Pétalos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 95}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.6 + Math.random() * 0.4;
    el.style.backgroundColor = `hsl(${340 + Math.random() * 20}, 80%, 70%)`; 
    container.appendChild(el);

    const duration = 5000 + Math.random() * 5000;
    
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity ${duration}ms ease-out`;
      el.style.transform = `translate(${(Math.random() - 0.5) * 100}px, -110vh) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0;
    }, 50);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 100);

    setTimeout(spawn, 400 + Math.random() * 400);
  }
  spawn();
}

// Cuenta regresiva
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2023-12-31T00:00:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2025-12-31T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    let eventDiff = eventDate - now;
    let eDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eMin = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eSec = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML = 
      `Llevamos juntos: <b>${days}</b> días<br>` +
      `Nuestro aniversario: <b>${eDays}d ${eHours}h ${eMin}m ${eSec}s</b>`;
    
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}