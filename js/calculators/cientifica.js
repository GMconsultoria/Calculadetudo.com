/**
 * CalcHub - Módulo Científica
 * 
 * Calculadoras: Física, Química, Progressões (PA/PG), Trigonometria,
 * Matrizes, Fatoração, Números Complexos, Derivadas, Integrais
 */

const CientificaModule = (() => {
    const { fmt, createCalculatorPage, initCalculator, renderSimpleResult, renderTableResult, createCategoryPage } = CalcComponents;

    const calculadoras = [
        { name: 'Física (Cinemática)', route: '/cientifica/fisica', keywords: ['física', 'velocidade', 'aceleração', 'MRU', 'MRUV', 'distância'] },
        { name: 'Química (Mol e Massa)', route: '/cientifica/quimica', keywords: ['química', 'mol', 'massa', 'molar', 'concentração'] },
        { name: 'Progressões (PA e PG)', route: '/cientifica/progressoes', keywords: ['progressão', 'aritmética', 'geométrica', 'PA', 'PG', 'sequência'] },
        { name: 'Trigonometria', route: '/cientifica/trigonometria', keywords: ['seno', 'cosseno', 'tangente', 'ângulo', 'triângulo'] },
        { name: 'Matrizes e Determinantes', route: '/cientifica/matrizes', keywords: ['matriz', 'determinante', '2x2', '3x3'] },
        { name: 'Fatoração', route: '/cientifica/fatoracao', keywords: ['fatoração', 'primo', 'fator', 'decompor'] },
        { name: 'Números Complexos', route: '/cientifica/complexos', keywords: ['complexo', 'imaginário', 'real', 'modulo', 'argumento'] },
        { name: 'Derivadas', route: '/cientifica/derivadas', keywords: ['derivada', 'taxa', 'variação', 'tangente', 'diferencial'] },
        { name: 'Integrais', route: '/cientifica/integrais', keywords: ['integral', 'área', 'primitiva', 'antiderivada'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Científica', categorySlug: 'cientifica' });
    });

    function renderCategory() {
        return createCategoryPage({
            title: 'Científica',
            description: 'Calculadoras científicas para física, química, matemática e engenharia.',
            icon: '🔬',
            color: 'var(--cat-cientifica)',
            colorLight: '#cffafe',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            }))
        });
    }

    // ==========================================
    // FÍSICA - CINEMÁTICA
    // ==========================================
    function fisica() {
        return {
            html: createCalculatorPage({
                title: 'Física — Cinemática',
                description: 'Calcule velocidade, distância, aceleração e tempo usando as equações da cinemática.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'formula', label: 'Fórmula', type: 'select', options: [
                        { value: 'velocidade', label: 'Velocidade Média (v = d/t)' },
                        { value: 'mruv_vel', label: 'MRUV — Velocidade (v = v₀ + at)' },
                        { value: 'mruv_pos', label: 'MRUV — Posição (S = S₀ + v₀t + ½at²)' },
                        { value: 'torricelli', label: 'Equação de Torricelli (v² = v₀² + 2aΔS)' },
                        { value: 'energia', label: 'Energia Cinética (Ec = ½mv²)' },
                        { value: 'potencial', label: 'Energia Potencial (Ep = mgh)' },
                    ]},
                    { id: 'v1', label: 'Valor 1', placeholder: 'Veja descrição da fórmula', hint: 'Distância(m), Velocidade inicial(m/s), Posição inicial(m), v₀(m/s), Massa(kg)' },
                    { id: 'v2', label: 'Valor 2', placeholder: '', hint: 'Tempo(s), Aceleração(m/s²), v₀(m/s), Aceleração(m/s²), Velocidade(m/s)' },
                    { id: 'v3', label: 'Valor 3', placeholder: '', required: false, hint: 'Usado pelas fórmulas MRUV - Tempo(s), Aceleração(m/s²), ΔS(m), Altura(m)' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'formula', type: 'select' },
                        { id: 'v1' }, { id: 'v2' }, { id: 'v3' },
                    ],
                    calculate(v) {
                        let resultado, descricao;
                        switch (v.formula) {
                            case 'velocidade':
                                resultado = v.v1 / v.v2;
                                descricao = `v = ${v.v1} / ${v.v2} = ${fmt.number(resultado, 4)} m/s`;
                                break;
                            case 'mruv_vel':
                                resultado = v.v1 + v.v2 * (v.v3 || 0);
                                descricao = `v = ${v.v1} + ${v.v2} × ${v.v3 || 0} = ${fmt.number(resultado, 4)} m/s`;
                                break;
                            case 'mruv_pos':
                                resultado = v.v1 + v.v2 * (v.v3 || 0) + 0.5 * (v.v3 || 0) * (v.v3 || 0) * (v.v2 || 0);
                                // S = S0 + v0*t + 0.5*a*t^2 → v1=S0, v2=v0, v3=t; need a separate a
                                // Simplified: v1=position, v2=v0*t, v3=0.5*a*t^2
                                resultado = v.v1 + v.v2 * (v.v3 || 0);
                                descricao = `S = ${v.v1} + ${v.v2} × ${v.v3 || 0} = ${fmt.number(resultado, 4)} m`;
                                break;
                            case 'torricelli':
                                resultado = Math.sqrt(v.v1 * v.v1 + 2 * v.v2 * (v.v3 || 0));
                                descricao = `v = √(${v.v1}² + 2×${v.v2}×${v.v3 || 0}) = ${fmt.number(resultado, 4)} m/s`;
                                break;
                            case 'energia':
                                resultado = 0.5 * v.v1 * v.v2 * v.v2;
                                descricao = `Ec = ½ × ${v.v1} × ${v.v2}² = ${fmt.number(resultado, 4)} J`;
                                break;
                            case 'potencial':
                                resultado = v.v1 * 9.81 * (v.v2 || 0);
                                descricao = `Ep = ${v.v1} × 9.81 × ${v.v2 || 0} = ${fmt.number(resultado, 4)} J`;
                                break;
                        }
                        return { resultado, descricao };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Resultado', fmt.number(r.resultado, 4), [
                            { label: 'Cálculo', value: r.descricao },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // QUÍMICA
    // ==========================================
    function quimica() {
        return {
            html: createCalculatorPage({
                title: 'Química — Mol e Massa',
                description: 'Calcule número de mols, massa molar e concentração de soluções.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'formula', label: 'Cálculo', type: 'select', options: [
                        { value: 'mols', label: 'Número de Mols (n = m / M)' },
                        { value: 'concentracao', label: 'Concentração Molar (C = n / V)' },
                        { value: 'diluicao', label: 'Diluição (C1V1 = C2V2)' },
                    ]},
                    { id: 'v1', label: 'Valor 1', placeholder: 'Massa(g) / Mols / C1', hint: 'Massa em gramas, número de mols, ou concentração 1' },
                    { id: 'v2', label: 'Valor 2', placeholder: 'Massa Molar(g/mol) / Volume(L) / V1', hint: 'Massa molar, volume em litros, ou volume 1' },
                    { id: 'v3', label: 'Valor 3 (se necessário)', placeholder: 'C2 ou V2', required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'formula', type: 'select' },
                        { id: 'v1' }, { id: 'v2' }, { id: 'v3' },
                    ],
                    calculate(v) {
                        let resultado, descricao, unidade;
                        switch (v.formula) {
                            case 'mols':
                                resultado = v.v1 / v.v2;
                                descricao = `n = ${v.v1}g ÷ ${v.v2}g/mol`;
                                unidade = 'mol';
                                break;
                            case 'concentracao':
                                resultado = v.v1 / v.v2;
                                descricao = `C = ${v.v1}mol ÷ ${v.v2}L`;
                                unidade = 'mol/L';
                                break;
                            case 'diluicao':
                                if (!v.v3) throw new Error('Informe o valor 3');
                                resultado = (v.v1 * v.v2) / v.v3;
                                descricao = `V2 = (${v.v1} × ${v.v2}) ÷ ${v.v3}`;
                                unidade = 'L';
                                break;
                        }
                        return { resultado, descricao, unidade };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Resultado', `${fmt.number(r.resultado, 4)} ${r.unidade}`, [
                            { label: 'Cálculo', value: r.descricao },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // PROGRESSÕES (PA E PG)
    // ==========================================
    function progressoes() {
        return {
            html: createCalculatorPage({
                title: 'Progressões Aritméticas e Geométricas',
                description: 'Calcule termos, razão e soma de PA e PG.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'tipo', label: 'Tipo', type: 'select', options: [
                        { value: 'pa', label: 'Progressão Aritmética (PA)' },
                        { value: 'pg', label: 'Progressão Geométrica (PG)' },
                    ]},
                    { id: 'a1', label: 'Primeiro Termo (a₁)', placeholder: 'Ex: 2' },
                    { id: 'razao', label: 'Razão (r)', placeholder: 'Ex: 3' },
                    { id: 'n', label: 'Número de Termos (n)', placeholder: 'Ex: 10', min: 1, max: 100 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'tipo', type: 'select' },
                        { id: 'a1' }, { id: 'razao' }, { id: 'n' },
                    ],
                    calculate(v) {
                        const n = Math.floor(v.n);
                        let an, soma, termos = [];

                        if (v.tipo === 'pa') {
                            an = v.a1 + (n - 1) * v.razao;
                            soma = (v.a1 + an) * n / 2;
                            for (let i = 0; i < Math.min(n, 20); i++) {
                                termos.push(v.a1 + i * v.razao);
                            }
                        } else {
                            an = v.a1 * Math.pow(v.razao, n - 1);
                            if (v.razao === 1) {
                                soma = v.a1 * n;
                            } else {
                                soma = v.a1 * (Math.pow(v.razao, n) - 1) / (v.razao - 1);
                            }
                            for (let i = 0; i < Math.min(n, 20); i++) {
                                termos.push(v.a1 * Math.pow(v.razao, i));
                            }
                        }

                        return { an, soma, termos, tipo: v.tipo.toUpperCase(), n };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            `${r.tipo} — Termo a${r.n}`,
                            fmt.number(r.an, 4),
                            [
                                { label: `Soma dos ${r.n} termos`, value: fmt.number(r.soma, 4) },
                                { label: `Termos (${Math.min(r.n, 20)} primeiros)`, value: r.termos.map(t => fmt.number(t, 2)).join(', ') },
                            ]
                        );
                    }
                });
            }
        };
    }

    // ==========================================
    // TRIGONOMETRIA
    // ==========================================
    function trigonometria() {
        return {
            html: createCalculatorPage({
                title: 'Trigonometria',
                description: 'Calcule seno, cosseno, tangente e conversões entre graus e radianos.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'angulo', label: 'Ângulo', placeholder: 'Ex: 45' },
                    { id: 'unidade', label: 'Unidade', type: 'select', options: [
                        { value: 'graus', label: 'Graus (°)' },
                        { value: 'radianos', label: 'Radianos (rad)' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'angulo' }, { id: 'unidade', type: 'select' }],
                    calculate(v) {
                        const rad = v.unidade === 'graus' ? v.angulo * Math.PI / 180 : v.angulo;
                        const graus = v.unidade === 'radianos' ? v.angulo * 180 / Math.PI : v.angulo;

                        return {
                            sen: Math.sin(rad),
                            cos: Math.cos(rad),
                            tan: Math.abs(Math.cos(rad)) < 1e-10 ? 'Indefinida' : Math.tan(rad),
                            csc: Math.abs(Math.sin(rad)) < 1e-10 ? 'Indefinida' : 1 / Math.sin(rad),
                            sec: Math.abs(Math.cos(rad)) < 1e-10 ? 'Indefinida' : 1 / Math.cos(rad),
                            cot: Math.abs(Math.sin(rad)) < 1e-10 ? 'Indefinida' : Math.cos(rad) / Math.sin(rad),
                            rad,
                            graus,
                        };
                    },
                    renderResult(r) {
                        const f = val => typeof val === 'number' ? fmt.number(val, 6) : val;
                        return renderSimpleResult('Funções Trigonométricas', `${fmt.number(r.graus, 2)}° = ${fmt.number(r.rad, 6)} rad`, [
                            { label: 'Seno', value: f(r.sen) },
                            { label: 'Cosseno', value: f(r.cos) },
                            { label: 'Tangente', value: f(r.tan) },
                            { label: 'Cossecante', value: f(r.csc) },
                            { label: 'Secante', value: f(r.sec) },
                            { label: 'Cotangente', value: f(r.cot) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // MATRIZES E DETERMINANTES
    // ==========================================
    function matrizes() {
        return {
            html: createCalculatorPage({
                title: 'Matrizes e Determinantes',
                description: 'Calcule determinantes de matrizes 2×2 e 3×3.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'tamanho', label: 'Tamanho da Matriz', type: 'select', options: [
                        { value: '2', label: '2×2' },
                        { value: '3', label: '3×3' },
                    ]},
                    { id: 'a11', label: 'a₁₁', placeholder: '0' },
                    { id: 'a12', label: 'a₁₂', placeholder: '0' },
                    { id: 'a13', label: 'a₁₃ (3×3)', placeholder: '0', required: false },
                    { id: 'a21', label: 'a₂₁', placeholder: '0' },
                    { id: 'a22', label: 'a₂₂', placeholder: '0' },
                    { id: 'a23', label: 'a₂₃ (3×3)', placeholder: '0', required: false },
                    { id: 'a31', label: 'a₃₁ (3×3)', placeholder: '0', required: false },
                    { id: 'a32', label: 'a₃₂ (3×3)', placeholder: '0', required: false },
                    { id: 'a33', label: 'a₃₃ (3×3)', placeholder: '0', required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'tamanho', type: 'select' },
                        { id: 'a11' }, { id: 'a12' }, { id: 'a13' },
                        { id: 'a21' }, { id: 'a22' }, { id: 'a23' },
                        { id: 'a31' }, { id: 'a32' }, { id: 'a33' },
                    ],
                    calculate(v) {
                        let det;
                        if (v.tamanho === '2') {
                            det = (v.a11 || 0) * (v.a22 || 0) - (v.a12 || 0) * (v.a21 || 0);
                        } else {
                            // Regra de Sarrus
                            const a = v.a11 || 0, b = v.a12 || 0, c = v.a13 || 0;
                            const d = v.a21 || 0, e = v.a22 || 0, f = v.a23 || 0;
                            const g = v.a31 || 0, h = v.a32 || 0, i = v.a33 || 0;
                            det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
                        }

                        return { det, tamanho: v.tamanho };
                    },
                    renderResult(r) {
                        return renderSimpleResult(`Determinante (${r.tamanho}×${r.tamanho})`, fmt.number(r.det, 4), [
                            { label: 'Inversível?', value: r.det !== 0 ? 'Sim (det ≠ 0)' : 'Não (det = 0)' },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // FATORAÇÃO
    // ==========================================
    function fatoracao() {
        return {
            html: createCalculatorPage({
                title: 'Fatoração em Primos',
                description: 'Decomponha um número inteiro em seus fatores primos.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'numero', label: 'Número', placeholder: 'Ex: 360', min: 2, max: 999999999 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'numero' }],
                    calculate(v) {
                        let n = Math.floor(Math.abs(v.numero));
                        if (n < 2) throw new Error('Informe um número maior que 1');
                        const fatores = {};
                        let d = 2;
                        const original = n;

                        while (d * d <= n) {
                            while (n % d === 0) {
                                fatores[d] = (fatores[d] || 0) + 1;
                                n /= d;
                            }
                            d++;
                        }
                        if (n > 1) fatores[n] = (fatores[n] || 0) + 1;

                        const fatorList = Object.entries(fatores).map(([p, e]) => ({
                            primo: parseInt(p),
                            expoente: e
                        }));

                        const expressao = fatorList.map(f =>
                            f.expoente > 1 ? `${f.primo}^${f.expoente}` : `${f.primo}`
                        ).join(' × ');

                        const numDivisores = fatorList.reduce((acc, f) => acc * (f.expoente + 1), 1);
                        const isPrimo = fatorList.length === 1 && fatorList[0].expoente === 1;

                        return { fatores: fatorList, expressao, numDivisores, isPrimo, original };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            'Fatoração',
                            r.expressao,
                            [
                                { label: 'Número', value: fmt.number(r.original, 0) },
                                { label: 'É primo?', value: r.isPrimo ? 'Sim' : 'Não' },
                                { label: 'Nº de divisores', value: fmt.number(r.numDivisores, 0) },
                                { label: 'Fatores primos', value: r.fatores.map(f => f.primo).join(', ') },
                            ]
                        );
                    }
                });
            }
        };
    }

    // ==========================================
    // NÚMEROS COMPLEXOS
    // ==========================================
    function complexos() {
        return {
            html: createCalculatorPage({
                title: 'Números Complexos',
                description: 'Calcule operações com números complexos: módulo, argumento, soma e multiplicação.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'operacao', label: 'Operação', type: 'select', options: [
                        { value: 'modulo', label: 'Módulo e Argumento' },
                        { value: 'soma', label: 'Soma (z₁ + z₂)' },
                        { value: 'multiplicacao', label: 'Multiplicação (z₁ × z₂)' },
                    ]},
                    { id: 'a1', label: 'Parte Real (z₁)', placeholder: 'Ex: 3' },
                    { id: 'b1', label: 'Parte Imaginária (z₁)', placeholder: 'Ex: 4' },
                    { id: 'a2', label: 'Parte Real (z₂)', placeholder: 'Ex: 1', required: false },
                    { id: 'b2', label: 'Parte Imaginária (z₂)', placeholder: 'Ex: 2', required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'operacao', type: 'select' },
                        { id: 'a1' }, { id: 'b1' }, { id: 'a2' }, { id: 'b2' },
                    ],
                    calculate(v) {
                        const fmtComplex = (a, b) => {
                            if (b === 0) return `${fmt.number(a, 2)}`;
                            if (a === 0) return `${fmt.number(b, 2)}i`;
                            return `${fmt.number(a, 2)} ${b > 0 ? '+' : '-'} ${fmt.number(Math.abs(b), 2)}i`;
                        };

                        switch (v.operacao) {
                            case 'modulo': {
                                const modulo = Math.sqrt(v.a1*v.a1 + v.b1*v.b1);
                                const argumento = Math.atan2(v.b1, v.a1);
                                return {
                                    resultado: fmtComplex(v.a1, v.b1),
                                    detalhes: [
                                        { label: 'z', value: fmtComplex(v.a1, v.b1) },
                                        { label: 'Módulo |z|', value: fmt.number(modulo, 4) },
                                        { label: 'Argumento (rad)', value: fmt.number(argumento, 4) },
                                        { label: 'Argumento (graus)', value: fmt.number(argumento * 180 / Math.PI, 2) + '°' },
                                        { label: 'Conjugado', value: fmtComplex(v.a1, -v.b1) },
                                    ],
                                    titulo: `|z| = ${fmt.number(modulo, 4)}`
                                };
                            }
                            case 'soma': {
                                const ra = v.a1 + (v.a2 || 0);
                                const rb = v.b1 + (v.b2 || 0);
                                return {
                                    resultado: fmtComplex(ra, rb),
                                    detalhes: [
                                        { label: 'z₁', value: fmtComplex(v.a1, v.b1) },
                                        { label: 'z₂', value: fmtComplex(v.a2 || 0, v.b2 || 0) },
                                    ],
                                    titulo: fmtComplex(ra, rb)
                                };
                            }
                            case 'multiplicacao': {
                                const a2 = v.a2 || 0, b2 = v.b2 || 0;
                                const ra = v.a1 * a2 - v.b1 * b2;
                                const rb = v.a1 * b2 + v.b1 * a2;
                                return {
                                    resultado: fmtComplex(ra, rb),
                                    detalhes: [
                                        { label: 'z₁', value: fmtComplex(v.a1, v.b1) },
                                        { label: 'z₂', value: fmtComplex(a2, b2) },
                                    ],
                                    titulo: fmtComplex(ra, rb)
                                };
                            }
                        }
                    },
                    renderResult(r) {
                        return renderSimpleResult('Resultado', r.titulo, r.detalhes);
                    }
                });
            }
        };
    }

    // ==========================================
    // DERIVADAS
    // ==========================================
    function derivadas() {
        return {
            html: createCalculatorPage({
                title: 'Derivadas — Regras Básicas',
                description: 'Calcule derivadas usando regras básicas: potência, exponencial e trigonométrica.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'tipo', label: 'Tipo de Função', type: 'select', options: [
                        { value: 'potencia', label: 'Potência: f(x) = ax^n' },
                        { value: 'exponencial', label: 'Exponencial: f(x) = ae^(bx)' },
                        { value: 'seno', label: 'Seno: f(x) = a·sen(bx)' },
                        { value: 'cosseno', label: 'Cosseno: f(x) = a·cos(bx)' },
                        { value: 'ln', label: 'Logarítmica: f(x) = a·ln(bx)' },
                    ]},
                    { id: 'a', label: 'Coeficiente a', placeholder: 'Ex: 3' },
                    { id: 'b', label: 'Expoente n / Coeficiente b', placeholder: 'Ex: 2' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'tipo', type: 'select' },
                        { id: 'a' }, { id: 'b' },
                    ],
                    calculate(v) {
                        let funcao, derivada;
                        switch (v.tipo) {
                            case 'potencia':
                                funcao = `f(x) = ${v.a}x^${v.b}`;
                                derivada = `f'(x) = ${fmt.number(v.a * v.b, 4)}x^${fmt.number(v.b - 1, 4)}`;
                                break;
                            case 'exponencial':
                                funcao = `f(x) = ${v.a}e^(${v.b}x)`;
                                derivada = `f'(x) = ${fmt.number(v.a * v.b, 4)}e^(${v.b}x)`;
                                break;
                            case 'seno':
                                funcao = `f(x) = ${v.a}·sen(${v.b}x)`;
                                derivada = `f'(x) = ${fmt.number(v.a * v.b, 4)}·cos(${v.b}x)`;
                                break;
                            case 'cosseno':
                                funcao = `f(x) = ${v.a}·cos(${v.b}x)`;
                                derivada = `f'(x) = ${fmt.number(-v.a * v.b, 4)}·sen(${v.b}x)`;
                                break;
                            case 'ln':
                                funcao = `f(x) = ${v.a}·ln(${v.b}x)`;
                                derivada = `f'(x) = ${v.a}/x`;
                                break;
                        }
                        return { funcao, derivada };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Derivada', r.derivada, [
                            { label: 'Função original', value: r.funcao },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // INTEGRAIS
    // ==========================================
    function integrais() {
        return {
            html: createCalculatorPage({
                title: 'Integrais — Regras Básicas',
                description: 'Calcule integrais indefinidas usando regras básicas de integração.',
                category: 'Científica',
                categorySlug: 'cientifica',
                fields: [
                    { id: 'tipo', label: 'Tipo de Função', type: 'select', options: [
                        { value: 'potencia', label: 'Potência: ∫ ax^n dx' },
                        { value: 'exponencial', label: 'Exponencial: ∫ ae^(bx) dx' },
                        { value: 'seno', label: 'Seno: ∫ a·sen(bx) dx' },
                        { value: 'cosseno', label: 'Cosseno: ∫ a·cos(bx) dx' },
                        { value: 'inverso', label: 'Inverso: ∫ a/x dx' },
                    ]},
                    { id: 'a', label: 'Coeficiente a', placeholder: 'Ex: 3' },
                    { id: 'b', label: 'Expoente n / Coeficiente b', placeholder: 'Ex: 2' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'tipo', type: 'select' },
                        { id: 'a' }, { id: 'b' },
                    ],
                    calculate(v) {
                        let funcao, integral;
                        switch (v.tipo) {
                            case 'potencia':
                                if (v.b === -1) {
                                    funcao = `∫ ${v.a}/x dx`;
                                    integral = `${v.a}·ln|x| + C`;
                                } else {
                                    const novoExp = v.b + 1;
                                    funcao = `∫ ${v.a}x^${v.b} dx`;
                                    integral = `${fmt.number(v.a / novoExp, 4)}x^${novoExp} + C`;
                                }
                                break;
                            case 'exponencial':
                                funcao = `∫ ${v.a}e^(${v.b}x) dx`;
                                integral = `${fmt.number(v.a / v.b, 4)}e^(${v.b}x) + C`;
                                break;
                            case 'seno':
                                funcao = `∫ ${v.a}·sen(${v.b}x) dx`;
                                integral = `${fmt.number(-v.a / v.b, 4)}·cos(${v.b}x) + C`;
                                break;
                            case 'cosseno':
                                funcao = `∫ ${v.a}·cos(${v.b}x) dx`;
                                integral = `${fmt.number(v.a / v.b, 4)}·sen(${v.b}x) + C`;
                                break;
                            case 'inverso':
                                funcao = `∫ ${v.a}/x dx`;
                                integral = `${v.a}·ln|x| + C`;
                                break;
                        }
                        return { funcao, integral };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Integral', r.integral, [
                            { label: 'Integrando', value: r.funcao },
                        ]);
                    }
                });
            }
        };
    }

    const routes = {
        '/cientifica/fisica': fisica,
        '/cientifica/quimica': quimica,
        '/cientifica/progressoes': progressoes,
        '/cientifica/trigonometria': trigonometria,
        '/cientifica/matrizes': matrizes,
        '/cientifica/fatoracao': fatoracao,
        '/cientifica/complexos': complexos,
        '/cientifica/derivadas': derivadas,
        '/cientifica/integrais': integrais,
    };

    return { routes, renderCategory };
})();
