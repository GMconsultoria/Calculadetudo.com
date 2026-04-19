/**
 * CalcHub - Módulo Conversores
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
            description: 'Converta moedas, medidas e temperaturas de forma rápida e precisa.',
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
    // MOEDAS
    // ==========================================
    function moedas() {
        return {
            html: createCalculatorPage({
                title: 'Conversor de Moedas',
                description: 'Converta entre moedas usando taxas de câmbio aproximadas. BRL, USD, EUR, GBP e mais.',
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
                // Taxas aproximadas em relação ao USD
                const taxas = {
                    USD: 1,
                    BRL: 5.75,
                    EUR: 0.92,
                    GBP: 0.79,
                    JPY: 154.5,
                    ARS: 1050,
                    BTC: 0.0000145,
                };

                initCalculator({
                    fields: [{ id: 'valor' }, { id: 'de', type: 'select' }, { id: 'para', type: 'select' }],
                    calculate(v) {
                        const valorUSD = v.valor / taxas[v.de];
                        const resultado = valorUSD * taxas[v.para];
                        const taxa = taxas[v.para] / taxas[v.de];
                        return { resultado, taxa, de: v.de, para: v.para, valor: v.valor };
                    },
                    renderResult(r) {
                        const decimals = r.para === 'BTC' ? 8 : 2;
                        return renderSimpleResult(
                            `${r.de} → ${r.para}`,
                            `${fmt.number(r.resultado, decimals)} ${r.para}`,
                            [
                                { label: 'Valor Original', value: `${fmt.number(r.valor, 2)} ${r.de}` },
                                { label: 'Taxa', value: `1 ${r.de} = ${fmt.number(r.taxa, decimals < 4 ? 4 : 8)} ${r.para}` },
                                { label: '⚠️ Taxas', value: 'Valores aproximados (offline)' },
                            ]
                        );
                    }
                });

                // Tentar buscar cotação real via API
                fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL,ARS-BRL,JPY-BRL')
                    .then(r => r.json())
                    .then(data => {
                        if (data.USDBRL) taxas.BRL = parseFloat(data.USDBRL.bid);
                        if (data.EURBRL) taxas.EUR = 1 / parseFloat(data.EURBRL.bid) * taxas.BRL;
                        if (data.GBPBRL) taxas.GBP = 1 / parseFloat(data.GBPBRL.bid) * taxas.BRL;
                        if (data.BTCBRL) taxas.BTC = 1 / parseFloat(data.BTCBRL.bid) * taxas.BRL;
                        if (data.JPYBRL) taxas.JPY = 1 / parseFloat(data.JPYBRL.bid) * taxas.BRL;
                        if (data.ARSBRL) taxas.ARS = 1 / parseFloat(data.ARSBRL.bid) * taxas.BRL;
                        CalcComponents.showToast('Cotações atualizadas em tempo real!', 'success');
                    })
                    .catch(() => {});
            }
        };
    }

    // ==========================================
    // MEDIDAS
    // ==========================================
    function medidas() {
        return {
            html: createCalculatorPage({
                title: 'Conversor de Medidas',
                description: 'Converta entre diferentes unidades de peso, distância e volume.',
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
    // TEMPERATURA
    // ==========================================
    function temperatura() {
        return {
            html: createCalculatorPage({
                title: 'Conversor de Temperatura',
                description: 'Converta temperaturas entre Celsius, Fahrenheit e Kelvin.',
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
