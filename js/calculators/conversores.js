/**
 * CalculaDeTudo - Módulo Conversores
 * 
 * Calculadoras: Moedas, Medidas, Temperatura
 */

const ConversoresModule = (() => {
    const { fmt, createCalculatorPage, initCalculator, renderSimpleResult, createCategoryPage } = CalcComponents;

    const calculadoras = [
        { name: 'Conversor de Moedas', route: '/conversores/moedas', keywords: ['moeda', 'dólar', 'euro', 'câmbio', 'real'] },
        { name: 'Conversor de Medidas', route: '/conversores/medidas', keywords: ['medida', 'peso', 'distância', 'volume', 'comprimento'] },
        { name: 'Conversor de Temperatura', route: '/conversores/temperatura', keywords: ['temperatura', 'celsius', 'fahrenheit', 'kelvin'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Conversores', categorySlug: 'conversores' });
    });

    function renderCategory() {
        return createCategoryPage({
            title: 'Conversores',
            description: 'Conversores de moedas, medidas e temperaturas de forma rápida e precisa.',
            icon: '🔄',
            color: 'var(--cat-conversores)',
            colorLight: '#ede9fe',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            }))
        });
    }

    // ==========================================
    // CONVERSOR DE MOEDAS
    // ==========================================
    function moedas() {
        return {
            html: createCalculatorPage({
                title: 'Conversor de Moedas',
                description: 'Converta moedas usando taxas de câmbio aproximadas. BRL, USD, EUR, GBP e mais.',
                category: 'Conversores',
                categorySlug: 'conversores',
                fields: [
                    { id: 'valor', label: 'Valor', placeholder: 'Ex: 1000', min: 0 },
                    { id: 'de', label: 'De', type: 'select', options: [
                        { value: 'BRL', label: '🇧🇷 Real (BRL)' },
                        { value: 'USD', label: '🇺🇸 Dólar (USD)' },
                        { value: 'EUR', label: '🇪🇺 Euro (EUR)' },
                        { value: 'GBP', label: '🇬🇧 Libra (GBP)' },
                        { value: 'JPY', label: '🇯🇵 Iene (JPY)' },
                        { value: 'ARS', label: '🇦🇷 Peso Argentino (ARS)' },
                        { value: 'BTC', label: '₿ Bitcoin (BTC)' },
                    ]},
                    { id: 'para', label: 'Para', type: 'select', options: [
                        { value: 'USD', label: '🇺🇸 Dólar (USD)' },
                        { value: 'BRL', label: '🇧🇷 Real (BRL)' },
                        { value: 'EUR', label: '🇪🇺 Euro (EUR)' },
                        { value: 'GBP', label: '🇬🇧 Libra (GBP)' },
                        { value: 'JPY', label: '🇯🇵 Iene (JPY)' },
                        { value: 'ARS', label: '🇦🇷 Peso Argentino (ARS)' },
                        { value: 'BTC', label: '₿ Bitcoin (BTC)' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                // Taxas aproximadas em relação ao USD (Ref: Maio/2024)
                const taxas = {
                    USD: 1,
                    BRL: 5.75,
                    EUR: 0.92,
                    GBP: 0.79,
                    JPY: 154.5,
                    ARS: 1200,
                    BTC: 0.0000105,
                };
                let cotacoesOnline = false;
                let ultimaAtualizacao = 'Valores fixos (Maio/2024)';

                // Insert live rate banner before the form
                const form = document.getElementById('calc-form');
                if (form) {
                    const banner = document.createElement('div');
                    banner.id = 'moedas-live-banner';
                    banner.className = 'moedas-live-banner';
                    banner.innerHTML = '<div class="moedas-loading"><span class="loading-spinner"></span> Carregando cotações em tempo real...</div>';
                    form.parentNode.insertBefore(banner, form);
                }

                initCalculator({
                    fields: [{ id: 'valor' }, { id: 'de', type: 'select' }, { id: 'para', type: 'select' }],
                    calculate(v) {
                        const valorUSD = v.valor / taxas[v.de];
                        const resultado = valorUSD * taxas[v.para];
                        const taxa = taxas[v.para] / taxas[v.de];
                        return { resultado, taxa, de: v.de, para: v.para, valor: v.valor, online: cotacoesOnline, atualizacao: ultimaAtualizacao };
                    },
                    renderResult(r) {
                        const decimals = r.para === 'BTC' ? 8 : 2;
                        const statusLabel = r.online ? '✅ Cotação em tempo real' : '⚠️ Valores aproximados (offline)';
                        const timeStr = r.atualizacao && r.online ? ` — Atualizado: ${r.atualizacao}` : (r.atualizacao ? ` — ${r.atualizacao}` : '');
                        return renderSimpleResult(
                            `${r.de} → ${r.para}`,
                            `${fmt.number(r.resultado, decimals)} ${r.para}`,
                            [
                                { label: 'Valor Original', value: `${fmt.number(r.valor, 2)} ${r.de}` },
                                { label: 'Taxa', value: `1 ${r.de} = ${fmt.number(r.taxa, decimals < 4 ? 4 : 8)} ${r.para}` },
                                { label: 'Status', value: statusLabel + timeStr },
                            ]
                        );
                    }
                });

                // Buscar cotação real via API
                fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL,ARS-BRL,JPY-BRL')
                    .then(r => r.json())
                    .then(data => {
                        if (data.USDBRL) taxas.BRL = parseFloat(data.USDBRL.bid);
                        if (data.EURBRL) taxas.EUR = 1 / parseFloat(data.EURBRL.bid) * taxas.BRL;
                        if (data.GBPBRL) taxas.GBP = 1 / parseFloat(data.GBPBRL.bid) * taxas.BRL;
                        if (data.BTCBRL) taxas.BTC = 1 / parseFloat(data.BTCBRL.bid) * taxas.BRL;
                        if (data.JPYBRL) taxas.JPY = 1 / parseFloat(data.JPYBRL.bid) * taxas.BRL;
                        if (data.ARSBRL) taxas.ARS = 1 / parseFloat(data.ARSBRL.bid) * taxas.BRL;
                        cotacoesOnline = true;
                        ultimaAtualizacao = new Date().toLocaleString('pt-BR');

                        // Update banner
                        const banner = document.getElementById('moedas-live-banner');
                        if (banner) {
                            const usdBrl = data.USDBRL ? parseFloat(data.USDBRL.bid).toFixed(4) : '—';
                            const eurBrl = data.EURBRL ? parseFloat(data.EURBRL.bid).toFixed(4) : '—';
                            const usdChange = data.USDBRL ? parseFloat(data.USDBRL.pctChange) : 0;
                            const eurChange = data.EURBRL ? parseFloat(data.EURBRL.pctChange) : 0;
                            banner.innerHTML = `
                                <div class="moedas-live-header"><span class="live-dot"></span> Cotações em Tempo Real</div>
                                <div class="moedas-live-rates">
                                    <div class="moedas-rate-item">
                                        <span class="moedas-rate-label">🇺🇸 USD/BRL</span>
                                        <span class="moedas-rate-value">R$ ${usdBrl}</span>
                                        <span class="moedas-rate-change ${usdChange >= 0 ? 'ticker-up' : 'ticker-down'}">${usdChange >= 0 ? '▲' : '▼'} ${usdChange.toFixed(2)}%</span>
                                    </div>
                                    <div class="moedas-rate-item">
                                        <span class="moedas-rate-label">🇪🇺 EUR/BRL</span>
                                        <span class="moedas-rate-value">R$ ${eurBrl}</span>
                                        <span class="moedas-rate-change ${eurChange >= 0 ? 'ticker-up' : 'ticker-down'}">${eurChange >= 0 ? '▲' : '▼'} ${eurChange.toFixed(2)}%</span>
                                    </div>
                                </div>
                                <div class="moedas-live-time">Atualizado em: ${ultimaAtualizacao}</div>
                            `;
                        }
                        CalcComponents.showToast('Cotações atualizadas em tempo real!', 'success');
                    })
                    .catch(() => {
                        const banner = document.getElementById('moedas-live-banner');
                        if (banner) banner.innerHTML = '<div class="moedas-loading">⚠️ Não foi possível carregar cotações em tempo real. Usando valores aproximados.</div>';
                    });
            }
        };
    }

    // ==========================================
    // CONVERSOR DE MEDIDAS
    // ==========================================
    function medidas() {
        return {
            html: createCalculatorPage({
                title: 'Conversor de Medidas',
                description: 'Conversor de diferentes unidades de peso, distância e volume.',
                category: 'Conversores',
                categorySlug: 'conversores',
                fields: [
                    { id: 'valor', label: 'Valor', placeholder: 'Ex: 100', min: 0 },
                    { id: 'categoria', label: 'Categoria', type: 'select', options: [
                        { value: 'peso', label: 'Peso' },
                        { value: 'comprimento', label: 'Comprimento' },
                        { value: 'volume', label: 'Volume' },
                        { value: 'area', label: 'Área' },
                    ]},
                    { id: 'de', label: 'De', type: 'select', options: [
                        // Peso
                        { value: 'mg', label: 'Miligramas (mg)' },
                        { value: 'g', label: 'Gramas (g)' },
                        { value: 'kg', label: 'Quilogramas (kg)' },
                        { value: 'ton', label: 'Toneladas (t)' },
                        { value: 'lb', label: 'Libras (lb)' },
                        { value: 'oz', label: 'Onças (oz)' },
                        // Comprimento
                        { value: 'mm', label: 'Milímetros (mm)' },
                        { value: 'cm', label: 'Centímetros (cm)' },
                        { value: 'm', label: 'Metros (m)' },
                        { value: 'km', label: 'Quilômetros (km)' },
                        { value: 'in', label: 'Polegadas (in)' },
                        { value: 'ft', label: 'Pés (ft)' },
                        { value: 'mi', label: 'Milhas (mi)' },
                        // Volume
                        { value: 'ml', label: 'Mililitros (ml)' },
                        { value: 'l', label: 'Litros (L)' },
                        { value: 'm3', label: 'Metros cúbicos (m³)' },
                        { value: 'gal', label: 'Galões (gal)' },
                        // Área
                        { value: 'mm2', label: 'mm²' },
                        { value: 'cm2', label: 'cm²' },
                        { value: 'm2', label: 'm²' },
                        { value: 'km2', label: 'km²' },
                        { value: 'ha', label: 'Hectares' },
                        { value: 'ac', label: 'Acres' },
                    ]},
                    { id: 'para', label: 'Para', type: 'select', options: [
                        { value: 'mg', label: 'Miligramas (mg)' },
                        { value: 'g', label: 'Gramas (g)' },
                        { value: 'kg', label: 'Quilogramas (kg)' },
                        { value: 'ton', label: 'Toneladas (t)' },
                        { value: 'lb', label: 'Libras (lb)' },
                        { value: 'oz', label: 'Onças (oz)' },
                        { value: 'mm', label: 'Milímetros (mm)' },
                        { value: 'cm', label: 'Centímetros (cm)' },
                        { value: 'm', label: 'Metros (m)' },
                        { value: 'km', label: 'Quilômetros (km)' },
                        { value: 'in', label: 'Polegadas (in)' },
                        { value: 'ft', label: 'Pés (ft)' },
                        { value: 'mi', label: 'Milhas (mi)' },
                        { value: 'ml', label: 'Mililitros (ml)' },
                        { value: 'l', label: 'Litros (L)' },
                        { value: 'm3', label: 'Metros cúbicos (m³)' },
                        { value: 'gal', label: 'Galões (gal)' },
                        { value: 'mm2', label: 'mm²' },
                        { value: 'cm2', label: 'cm²' },
                        { value: 'm2', label: 'm²' },
                        { value: 'km2', label: 'km²' },
                        { value: 'ha', label: 'Hectares' },
                        { value: 'ac', label: 'Acres' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                // Conversão para unidade base de cada categoria
                const conversoes = {
                    // Peso -> kg
                    mg: 0.000001, g: 0.001, kg: 1, ton: 1000, lb: 0.453592, oz: 0.0283495,
                    // Comprimento -> m
                    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, mi: 1609.34,
                    // Volume -> l
                    ml: 0.001, l: 1, m3: 1000, gal: 3.78541,
                    // Área -> m2
                    mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1000000, ha: 10000, ac: 4046.86,
                };

                const categoriaSelect = document.getElementById('field-categoria');
                const deSelect = document.getElementById('field-de');
                const paraSelect = document.getElementById('field-para');

                if (categoriaSelect && deSelect && paraSelect) {
                    const grupos = {
                        peso: ['mg', 'g', 'kg', 'ton', 'lb', 'oz'],
                        comprimento: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'mi'],
                        volume: ['ml', 'l', 'm3', 'gal'],
                        area: ['mm2', 'cm2', 'm2', 'km2', 'ha', 'ac']
                    };

                    const todasOptionsDe = Array.from(deSelect.options);
                    const todasOptionsPara = Array.from(paraSelect.options);

                    const updateOptions = () => {
                        const cat = categoriaSelect.value;
                        const permitidos = grupos[cat];
                        
                        const currDe = deSelect.value;
                        const currPara = paraSelect.value;

                        deSelect.innerHTML = '';
                        todasOptionsDe.forEach(opt => {
                            if (permitidos.includes(opt.value)) deSelect.appendChild(opt.cloneNode(true));
                        });
                        if (permitidos.includes(currDe)) deSelect.value = currDe;

                        paraSelect.innerHTML = '';
                        todasOptionsPara.forEach(opt => {
                            if (permitidos.includes(opt.value)) paraSelect.appendChild(opt.cloneNode(true));
                        });
                        if (permitidos.includes(currPara)) paraSelect.value = currPara;
                    };

                    categoriaSelect.addEventListener('change', updateOptions);
                    updateOptions();
                }

                initCalculator({
                    fields: [{ id: 'valor' }, { id: 'categoria', type: 'select' }, { id: 'de', type: 'select' }, { id: 'para', type: 'select' }],
                    calculate(v) {
                        const fatDe = conversoes[v.de];
                        const fatPara = conversoes[v.para];
                        if (!fatDe || !fatPara) throw new Error('Unidades incompatíveis');
                        const resultado = v.valor * (fatDe / fatPara);
                        return { resultado, de: v.de, para: v.para, valor: v.valor };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            'Resultado da Conversão',
                            `${fmt.number(r.resultado, 6)} ${r.para}`,
                            [
                                { label: 'Valor Original', value: `${fmt.number(r.valor, 6)} ${r.de}` },
                            ]
                        );
                    }
                });
            }
        };
    }

    // ==========================================
    // CONVERSOR DE TEMPERATURA
    // ==========================================
    function temperatura() {
        return {
            html: createCalculatorPage({
                title: 'Conversor de Temperatura',
                description: 'Conversor de temperaturas entre Celsius, Fahrenheit e Kelvin.',
                category: 'Conversores',
                categorySlug: 'conversores',
                fields: [
                    { id: 'valor', label: 'Temperatura', placeholder: 'Ex: 100' },
                    { id: 'de', label: 'De', type: 'select', options: [
                        { value: 'C', label: '°C Celsius' },
                        { value: 'F', label: '°F Fahrenheit' },
                        { value: 'K', label: 'K Kelvin' },
                    ]},
                    { id: 'para', label: 'Para', type: 'select', options: [
                        { value: 'F', label: '°F Fahrenheit' },
                        { value: 'C', label: '°C Celsius' },
                        { value: 'K', label: 'K Kelvin' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'valor' }, { id: 'de', type: 'select' }, { id: 'para', type: 'select' }],
                    calculate(v) {
                        // Converter para Celsius primeiro
                        let celsius;
                        switch (v.de) {
                            case 'C': celsius = v.valor; break;
                            case 'F': celsius = (v.valor - 32) * 5/9; break;
                            case 'K': celsius = v.valor - 273.15; break;
                        }
                        // Converter para destino
                        let resultado;
                        switch (v.para) {
                            case 'C': resultado = celsius; break;
                            case 'F': resultado = celsius * 9/5 + 32; break;
                            case 'K': resultado = celsius + 273.15; break;
                        }
                        const simbolos = { C: '°C', F: '°F', K: 'K' };
                        return { resultado, de: simbolos[v.de], para: simbolos[v.para], valor: v.valor };
                    },
                    renderResult(r) {
                        return renderSimpleResult(
                            'Conversão de Temperatura',
                            `${fmt.number(r.resultado)} ${r.para}`,
                            [
                                { label: 'Valor Original', value: `${fmt.number(r.valor)} ${r.de}` },
                            ]
                        );
                    }
                });
            }
        };
    }

    const routes = {
        '/conversores/moedas': moedas,
        '/conversores/medidas': medidas,
        '/conversores/temperatura': temperatura,
    };

    return { routes, renderCategory };
})();
