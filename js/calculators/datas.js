/**
 * CalcHub - Módulo Datas
 * 
 * Calculadoras: Somar/Subtrair Datas, Tempo Restante, Tempo Vivido
 */

const DatasModule = (() => {
    const { fmt, createCalculatorPage, initCalculator, renderSimpleResult, createCategoryPage } = CalcComponents;

    const calculadoras = [
        { name: 'Somar/Subtrair Datas', route: '/datas/somar-subtrair', keywords: ['somar', 'subtrair', 'data', 'dias', 'adicionar'] },
        { name: 'Tempo Restante', route: '/datas/tempo-restante', keywords: ['tempo', 'restante', 'futuro', 'contagem', 'countdown'] },
        { name: 'Tempo Vivido', route: '/datas/tempo-vivido', keywords: ['tempo', 'vivido', 'idade', 'nascimento', 'anos', 'horas'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Datas', categorySlug: 'datas' });
    });

    function renderCategory() {
        return createCategoryPage({
            title: 'Datas',
            description: 'Calcule diferenças entre datas, tempo vivido e contagens regressivas.',
            icon: '📅',
            color: 'var(--cat-datas)',
            colorLight: '#fee2e2',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            }))
        });
    }

    // ==========================================
    // SOMAR/SUBTRAIR DATAS
    // ==========================================
    function somarSubtrair() {
        return {
            html: createCalculatorPage({
                title: 'Somar/Subtrair Datas',
                description: 'Adicione ou subtraia dias, meses e anos a partir de uma data.',
                category: 'Datas',
                categorySlug: 'datas',
                fields: [
                    { id: 'data', label: 'Data Inicial', type: 'date' },
                    { id: 'operacao', label: 'Operação', type: 'select', options: [
                        { value: 'somar', label: 'Somar (+)' },
                        { value: 'subtrair', label: 'Subtrair (-)' },
                    ]},
                    { id: 'dias', label: 'Dias', placeholder: '0', min: 0, required: false },
                    { id: 'meses', label: 'Meses', placeholder: '0', min: 0, required: false },
                    { id: 'anos', label: 'Anos', placeholder: '0', min: 0, required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'data', type: 'date' },
                        { id: 'operacao', type: 'select' },
                        { id: 'dias' }, { id: 'meses' }, { id: 'anos' },
                    ],
                    calculate(v) {
                        const data = new Date(v.data + 'T00:00:00');
                        const mult = v.operacao === 'somar' ? 1 : -1;

                        const dias = (v.dias || 0) * mult;
                        const meses = (v.meses || 0) * mult;
                        const anos = (v.anos || 0) * mult;

                        const resultado = new Date(data);
                        resultado.setFullYear(resultado.getFullYear() + anos);
                        resultado.setMonth(resultado.getMonth() + meses);
                        resultado.setDate(resultado.getDate() + dias);

                        const diffMs = Math.abs(resultado - data);
                        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                        const diaSemana = resultado.toLocaleDateString('pt-BR', { weekday: 'long' });

                        return {
                            resultado: resultado.toLocaleDateString('pt-BR'),
                            diaSemana,
                            diffDias,
                            operacao: v.operacao === 'somar' ? 'somados' : 'subtraídos',
                        };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Data Resultante', r.resultado, [
                            { label: 'Dia da Semana', value: r.diaSemana },
                            { label: 'Diferença', value: `${r.diffDias} dias ${r.operacao}` },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // TEMPO RESTANTE
    // ==========================================
    function tempoRestante() {
        return {
            html: createCalculatorPage({
                title: 'Tempo Restante',
                description: 'Calcule quanto tempo falta para uma data futura.',
                category: 'Datas',
                categorySlug: 'datas',
                fields: [
                    { id: 'data', label: 'Data Futura', type: 'date' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'data', type: 'date' }],
                    calculate(v) {
                        const futuro = new Date(v.data + 'T23:59:59');
                        const agora = new Date();
                        const diffMs = futuro - agora;

                        if (diffMs < 0) throw new Error('A data deve ser no futuro');

                        const segundos = Math.floor(diffMs / 1000);
                        const minutos = Math.floor(segundos / 60);
                        const horas = Math.floor(minutos / 60);
                        const dias = Math.floor(horas / 24);
                        const semanas = Math.floor(dias / 7);
                        const meses = Math.floor(dias / 30.44);
                        const anos = Math.floor(dias / 365.25);

                        return { dias, horas, minutos, segundos, semanas, meses, anos };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Tempo Restante', `${r.dias} dias`, [
                            { label: 'Anos', value: fmt.number(r.anos, 0) },
                            { label: 'Meses', value: fmt.number(r.meses, 0) },
                            { label: 'Semanas', value: fmt.number(r.semanas, 0) },
                            { label: 'Horas', value: fmt.number(r.horas, 0) },
                            { label: 'Minutos', value: fmt.number(r.minutos, 0) },
                            { label: 'Segundos', value: fmt.number(r.segundos, 0) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // TEMPO VIVIDO
    // ==========================================
    function tempoVivido() {
        return {
            html: createCalculatorPage({
                title: 'Tempo Vivido',
                description: 'Descubra há quanto tempo você está vivo — em anos, meses, dias, horas e mais.',
                category: 'Datas',
                categorySlug: 'datas',
                fields: [
                    { id: 'nascimento', label: 'Data de Nascimento', type: 'date' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'nascimento', type: 'date' }],
                    calculate(v) {
                        const nasc = new Date(v.nascimento + 'T00:00:00');
                        const agora = new Date();
                        const diffMs = agora - nasc;

                        if (diffMs < 0) throw new Error('A data deve ser no passado');

                        const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                        const totalHoras = Math.floor(diffMs / (1000 * 60 * 60));
                        const totalMinutos = Math.floor(diffMs / (1000 * 60));
                        const totalSegundos = Math.floor(diffMs / 1000);

                        // Anos, meses, dias exatos
                        let anos = agora.getFullYear() - nasc.getFullYear();
                        let meses = agora.getMonth() - nasc.getMonth();
                        let dias = agora.getDate() - nasc.getDate();

                        if (dias < 0) {
                            meses--;
                            const mesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
                            dias += mesAnterior;
                        }
                        if (meses < 0) {
                            anos--;
                            meses += 12;
                        }

                        const batimentos = totalMinutos * 72; // média de 72 BPM

                        return { anos, meses, dias, totalDias, totalHoras, totalMinutos, totalSegundos, batimentos };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            'Você está vivo há',
                            `${r.anos} anos, ${r.meses} meses e ${r.dias} dias`,
                            [
                                { label: 'Total de dias', value: fmt.number(r.totalDias, 0) },
                                { label: 'Total de horas', value: fmt.number(r.totalHoras, 0) },
                                { label: 'Total de minutos', value: fmt.number(r.totalMinutos, 0) },
                                { label: 'Total de segundos', value: fmt.number(r.totalSegundos, 0) },
                                { label: '❤️ Batimentos cardíacos (aprox.)', value: fmt.number(r.batimentos, 0) },
                            ]
                        );
                    }
                });
            }
        };
    }

    const routes = {
        '/datas/somar-subtrair': somarSubtrair,
        '/datas/tempo-restante': tempoRestante,
        '/datas/tempo-vivido': tempoVivido,
    };

    return { routes, renderCategory };
})();
