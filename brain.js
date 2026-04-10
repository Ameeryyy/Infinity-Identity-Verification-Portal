class InfinityBrain {
    constructor() {
        this.settings = this.getSettings();
        this.init();
    }
    init() {
        this.applySecurity();
        this.applyGlobalStyles();
        this.setupCustomAlert();
        this.applyTheme(this.settings?.theme || 'system');
        this.setupNetworkMonitor();
        this.restorePageState();
    }
    applySecurity() {
        ['copy', 'contextmenu', 'selectstart'].forEach(e => document.addEventListener(e, x => x.preventDefault()));
    }
    applyGlobalStyles() {
        const s = document.createElement('style');
        s.textContent = 'html,body{margin:0;padding:0;width:100vw;min-height:100vh;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:monospace,system-ui,-apple-system,sans-serif;transition:background-color .4s,color .4s}*,::before,::after{box-sizing:inherit}*{-webkit-tap-highlight-color:transparent!important;user-select:none!important;outline:none!important}';
        document.head.appendChild(s);
    }
    applyTheme(t) {
        const d = t === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches : t === 'dark';
        document.documentElement.style.setProperty('--bg', d ? '#000' : '#fff');
        document.documentElement.style.setProperty('--fg', d ? '#fff' : '#000');
        document.body.style.backgroundColor = 'var(--bg)';
        document.body.style.color = 'var(--fg)';
    }
    saveSettings(d) {
        this.settings = { ...this.settings, ...d };
        localStorage.setItem('infinity_settings', JSON.stringify(this.settings));
        this.applyTheme(this.settings.theme);
    }
    getSettings() {
        return JSON.parse(localStorage.getItem('infinity_settings'));
    }
    setupCustomAlert() {
        const s = document.createElement('style');
        s.textContent = '.inf-ov{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.9);display:flex;justify-content:center;align-items:center;z-index:9999;opacity:0;transition:opacity .3s}.inf-al{background:var(--bg);color:var(--fg);padding:30px;border:1px solid var(--fg);text-align:center;width:85%;max-width:320px;transform:scale(.9);transition:transform .3s}.inf-al h3{margin:0 0 10px;font-size:16px;letter-spacing:2px;text-transform:uppercase}.inf-al p{margin:0 0 20px;font-size:13px;opacity:.7}.inf-al button{padding:12px;border:1px solid var(--fg);background:0 0;color:inherit;cursor:pointer;font-size:12px;width:100%;text-transform:uppercase;letter-spacing:2px}.inf-sh{opacity:1}.inf-sh .inf-al{transform:scale(1)}';
        document.head.appendChild(s);
        window.alert = (t, m = t) => {
            const o = document.createElement('div');
            o.className = 'inf-ov';
            o.innerHTML = `<div class="inf-al"><h3>${t}</h3><p>${m}</p><button onclick="const p=this.closest('.inf-ov');p.classList.remove('inf-sh');setTimeout(()=>p.remove(),300)">ACKNOWLEDGE</button></div>`;
            document.body.appendChild(o);
            setTimeout(() => o.classList.add('inf-sh'), 10);
        };
    }
    setupNetworkMonitor() {
        const p = window.location.pathname.toLowerCase();
        const i = p.endsWith('index.html') || p.endsWith('/');
        const o = p.endsWith('offline.html');
        window.addEventListener('offline', () => {
            if (!i && !o) {
                this.savePageState();
                localStorage.setItem('inf_last', window.location.href);
                window.location.href = 'offline.html';
            }
        });
        window.addEventListener('online', () => {
            if (o) {
                alert('SYSTEM ONLINE', 'Connection re-established. Restoring session...');
                setTimeout(() => window.location.href = localStorage.getItem('inf_last') || 'home.html', 3000);
            }
        });
        if (!navigator.onLine && !i && !o) {
            this.savePageState();
            localStorage.setItem('inf_last', window.location.href);
            window.location.href = 'offline.html';
        }
    }
    savePageState() {
        const s = {};
        document.querySelectorAll('input, textarea').forEach((i, x) => s[i.id || i.name || 'i_' + x] = i.value);
        localStorage.setItem('inf_st_' + window.location.pathname, JSON.stringify(s));
    }
    restorePageState() {
        try {
            const s = JSON.parse(localStorage.getItem('inf_st_' + window.location.pathname));
            if (s) document.querySelectorAll('input, textarea').forEach((i, x) => {
                const k = i.id || i.name || 'i_' + x;
                if (s[k] !== undefined) i.value = s[k];
            });
        } catch (e) {}
    }
    async setupAuth() {
        try {
            await navigator.credentials.create({ publicKey: { challenge: new Uint8Array(32), rp: { name: "Infinity" }, user: { id: new Uint8Array(16), name: "U", displayName: "U" }, pubKeyCredParams: [{ type: "public-key", alg: -7 }], authenticatorSelection: { userVerification: "preferred" }, timeout: 60000, attestation: "none" } });
            return true;
        } catch (e) { return false; }
    }
}
const brain = new InfinityBrain();
