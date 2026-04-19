/**
 * CalculaDeTudo - Módulo Financeiro
 * 
 * Calculadoras: Juros Simples, Juros Compostos, Montante, Taxas,
 * Valor Presente, Valor Futuro, VPL, TIR, ROI, Financiamento, Breakeven, Correção Monetária
 */

const FinanceiroModule = (() => {
    const { fmt, createCalculatorPage, initCalculator, renderSimpleResult, renderTableResult, createCategoryPage } = CalcComponents;

    // ---- Registro de calculadoras para busca ----
    const calculadoras = [
        { name: 'Juros Simples', route: '/financeira/juros-simples', keywords: ['juros', 'simples', 'taxa', 'capital'] },
        { name: 'Juros Compostos', route: '/financeira/juros-compostos', keywords: ['juros', 'compostos', 'exponencial'] },
        { name: 'Cálculo de Montante', route: '/financeira/montante', keywords: ['montante', 'capital', 'juros'] },
        { name: 'Taxas (Nominal, Real, Efetiva)', route: '/financeira/taxas', keywords: ['taxa', 'nominal', 'real', 'efetiva', 'equivalente'] },
        { name: 'Valor Presente', route: '/financeira/valor-presente', keywords: ['valor presente', 'desconto', 'fluxo'] },
        { name: 'Valor Futuro', route: '/financeira/valor-futuro', keywords: ['valor futuro', 'capital', 'rendimento'] },
        { name: 'VPL - Valor Presente Líquido', route: '/financeira/vpl', keywords: ['vpl', 'valor presente liquido', 'investimento'] },
        { name: 'TIR - Taxa Interna de Retorno', route: '/financeira/tir', keywords: ['tir', 'taxa interna', 'retorno'] },
        { name: 'ROI - Retorno sobre Investimento', route: '/financeira/roi', keywords: ['roi', 'retorno', 'investimento', 'lucro'] },
        { name: 'Financiamento (SAC/PRICE)', route: '/financeira/financiamento', keywords: ['financiamento', 'sac', 'price', 'parcela', 'amortização'] },
        { name: 'Ponto de Equilíbrio (Breakeven)', route: '/financeira/breakeven', keywords: ['breakeven', 'ponto', 'equilibrio', 'receita', 'custo'] },
        { name: 'Correção Monetária', route: '/financeira/correcao', keywords: ['correção', 'monetaria', 'ipca', 'igpm', 'inflação'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Financeira', categorySlug: 'financeira' });
    });

    // ---- Categoria ----
    function renderCategory() {
        return createCategoryPage({
            title: 'Financeira',
            description: 'Calculadoras financeiras para juros, investimentos, financiamentos e mais.',
            icon: '💰',
            color: 'var(--cat-financeira)',
            colorLight: 'var(--color-primary-light)',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            }))
        });
    }

    // ==========================================
    // CALCULADORA DE JUROS SIMPLES
    // ==========================================
    function jurosSimples() {
        return {
            html: createCalculatorPage({
                title: 'Juros Simples',
                description: 'Calcule juros simples a partir do capital, taxa e período. Fórmula: J = C × i × t',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'capital', label: 'Capital Inicial (R$)', placeholder: 'Ex: 10000', min: 0 },
                    { id: 'taxa', label: 'Taxa de Juros (% ao mês)', placeholder: 'Ex: 2', min: 0 },
                    { id: 'periodo', label: 'Período (meses)', placeholder: 'Ex: 12', min: 1 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'capital' },
                        { id: 'taxa' },
                        { id: 'periodo' },
                    ],
                    calculate(v) {
                        const juros = v.capital * (v.taxa / 100) * v.periodo;
                        const montante = v.capital + juros;
                        return { juros, montante, capital: v.capital, taxa: v.taxa, periodo: v.periodo };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Montante Final', fmt.currency(r.montante), [
                            { label: 'Capital Inicial', value: fmt.currency(r.capital) },
                            { label: 'Juros Acumulados', value: fmt.currency(r.juros) },
                            { label: 'Taxa Mensal', value: fmt.percent(r.taxa) },
                            { label: 'Período', value: `${r.periodo} meses` },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // JUROS COMPOSTOS
    // ==========================================
    function jurosCompostos() {
        return {
            html: createCalculatorPage({
                title: 'Juros Compostos',
                description: 'Calcule juros compostos. Fórmula: M = C × (1 + i)^t. Veja como seu dinheiro cresce exponencialmente.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'capital', label: 'Capital Inicial (R$)', placeholder: 'Ex: 10000', min: 0 },
                    { id: 'aporte', label: 'Aporte Mensal (R$)', placeholder: 'Ex: 500', min: 0 },
                    { id: 'taxa', label: 'Taxa de Juros (% ao mês)', placeholder: 'Ex: 1', min: 0 },
                    { id: 'periodo', label: 'Período (meses)', placeholder: 'Ex: 24', min: 1 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'capital' },
                        { id: 'aporte' },
                        { id: 'taxa' },
                        { id: 'periodo' },
                    ],
                    calculate(v) {
                        const i = v.taxa / 100;
                        let montante = v.capital;
                        let totalAportes = v.capital;
                        for (let t = 0; t < v.periodo; t++) {
                            montante = montante * (1 + i) + (v.aporte || 0);
                            totalAportes += (v.aporte || 0);
                        }
                        const juros = montante - totalAportes;
                        return { montante, juros, totalAportes, capital: v.capital, taxa: v.taxa, periodo: v.periodo };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Montante Final', fmt.currency(r.montante), [
                            { label: 'Total Investido', value: fmt.currency(r.totalAportes) },
                            { label: 'Juros Acumulados', value: fmt.currency(r.juros) },
                            { label: 'Rendimento', value: fmt.percent((r.juros / r.totalAportes) * 100) },
                            { label: 'Período', value: `${r.periodo} meses` },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // MONTANTE
    // ==========================================
    function montante() {
        return {
            html: createCalculatorPage({
                title: 'Cálculo de Montante',
                description: 'Calcule o montante final considerando capital, juros e tipo de capitalização.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'capital', label: 'Capital Inicial (R$)', placeholder: 'Ex: 5000', min: 0 },
                    { id: 'taxa', label: 'Taxa de Juros (% ao mês)', placeholder: 'Ex: 1.5', min: 0 },
                    { id: 'periodo', label: 'Período (meses)', placeholder: 'Ex: 12', min: 1 },
                    { id: 'tipo', label: 'Tipo de Capitalização', type: 'select', options: [
                        { value: 'simples', label: 'Juros Simples' },
                        { value: 'composto', label: 'Juros Compostos' }
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'capital' },
                        { id: 'taxa' },
                        { id: 'periodo' },
                        { id: 'tipo', type: 'select' },
                    ],
                    calculate(v) {
                        const i = v.taxa / 100;
                        let m;
                        if (v.tipo === 'simples') {
                            m = v.capital * (1 + i * v.periodo);
                        } else {
                            m = v.capital * Math.pow(1 + i, v.periodo);
                        }
                        return { montante: m, juros: m - v.capital, capital: v.capital, tipo: v.tipo };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Montante', fmt.currency(r.montante), [
                            { label: 'Capital', value: fmt.currency(r.capital) },
                            { label: 'Juros', value: fmt.currency(r.juros) },
                            { label: 'Tipo', value: r.tipo === 'simples' ? 'Juros Simples' : 'Juros Compostos' },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // TAXAS
    // ==========================================
    function taxas() {
        return {
            html: createCalculatorPage({
                title: 'Conversão de Taxas',
                description: 'Converta taxas de juros entre nominal, efetiva e equivalente. Calcule taxas mensais a partir de anuais e vice-versa.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'taxa', label: 'Taxa (%)', placeholder: 'Ex: 12', min: 0 },
                    { id: 'de', label: 'De', type: 'select', options: [
                        { value: 'mensal', label: 'Mensal' },
                        { value: 'bimestral', label: 'Bimestral' },
                        { value: 'trimestral', label: 'Trimestral' },
                        { value: 'semestral', label: 'Semestral' },
                        { value: 'anual', label: 'Anual' },
                    ]},
                    { id: 'para', label: 'Para', type: 'select', options: [
                        { value: 'mensal', label: 'Mensal' },
                        { value: 'bimestral', label: 'Bimestral' },
                        { value: 'trimestral', label: 'Trimestral' },
                        { value: 'semestral', label: 'Semestral' },
                        { value: 'anual', label: 'Anual' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'taxa' },
                        { id: 'de', type: 'select' },
                        { id: 'para', type: 'select' },
                    ],
                    calculate(v) {
                        const periodos = { mensal: 1, bimestral: 2, trimestral: 3, semestral: 6, anual: 12 };
                        const nDe = periodos[v.de];
                        const nPara = periodos[v.para];
                        const taxaEfetiva = Math.pow(1 + v.taxa / 100, nPara / nDe) - 1;
                        return { taxaConvertida: taxaEfetiva * 100, de: v.de, para: v.para, original: v.taxa };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Taxa Equivalente', fmt.percent(r.taxaConvertida, 4), [
                            { label: 'Taxa Original', value: fmt.percent(r.original) + ' ' + r.de },
                            { label: 'Período convertido', value: r.para },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // VALOR PRESENTE
    // ==========================================
    function valorPresente() {
        return {
            html: createCalculatorPage({
                title: 'Valor Presente',
                description: 'Calcule o valor presente de um montante futuro, descontando a taxa de juros.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'vf', label: 'Valor Futuro (R$)', placeholder: 'Ex: 50000', min: 0 },
                    { id: 'taxa', label: 'Taxa de Desconto (% ao mês)', placeholder: 'Ex: 1', min: 0 },
                    { id: 'periodo', label: 'Período (meses)', placeholder: 'Ex: 24', min: 1 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'vf' }, { id: 'taxa' }, { id: 'periodo' }],
                    calculate(v) {
                        const vp = v.vf / Math.pow(1 + v.taxa / 100, v.periodo);
                        return { vp, desconto: v.vf - vp, vf: v.vf };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Valor Presente', fmt.currency(r.vp), [
                            { label: 'Valor Futuro', value: fmt.currency(r.vf) },
                            { label: 'Desconto', value: fmt.currency(r.desconto) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // VALOR FUTURO
    // ==========================================
    function valorFuturo() {
        return {
            html: createCalculatorPage({
                title: 'Valor Futuro',
                description: 'Calcule o valor futuro de um capital aplicado a juros compostos.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'vp', label: 'Valor Presente (R$)', placeholder: 'Ex: 10000', min: 0 },
                    { id: 'taxa', label: 'Taxa (% ao mês)', placeholder: 'Ex: 1', min: 0 },
                    { id: 'periodo', label: 'Período (meses)', placeholder: 'Ex: 24', min: 1 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'vp' }, { id: 'taxa' }, { id: 'periodo' }],
                    calculate(v) {
                        const vf = v.vp * Math.pow(1 + v.taxa / 100, v.periodo);
                        return { vf, rendimento: vf - v.vp, vp: v.vp };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Valor Futuro', fmt.currency(r.vf), [
                            { label: 'Valor Presente', value: fmt.currency(r.vp) },
                            { label: 'Rendimento Total', value: fmt.currency(r.rendimento) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // VPL
    // ==========================================
    function vpl() {
        return {
            html: createCalculatorPage({
                title: 'VPL — Valor Presente Líquido',
                description: 'Calcule o VPL (Valor Presente Líquido) para análise de viabilidade de investimentos.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'investimento', label: 'Investimento Inicial (R$)', placeholder: 'Ex: 100000', min: 0 },
                    { id: 'taxa', label: 'Taxa de Desconto (% ao mês)', placeholder: 'Ex: 1', min: 0 },
                    { id: 'fluxo1', label: 'Fluxo Mês 1 (R$)', placeholder: 'Ex: 15000', required: true },
                    { id: 'fluxo2', label: 'Fluxo Mês 2 (R$)', placeholder: 'Ex: 15000', required: false },
                    { id: 'fluxo3', label: 'Fluxo Mês 3 (R$)', placeholder: 'Ex: 15000', required: false },
                    { id: 'fluxo4', label: 'Fluxo Mês 4 (R$)', placeholder: 'Ex: 15000', required: false },
                    { id: 'fluxo5', label: 'Fluxo Mês 5 (R$)', placeholder: 'Ex: 15000', required: false },
                    { id: 'fluxo6', label: 'Fluxo Mês 6 (R$)', placeholder: 'Ex: 15000', required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'investimento' },
                        { id: 'taxa' },
                        { id: 'fluxo1' },
                        { id: 'fluxo2' },
                        { id: 'fluxo3' },
                        { id: 'fluxo4' },
                        { id: 'fluxo5' },
                        { id: 'fluxo6' },
                    ],
                    calculate(v) {
                        const i = v.taxa / 100;
                        const fluxos = [v.fluxo1, v.fluxo2, v.fluxo3, v.fluxo4, v.fluxo5, v.fluxo6].filter(f => !isNaN(f) && f > 0);
                        let vplVal = -v.investimento;
                        fluxos.forEach((f, idx) => {
                            vplVal += f / Math.pow(1 + i, idx + 1);
                        });
                        return { vpl: vplVal, investimento: v.investimento, fluxos, viavel: vplVal > 0 };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            r.viavel ? '✅ Projeto Viável' : '❌ Projeto Inviável',
                            fmt.currency(r.vpl),
                            [
                                { label: 'Investimento', value: fmt.currency(r.investimento) },
                                { label: 'Fluxos considerados', value: `${r.fluxos.length} meses` },
                                { label: 'VPL', value: fmt.currency(r.vpl) },
                            ]
                        );
                    }
                });
            }
        };
    }

    // ==========================================
    // TIR
    // ==========================================
    function tir() {
        return {
            html: createCalculatorPage({
                title: 'TIR — Taxa Interna de Retorno',
                description: 'Calcule a TIR (Taxa Interna de Retorno) para avaliar a rentabilidade de um investimento.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'investimento', label: 'Investimento Inicial (R$)', placeholder: 'Ex: 100000', min: 0 },
                    { id: 'fluxo1', label: 'Fluxo Mês 1 (R$)', placeholder: 'Ex: 30000' },
                    { id: 'fluxo2', label: 'Fluxo Mês 2 (R$)', placeholder: 'Ex: 30000', required: false },
                    { id: 'fluxo3', label: 'Fluxo Mês 3 (R$)', placeholder: 'Ex: 30000', required: false },
                    { id: 'fluxo4', label: 'Fluxo Mês 4 (R$)', placeholder: 'Ex: 30000', required: false },
                    { id: 'fluxo5', label: 'Fluxo Mês 5 (R$)', placeholder: 'Ex: 30000', required: false },
                    { id: 'fluxo6', label: 'Fluxo Mês 6 (R$)', placeholder: 'Ex: 30000', required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'investimento' },
                        { id: 'fluxo1' }, { id: 'fluxo2' }, { id: 'fluxo3' },
                        { id: 'fluxo4' }, { id: 'fluxo5' }, { id: 'fluxo6' },
                    ],
                    calculate(v) {
                        const fluxos = [-v.investimento];
                        [v.fluxo1, v.fluxo2, v.fluxo3, v.fluxo4, v.fluxo5, v.fluxo6].forEach(f => {
                            if (!isNaN(f) && f > 0) fluxos.push(f);
                        });

                        // Newton-Raphson para encontrar TIR
                        let taxa = 0.1;
                        for (let iter = 0; iter < 1000; iter++) {
                            let vplVal = 0, dvpl = 0;
                            fluxos.forEach((f, t) => {
                                vplVal += f / Math.pow(1 + taxa, t);
                                dvpl -= t * f / Math.pow(1 + taxa, t + 1);
                            });
                            const novaTaxa = taxa - vplVal / dvpl;
                            if (Math.abs(novaTaxa - taxa) < 1e-10) break;
                            taxa = novaTaxa;
                        }

                        return { tir: taxa * 100, fluxos };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Taxa Interna de Retorno', fmt.percent(r.tir, 4), [
                            { label: 'TIR mensal', value: fmt.percent(r.tir, 4) },
                            { label: 'TIR anual (equivalente)', value: fmt.percent((Math.pow(1 + r.tir / 100, 12) - 1) * 100, 2) },
                            { label: 'Períodos', value: r.fluxos.length - 1 },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // ROI
    // ==========================================
    function roi() {
        return {
            html: createCalculatorPage({
                title: 'ROI — Retorno sobre Investimento',
                description: 'Calcule o ROI (Return on Investment) para medir a eficiência de um investimento.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'ganho', label: 'Ganho obtido (R$)', placeholder: 'Ex: 50000', min: 0 },
                    { id: 'investimento', label: 'Investimento (R$)', placeholder: 'Ex: 30000', min: 0.01 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'ganho' }, { id: 'investimento' }],
                    calculate(v) {
                        const roi = ((v.ganho - v.investimento) / v.investimento) * 100;
                        return { roi, lucro: v.ganho - v.investimento, ganho: v.ganho, investimento: v.investimento };
                    },
                    renderResult(r) {
                        return renderSimpleResult('ROI', fmt.percent(r.roi), [
                            { label: 'Ganho Total', value: fmt.currency(r.ganho) },
                            { label: 'Investimento', value: fmt.currency(r.investimento) },
                            { label: 'Lucro Líquido', value: fmt.currency(r.lucro) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // FINANCIAMENTO (SAC / PRICE)
    // ==========================================
    function financiamento() {
        return {
            html: createCalculatorPage({
                title: 'Simulador de Financiamento',
                description: 'Simule financiamentos nos sistemas SAC e PRICE. Compare parcelas e juros totais.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'valor', label: 'Valor Financiado (R$)', placeholder: 'Ex: 200000', min: 0 },
                    { id: 'taxa', label: 'Taxa de Juros (% ao mês)', placeholder: 'Ex: 0.8', min: 0 },
                    { id: 'prazo', label: 'Prazo (meses)', placeholder: 'Ex: 360', min: 1, max: 600 },
                    { id: 'sistema', label: 'Sistema de Amortização', type: 'select', options: [
                        { value: 'price', label: 'PRICE (parcelas fixas)' },
                        { value: 'sac', label: 'SAC (amortização constante)' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'valor' }, { id: 'taxa' }, { id: 'prazo' }, { id: 'sistema', type: 'select' },
                    ],
                    calculate(v) {
                        const i = v.taxa / 100;
                        const n = v.prazo;
                        const pv = v.valor;
                        let tabela = [];
                        let totalJuros = 0;
                        let totalPago = 0;

                        if (v.sistema === 'price') {
                            const parcela = pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
                            let saldo = pv;
                            for (let t = 1; t <= Math.min(n, 12); t++) {
                                const juros = saldo * i;
                                const amort = parcela - juros;
                                saldo -= amort;
                                totalJuros += juros;
                                totalPago += parcela;
                                tabela.push([t, fmt.currency(parcela), fmt.currency(amort), fmt.currency(juros), fmt.currency(Math.max(0, saldo))]);
                            }
                            // Calcular totais completos
                            totalJuros = parcela * n - pv;
                            totalPago = parcela * n;
                            return { parcela, totalJuros, totalPago, tabela, sistema: 'PRICE' };
                        } else {
                            const amort = pv / n;
                            let saldo = pv;
                            for (let t = 1; t <= Math.min(n, 12); t++) {
                                const juros = saldo * i;
                                const parcela = amort + juros;
                                saldo -= amort;
                                totalJuros += juros;
                                totalPago += parcela;
                                tabela.push([t, fmt.currency(parcela), fmt.currency(amort), fmt.currency(juros), fmt.currency(Math.max(0, saldo))]);
                            }
                            // Totais completos
                            totalJuros = 0;
                            totalPago = 0;
                            saldo = pv;
                            for (let t = 1; t <= n; t++) {
                                const juros = saldo * i;
                                totalJuros += juros;
                                totalPago += amort + juros;
                                saldo -= amort;
                            }
                            const primeiraParcela = amort + pv * i;
                            return { parcela: primeiraParcela, totalJuros, totalPago, tabela, sistema: 'SAC' };
                        }
                    },
                    renderResult(r) {
                        return renderTableResult(
                            `Sistema ${r.sistema}`,
                            fmt.currency(r.parcela) + (r.sistema === 'SAC' ? ' (1ª parcela)' : ' /mês'),
                            ['Mês', 'Parcela', 'Amortização', 'Juros', 'Saldo'],
                            r.tabela,
                            [
                                { label: 'Total de Juros', value: fmt.currency(r.totalJuros) },
                                { label: 'Total Pago', value: fmt.currency(r.totalPago) },
                            ]
                        );
                    }
                });
            }
        };
    }

    // ==========================================
    // BREAKEVEN
    // ==========================================
    function breakeven() {
        return {
            html: createCalculatorPage({
                title: 'Ponto de Equilíbrio (Breakeven)',
                description: 'Calcule o ponto de equilíbrio do seu negócio — quando receitas igualam custos.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'custoFixo', label: 'Custo Fixo Mensal (R$)', placeholder: 'Ex: 10000', min: 0 },
                    { id: 'precoVenda', label: 'Preço de Venda Unitário (R$)', placeholder: 'Ex: 100', min: 0.01 },
                    { id: 'custoVariavel', label: 'Custo Variável Unitário (R$)', placeholder: 'Ex: 40', min: 0 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'custoFixo' }, { id: 'precoVenda' }, { id: 'custoVariavel' }],
                    calculate(v) {
                        const mc = v.precoVenda - v.custoVariavel;
                        if (mc <= 0) throw new Error('Preço de venda deve ser maior que custo variável');
                        const qtd = Math.ceil(v.custoFixo / mc);
                        const receita = qtd * v.precoVenda;
                        return { qtd, receita, mc, custoFixo: v.custoFixo };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Ponto de Equilíbrio', `${fmt.number(r.qtd, 0)} unidades`, [
                            { label: 'Receita no Breakeven', value: fmt.currency(r.receita) },
                            { label: 'Margem de Contribuição', value: fmt.currency(r.mc) + ' /unidade' },
                            { label: 'Custo Fixo', value: fmt.currency(r.custoFixo) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // CORREÇÃO MONETÁRIA
    // ==========================================
    function correcao() {
        return {
            html: createCalculatorPage({
                title: 'Correção Monetária',
                description: 'Corrija valores monetários usando índices como IPCA, IGP-M, INPC e outros.',
                category: 'Financeira',
                categorySlug: 'financeira',
                fields: [
                    { id: 'valor', label: 'Valor Original (R$)', placeholder: 'Ex: 1000', min: 0 },
                    { id: 'indice', label: 'Índice de Correção', type: 'select', options: [
                        { value: '4.62', label: 'IPCA (aprox. 4,62% a.a.)' },
                        { value: '3.50', label: 'IGP-M (aprox. 3,50% a.a.)' },
                        { value: '4.77', label: 'INPC (aprox. 4,77% a.a.)' },
                        { value: '4.10', label: 'IPC-Br (aprox. 4,10% a.a.)' },
                        { value: '7.41', label: 'INCC (aprox. 7,41% a.a.)' },
                        { value: '3.80', label: 'IGP-DI (aprox. 3,80% a.a.)' },
                        { value: '3.22', label: 'IPA-M (aprox. 3,22% a.a.)' },
                        { value: '4.71', label: 'IPCA-E (aprox. 4,71% a.a.)' },
                        { value: '3.90', label: 'IPC-Fipe (aprox. 3,90% a.a.)' },
                        { value: '3.60', label: 'IGP-10 (aprox. 3,60% a.a.)' },
                        { value: '4.54', label: 'IPCA-15 (aprox. 4,54% a.a.)' },
                        { value: '4.30', label: 'IPC-C1 (aprox. 4,30% a.a.)' },
                    ]},
                    { id: 'anos', label: 'Período (anos)', placeholder: 'Ex: 5', min: 1 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'valor' },
                        { id: 'indice', type: 'select' },
                        { id: 'anos' },
                    ],
                    calculate(v) {
                        const taxa = parseFloat(v.indice) / 100;
                        const corrigido = v.valor * Math.pow(1 + taxa, v.anos);
                        return { corrigido, diferenca: corrigido - v.valor, original: v.valor, taxa: parseFloat(v.indice), anos: v.anos };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Valor Corrigido', fmt.currency(r.corrigido), [
                            { label: 'Valor Original', value: fmt.currency(r.original) },
                            { label: 'Correção', value: fmt.currency(r.diferenca) },
                            { label: 'Taxa anual usada', value: fmt.percent(r.taxa) },
                            { label: 'Período', value: `${r.anos} anos` },
                        ]);
                    }
                });
            }
        };
    }

    // ---- Roteamento ----
    const routes = {
        '/financeira/juros-simples': jurosSimples,
        '/financeira/juros-compostos': jurosCompostos,
        '/financeira/montante': montante,
        '/financeira/taxas': taxas,
        '/financeira/valor-presente': valorPresente,
        '/financeira/valor-futuro': valorFuturo,
        '/financeira/vpl': vpl,
        '/financeira/tir': tir,
        '/financeira/roi': roi,
        '/financeira/financiamento': financiamento,
        '/financeira/breakeven': breakeven,
        '/financeira/correcao': correcao,
    };

    return { routes, renderCategory };
})();
