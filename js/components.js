/**
 * CalculaDeTudo - Sistema de Componentes Reutilizáveis
 * 
 * Factory functions para criar calculadoras de forma padronizada
 * com validação, feedback visual e resultados formatados.
 */

const CalcComponents = (() => {

    // ---- Formatação ----
    const fmt = {
        /** Formata número como moeda brasileira */
        currency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        },

        /** Formata número com casas decimais */
        number(value, decimals = 2) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(value);
        },

        /** Formata porcentagem */
        percent(value, decimals = 2) {
            return fmt.number(value, decimals) + '%';
        }
    };

    // ---- Validação ----
    function validateInputs(form) {
        let valid = true;
        const inputs = form.querySelectorAll('.form-input[required], .form-select[required]');

        inputs.forEach(input => {
            const error = input.parentElement.querySelector('.form-error-message');
            const val = parseFloat(input.value);
            const min = parseFloat(input.getAttribute('min'));
            const max = parseFloat(input.getAttribute('max'));

            if (!input.value || (input.type === 'number' && isNaN(val))) {
                input.classList.add('error');
                if (error) {
                    error.textContent = 'Este campo é obrigatório';
                    error.classList.add('visible');
                }
                valid = false;
            } else if (!isNaN(min) && val < min) {
                input.classList.add('error');
                if (error) {
                    error.textContent = `Valor mínimo: ${min}`;
                    error.classList.add('visible');
                }
                valid = false;
            } else if (!isNaN(max) && val > max) {
                input.classList.add('error');
                if (error) {
                    error.textContent = `Valor máximo: ${max}`;
                    error.classList.add('visible');
                }
                valid = false;
            } else {
                input.classList.remove('error');
                if (error) error.classList.remove('visible');
            }
        });

        return valid;
    }

    /** Limpa todos os campos e erros do formulário */
    function clearForm(form) {
        form.querySelectorAll('.form-input, .form-select').forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
            input.classList.remove('error');
        });
        form.querySelectorAll('.form-error-message').forEach(e => e.classList.remove('visible'));
    }

    // ---- Toast ----
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = '0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ---- Gerador de Página de Calculadora ----

    /**
     * Cria uma página de calculadora completa.
     * @param {Object} config
     * @param {string} config.title - Título da calculadora
     * @param {string} config.description - Descrição (SEO)
     * @param {string} config.category - Nome da categoria
     * @param {string} config.categorySlug - Slug da categoria para link
     * @param {Array} config.fields - Campos do formulário
     * @param {Function} config.calculate - Função de cálculo
     * @param {Function} config.renderResult - Função para renderizar resultado
     * @returns {string} HTML da página
     */
    function createCalculatorPage(config) {
        const fieldsHTML = config.fields.map(field => createField(field)).join('');

        return `
            <div class="calc-page">
                <nav class="calc-breadcrumb" aria-label="Breadcrumb">
                    <a href="#/">Início</a>
                    <span class="sep">›</span>
                    <a href="#/categoria/${config.categorySlug}">${config.category}</a>
                    <span class="sep">›</span>
                    <span>${config.title}</span>
                </nav>

                <header class="calc-header">
                    <h1 class="calc-title">${config.title}</h1>
                    <p class="calc-description">${config.description}</p>
                </header>

                <div class="calc-form ${config.formClass || ''}" id="calc-form">
                    ${fieldsHTML}
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary" id="btn-calculate">
                            Calcular
                        </button>
                        <button type="button" class="btn btn-secondary" id="btn-clear">
                            Limpar
                        </button>
                    </div>
                </div>

                <div class="calc-result" id="calc-result">
                    <!-- result rendered here -->
                </div>
            </div>
        `;
    }

    /**
     * Cria um campo de formulário
     */
    function createField(field) {
        const id = `field-${field.id}`;
        const required = field.required !== false ? 'required' : '';
        
        let inputHTML;

        switch (field.type) {
            case 'select':
                const options = field.options.map(opt => {
                    const val = typeof opt === 'object' ? opt.value : opt;
                    const label = typeof opt === 'object' ? opt.label : opt;
                    return `<option value="${val}">${label}</option>`;
                }).join('');
                inputHTML = `<select class="form-select form-input" id="${id}" ${required}><option value="">Selecione...</option>${options}</select>`;
                break;

            case 'date':
                inputHTML = `<input type="date" class="form-input" id="${id}" ${required}>`;
                break;

            default:
                const step = field.step || 'any';
                const min = field.min !== undefined ? `min="${field.min}"` : '';
                const max = field.max !== undefined ? `max="${field.max}"` : '';
                const placeholder = field.placeholder || '';
                inputHTML = `<input type="number" class="form-input" id="${id}" placeholder="${placeholder}" step="${step}" ${min} ${max} ${required}>`;
        }

        return `
            <div class="form-group">
                <label class="form-label" for="${id}">${field.label}</label>
                ${inputHTML}
                ${field.hint ? `<span class="form-hint">${field.hint}</span>` : ''}
                <span class="form-error-message"></span>
            </div>
        `;
    }

    /**
     * Inicializa eventos da calculadora após inserir no DOM
     */
    function initCalculator(config) {
        const form = document.getElementById('calc-form');
        const resultDiv = document.getElementById('calc-result');
        const btnCalc = document.getElementById('btn-calculate');
        const btnClear = document.getElementById('btn-clear');

        if (!form || !btnCalc) return;

        btnCalc.addEventListener('click', () => {
            if (!validateInputs(form)) {
                showToast('Preencha todos os campos obrigatórios', 'error');
                return;
            }

            // Coleta valores
            const values = {};
            config.fields.forEach(field => {
                const el = document.getElementById(`field-${field.id}`);
                if (el) {
                    values[field.id] = field.type === 'select' || field.type === 'date'
                        ? el.value
                        : parseFloat(el.value);
                }
            });

            try {
                const result = config.calculate(values);
                resultDiv.innerHTML = config.renderResult(result);
                resultDiv.classList.add('active');
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (err) {
                showToast('Erro no cálculo: ' + err.message, 'error');
            }
        });

        btnClear.addEventListener('click', () => {
            clearForm(form);
            resultDiv.classList.remove('active');
            resultDiv.innerHTML = '';
        });

        // Enter key to calculate
        form.addEventListener('keypress', e => {
            if (e.key === 'Enter') btnCalc.click();
        });
    }

    // ---- Renderizadores de resultado ----

    /** Resultado simples com valor principal e detalhes */
        return `
            <div class="result-header">
                <div class="result-title">${mainLabel}</div>
                <button class="btn-copy-result" title="Copiar resultados" onclick="CalcComponents.copyResult(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
            <div class="result-value">${mainValue}</div>
            ${details.length ? `<div class="result-details">${detailsHTML}</div>` : ''}
        `;
    }

    /** Resultado com tabela */
        return `
            <div class="result-header">
                <div class="result-title">${mainLabel}</div>
                <button class="btn-copy-result" title="Copiar resultados" onclick="CalcComponents.copyResult(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
            <div class="result-value">${mainValue}</div>
            ${details.length ? `<div class="result-details">${detailsHTML}</div>` : ''}
            <div class="result-table-container">
                <table class="result-table">
                    <thead><tr>${headerHTML}</tr></thead>
                    <tbody>${rowsHTML}</tbody>
                </table>
            </div>
        `;
    }

    /** Copia o texto do resultado para a área de transferência */
    function copyResult(btn) {
        const resultDiv = btn.closest('#calc-result');
        if (!resultDiv) return;

        // Clone to not copy the button itself
        const clone = resultDiv.cloneNode(true);
        const copyBtn = clone.querySelector('.btn-copy-result');
        if (copyBtn) copyBtn.remove();

        const text = clone.innerText.trim();
        navigator.clipboard.writeText(text).then(() => {
            showToast('Resultado copiado!', 'success');
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
        });
    }

    // ---- Gerador de Página de Categoria ----

    function createCategoryPage(config) {
        const itemsHTML = config.items.map(item => `
            <a href="#${item.route}" class="calc-list-item">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </a>
        `).join('');

        return `
            <div class="category-page">
                <nav class="calc-breadcrumb" aria-label="Breadcrumb">
                    <a href="#/">Início</a>
                    <span class="sep">›</span>
                    <span>${config.title}</span>
                </nav>
                <header class="category-page-header">
                    <div class="category-page-icon" style="background: ${config.colorLight}; color: ${config.color};">
                        ${config.icon}
                    </div>
                    <h1 class="category-page-title">${config.title}</h1>
                    <p class="category-page-desc">${config.description}</p>
                </header>
                <div class="calc-list-grid">
                    ${itemsHTML}
                </div>
            </div>
        `;
    }

    // Expose public API
    return {
        fmt,
        validateInputs,
        clearForm,
        showToast,
        createCalculatorPage,
        initCalculator,
        renderSimpleResult,
        renderTableResult,
        createCategoryPage,
        createField
    };

})();
