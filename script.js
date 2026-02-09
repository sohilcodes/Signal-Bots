window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

const theme = window.Telegram.WebApp.themeParams;

if (theme.bg_color) {
    document.documentElement.style.setProperty('--bg', theme.bg_color);
}
if (theme.secondary_bg_color) {
    document.documentElement.style.setProperty('--card-bg', theme.secondary_bg_color);
}
if (theme.text_color) {
    document.documentElement.style.setProperty('--text', theme.text_color);
}
if (theme.button_color) {
    document.documentElement.style.setProperty('--accent', theme.button_color);
}

let selectedPair = '';
let selectedExpiry = '';

// Screen 1 → 2
document.getElementById('next-to-expiry').addEventListener('click', () => {
    selectedPair = document.getElementById('pair-select').value;
    if (selectedPair) {
        document.getElementById('screen1').classList.remove('active');
        document.getElementById('screen2').classList.add('active');
    }
});

// Expiry buttons
document.querySelectorAll('.expiry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.expiry-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedExpiry = btn.dataset.time;
    });
});

// Screen 2 → 3
document.getElementById('next-to-signal').addEventListener('click', () => {
    if (selectedExpiry) {
        document.getElementById('screen2').classList.remove('active');
        document.getElementById('screen3').classList.add('active');
    }
});

// Get Signal
document.getElementById('get-signal').addEventListener('click', () => {
    const btn = document.getElementById('get-signal');
    btn.style.display = 'none';

    const processing = document.getElementById('processing');
    processing.style.display = 'flex';

    setTimeout(() => step(1),  800);
    setTimeout(() => step(2), 1600);
    setTimeout(() => step(3), 2400);
    setTimeout(() => step(4), 3200);
    setTimeout(showSignal,   4200);
});

function step(n) {
    document.getElementById(`step${n}`).classList.add('done');
}

function showSignal() {
    document.getElementById('processing').style.display = 'none';

    const direction = Math.random() > 0.5 ? 'CALL' : 'PUT';
    document.getElementById('signal-pair').textContent = selectedPair;
    document.getElementById('signal-time').textContent = selectedExpiry;
    
    const dirEl = document.getElementById('signal-direction');
    dirEl.textContent = direction;
    dirEl.className = direction === 'CALL' ? 'green' : 'red';

    document.getElementById('signal-card').style.display = 'block';
}
