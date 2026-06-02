const API = 'http://localhost:5000/api';

// State
const state = {
  accepted: false,
  respondentName: '',
  dateChosen: '',
  timeChosen: '',
  foodChosen: ''
};

// ── Navigation ──
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  // Force re-animation
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = '';
}

// ── No button dodge ──
let noMoves = 0;
function dodgeNo(btn) {
  noMoves++;
  if (noMoves >= 6) {
    // After 6 tries, accept anyway 😂
    acceptDate();
    return;
  }
  const msgs = ['encore...', 'vraiment?', 'essaie encore 😌', 'non non 🫣', 'j\'attends 💅'];
  btn.textContent = msgs[noMoves - 1] || 'non';
  const range = 140;
  const x = (Math.random() - 0.5) * range * 2;
  const y = (Math.random() - 0.5) * range * 2;
  btn.style.transition = 'transform 0.15s';
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

// ── Accept flow ──
function acceptDate() {
  state.accepted = true;
  goPage('page-yay');
}

// ── Set date ──
function setDate() {
  const d = document.getElementById('dateInput').value;
  const t = document.getElementById('timeInput').value;
  if (!d || !t) {
    showToast('Choisis une date et une heure 🥺');
    return;
  }
  state.dateChosen = d;
  state.timeChosen = t;
  goPage('page-food');
}

// ── Select food ──
function selectFood(el, name) {
  document.querySelectorAll('.food-item').forEach(f => f.classList.remove('selected'));
  el.classList.add('selected');
  state.foodChosen = name;
}

// ── Final confirm & save to DB ──
async function confirm() {
  if (!state.foodChosen) {
    showToast('Choisis quelque chose à manger d\'abord 😋');
    return;
  }

  const btn = document.getElementById('confirmBtn');
  btn.disabled = true;
  btn.textContent = 'Enregistrement...';

  try {
    const res = await fetch(`${API}/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accepted: state.accepted,
        respondentName: 'Hadil',
        dateChosen: state.dateChosen,
        timeChosen: state.timeChosen,
        foodChosen: state.foodChosen
      })
    });

    const data = await res.json();

    if (data.success) {
      // Update letter with chosen details
      const dateFormatted = new Date(state.dateChosen).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
      document.getElementById('letterDetails').textContent =
        `${dateFormatted} à ${state.timeChosen.split('(')[0].trim()} — avec ${state.foodChosen} 🍽️`;

      goPage('page-letter');
      launchConfetti();
    } else {
      showToast('Erreur lors de l\'enregistrement 😢');
      btn.disabled = false;
      btn.textContent = 'c\'est noté! →';
    }
  } catch (err) {
    console.error(err);
    showToast('Impossible de contacter le serveur. Vérifie que le backend tourne!');
    btn.disabled = false;
    btn.textContent = 'c\'est noté! →';
  }
}

// ── Confetti ──
function launchConfetti() {
  const colors = ['#5C1A2E','#E8A0B0','#C4973A','#F5D6DC','#7a2340'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.5 + Math.random() * 2.5}s;
      animation-delay: ${Math.random() * 1.2}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      width: ${5 + Math.random() * 7}px;
      height: ${5 + Math.random() * 7}px;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
}

// ── Toast ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
      background:#5C1A2E; color:#F5D6DC; padding:0.75rem 1.5rem;
      border-radius:50px; font-size:0.88rem; z-index:9999;
      box-shadow:0 4px 20px rgba(92,26,46,0.3); transition: opacity 0.3s;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.style.opacity = '0', 3000);
}