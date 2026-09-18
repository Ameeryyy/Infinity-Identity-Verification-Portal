// === GLOBAL THEME INITIALIZATION ===
window.setGlobalTheme = function(theme) {
    if (theme === 'system') {
        const isLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
        document.documentElement.setAttribute('data-theme', isLight ? 'minimal-light' : 'minimal-dark');
    } else {
        document.documentElement.setAttribute('data-theme', theme === 'light' ? 'minimal-light' : 'minimal-dark');
    }
};

(function() {
    const savedTheme = localStorage.getItem('inf_theme') || 'system';
    window.setGlobalTheme(savedTheme);

    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
        if (localStorage.getItem('inf_theme') === 'system' || !localStorage.getItem('inf_theme')) {
            window.setGlobalTheme('system');
        }
    });
})();
// === END THEME INITIALIZATION ===

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }
    
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
    }
    
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
    }
    
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
    }
    
    if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
    }
});

document.addEventListener('copy', function(e) {
    e.preventDefault();
});

document.addEventListener('cut', function(e) {
    e.preventDefault();
});

document.addEventListener('paste', function(e) {
    e.preventDefault();
});

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

function isIndexPage() {
    const path = window.location.pathname;
    return path.endsWith('index.html') || path === '/' || path === '';
}

document.addEventListener('DOMContentLoaded', () => {
    const allInputs = document.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', 'false');
    });

    if (!navigator.onLine && window.location.pathname.indexOf('offline.html') === -1 && !isIndexPage()) {
        sessionStorage.setItem('brain_last_online_page', window.location.href);
        window.location.href = "offline.html";
    }
});

const securityStyles = document.createElement('style');
securityStyles.innerHTML = `
    * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        outline: none !important;
        -webkit-tap-highlight-color: transparent !important;
    }
    input, textarea {
        -webkit-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
    }
`;
document.head.appendChild(securityStyles);

const brain = {
    settingsKey: 'infinity_verification_settings',
    
    get settings() {
        try {
            return JSON.parse(localStorage.getItem(this.settingsKey)) || {};
        } catch (e) {
            return {};
        }
    },
    
    saveSettings(newSettings) {
        localStorage.setItem(this.settingsKey, JSON.stringify(newSettings));
    },

    clearSettings() {
        localStorage.removeItem(this.settingsKey);
    }
};

window.brain = brain;

window.addEventListener('offline', () => {
    if (window.location.pathname.indexOf('offline.html') === -1 && !isIndexPage()) {
        sessionStorage.setItem('brain_last_online_page', window.location.href);
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = "offline.html";
        }, 800);
    }
});

window.addEventListener('online', () => {
    if (window.location.pathname.indexOf('offline.html') === -1) {
    }
});