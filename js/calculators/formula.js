/**
 * CalculaDeTudo - Módulo Super Calculadora de Fórmulas
 * 
 * Permite criar fórmulas personalizadas nas modalidades:
 * 1. Convencional
 * 2. Científica
 * 3. Financeira
 */

const FormulaModule = (() => {
    const { fmt, renderSimpleResult, showToast } = CalcComponents;

    // Registrar no sistema de busca para que seja encontrada
    if (typeof CalcSearch !== 'undefined') {
        CalcSearch.register({
            name: 'Super Calculadora (Fórmulas Personalizadas)',
            route: '/cientifica/calculadora-formulas',
            category: 'Científica',
            categorySlug: 'cientifica',
            keywords: ['fórmula', 'calculadora', 'personalizada', 'convencional', 'cientifica', 'financeira', 'expressão', 'matemática', 'variáveis', 'criar']
        });
    }

    // Fórmulas predefinidas para cada modalidade
    const predefinedFormulas = {
        convencional: [
            { name: 'Regra de Três Simples', formula: '(a * b) / c', desc: 'Calcula o valor desconhecido correspondente à proporção.' },
            { name: 'Porcentagem de Aumento', formula: 'valor * (1 + porcentagem / 100)', desc: 'Calcula o valor final após acréscimo percentual.' },
            { name: 'Porcentagem de Desconto', formula: 'valor * (1 - porcentagem / 100)', desc: 'Calcula o valor final após desconto percentual.' },
            { name: 'Média Aritmética de 3 Valores', formula: '(x + y + z) / 3', desc: 'Média simples dos três valores fornecidos.' },
            { name: 'Índice de Massa Corporal (IMC)', formula: 'peso / altura^2', desc: 'Cálculo padrão do IMC.' }
        ],
        cientifica: [
            { name: 'Teorema de Pitágoras (Hipotenusa)', formula: 'sqrt(a^2 + b^2)', desc: 'Calcula a hipotenusa de um triângulo retângulo.' },
            { name: 'Área do Círculo', formula: 'pi * r^2', desc: 'Calcula a área a partir do raio.' },
            { name: 'Delta da Equação de 2º Grau', formula: 'b^2 - 4 * a * c', desc: 'Calcula o discriminante (Δ) de uma equação quadrática.' },
            { name: 'Conversão Celsius para Fahrenheit', formula: 'celsius * 1.8 + 32', desc: 'Converte temperatura de ºC para ºF.' },
            { name: 'Volume de uma Esfera', formula: '(4/3) * pi * r^3', desc: 'Calcula o volume total da esfera.' },
            { name: 'Trigonometria Livre', formula: 'sin(angulo_rad) + cos(angulo_rad)', desc: 'Soma do seno e cosseno de um ângulo.' }
        ],
        financeira: [
            { name: 'Juros Simples (Montante)', formula: 'PV * (1 + taxa * n)', desc: 'Calcula o montante total com taxa e prazo lineares.' },
            { name: 'Juros Compostos (Montante)', formula: 'PV * (1 + taxa)^n', desc: 'Calcula o montante total acumulado sob juros compostos.' },
            { name: 'Valor Presente (Juros Compostos)', formula: 'FV / (1 + taxa)^n', desc: 'Calcula o valor atual necessário para atingir o montante futuro.' },
            { name: 'Margem de Lucro (%)', formula: '((Venda - Custo) / Venda) * 100', desc: 'Calcula o percentual de lucro sobre o preço de venda.' },
            { name: 'Amortização Price (Prestação)', formula: 'PV * (taxa * (1 + taxa)^n) / ((1 + taxa)^n - 1)', desc: 'Calcula o valor da parcela fixa na tabela Price.' },
            { name: 'Retorno sobre Investimento (ROI)', formula: '((Ganho - Investimento) / Investimento) * 100', desc: 'Mede o retorno financeiro em porcentagem.' }
        ]
    };

    function formulaCalculator() {
        return {
            html: `
                <div class="calc-page">
                    <nav class="calc-breadcrumb" aria-label="Breadcrumb">
                        <a href="#/">Início</a>
                        <span class="sep">›</span>
                        <a href="#/categoria/cientifica">Científica</a>
                        <span class="sep">›</span>
                        <span>Super Calculadora de Fórmulas</span>
                    </nav>



                    <!-- ============ MODALITY TABS ============ -->
                    <div class="calculator-tabs" role="tablist">
                        <button class="tab-btn active" data-tab="convencional" role="tab" aria-selected="true">
                            <span class="tab-icon">🧮</span>
                            <span class="tab-label">Convencional</span>
                        </button>
                        <button class="tab-btn" data-tab="cientifica" role="tab" aria-selected="false">
                            <span class="tab-icon">🔬</span>
                            <span class="tab-label">Científica</span>
                        </button>
                        <button class="tab-btn" data-tab="financeira" role="tab" aria-selected="false">
                            <span class="tab-icon">💰</span>
                            <span class="tab-label">Financeira</span>
                        </button>
                    </div>

                    <!-- ============ MAIN CALCULATOR INTERFACE ============ -->
                    <div class="calc-form formula-calculator-form" id="calc-form">
                        
                        <!-- Predefined Formulas Dropdown -->
                        <div class="form-group">
                            <label class="form-label" for="predefined-select">Exemplos e Fórmulas Prontas</label>
                            <select class="form-select" id="predefined-select">
                                <option value="">Selecione uma fórmula pronta ou crie a sua abaixo...</option>
                            </select>
                            <span class="form-hint" id="predefined-desc">Você pode selecionar um exemplo ou digitar livremente no campo abaixo.</span>
                        </div>

                        <!-- Formula Text Input -->
                        <div class="form-group">
                            <label class="form-label" for="formula-input">Sua Fórmula Personalizada</label>
                            <input type="text" class="form-input" id="formula-input" placeholder="Ex: a * b + c" style="font-family: monospace; font-size: 1.15rem; letter-spacing: 0.05em; font-weight: 600;" required>
                            <span class="form-hint">Dica: Use letras ou palavras (ex: PV, taxa, x, y) como suas variáveis.</span>
                        </div>

                        <!-- Virtual Keyboards -->
                        <div class="calc-keyboard-container">
                            <div class="calc-keyboard-title">Teclado de Atalho Rápido</div>
                            
                            <div class="keyboard-layout-wrapper">
                                <!-- Standard Numeric Pad (Always visible on left) -->
                                <div class="keyboard-numpad">
                                    <button type="button" class="calc-key" data-insert="7">7</button>
                                    <button type="button" class="calc-key" data-insert="8">8</button>
                                    <button type="button" class="calc-key" data-insert="9">9</button>
                                    <button type="button" class="calc-key" data-insert="4">4</button>
                                    <button type="button" class="calc-key" data-insert="5">5</button>
                                    <button type="button" class="calc-key" data-insert="6">6</button>
                                    <button type="button" class="calc-key" data-insert="1">1</button>
                                    <button type="button" class="calc-key" data-insert="2">2</button>
                                    <button type="button" class="calc-key" data-insert="3">3</button>
                                    <button type="button" class="calc-key" data-insert="0">0</button>
                                    <button type="button" class="calc-key" data-insert=".">.</button>
                                    <button type="button" class="calc-key clear" id="btn-key-clear">C</button>
                                </div>

                                <!-- Contextual Operators Pad (Changes on right) -->
                                <div class="keyboard-contextual">
                                    <!-- Standard Keys Panel -->
                                    <div class="keyboard-panel active" id="keys-convencional">
                                        <div class="calc-keyboard-ops">
                                            <button type="button" class="calc-key op" data-insert="+">+</button>
                                            <button type="button" class="calc-key op" data-insert="-">-</button>
                                            <button type="button" class="calc-key op" data-insert="*">*</button>
                                            <button type="button" class="calc-key op" data-insert="/">/</button>
                                            <button type="button" class="calc-key op" data-insert="(">(</button>
                                            <button type="button" class="calc-key op" data-insert=")">)</button>
                                            <button type="button" class="calc-key op" data-insert="%" style="grid-column: span 2;">%</button>
                                        </div>
                                    </div>

                                    <!-- Scientific Keys Panel -->
                                    <div class="keyboard-panel" id="keys-cientifica" style="display: none;">
                                        <div class="calc-keyboard-ops">
                                            <button type="button" class="calc-key op" data-insert="sin(">sin</button>
                                            <button type="button" class="calc-key op" data-insert="cos(">cos</button>
                                            <button type="button" class="calc-key op" data-insert="tan(">tan</button>
                                            <button type="button" class="calc-key op" data-insert="sqrt(">√</button>
                                            <button type="button" class="calc-key op" data-insert="^">^</button>
                                            <button type="button" class="calc-key op" data-insert="log(">log</button>
                                            <button type="button" class="calc-key op" data-insert="ln(">ln</button>
                                            <button type="button" class="calc-key op" data-insert="pi">π</button>
                                            <button type="button" class="calc-key op" data-insert="e" style="grid-column: span 2;">e</button>
                                        </div>
                                    </div>

                                    <!-- Financial Keys Panel -->
                                    <div class="keyboard-panel" id="keys-financeira" style="display: none;">
                                        <div class="calc-keyboard-ops">
                                            <button type="button" class="calc-key op" data-insert="PV">PV</button>
                                            <button type="button" class="calc-key op" data-insert="FV">FV</button>
                                            <button type="button" class="calc-key op" data-insert="PMT">PMT</button>
                                            <button type="button" class="calc-key op" data-insert="taxa">taxa</button>
                                            <button type="button" class="calc-key op" data-insert="n">n</button>
                                            <button type="button" class="calc-key op" data-insert="^">^</button>
                                            <button type="button" class="calc-key op" data-insert="*">*</button>
                                            <button type="button" class="calc-key op" data-insert="/">/</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Dynamic Variable Fields -->
                        <div class="dynamic-variables-section">
                            <h3 class="variables-title">Variáveis Detectadas</h3>
                            <div id="variables-container">
                                <div class="variables-empty">Nenhuma variável detectada. Digite letras no campo de fórmula acima para criar variáveis.</div>
                            </div>
                        </div>

                        <!-- Buttons Group -->
                        <div class="btn-group" style="margin-top: var(--space-xl);">
                            <button type="button" class="btn btn-primary" id="btn-calculate" style="flex: 2;">
                                Calcular Fórmula
                            </button>
                            <button type="button" class="btn btn-secondary" id="btn-clear" style="flex: 1;">
                                Resetar
                            </button>
                        </div>
                    </div>

                    ${CalcComponents.renderAdSpace('formula-middle', 'horizontal')}

                    <!-- Results Output -->
                    <div class="calc-result" id="calc-result">
                        <!-- calculation results are rendered here -->
                    </div>

                    <style>
                        /* Estilos exclusivos para a Super Calculadora de Fórmulas */
                        .calculator-tabs {
                            display: flex;
                            justify-content: space-around;
                            gap: var(--space-md);
                            margin-bottom: var(--space-xl);
                            background: var(--color-bg);
                            padding: 6px;
                            border-radius: var(--radius-lg);
                            border: 1px solid var(--color-border-light);
                        }

                        .tab-btn {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: var(--space-xs);
                            padding: 14px 8px;
                            border-radius: var(--radius-md);
                            font-size: var(--font-size-sm);
                            font-weight: 600;
                            color: var(--color-text-secondary);
                            transition: all var(--transition-normal);
                            cursor: pointer;
                        }

                        .tab-btn:hover {
                            color: var(--color-text);
                            background: var(--color-surface-hover);
                        }

                        .tab-btn.active {
                            color: #fff;
                            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
                            box-shadow: 0 4px 14px var(--color-primary-glow);
                        }

                        .tab-icon {
                            font-size: 1.5rem;
                        }

                        .calc-keyboard-container {
                            margin-top: var(--space-md);
                            margin-bottom: var(--space-xl);
                            padding: var(--space-md);
                            background: var(--color-bg);
                            border-radius: var(--radius-md);
                            border: 1px solid var(--color-border-light);
                        }

                        .calc-keyboard-title {
                            font-size: var(--font-size-xs);
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                            color: var(--color-text-muted);
                            margin-bottom: var(--space-md);
                        }

                        .keyboard-layout-wrapper {
                            display: grid;
                            grid-template-columns: 3fr 2fr;
                            gap: 12px;
                        }

                        .keyboard-numpad {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 8px;
                        }

                        .keyboard-contextual {
                            height: 100%;
                        }

                        .calc-keyboard-ops {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 8px;
                            height: 100%;
                        }

                        @media (max-width: 480px) {
                            .keyboard-layout-wrapper {
                                grid-template-columns: 1fr;
                                gap: 12px;
                            }
                        }

                        .calc-key {
                            background: var(--color-surface);
                            border: 1px solid var(--color-border);
                            color: var(--color-text);
                            border-radius: var(--radius-sm);
                            padding: 12px;
                            font-size: var(--font-size-base);
                            font-weight: 700;
                            transition: all var(--transition-fast);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                        }

                        .calc-key:hover {
                            background: var(--color-surface-hover);
                            border-color: var(--color-primary);
                            transform: translateY(-1px);
                            box-shadow: var(--shadow-sm);
                        }

                        .calc-key:active {
                            transform: translateY(1px);
                        }

                        .calc-key.op {
                            background: var(--color-primary-light);
                            color: var(--color-primary);
                            border-color: transparent;
                        }

                        .calc-key.op:hover {
                            background: var(--color-primary);
                            color: #fff;
                        }

                        .calc-key.clear {
                            background: rgba(239, 68, 68, 0.1);
                            color: var(--color-error);
                            border-color: transparent;
                        }

                        .calc-key.clear:hover {
                            background: var(--color-error);
                            color: #fff;
                        }

                        .variables-title {
                            font-size: var(--font-size-base);
                            font-weight: 700;
                            margin-bottom: var(--space-md);
                            color: var(--color-text);
                            border-bottom: 2px solid var(--color-border-light);
                            padding-bottom: var(--space-xs);
                        }

                        .variables-empty {
                            padding: var(--space-xl);
                            background: var(--color-bg);
                            border-radius: var(--radius-md);
                            text-align: center;
                            color: var(--color-text-muted);
                            font-size: var(--font-size-sm);
                            border: 1px dashed var(--color-border);
                        }

                        .var-row-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                            gap: var(--space-md);
                        }

                        .animate-slide-up {
                            animation: var-slide-up 0.25s ease forwards;
                        }

                        @keyframes var-slide-up {
                            from { opacity: 0; transform: translateY(8px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    </style>
                </div>
            `,
            init: () => {
                const tabs = document.querySelectorAll('.tab-btn');
                const formulaInput = document.getElementById('formula-input');
                const predefinedSelect = document.getElementById('predefined-select');
                const predefinedDesc = document.getElementById('predefined-desc');
                const variablesContainer = document.getElementById('variables-container');
                const btnCalc = document.getElementById('btn-calculate');
                const btnClear = document.getElementById('btn-clear');
                const resultDiv = document.getElementById('calc-result');

                let currentTab = 'convencional';
                let renderedVars = [];

                // 1. Alternar entre as Abas (Modalidades)
                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        tabs.forEach(t => {
                            t.classList.remove('active');
                            t.setAttribute('aria-selected', 'false');
                        });
                        tab.classList.add('active');
                        tab.setAttribute('aria-selected', 'true');

                        const tabId = tab.dataset.tab;
                        currentTab = tabId;

                        // Esconder/Mostrar teclados correspondentes
                        document.querySelectorAll('.keyboard-panel').forEach(p => {
                            p.style.display = 'none';
                        });
                        const currentKeysPanel = document.getElementById(`keys-${tabId}`);
                        if (currentKeysPanel) currentKeysPanel.style.display = 'block';

                        // Atualizar a lista de fórmulas predefinidas
                        populatePredefinedFormulas(tabId);
                        
                        // Resetar fórmula e variáveis ao trocar de aba
                        formulaInput.value = '';
                        predefinedDesc.textContent = 'Você pode selecionar um exemplo ou digitar livremente no campo abaixo.';
                        updateVariables();
                        resultDiv.classList.remove('active');
                        resultDiv.innerHTML = '';
                    });
                });

                // Popular Fórmulas Predefinidas
                function populatePredefinedFormulas(tabId) {
                    predefinedSelect.innerHTML = '<option value="">Selecione uma fórmula pronta ou crie a sua abaixo...</option>';
                    const formulas = predefinedFormulas[tabId] || [];
                    formulas.forEach((item, index) => {
                        const opt = document.createElement('option');
                        opt.value = index;
                        opt.textContent = item.name;
                        predefinedSelect.appendChild(opt);
                    });
                }

                // Quando selecionar uma fórmula pronta
                predefinedSelect.addEventListener('change', () => {
                    const idx = predefinedSelect.value;
                    if (idx === '') {
                        formulaInput.value = '';
                        predefinedDesc.textContent = 'Você pode selecionar um exemplo ou digitar livremente no campo abaixo.';
                        updateVariables();
                        return;
                    }

                    const selected = predefinedFormulas[currentTab][idx];
                    if (selected) {
                        formulaInput.value = selected.formula;
                        predefinedDesc.textContent = selected.desc;
                        // Forçar atualização do container de variáveis
                        updateVariables();
                    }
                });

                // 2. Extrair variáveis e renderizar inputs dinamicamente
                function extractVariables(expr) {
                    if (!expr) return [];
                    // Encontrar palavras que começam com letras e podem ter números
                    const words = expr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
                    
                    // Lista de palavras reservadas matemáticas (não são variáveis)
                    const mathReserved = new Set([
                        'sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'abs', 'pow',
                        'pi', 'e', 'Math', 'PI', 'E', 'log10'
                    ]);

                    const vars = new Set();
                    words.forEach(w => {
                        if (!mathReserved.has(w)) {
                            vars.add(w);
                        }
                    });

                    return Array.from(vars);
                }

                function updateVariables() {
                    const formula = formulaInput.value;
                    const vars = extractVariables(formula);

                    // Só atualiza o DOM se a lista de variáveis mudar
                    const sortedVars = [...vars].sort();
                    const sortedRendered = [...renderedVars].sort();

                    if (JSON.stringify(sortedVars) === JSON.stringify(sortedRendered)) {
                        return; // Nenhuma mudança de variáveis detectada, não reconstrói
                    }

                    renderedVars = vars;

                    if (vars.length === 0) {
                        variablesContainer.innerHTML = `<div class="variables-empty">Nenhuma variável detectada. Digite letras no campo de fórmula acima para criar variáveis.</div>`;
                        return;
                    }

                    let gridHTML = '<div class="var-row-grid animate-slide-up">';
                    vars.forEach(v => {
                        gridHTML += `
                            <div class="form-group">
                                <label class="form-label" for="var-${v}">Valor para <strong>${v}</strong></label>
                                <input type="number" step="any" class="form-input var-input" id="var-${v}" data-var="${v}" placeholder="Digite o valor..." required>
                                <span class="form-error-message"></span>
                            </div>
                        `;
                    });
                    gridHTML += '</div>';
                    variablesContainer.innerHTML = gridHTML;
                }

                // Escutar eventos de digitação no campo de fórmula
                formulaInput.addEventListener('input', updateVariables);

                // 3. Teclado Virtual (Inserção de caracteres)
                document.querySelectorAll('.calc-key[data-insert]').forEach(key => {
                    key.addEventListener('click', (e) => {
                        e.preventDefault();
                        const insertText = key.dataset.insert;
                        
                        // Pegar posição do cursor
                        const start = formulaInput.selectionStart;
                        const end = formulaInput.selectionEnd;
                        const val = formulaInput.value;
                        
                        formulaInput.value = val.substring(0, start) + insertText + val.substring(end);
                        
                        // Focar de volta no input e ajustar cursor
                        formulaInput.focus();
                        formulaInput.selectionStart = formulaInput.selectionEnd = start + insertText.length;
                        
                        updateVariables();
                    });
                });

                // Botão de Limpar Teclado Comum
                const clearBtn = document.getElementById('btn-key-clear');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        formulaInput.value = '';
                        updateVariables();
                    });
                }

                // 4. Executar o cálculo matemático de forma segura
                btnCalc.addEventListener('click', () => {
                    const formula = formulaInput.value.trim();
                    if (!formula) {
                        showToast('Por favor, defina uma fórmula primeiro!', 'error');
                        return;
                    }

                    // Validar inputs de variáveis gerados
                    const varInputs = variablesContainer.querySelectorAll('.var-input');
                    let allValid = true;
                    const varValues = {};

                    varInputs.forEach(input => {
                        const valStr = input.value.trim();
                        const errSpan = input.parentElement.querySelector('.form-error-message');
                        
                        if (!valStr || isNaN(parseFloat(valStr))) {
                            input.classList.add('error');
                            if (errSpan) {
                                errSpan.textContent = 'Informe um valor numérico válido';
                                errSpan.classList.add('visible');
                            }
                            allValid = false;
                        } else {
                            input.classList.remove('error');
                            if (errSpan) errSpan.classList.remove('visible');
                            varValues[input.dataset.var] = parseFloat(valStr);
                        }
                    });

                    if (!allValid) {
                        showToast('Preencha os valores de todas as variáveis criadas!', 'error');
                        return;
                    }

                    try {
                        // Construir representação visual do cálculo substituído
                        let substitutedExpr = formula;
                        
                        // 1. Substituir variáveis pelos valores (com cuidado de limites de palavra \b)
                        Object.keys(varValues).sort((a,b) => b.length - a.length).forEach(v => {
                            const val = varValues[v];
                            substitutedExpr = substitutedExpr.replace(new RegExp('\\b' + v + '\\b', 'g'), val);
                        });

                        // 2. Traduzir funções científicas e operadores para JS matemático
                        let mathJsExpr = formula;
                        
                        // Substituir potência '^' por '**'
                        mathJsExpr = mathJsExpr.replace(/\^/g, '**');
                        substitutedExpr = substitutedExpr.replace(/\^/g, '**');

                        // Substituir constantes pi e e
                        mathJsExpr = mathJsExpr.replace(/\bpi\b/gi, 'Math.PI');
                        mathJsExpr = mathJsExpr.replace(/\be\b/gi, 'Math.E');

                        substitutedExpr = substitutedExpr.replace(/\bpi\b/gi, 'Math.PI');
                        substitutedExpr = substitutedExpr.replace(/\be\b/gi, 'Math.E');

                        // Substituir funções trigonométricas e científicas comuns
                        const functions = ['sin', 'cos', 'tan', 'sqrt', 'log10', 'log', 'ln', 'abs'];
                        functions.forEach(f => {
                            const regex = new RegExp('\\b' + f + '\\b', 'g');
                            let target = 'Math.' + f;
                            if (f === 'ln') target = 'Math.log'; // em matemática natural 'ln' = Math.log
                            if (f === 'log') target = 'Math.log10'; // 'log' padrão de base 10

                            mathJsExpr = mathJsExpr.replace(regex, target);
                            substitutedExpr = substitutedExpr.replace(regex, target);
                        });

                        // Substituir variáveis na expressão de execução JS
                        Object.keys(varValues).sort((a,b) => b.length - a.length).forEach(v => {
                            const val = varValues[v];
                            mathJsExpr = mathJsExpr.replace(new RegExp('\\b' + v + '\\b', 'g'), val);
                        });

                        // 3. Validação de Segurança - Garante que a expressão final seja 100% segura para rodar
                        // Remove todas as chamadas Math.xxx válidas do string temporário de verificação
                        let safetyCheckStr = mathJsExpr;
                        safetyCheckStr = safetyCheckStr.replace(/Math\.(sin|cos|tan|sqrt|log10|log|abs|PI|E)/g, '');
                        
                        // Garante que o restante do código contenha apenas números, operadores básicos, vírgulas, pontos e parênteses
                        const isSafe = /^[0-9\s.+\-*/%(),]*$/.test(safetyCheckStr);
                        if (!isSafe) {
                            throw new Error('Expressão contém caracteres inválidos ou inseguros. Use apenas letras como variáveis e operadores matemáticos padrão.');
                        }

                        // Substitui vírgulas por pontos se houver vírgula como decimal nas variáveis
                        mathJsExpr = mathJsExpr.replace(/(\d),(\d)/g, '$1.$2');

                        // 4. Executar e calcular resultado
                        const calculateFn = new Function('return ' + mathJsExpr);
                        const resultVal = calculateFn();

                        if (resultVal === undefined || resultVal === null || isNaN(resultVal)) {
                            throw new Error('Cálculo inválido ou indefinido (divisão por zero ou indeterminação).');
                        }

                        // Formatar o resultado
                        const formattedResult = fmt.number(resultVal, 4);

                        // Montar linhas de detalhes com os valores fornecidos
                        const details = [
                            { label: 'Fórmula Base', value: `<code>${formula}</code>` },
                            { label: 'Cálculo com Valores', value: `<code>${substitutedExpr}</code>` }
                        ];

                        Object.keys(varValues).forEach(v => {
                            details.push({ label: `Variável ${v}`, value: fmt.number(varValues[v], 4) });
                        });

                        // Renderizar resultado usando o componente padrão
                        resultDiv.innerHTML = renderSimpleResult(
                            'Resultado Calculado',
                            formattedResult,
                            details
                        );

                        resultDiv.classList.add('active');
                        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                    } catch (err) {
                        showToast(err.message, 'error');
                    }
                });

                // Resetar formulário
                btnClear.addEventListener('click', () => {
                    formulaInput.value = '';
                    predefinedSelect.selectedIndex = 0;
                    predefinedDesc.textContent = 'Você pode selecionar um exemplo ou digitar livremente no campo abaixo.';
                    updateVariables();
                    resultDiv.classList.remove('active');
                    resultDiv.innerHTML = '';
                });

                // Carregar as fórmulas predefinidas da aba convencional inicialmente
                populatePredefinedFormulas('convencional');
            }
        };
    }

    function embedHome(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Obter objeto calculadora
        const calc = formulaCalculator();

        // Remover o breadcrumb de forma limpa, preservando a estrutura de divs wrappers intacta
        const cleanHtml = calc.html.replace(/<nav class="calc-breadcrumb"[\s\S]*?<\/nav>/, '');

        // Inserir o HTML íntegro (com a div wrapper calc-page e seu fechamento)
        container.innerHTML = cleanHtml;

        // Inicializar listeners de eventos
        requestAnimationFrame(() => {
            calc.init();
        });
    }

    const routes = {};

    return { routes, embedHome };
})();

window.FormulaModule = FormulaModule;
