/**
 * CalculaDeTudo - Sistema de Tradução usando Google Translate
 * 
 * Tradução automática para 10 idiomas.
 */

const TranslateSystem = (() => {
    const languages = [
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: '한국어', flag: '🇰🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    let currentLang = 'pt';

    function setGoogleTranslateLanguage(lang) {
        // Find the Google Translate select element
        const select = document.querySelector('.goog-te-combo');
        if (!select) {
            // Google Translate might not be fully loaded yet
            setTimeout(() => setGoogleTranslateLanguage(lang), 500);
            return;
        }

        // Se for português, voltamos para o original
        if (lang === 'pt') {
            select.value = '';
            select.dispatchEvent(new Event('change'));
        } else {
            select.value = lang;
            select.dispatchEvent(new Event('change'));
        }
    }

    function translatePage(lang) {
        // Map zh -> zh-CN se vier do dropdown antigo
        if (lang === 'zh') lang = 'zh-CN';
        
        currentLang = lang;
        localStorage.setItem('CalculaDeTudo-lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Trigger google translate
        setGoogleTranslateLanguage(lang);

        // Update language flag in our custom UI
        const langBtn = document.getElementById('lang-current');
        if (langBtn) {
            // Check both zh and zh-CN
            const langInfo = languages.find(l => l.code === lang || (lang === 'zh-CN' && l.code === 'zh'));
            if (langInfo) langBtn.textContent = langInfo.flag;
        }

        // Close our custom dropdown
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.remove('active');
    }

    function init() {
        const saved = localStorage.getItem('CalculaDeTudo-lang');
        if (saved && saved !== 'pt') {
            currentLang = saved;
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            translatePage(saved);

            const checkTranslate = setInterval(() => {
                const html = document.documentElement;
                if (html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl')) {
                    document.body.style.opacity = '1';
                    clearInterval(checkTranslate);
                }
            }, 100);

            // Failsafe
            setTimeout(() => {
                document.body.style.opacity = '1';
                clearInterval(checkTranslate);
            }, 2000);
        } else if (saved === 'pt') {
            currentLang = saved;
            translatePage(saved);
        }

        // Language button click handler for our custom UI
        const langToggle = document.getElementById('lang-toggle');
        const langDropdown = document.getElementById('lang-dropdown');

        if (langToggle && langDropdown) {
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('active');
            });

            // Close dropdown on outside click
            document.addEventListener('click', () => {
                langDropdown.classList.remove('active');
            });

            // Language selection
            langDropdown.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const lang = option.dataset.lang;
                    translatePage(lang);
                });
            });
        }
    }

    return { init, translatePage, languages, getCurrentLang: () => currentLang };
})();
