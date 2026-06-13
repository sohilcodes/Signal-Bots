// ── Login Gate ──
(function() {
    const PASS = '#BenZ@Xyz';
    const SESSION_KEY = 'benz_auth';

    const loginScreen = document.getElementById('login-screen');
    const app         = document.getElementById('app');
    const topbar      = document.getElementById('topbar');
    const input       = document.getElementById('password-input');
    const loginBtn    = document.getElementById('login-btn');
    const errorEl     = document.getElementById('login-error');
    const toggleBtn   = document.getElementById('toggle-pw');

    // Check session
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
        loginScreen.style.display = 'none';
        app.style.display = 'block';
        topbar.style.display = 'flex';
        return;
    }

    // Hide topbar until logged in
    if (topbar) topbar.style.display = 'none';

    function tryLogin() {
        if (input.value === PASS) {
            sessionStorage.setItem(SESSION_KEY, '1');
            loginScreen.style.opacity = '0';
            loginScreen.style.transition = 'opacity 0.4s';
            setTimeout(() => {
                loginScreen.style.display = 'none';
                app.style.display = 'block';
                if (topbar) topbar.style.display = 'flex';
            }, 400);
        } else {
            errorEl.style.display = 'block';
            errorEl.style.animation = 'none';
            void errorEl.offsetWidth;
            errorEl.style.animation = 'shake 0.35s ease';
            input.value = '';
            input.focus();
        }
    }

    loginBtn.addEventListener('click', tryLogin);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

    toggleBtn.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        toggleBtn.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
})();

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// ── Pair Data ──
const PAIRS = {
    currencies: [
        { name: 'EUR/CAD OTC', emoji: '🇪🇺🇨🇦', profit: '1+ min 93% • 5+ min 93%' },
        { name: 'NZD/CAD OTC', emoji: '🇳🇿🇨🇦', profit: '1+ min 93% • 5+ min 93%' },
        { name: 'AUD/CAD OTC', emoji: '🇦🇺🇨🇦', profit: '1+ min 92% • 5+ min 91%' },
        { name: 'AUD/JPY OTC', emoji: '🇦🇺🇯🇵', profit: '1+ min 92% • 5+ min 94%' },
        { name: 'EUR/CHF OTC', emoji: '🇪🇺🇨🇭', profit: '1+ min 92% • 5+ min 93%' },
        { name: 'GBP/CAD OTC', emoji: '🇬🇧🇨🇦', profit: '1+ min 92% • 5+ min 93%' },
        { name: 'USD/BDT OTC', emoji: '🇺🇸🇧🇩', profit: '1+ min 92% • 5+ min 92%' },
        { name: 'USD/EGP OTC', emoji: '🇺🇸🇪🇬', profit: '1+ min 92% • 5+ min 89%' },
        { name: 'USD/JPY OTC', emoji: '🇺🇸🇯🇵', profit: '1+ min 92% • 5+ min 93%' },
        { name: 'USD/ARS OTC', emoji: '🇺🇸🇦🇷', profit: '1+ min 91% • 5+ min 91%' },
        { name: 'EUR/USD OTC', emoji: '🇪🇺🇺🇸', profit: '1+ min 91% • 5+ min 90%' },
        { name: 'GBP/USD OTC', emoji: '🇬🇧🇺🇸', profit: '1+ min 90% • 5+ min 91%' },
        { name: 'CHF/JPY OTC', emoji: '🇨🇭🇯🇵', profit: '1+ min 90% • 5+ min 92%' },
    ],
    commodities: [
        { name: 'USCrude OTC', emoji: '🛢️',      profit: '1+ min 92% • 5+ min 92%' },
        { name: 'Silver OTC',  emoji: '🥈',      profit: '1+ min 85% • 5+ min 81%' },
        { name: 'Gold OTC',    emoji: '🥇',      profit: '1+ min 83% • 5+ min 82%' },
        { name: 'UKBrent OTC', emoji: '⛽',      profit: '1+ min 77% • 5+ min 77%' },
    ]
};

let selectedPair   = '';
let selectedExpiry = '';
let currentCat     = 'currencies';

// ── Render Pair List ──
function renderPairs(cat) {
    const list = document.getElementById('pair-list');
    list.innerHTML = '';
    PAIRS[cat].forEach(pair => {
        const item = document.createElement('div');
        item.className = 'pair-item' + (selectedPair === pair.name ? ' selected' : '');
        item.innerHTML = `
            <div class="pair-left">
                <span class="pair-emoji">${pair.emoji}</span>
                <div class="pair-info">
                    <span class="pair-name">${pair.name}</span>
                    <span class="pair-profit">Profit • ${pair.profit}</span>
                </div>
            </div>
            <div class="pair-check">✓</div>
        `;
        item.addEventListener('click', () => {
            selectedPair = pair.name;
            renderPairs(currentCat);
            const btn = document.getElementById('next-to-expiry');
            btn.disabled = false;
            btn.textContent = 'Next →';
        });
        list.appendChild(item);
    });
}

// ── Tab Switch ──
document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCat = tab.dataset.cat;
        selectedPair = '';
        const btn = document.getElementById('next-to-expiry');
        btn.disabled = true;
        btn.textContent = 'Select a Pair →';
        renderPairs(currentCat);
    });
});

// Initial render
renderPairs('currencies');

// ── Screen 1 → 2 ──
document.getElementById('next-to-expiry').addEventListener('click', () => {
    if (selectedPair) {
        document.getElementById('screen1').classList.remove('active');
        document.getElementById('screen2').classList.add('active');
    }
});

// ── Expiry Buttons ──
document.querySelectorAll('.expiry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.expiry-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedExpiry = btn.dataset.time;
    });
});

// ── Screen 2 → 3 ──
document.getElementById('next-to-signal').addEventListener('click', () => {
    if (selectedExpiry) {
        document.getElementById('screen2').classList.remove('active');
        document.getElementById('screen3').classList.add('active');
    }
});

// ── Get Signal ──
document.getElementById('get-signal').addEventListener('click', () => {
    document.getElementById('get-signal').style.display = 'none';
    document.getElementById('processing').style.display = 'flex';

    setTimeout(() => step(1),  800);
    setTimeout(() => step(2), 1600);
    setTimeout(() => step(3), 2400);
    setTimeout(() => step(4), 3200);
    setTimeout(showSignal,    4200);
});

function step(n) {
    document.getElementById(`step${n}`).classList.add('done');
}

function showSignal() {
    document.getElementById('processing').style.display = 'none';

    const direction = Math.random() > 0.5 ? '⬆ CALL' : '⬇ PUT';
    const isCall    = direction.includes('CALL');

    document.getElementById('signal-pair').textContent      = selectedPair;
    document.getElementById('signal-time').textContent      = selectedExpiry;

    const dirEl = document.getElementById('signal-direction');
    dirEl.textContent = direction;
    dirEl.className   = isCall ? 'green' : 'red';

    document.getElementById('signal-card').style.display = 'block';
}
