/**
 * CalculaDeTudo - Módulo Investimentos
 * 
 * Calculadoras: Renda Fixa, Primeiro Milhão, Selic vs Poupança, Reserva de Emergência
 * Inclui: Painel de Cotações (Ticker) e Taxa SELIC em tempo real
 */

const InvestimentosModule = (() => {
    const { fmt, createCalculatorPage, initCalculator, renderSimpleResult, renderTableResult, createCategoryPage } = CalcComponents;

    // ---- Variáveis globais de cotações ----
    let cotacoesData = null;
    let selicAtual = null;

    // ---- Buscar Cotações ----
    async function fetchCotacoes() {
        try {
            // Buscar ações gratuitas da brapi.dev
            const [brapiRes, awesomeRes] = await Promise.allSettled([
                fetch('https://brapi.dev/api/quote/PETR4,VALE3,MGLU3,ITUB4').then(r => r.json()),
                fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL').then(r => r.json()),
            ]);

            const data = { acoes: [], moedas: [] };

            if (brapiRes.status === 'fulfilled' && brapiRes.value.results) {
                data.acoes = brapiRes.value.results.map(a => ({
                    symbol: a.symbol,
                    price: a.regularMarketPrice,
                    change: a.regularMarketChangePercent,
                    name: a.shortName || a.symbol,
                }));
            }

            if (awesomeRes.status === 'fulfilled') {
                const aw = awesomeRes.value;
                if (aw.USDBRL) {
                    data.moedas.push({
                        symbol: 'USD/BRL',
                        price: parseFloat(aw.USDBRL.bid),
                        change: parseFloat(aw.USDBRL.pctChange),
                        name: 'Dólar',
                    });
                }
                if (aw.EURBRL) {
                    data.moedas.push({
                        symbol: 'EUR/BRL',
                        price: parseFloat(aw.EURBRL.bid),
                        change: parseFloat(aw.EURBRL.pctChange),
                        name: 'Euro',
                    });
                }
            }

            cotacoesData = data;
            return data;
        } catch (e) {
            console.warn('Erro ao buscar cotações:', e);
            return null;
        }
    }

    // ---- Buscar Taxa SELIC ----
    async function fetchSelic() {
        try {
            const res = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
            const data = await res.json();
            if (data && data.length > 0) {
                selicAtual = parseFloat(data[0].valor);
                return selicAtual;
            }
        } catch (e) {
            console.warn('Erro ao buscar SELIC:', e);
        }
        return null;
    }

    // ---- Renderizar Ticker ----
    function renderTicker() {
        if (!cotacoesData) return '';

        const items = [...cotacoesData.acoes, ...cotacoesData.moedas];
        if (items.length === 0) return '';

        const tickerItems = items.map(item => {
            const isUp = item.change >= 0;
            const arrow = isUp ? '▲' : '▼';
            const cls = isUp ? 'ticker-up' : 'ticker-down';
            const changeStr = (isUp ? '+' : '') + item.change.toFixed(2) + '%';
            const priceStr = item.price.toFixed(2);
            return `<span class="ticker-item ${cls}">
                <strong>${item.symbol}</strong> R$ ${priceStr} 
                <span class="ticker-change">${arrow} ${changeStr}</span>
            </span>`;
        }).join('<span class="ticker-sep">|</span>');

        // Duplicate for seamless loop
        return `
            <div class="stock-ticker" id="stock-ticker">
                <div class="ticker-track">
                    <div class="ticker-content">${tickerItems}</div>
                    <div class="ticker-content">${tickerItems}</div>
                </div>
                <div class="ticker-live-badge">
                    <span class="live-dot"></span> AO VIVO
                </div>
            </div>
        `;
    }

    // ---- Renderizar badge da SELIC ----
    function renderSelicBadge() {
        if (!selicAtual) return '';
        return `
            <div class="selic-badge">
                <span class="selic-badge-icon">📊</span>
                <span class="selic-badge-text">Taxa SELIC atual: <strong>${selicAtual.toFixed(2)}% a.a.</strong></span>
                <span class="selic-badge-live"><span class="live-dot"></span> Tempo real (BCB)</span>
            </div>
        `;
    }

    // ---- Registrar calculadoras ----
    const calculadoras = [
        { name: 'Renda Fixa (CDB, Selic, Poupança)', route: '/investimentos/renda-fixa', keywords: ['cdb', 'selic', 'poupança', 'renda fixa', 'tesouro'] },
        { name: 'Calculadora do Primeiro Milhão', route: '/investimentos/primeiro-milhao', keywords: ['milhão', 'milhao', 'aporte', 'aposentadoria'] },
        { name: 'Selic vs Poupança', route: '/investimentos/selic-vs-poupanca', keywords: ['selic', 'poupança', 'comparar', 'rendimento'] },
        { name: 'Reserva de Emergência', route: '/investimentos/reserva-emergencia', keywords: ['reserva', 'emergência', 'segurança', 'meses'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Investimentos', categorySlug: 'investimentos' });
    });

    function renderCategory() {
        // Start fetching data
        fetchCotacoes().then(() => {
            const tickerContainer = document.getElementById('investimentos-ticker');
            if (tickerContainer) tickerContainer.innerHTML = renderTicker();
        });
        fetchSelic().then(() => {
            const selicContainer = document.getElementById('investimentos-selic');
            if (selicContainer) selicContainer.innerHTML = renderSelicBadge();
        });

        const baseHTML = createCategoryPage({
            title: 'Calculadora de Investimentos',
            description: 'Calcule e simule investimentos, compare rentabilidades e planeje seu futuro financeiro.',
            icon: '📈',
            color: 'var(--cat-investimentos)',
            colorLight: '#d1fae5',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            }))
        });

        // Inject ticker and selic badge at the top of the page
        return `
            <div id="investimentos-ticker"></div>
            <div id="investimentos-selic" style="max-width:1000px;margin:0 auto;padding:0 24px;"></div>
            ${baseHTML}
        `;
    }

    // ==========================================
    // CALCULADORA DE RENDA FIXA
    // ==========================================
    function rendaFixa() {
        // Fetch SELIC for auto-fill
        fetchSelic();
        fetchCotacoes().then(() => {
            const tc = document.getElementById('page-ticker');
            if (tc) tc.innerHTML = renderTicker();
        });

        return {
            html: `<div id="page-ticker"></div>` + createCalculatorPage({
                title: 'Calculadora e Simulador de Renda Fixa',
                description: 'Calcule e simule investimentos em CDB, Tesouro Selic e Poupança. Compare rendimentos líquidos.',
                category: 'Investimentos',
                categorySlug: 'investimentos',
                fields: [
                    { id: 'valor', label: 'Valor Inicial (R$)', placeholder: 'Ex: 10000', min: 0 },
                    { id: 'aporte', label: 'Aporte Mensal (R$)', placeholder: 'Ex: 500', min: 0, required: false },
                    { id: 'prazo', label: 'Prazo (meses)', placeholder: 'Ex: 12', min: 1 },
                    { id: 'tipo', label: 'Tipo de Investimento', type: 'select', options: [
                        { value: 'cdb', label: 'CDB' },
                        { value: 'selic', label: 'Tesouro Selic' },
                        { value: 'poupanca', label: 'Poupança' },
                    ]},
                    { id: 'taxa', label: 'Taxa Anual / % CDI', placeholder: 'Ex: 100 (para 100% CDI) ou 13.25 (taxa)', min: 0, hint: 'Para CDB: % do CDI. Para Selic: taxa anual. Para Poupança: automático.' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                // Auto-fill SELIC
                fetchSelic().then(selic => {
                    if (selic) {
                        const taxaField = document.getElementById('field-taxa');
                        const selicInfo = document.getElementById('selic-realtime-info');
                        if (taxaField && !taxaField.value) {
                            taxaField.placeholder = `Ex: ${selic.toFixed(2)} (SELIC atual)`;
                        }
                        // Add info badge after the form
                        const form = document.getElementById('calc-form');
                        if (form && !document.getElementById('selic-realtime-badge')) {
                            const badge = document.createElement('div');
                            badge.id = 'selic-realtime-badge';
                            badge.innerHTML = renderSelicBadge();
                            form.parentNode.insertBefore(badge, form);
                        }
                    }
                });

                initCalculator({
                    fields: [
                        { id: 'valor' }, { id: 'aporte' }, { id: 'prazo' }, { id: 'tipo', type: 'select' }, { id: 'taxa' },
                    ],
                    calculate(v) {
                        const selic = selicAtual || 13.25; // Use real SELIC or fallback
                        let taxaAnual;
                        
                        if (v.tipo === 'cdb') {
                            taxaAnual = selic * (v.taxa / 100);
                        } else if (v.tipo === 'selic') {
                            taxaAnual = v.taxa || selic;
                        } else {
                            // Poupança: 70% da Selic quando Selic > 8.5%
                            taxaAnual = selic > 8.5 ? selic * 0.7 : 6.17;
                        }

                        const taxaMensal = Math.pow(1 + taxaAnual / 100, 1/12) - 1;
                        let montante = v.valor;
                        const aporte = v.aporte || 0;

                        for (let t = 0; t < v.prazo; t++) {
                            montante = montante * (1 + taxaMensal) + aporte;
                        }

                        const totalInvestido = v.valor + aporte * v.prazo;
                        const rendimentoBruto = montante - totalInvestido;

                        // IR regressivo (exceto poupança)
                        let aliquotaIR = 0;
                        if (v.tipo !== 'poupanca') {
                            if (v.prazo <= 6) aliquotaIR = 22.5;
                            else if (v.prazo <= 12) aliquotaIR = 20;
                            else if (v.prazo <= 24) aliquotaIR = 17.5;
                            else aliquotaIR = 15;
                        }

                        const ir = rendimentoBruto * (aliquotaIR / 100);
                        const rendimentoLiquido = rendimentoBruto - ir;
                        const montanteLiquido = totalInvestido + rendimentoLiquido;

                        return {
                            montanteBruto: montante,
                            montanteLiquido,
                            rendimentoBruto,
                            rendimentoLiquido,
                            ir,
                            aliquotaIR,
                            totalInvestido,
                            taxaAnual,
                            tipo: v.tipo.toUpperCase(),
                            selicUsada: selic,
                        };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Montante Líquido', fmt.currency(r.montanteLiquido), [
                            { label: 'Montante Bruto', value: fmt.currency(r.montanteBruto) },
                            { label: 'Total Investido', value: fmt.currency(r.totalInvestido) },
                            { label: 'Rendimento Bruto', value: fmt.currency(r.rendimentoBruto) },
                            { label: 'IR (' + fmt.percent(r.aliquotaIR) + ')', value: '- ' + fmt.currency(r.ir) },
                            { label: 'Rendimento Líquido', value: fmt.currency(r.rendimentoLiquido) },
                            { label: 'Taxa equivalente anual', value: fmt.percent(r.taxaAnual) },
                            { label: 'SELIC utilizada', value: fmt.percent(r.selicUsada) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DO PRIMEIRO MILHÃO
    // ==========================================
    function primeiroMilhao() {
        fetchCotacoes().then(() => {
            const tc = document.getElementById('page-ticker');
            if (tc) tc.innerHTML = renderTicker();
        });

        return {
            html: `<div id="page-ticker"></div>` + createCalculatorPage({
                title: 'Calculadora do Primeiro Milhão',
                description: 'Descubra quanto tempo você precisa para acumular R$ 1.000.000 com aportes mensais e juros compostos.',
                category: 'Investimentos',
                categorySlug: 'investimentos',
                fields: [
                    { id: 'inicial', label: 'Aporte Inicial (R$)', placeholder: 'Ex: 10000', min: 0 },
                    { id: 'mensal', label: 'Aporte Mensal (R$)', placeholder: 'Ex: 2000', min: 0 },
                    { id: 'taxa', label: 'Taxa de Juros (% ao mês)', placeholder: 'Ex: 0.8', min: 0 },
                    { id: 'meta', label: 'Meta (R$)', placeholder: '1000000', min: 1, hint: 'Padrão: R$ 1.000.000' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'inicial' }, { id: 'mensal' }, { id: 'taxa' }, { id: 'meta' },
                    ],
                    calculate(v) {
                        const meta = v.meta || 1000000;
                        const i = v.taxa / 100;
                        let montante = v.inicial;
                        let meses = 0;
                        const maxMeses = 12000;

                        while (montante < meta && meses < maxMeses) {
                            montante = montante * (1 + i) + v.mensal;
                            meses++;
                        }

                        if (meses >= maxMeses) throw new Error('Meta inatingível com esses parâmetros');

                        const anos = Math.floor(meses / 12);
                        const mesesRestantes = meses % 12;
                        const totalInvestido = v.inicial + v.mensal * meses;

                        return { meses, anos, mesesRestantes, montante, totalInvestido, juros: montante - totalInvestido, meta };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            'Tempo para ' + fmt.currency(r.meta),
                            `${r.anos} anos e ${r.mesesRestantes} meses`,
                            [
                                { label: 'Total de meses', value: fmt.number(r.meses, 0) },
                                { label: 'Total Investido', value: fmt.currency(r.totalInvestido) },
                                { label: 'Juros Acumulados', value: fmt.currency(r.juros) },
                                { label: 'Montante Final', value: fmt.currency(r.montante) },
                            ]
                        );
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DE SELIC VS POUPANÇA
    // ==========================================
    function selicVsPoupanca() {
        fetchCotacoes().then(() => {
            const tc = document.getElementById('page-ticker');
            if (tc) tc.innerHTML = renderTicker();
        });

        return {
            html: `<div id="page-ticker"></div>` + createCalculatorPage({
                title: 'Comparador de Selic vs Poupança',
                description: 'Calcule e compare o rendimento do Tesouro Selic com a Poupança e descubra a melhor opção.',
                category: 'Investimentos',
                categorySlug: 'investimentos',
                fields: [
                    { id: 'valor', label: 'Valor a Investir (R$)', placeholder: 'Ex: 10000', min: 0 },
                    { id: 'prazo', label: 'Prazo (meses)', placeholder: 'Ex: 12', min: 1 },
                    { id: 'selic', label: 'Taxa Selic (% ao ano)', placeholder: 'Carregando...', min: 0, hint: 'Taxa Selic atual — preenchida automaticamente via BCB' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                // Auto-fill SELIC value
                fetchSelic().then(selic => {
                    if (selic) {
                        const selicField = document.getElementById('field-selic');
                        if (selicField && !selicField.value) {
                            selicField.value = selic.toFixed(2);
                            selicField.placeholder = `${selic.toFixed(2)} (atualizada)`;
                        }
                        // Add badge
                        const form = document.getElementById('calc-form');
                        if (form && !document.getElementById('selic-realtime-badge')) {
                            const badge = document.createElement('div');
                            badge.id = 'selic-realtime-badge';
                            badge.innerHTML = renderSelicBadge();
                            form.parentNode.insertBefore(badge, form);
                        }
                    }
                });

                initCalculator({
                    fields: [{ id: 'valor' }, { id: 'prazo' }, { id: 'selic' }],
                    calculate(v) {
                        const selicMensal = Math.pow(1 + v.selic / 100, 1/12) - 1;
                        const poupMensal = v.selic > 8.5
                            ? Math.pow(1 + (v.selic * 0.7) / 100, 1/12) - 1
                            : Math.pow(1.0617, 1/12) - 1;

                        const montanteSelic = v.valor * Math.pow(1 + selicMensal, v.prazo);
                        const montantePoup = v.valor * Math.pow(1 + poupMensal, v.prazo);

                        // IR sobre Selic
                        let aliquota;
                        if (v.prazo <= 6) aliquota = 22.5;
                        else if (v.prazo <= 12) aliquota = 20;
                        else if (v.prazo <= 24) aliquota = 17.5;
                        else aliquota = 15;

                        const rendSelic = montanteSelic - v.valor;
                        const irSelic = rendSelic * (aliquota / 100);
                        const selicLiquido = montanteSelic - irSelic;

                        return {
                            selicBruto: montanteSelic,
                            selicLiquido,
                            irSelic,
                            poupanca: montantePoup,
                            diferenca: selicLiquido - montantePoup,
                            melhor: selicLiquido > montantePoup ? 'Tesouro Selic' : 'Poupança',
                        };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            `Melhor opção: ${r.melhor}`,
                            `Diferença: ${fmt.currency(Math.abs(r.diferenca))}`,
                            [
                                { label: 'Tesouro Selic (bruto)', value: fmt.currency(r.selicBruto) },
                                { label: 'IR Selic', value: '- ' + fmt.currency(r.irSelic) },
                                { label: 'Tesouro Selic (líquido)', value: fmt.currency(r.selicLiquido) },
                                { label: 'Poupança (isenta de IR)', value: fmt.currency(r.poupanca) },
                            ]
                        );
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DE RESERVA DE EMERGÊNCIA
    // ==========================================
    function reservaEmergencia() {
        fetchCotacoes().then(() => {
            const tc = document.getElementById('page-ticker');
            if (tc) tc.innerHTML = renderTicker();
        });

        return {
            html: `<div id="page-ticker"></div>` + createCalculatorPage({
                title: 'Calculadora de Reserva de Emergência',
                description: 'Calcule quanto você precisa ter guardado para sua reserva de emergência.',
                category: 'Investimentos',
                categorySlug: 'investimentos',
                fields: [
                    { id: 'gastosMensais', label: 'Gastos Mensais (R$)', placeholder: 'Ex: 5000', min: 0 },
                    { id: 'meses', label: 'Meses de Cobertura', placeholder: 'Ex: 6', min: 1, max: 24, hint: 'Recomendado: 6 a 12 meses' },
                    { id: 'jaTem', label: 'Já tem guardado (R$)', placeholder: 'Ex: 5000', min: 0, required: false },
                    { id: 'aporteMensal', label: 'Aporte mensal possível (R$)', placeholder: 'Ex: 1000', min: 0, required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'gastosMensais' }, { id: 'meses' }, { id: 'jaTem' }, { id: 'aporteMensal' },
                    ],
                    calculate(v) {
                        const meta = v.gastosMensais * v.meses;
                        const jaTem = v.jaTem || 0;
                        const falta = Math.max(0, meta - jaTem);
                        const aporte = v.aporteMensal || 0;
                        const mesesPara = aporte > 0 ? Math.ceil(falta / aporte) : null;
                        return { meta, jaTem, falta, mesesPara, progresso: Math.min(100, (jaTem / meta) * 100) };
                    },
                    renderResult(r) {
                        const details = [
                            { label: 'Valor da Reserva', value: fmt.currency(r.meta) },
                            { label: 'Já acumulado', value: fmt.currency(r.jaTem) },
                            { label: 'Falta', value: fmt.currency(r.falta) },
                            { label: 'Progresso', value: fmt.percent(r.progresso) },
                        ];
                        if (r.mesesPara !== null) {
                            details.push({ label: 'Tempo estimado', value: `${r.mesesPara} meses` });
                        }
                        return renderSimpleResult('Meta da Reserva', fmt.currency(r.meta), details);
                    }
                });
            }
        };
    }

    const routes = {
        '/investimentos/renda-fixa': rendaFixa,
        '/investimentos/primeiro-milhao': primeiroMilhao,
        '/investimentos/selic-vs-poupanca': selicVsPoupanca,
        '/investimentos/reserva-emergencia': reservaEmergencia,
    };

    return { routes, renderCategory };
})();
