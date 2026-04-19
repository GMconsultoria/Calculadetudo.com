/**
 * CalculaDeTudo - Sistema de Busca
 * 
 * Implementa busca em tempo real por todas as calculadoras disponíveis.
 */

const CalcSearch = (() => {

    /** Registry de todas as calculadoras para busca */
    const registry = [];

    /** Registra uma calculadora para ser encontrada na busca */
    function register(item) {
        // item: { name, category, categorySlug, route, keywords }
        registry.push(item);
    }

    /** Busca nas calculadoras registradas */
    function search(query) {
        if (!query || query.length < 2) return [];

        const normalized = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return registry.filter(item => {
            const searchable = `${item.name} ${item.category} ${(item.keywords || []).join(' ')}`
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            return searchable.includes(normalized);
        }).slice(0, 10);
    }

    /** Inicializa handlers da barra de busca no DOM */
    function initSearchBar() {
        const searchBar = document.getElementById('search-bar');
        const searchResults = document.getElementById('search-results');
        if (!searchBar || !searchResults) return;

        let debounceTimer;

        searchBar.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const results = search(searchBar.value);
                renderResults(results, searchResults);
            }, 200);
        });

        searchBar.addEventListener('focus', () => {
            if (searchBar.value.length >= 2) {
                searchResults.classList.add('active');
            }
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('active');
            }
        });
    }

    function renderResults(results, container) {
        if (results.length === 0) {
            if (document.getElementById('search-bar').value.length >= 2) {
                container.innerHTML = '<div class="search-no-results">Nenhuma calculadora encontrada</div>';
                container.classList.add('active');
            } else {
                container.classList.remove('active');
            }
            return;
        }

        container.innerHTML = results.map(item => `
            <div class="search-result-item" data-route="${item.route}">
                <span class="search-result-cat">${item.category}</span>
                <span class="search-result-name">${item.name}</span>
            </div>
        `).join('');

        container.classList.add('active');

        // Click handlers
        container.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', () => {
                window.location.hash = el.dataset.route;
                container.classList.remove('active');
                document.getElementById('search-bar').value = '';
            });
        });
    }

    return { register, search, initSearchBar };
})();
