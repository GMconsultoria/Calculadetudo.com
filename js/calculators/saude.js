/**
 * CalculaDeTudo - Módulo Saúde
 * 
 * Calculadoras: IMC, Consumo de Água, Necessidade de Proteína
 */

const SaudeModule = (() => {
    const { fmt, createCalculatorPage, initCalculator, renderSimpleResult, createCategoryPage } = CalcComponents;

    const calculadoras = [
        { name: 'IMC — Índice de Massa Corporal', route: '/saude/imc', keywords: ['imc', 'massa', 'corporal', 'peso', 'obesidade'] },
        { name: 'Consumo de Água Diário', route: '/saude/agua', keywords: ['água', 'hidratação', 'litros', 'diário'] },
        { name: 'Necessidade de Proteína', route: '/saude/proteina', keywords: ['proteína', 'musculação', 'gramas', 'dieta'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Saúde', categorySlug: 'saude' });
    });

    function renderCategory() {
        return createCategoryPage({
            title: 'Saúde',
            description: 'Calculadoras para saúde e bem-estar: IMC, hidratação e nutrição.',
            icon: '❤️',
            color: 'var(--cat-saude)',
            colorLight: '#fce7f3',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            }))
        });
    }

    // ==========================================
    // CALCULADORA DE IMC
    // ==========================================
    function imc() {
        return {
            html: createCalculatorPage({
                title: 'Calculadora de IMC — Índice de Massa Corporal',
                description: 'Calcule seu Índice de Massa Corporal e descubra sua classificação.',
                category: 'Saúde',
                categorySlug: 'saude',
                fields: [
                    { id: 'peso', label: 'Peso (kg)', placeholder: 'Ex: 75', min: 1, max: 500 },
                    { id: 'altura', label: 'Altura (m)', placeholder: 'Ex: 1.75', min: 0.5, max: 3, step: 0.01 },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'peso' }, { id: 'altura' }],
                    calculate(v) {
                        const imc = v.peso / (v.altura * v.altura);
                        let classificacao, cor;
                        if (imc < 18.5) { classificacao = 'Abaixo do peso'; cor = '#3b82f6'; }
                        else if (imc < 25) { classificacao = 'Peso normal'; cor = '#10b981'; }
                        else if (imc < 30) { classificacao = 'Sobrepeso'; cor = '#f59e0b'; }
                        else if (imc < 35) { classificacao = 'Obesidade Grau I'; cor = '#f97316'; }
                        else if (imc < 40) { classificacao = 'Obesidade Grau II'; cor = '#ef4444'; }
                        else { classificacao = 'Obesidade Grau III'; cor = '#dc2626'; }

                        const pesoIdealMin = 18.5 * v.altura * v.altura;
                        const pesoIdealMax = 24.9 * v.altura * v.altura;

                        return { imc, classificacao, cor, pesoIdealMin, pesoIdealMax };
                    },
                    renderResult(r) {
                        return `
                            <div class="result-title">Índice de Massa Corporal</div>
                            <div class="result-value" style="color: ${r.cor}">${fmt.number(r.imc, 1)}</div>
                            <div style="font-size: 1.1rem; font-weight: 600; color: ${r.cor}; margin-bottom: 16px;">${r.classificacao}</div>
                            <div class="result-details">
                                <div class="result-row">
                                    <span class="result-row-label">Peso ideal</span>
                                    <span class="result-row-value">${fmt.number(r.pesoIdealMin, 1)} – ${fmt.number(r.pesoIdealMax, 1)} kg</span>
                                </div>
                            </div>
                        `;
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DE CONSUMO DE ÁGUA
    // ==========================================
    function agua() {
        return {
            html: createCalculatorPage({
                title: 'Calculadora de Consumo de Água Diário',
                description: 'Calcule a quantidade ideal de água que você deve beber por dia.',
                category: 'Saúde',
                categorySlug: 'saude',
                fields: [
                    { id: 'peso', label: 'Peso (kg)', placeholder: 'Ex: 75', min: 1 },
                    { id: 'atividade', label: 'Nível de Atividade Física', type: 'select', options: [
                        { value: 'sedentario', label: 'Sedentário' },
                        { value: 'leve', label: 'Atividade Leve' },
                        { value: 'moderado', label: 'Atividade Moderada' },
                        { value: 'intenso', label: 'Atividade Intensa' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'peso' }, { id: 'atividade', type: 'select' }],
                    calculate(v) {
                        const fatores = {
                            sedentario: 35,
                            leve: 40,
                            moderado: 45,
                            intenso: 50,
                        };
                        const ml = v.peso * fatores[v.atividade];
                        const litros = ml / 1000;
                        const copos = Math.ceil(ml / 250);
                        return { litros, ml, copos };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Consumo Recomendado', `${fmt.number(r.litros, 1)} litros/dia`, [
                            { label: 'Em mililitros', value: `${fmt.number(r.ml, 0)} ml` },
                            { label: 'Copos (250ml)', value: `${r.copos} copos` },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DE PROTEÍNA
    // ==========================================
    function proteina() {
        return {
            html: createCalculatorPage({
                title: 'Calculadora de Necessidade Diária de Proteína',
                description: 'Calcule a quantidade ideal de proteína diária com base no seu peso e objetivo.',
                category: 'Saúde',
                categorySlug: 'saude',
                fields: [
                    { id: 'peso', label: 'Peso (kg)', placeholder: 'Ex: 75', min: 1 },
                    { id: 'objetivo', label: 'Objetivo', type: 'select', options: [
                        { value: 'sedentario', label: 'Sedentário / Manutenção' },
                        { value: 'emagrecer', label: 'Emagrecimento' },
                        { value: 'hipertrofia', label: 'Hipertrofia / Ganho Muscular' },
                        { value: 'atleta', label: 'Atleta / Alto Rendimento' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'peso' }, { id: 'objetivo', type: 'select' }],
                    calculate(v) {
                        const fatores = {
                            sedentario: { min: 0.8, max: 1.0 },
                            emagrecer: { min: 1.2, max: 1.6 },
                            hipertrofia: { min: 1.6, max: 2.2 },
                            atleta: { min: 2.0, max: 2.5 },
                        };
                        const fator = fatores[v.objetivo];
                        const min = v.peso * fator.min;
                        const max = v.peso * fator.max;
                        const media = (min + max) / 2;

                        // Equivalentes alimentares
                        const ovos = Math.round(media / 6);
                        const frangog = Math.round(media / 0.31);
                        const whey = Math.round(media / 24);

                        return { min, max, media, ovos, frangog, whey };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Proteína Diária', `${fmt.number(r.min, 0)} – ${fmt.number(r.max, 0)}g`, [
                            { label: 'Média Recomendada', value: `${fmt.number(r.media, 0)}g` },
                            { label: '🥚 Equivalente em ovos', value: `~${r.ovos} ovos` },
                            { label: '🍗 Equivalente em frango', value: `~${r.frangog}g de peito` },
                            { label: '🥛 Doses de whey', value: `~${r.whey} doses` },
                        ]);
                    }
                });
            }
        };
    }

    const routes = {
        '/saude/imc': imc,
        '/saude/agua': agua,
        '/saude/proteina': proteina,
    };

    return { routes, renderCategory };
})();
