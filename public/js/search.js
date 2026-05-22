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

    /** Busca nas calculadoras registradas com algoritmo de relevância */
    function search(query) {
        if (!query || query.length < 2) return [];

        const normalized = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const words = normalized.split(/\s+/).filter(w => w.length > 0);

        return registry
            .map(item => {
                const name = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const category = item.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const keywords = (item.keywords || []).map(k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
                
                let score = 0;

                // 1. Exact name match
                if (name === normalized) score += 100;
                
                // 2. Name starts with query
                if (name.startsWith(normalized)) score += 50;
                
                // 3. Name contains query
                if (name.includes(normalized)) score += 30;
                
                // 4. Word matches in name
                words.forEach(word => {
                    if (name.includes(word)) score += 10;
                });

                // 5. Category match
                if (category.includes(normalized)) score += 5;

                // 6. Keywords match
                keywords.forEach(kw => {
                    if (kw === normalized) score += 20;
                    else if (kw.includes(normalized)) score += 10;
                });

                return { item, score };
            })
            .filter(res => res.score > 0)
            .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
            .map(res => res.item)
            .slice(0, 15);
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

    return { register, search, initSearchBar, calculadoras: registry };
})();

window.CalcSearch = CalcSearch;
