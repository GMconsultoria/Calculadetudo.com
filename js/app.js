/**
 * CalculaDeTudo - Main Application
 * 
 * SPA Router, Home Page, Inicialização de Navbar e Dark Mode
 */

const App = (() => {
    const mainContent = document.getElementById('main-content');

    // ---- Merge all routes from modules ----
    const allRoutes = {
        ...FinanceiroModule.routes,
        ...InvestimentosModule.routes,
        ...ImpostosModule.routes,
        ...ConversoresModule.routes,
        ...DatasModule.routes,
        ...SaudeModule.routes,
        ...CientificaModule.routes,
        ...CuriosidadesModule.routes,
    };

    // Category renderers
    const categoryRenderers = {
        financeira: FinanceiroModule.renderCategory,
        investimentos: InvestimentosModule.renderCategory,
        impostos: ImpostosModule.renderCategory,
        conversores: ConversoresModule.renderCategory,
        datas: DatasModule.renderCategory,
        saude: SaudeModule.renderCategory,
        cientifica: CientificaModule.renderCategory,
        curiosidades: CuriosidadesModule.renderCategory,
    };

    // ---- Home Page ----
    function renderHome() {
        const getCount = slug => typeof CalcSearch !== 'undefined' ? CalcSearch.calculadoras.filter(c => c.categorySlug === slug).length : 0;
        return `
            <section class="hero">
                <div class="hero-badge">🧮 100% gratuito e aberto</div>
                <h1>Todas as calculadoras que você precisa em um só lugar</h1>
                <p>Financeira, investimentos, impostos, conversores, datas, saúde e científica. Rápido, simples e sem complicação.</p>

                <div class="search-container">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input type="text" class="search-bar" id="search-bar" placeholder="Buscar calculadora... (ex: juros, IMC, IRPF)" autocomplete="off">
                    <div class="search-results" id="search-results"></div>
                </div>
            </section>

            <section class="categories-section" aria-label="Categorias">
                <div class="section-header">
                    <h2 class="section-title">Categorias</h2>
                </div>
                <div class="categories-grid">
                    ${renderCategoryCard('financeira', '💰', 'Financeira', 'Juros, financiamentos, taxas, VPL, TIR e mais.', getCount('financeira'), '--cat-financeira', '#dbeafe')}
                    ${renderCategoryCard('investimentos', '📈', 'Investimentos', 'Renda fixa, poupança, simuladores e reserva.', getCount('investimentos'), '--cat-investimentos', '#d1fae5')}
                    ${renderCategoryCard('impostos', '🧾', 'Impostos', 'IRPF, Simples Nacional, Lucro Presumido e Real.', getCount('impostos'), '--cat-impostos', '#fef3c7')}
                    ${renderCategoryCard('conversores', '🔄', 'Conversores', 'Moedas, medidas, volume e temperatura.', getCount('conversores'), '--cat-conversores', '#ede9fe')}
                    ${renderCategoryCard('datas', '📅', 'Datas', 'Diferenças, contagens e tempo vivido.', getCount('datas'), '--cat-datas', '#fee2e2')}
                    ${renderCategoryCard('saude', '❤️', 'Saúde', 'IMC, hidratação e necessidade proteica.', getCount('saude'), '--cat-saude', '#fce7f3')}
                    ${renderCategoryCard('cientifica', '🔬', 'Científica', 'Física, química, trigonometria, matrizes e mais.', getCount('cientifica'), '--cat-cientifica', '#cffafe')}
                    ${renderCategoryCard('curiosidades', '🏛️', 'Curiosidades', 'Tempo entre fatos históricos e muito mais.', getCount('curiosidades'), '--cat-curiosidades', '#fef9c3')}
                </div>
            </section>

            <section class="popular-section" aria-label="Calculadoras populares">
                <div class="section-header">
                    <h2 class="section-title">Populares</h2>
                </div>
                <div class="popular-grid">
                    ${renderPopularItem('/financeira/juros-compostos', '💰', 'Juros Compostos', '#dbeafe', 'var(--cat-financeira)')}
                    ${renderPopularItem('/saude/imc', '❤️', 'IMC', '#fce7f3', 'var(--cat-saude)')}
                    ${renderPopularItem('/impostos/irpf', '🧾', 'IRPF', '#fef3c7', 'var(--cat-impostos)')}
                    ${renderPopularItem('/conversores/moedas', '🔄', 'Conversor de Moedas', '#ede9fe', 'var(--cat-conversores)')}
                    ${renderPopularItem('/investimentos/primeiro-milhao', '📈', 'Primeiro Milhão', '#d1fae5', 'var(--cat-investimentos)')}
                    ${renderPopularItem('/financeira/financiamento', '🏠', 'Financiamento', '#dbeafe', 'var(--cat-financeira)')}
                    ${renderPopularItem('/datas/tempo-vivido', '⏰', 'Tempo Vivido', '#fee2e2', 'var(--cat-datas)')}
                    ${renderPopularItem('/cientifica/progressoes', '🔬', 'PA e PG', '#cffafe', 'var(--cat-cientifica)')}
                </div>
            </section>
        `;
    }

    function renderCategoryCard(slug, icon, title, desc, count, colorVar, bgColor) {
        return `
            <a href="#/categoria/${slug}" class="category-card" style="--card-color: var(${colorVar}); --card-color-light: ${bgColor}">
                <div class="card-icon">${icon}</div>
                <h3 class="card-title">${title}</h3>
                <p class="card-desc">${desc}</p>
                <span class="card-count">${count} ${count === 1 ? 'calculadora' : 'calculadoras'}</span>
            </a>
        `;
    }

    function renderPopularItem(route, icon, name, bgColor, color) {
        return `
            <a href="#${route}" class="popular-item">
                <span class="popular-icon" style="background: ${bgColor}; color: ${color}">${icon}</span>
                <span class="popular-name">${name}</span>
            </a>
        `;
    }

    // ---- Legal Pages ----
    function renderPrivacy() {
        return `
            <div class="legal-page">
                <div class="legal-content">
                    <h1>Política de Privacidade</h1>
                    <p>Última atualização: Maio de 2026</p>
                    <p>Esta Política de Privacidade descreve como o CalculaDeTudo ("nós", "nosso") coleta, usa e protege suas informações ao usar nosso site.</p>
                    
                    <h2>1. Coleta de Dados</h2>
                    <p>O CalculaDeTudo é uma ferramenta de utilidade pública. Não solicitamos cadastro nem coletamos dados pessoais identificáveis (como nome, e-mail ou endereço) para a maioria das funcionalidades.</p>
                    
                    <h2>2. Cookies e Tecnologias de Rastreamento</h2>
                    <p>Usamos cookies para:</p>
                    <ul>
                        <li>Lembrar suas preferências de idioma e tema (claro/escuro).</li>
                        <li>Analisar o tráfego do site através do Google Analytics.</li>
                        <li>Exibir anúncios relevantes através do Google AdSense.</li>
                    </ul>
                    
                    <h2>3. LGPD (Lei Geral de Proteção de Dados)</h2>
                    <p>Respeitamos integralmente a LGPD. Você tem o direito de:</p>
                    <ul>
                        <li>Saber quais dados são coletados.</li>
                        <li>Solicitar a exclusão de dados de navegação armazenados em cookies (limpando o cache do seu navegador).</li>
                        <li>Navegar de forma anônima.</li>
                    </ul>
                    
                    <h2>4. Segurança</h2>
                    <p>Empregamos medidas de segurança técnicas para proteger a integridade do site e evitar acessos não autorizados.</p>
                </div>
            </div>
        `;
    }

    function renderTerms() {
        return `
            <div class="legal-page">
                <div class="legal-content">
                    <h1>Termos de Uso</h1>
                    <p>Ao acessar o CalculaDeTudo, você concorda com os seguintes termos:</p>
                    
                    <h2>1. Uso do Serviço</h2>
                    <p>O site fornece calculadoras para fins informativos e educacionais. Embora busquemos a máxima precisão, não nos responsabilizamos por decisões financeiras ou legais tomadas com base nos resultados apresentados.</p>
                    
                    <h2>2. Propriedade Intelectual</h2>
                    <p>Todo o conteúdo, design e código fonte são de propriedade do CalculaDeTudo ou licenciados. O uso comercial sem autorização é proibido.</p>
                    
                    <h2>3. Isenção de Responsabilidade</h2>
                    <p>Os cálculos são aproximações baseadas em fórmulas matemáticas padrão e índices de mercado que podem sofrer variações.</p>
                </div>
            </div>
        `;
    }

    // ---- Cookie Banner ----
    function initCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const cookieSeen = localStorage.getItem('CalculaDeTudo-cookies-accepted');

        if (!cookieSeen && banner) {
            banner.classList.add('active');
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('CalculaDeTudo-cookies-accepted', 'true');
                banner.classList.remove('active');
            });
        }
    }

    // ---- Router ----
    function route() {
        let hash = window.location.hash.replace('#', '') || '/';

        // Scroll to top
        window.scrollTo(0, 0);

        // Home
        if (hash === '/' || hash === '') {
            mainContent.innerHTML = renderHome();
            CalcSearch.initSearchBar();
            document.title = 'CalculaDeTudo — Todas as calculadoras que você precisa';
            return;
        }

        // Legal
        if (hash === '/privacidade') {
            mainContent.innerHTML = renderPrivacy();
            document.title = 'Política de Privacidade | CalculaDeTudo';
            return;
        }
        if (hash === '/termos') {
            mainContent.innerHTML = renderTerms();
            document.title = 'Termos de Uso | CalculaDeTudo';
            return;
        }

        // Category page
        if (hash.startsWith('/categoria/')) {
            const cat = hash.replace('/categoria/', '');
            if (categoryRenderers[cat]) {
                mainContent.innerHTML = categoryRenderers[cat]();
                document.title = `${cat.charAt(0).toUpperCase() + cat.slice(1)} | CalculaDeTudo`;
                return;
            }
        }

        // Calculator page
        if (allRoutes[hash]) {
            const calc = allRoutes[hash]();
            mainContent.innerHTML = calc.html;
            document.title = `${mainContent.querySelector('.calc-title')?.textContent || 'Calculadora'} | CalculaDeTudo`;
            // Init calculator after DOM is updated
            requestAnimationFrame(() => {
                if (calc.init) calc.init();
            });
            return;
        }

        // 404
        mainContent.innerHTML = `
            <div class="calc-page" style="text-align: center; padding-top: 80px;">
                <h1 class="calc-title">Página não encontrada</h1>
                <p class="calc-description">A calculadora que você procura não existe.</p>
                <a href="#/" class="btn btn-primary" style="margin-top: 24px; display: inline-flex;">Voltar ao Início</a>
            </div>
        `;
    }

    // ---- Navbar ----
    function initNavbar() {
        const nav = document.getElementById('navbar-nav');
        const toggle = document.getElementById('mobile-toggle');
        const overlay = document.getElementById('mobile-overlay');

        // Dropdowns
        document.querySelectorAll('.dropdown-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.closest('.nav-item');
                const isActive = item.classList.contains('active');
                // Close all
                document.querySelectorAll('.nav-item.dropdown').forEach(d => {
                    d.classList.remove('active');
                    const t = d.querySelector('.dropdown-toggle');
                    if (t) t.setAttribute('aria-expanded', 'false');
                });
                if (!isActive) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            document.querySelectorAll('.nav-item.dropdown').forEach(d => {
                d.classList.remove('active');
                const t = d.querySelector('.dropdown-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        });

        // Close dropdowns on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.nav-item.dropdown').forEach(d => {
                    d.classList.remove('active');
                    const t = d.querySelector('.dropdown-toggle');
                    if (t) t.setAttribute('aria-expanded', 'false');
                });
                const langDropdown = document.getElementById('lang-dropdown');
                if (langDropdown) langDropdown.classList.remove('active');
            }
        });

        // Close dropdown and mobile nav on link click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dropdown-item') || e.target.closest('.footer-links a')) {
                document.querySelectorAll('.nav-item.dropdown').forEach(d => {
                    d.classList.remove('active');
                    const t = d.querySelector('.dropdown-toggle');
                    if (t) t.setAttribute('aria-expanded', 'false');
                });
                nav.classList.remove('active');
                toggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Mobile toggle
        toggle.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            toggle.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Overlay click
        overlay.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ---- Dark Mode ----
    function initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const saved = localStorage.getItem('CalculaDeTudo-theme');

        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('CalculaDeTudo-theme', isDark ? 'light' : 'dark');
        });
    }

    // ---- Init ----
    function init() {
        initNavbar();
        initTheme();
        initCookieBanner();
        TranslateSystem.init();
        route();
        window.addEventListener('hashchange', route);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { route };
})();
