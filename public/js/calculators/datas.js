/**
 * CalculaDeTudo - Módulo Datas
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
            })),
            editorialContent: `
                <h2>Por que calcular Datas e Tempos é tão difícil?</h2>
                <p>Nossa mente foi treinada para pensar em base 10 (sistema decimal), mas o nosso calendário e os nossos relógios funcionam de maneira completamente diferente. Os meses têm durações variadas (28, 29, 30 ou 31 dias), os anos bissextos bagunçam as contas longas e as horas giram em base 60. É por isso que somar 45 dias a "18 de Agosto" de cabeça costuma gerar confusão e erros.</p>
                <p>Nesta categoria de Datas e Tempo, reunimos ferramentas para acabar com a adivinhação e o uso do "dedo" no calendário. Nós cuidamos de todos os cálculos obscuros envolvendo o calendário Gregoriano para entregar a você respostas precisas em segundos.</p>

                <h3>Nossas Calculadoras de Tempo</h3>
                <ul>
                    <li><strong>Somar ou Subtrair Datas:</strong> Tem um prazo legal, um vencimento de boleto ou um projeto para entregar em 120 dias? Insira a data inicial, adicione os dias, meses ou anos, e nossa calculadora informará não só a data exata de vencimento, mas também em qual <em>Dia da Semana</em> ele vai cair (ideal para evitar prazos em domingos e feriados).</li>
                    <li><strong>Tempo Restante (Contagem Regressiva):</strong> Essencial para planejamento de eventos (casamentos, formaturas) e gestão de projetos. Informe uma data no futuro e saiba exatamente quantos anos, meses, semanas e dias faltam para o grande dia.</li>
                    <li><strong>Tempo Vivido (Idade Exata):</strong> Muito mais do que apenas sua idade em anos. Descubra quantos meses, dias, horas e minutos você já viveu desde o seu nascimento. Uma ferramenta divertida que, inclusive, estima a quantidade de vezes que seu coração já bateu!</li>
                </ul>

                <div class="example-box">
                    <h4>Exemplo Prático: Como os Anos Bissextos afetam os cálculos</h4>
                    <p>Um erro comum ao somar 1 ano inteiro a uma data é esquecer o dia 29 de fevereiro. Se você assinar um contrato válido por 365 dias em 1º de Março de 2023, ele vence em 29 de Fevereiro de 2024 (ano bissexto), e não em 1º de Março.</p>
                    <p>Nossas calculadoras usam as bibliotecas nativas de tempo da programação, que já embutem as regras de anos bissextos automaticamente, garantindo que seu prazo legal nunca falhe por um dia de diferença.</p>
                </div>

                <h3>Curiosidades sobre a Medição do Tempo</h3>
                <p>Você sabia que um mês comercial tem sempre <strong>30 dias</strong> e um ano comercial tem <strong>360 dias</strong>? Esse formato padronizado foi criado pelo mercado financeiro justamente para evitar os cálculos malucos de meses com 31 e 28 dias na hora de cobrar juros.</p>
                <p>Entretanto, nossas calculadoras de datas utilizam o formato <strong>Civil (Calendário Real)</strong>, que contabiliza a passagem exata dos dias no calendário que temos na parede da nossa casa.</p>

                <h3>Dica do Especialista em Prazos</h3>
                <p>Se você lida com recursos jurídicos ou prazos bancários, lembre-se: "Dias Úteis" são diferentes de "Dias Corridos". Atualmente, nossa ferramenta de soma e subtração lida com dias corridos. Se o prazo cair em um final de semana, a legislação brasileira geralmente prorroga o vencimento para o <strong>primeiro dia útil subsequente</strong>.</p>
            `
        });
    }

    // ==========================================
    // CALCULADORA DE SOMAR/SUBTRAIR DATAS
    // ==========================================
    function somarSubtrair() {
        return {
            html: createCalculatorPage({
                title: 'Calculadora para Somar/Subtrair Datas',
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
    // CALCULADORA DE TEMPO RESTANTE
    // ==========================================
    function tempoRestante() {
        return {
            html: createCalculatorPage({
                title: 'Calculadora - Tempo Restante',
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
