/**
 * CalculaDeTudo - Módulo Impostos
 * 
 * Calculadoras: IRPF, Simples Nacional, Lucro Presumido, Lucro Real
 */

const ImpostosModule = (() => {
    const { fmt, createCalculatorPage, initCalculator, renderSimpleResult, renderTableResult, createCategoryPage } = CalcComponents;

    const calculadoras = [
        { name: 'Imposto de Renda (IRPF)', route: '/impostos/irpf', keywords: ['irpf', 'imposto', 'renda', 'pessoa física', 'deduções'] },
        { name: 'Simples Nacional', route: '/impostos/simples-nacional', keywords: ['simples', 'nacional', 'mei', 'microempresa', 'anexo'] },
        { name: 'Lucro Presumido', route: '/impostos/lucro-presumido', keywords: ['lucro', 'presumido', 'pis', 'cofins', 'irpj', 'csll'] },
        { name: 'Lucro Real', route: '/impostos/lucro-real', keywords: ['lucro', 'real', 'faturamento', 'custos', 'despesas'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Impostos', categorySlug: 'impostos' });
    });

    function renderCategory() {
        return createCategoryPage({
            title: 'Impostos',
            description: 'Calculadoras tributárias para IRPF, Simples Nacional, Lucro Presumido e Real.',
            icon: '🧾',
            color: 'var(--cat-impostos)',
            colorLight: '#fef3c7',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            }))
        });
    }

    // ==========================================
    // CALCULADORA DE IRPF
    // ==========================================
    function irpf() {
        // Tabela IRPF 2024/2025
        const faixas = [
            { limite: 2259.20, aliquota: 0, deducao: 0 },
            { limite: 2826.65, aliquota: 7.5, deducao: 169.44 },
            { limite: 3751.05, aliquota: 15, deducao: 381.44 },
            { limite: 4664.68, aliquota: 22.5, deducao: 662.77 },
            { limite: Infinity, aliquota: 27.5, deducao: 884.96 },
        ];

        return {
            html: createCalculatorPage({
                title: 'Calculadora de Imposto de Renda (IRPF)',
                description: 'Calcule e simule o Imposto de Renda Pessoa Física com as faixas progressivas atualizadas.',
                category: 'Impostos',
                categorySlug: 'impostos',
                fields: [
                    { id: 'salario', label: 'Salário Bruto Mensal (R$)', placeholder: 'Ex: 8000', min: 0 },
                    { id: 'dependentes', label: 'Número de Dependentes', placeholder: 'Ex: 2', min: 0, required: false },
                    { id: 'inss', label: 'Desconto INSS (R$)', placeholder: 'Ex: 700', min: 0, required: false, hint: 'Deixe em branco para cálculo automático' },
                    { id: 'outrasDeducoes', label: 'Outras Deduções (R$)', placeholder: 'Ex: 500', min: 0, required: false },
                    { id: 'tipoDesconto', label: 'Tipo de Desconto', type: 'select', options: [
                        { value: 'automatico', label: 'Automático (Mais vantajoso)' },
                        { value: 'legal', label: 'Deduções Legais (Completa)' },
                        { value: 'simplificado', label: 'Desconto Simplificado (R$ 528,00)' },
                    ]},
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'salario' }, { id: 'dependentes' }, { id: 'inss' }, { id: 'outrasDeducoes' }, { id: 'tipoDesconto', type: 'select' },
                    ],
                    calculate(v) {
                        // INSS automático se não informado
                        let inss = v.inss || 0;
                        if (!v.inss || isNaN(v.inss)) {
                            // Faixas INSS 2024
                            const faixasINSS = [
                                { limite: 1412.00, aliquota: 7.5 },
                                { limite: 2666.68, aliquota: 9 },
                                { limite: 4000.03, aliquota: 12 },
                                { limite: 7786.02, aliquota: 14 },
                            ];
                            inss = 0;
                            let salarioRestante = v.salario;
                            let anterior = 0;
                            for (const faixa of faixasINSS) {
                                if (salarioRestante <= 0) break;
                                const base = Math.min(salarioRestante, faixa.limite - anterior);
                                inss += base * (faixa.aliquota / 100);
                                salarioRestante -= base;
                                anterior = faixa.limite;
                            }
                        }

                        const dedDependentes = (v.dependentes || 0) * 189.59;
                        const totalDeducoesLegais = inss + dedDependentes + (v.outrasDeducoes || 0);
                        
                        let deducoesUsadas = 0;
                        let tipoAplicado = '';
                        
                        if (v.tipoDesconto === 'simplificado') {
                            deducoesUsadas = 528;
                            tipoAplicado = 'Simplificado (R$ 528,00)';
                        } else if (v.tipoDesconto === 'legal') {
                            deducoesUsadas = totalDeducoesLegais;
                            tipoAplicado = 'Deduções Legais';
                        } else {
                            if (528 > totalDeducoesLegais) {
                                deducoesUsadas = 528;
                                tipoAplicado = 'Simplificado (Automático)';
                            } else {
                                deducoesUsadas = totalDeducoesLegais;
                                tipoAplicado = 'Deduções Legais (Automático)';
                            }
                        }

                        const baseCalculo = v.salario - deducoesUsadas;

                        let irpfVal = 0;
                        let aliquotaEfetiva = 0;
                        let faixaUsada = '';

                        for (const faixa of faixas) {
                            if (baseCalculo <= faixa.limite) {
                                irpfVal = baseCalculo * (faixa.aliquota / 100) - faixa.deducao;
                                aliquotaEfetiva = faixa.aliquota;
                                faixaUsada = faixa.aliquota + '%';
                                break;
                            }
                        }

                        irpfVal = Math.max(0, irpfVal);
                        const salarioLiquido = v.salario - inss - irpfVal;
                        const aliquotaReal = (irpfVal / v.salario) * 100;

                        return { irpf: irpfVal, inss, baseCalculo: Math.max(0, baseCalculo), salarioLiquido, aliquotaReal, faixaUsada, salarioBruto: v.salario, tipoAplicado, deducoesUsadas };
                    },
                    renderResult(r) {
                        return renderSimpleResult('IRPF a Pagar', fmt.currency(r.irpf), [
                            { label: 'Salário Bruto', value: fmt.currency(r.salarioBruto) },
                            { label: 'INSS', value: '- ' + fmt.currency(r.inss) },
                            { label: 'Desconto Aplicado', value: r.tipoAplicado },
                            { label: 'Base de Cálculo', value: fmt.currency(r.baseCalculo) },
                            { label: 'Faixa', value: r.faixaUsada },
                            { label: 'Alíquota Efetiva', value: fmt.percent(r.aliquotaReal) },
                            { label: 'Salário Líquido', value: fmt.currency(r.salarioLiquido) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DE SIMPLES NACIONAL
    // ==========================================
    function simplesNacional() {
        // Tabelas do Simples Nacional (Anexos 1 a 5)
        const anexos = {
            '1': { nome: 'Comércio', faixas: [
                { limite: 180000, aliquota: 4, deducao: 0 },
                { limite: 360000, aliquota: 7.3, deducao: 5940 },
                { limite: 720000, aliquota: 9.5, deducao: 13860 },
                { limite: 1800000, aliquota: 10.7, deducao: 22500 },
                { limite: 3600000, aliquota: 14.3, deducao: 87300 },
                { limite: 4800000, aliquota: 19, deducao: 378000 },
            ]},
            '2': { nome: 'Indústria', faixas: [
                { limite: 180000, aliquota: 4.5, deducao: 0 },
                { limite: 360000, aliquota: 7.8, deducao: 5940 },
                { limite: 720000, aliquota: 10, deducao: 13860 },
                { limite: 1800000, aliquota: 11.2, deducao: 22500 },
                { limite: 3600000, aliquota: 14.7, deducao: 85500 },
                { limite: 4800000, aliquota: 30, deducao: 720000 },
            ]},
            '3': { nome: 'Serviços (Locação, cessão de bens)', faixas: [
                { limite: 180000, aliquota: 6, deducao: 0 },
                { limite: 360000, aliquota: 11.2, deducao: 9360 },
                { limite: 720000, aliquota: 13.5, deducao: 17640 },
                { limite: 1800000, aliquota: 16, deducao: 35640 },
                { limite: 3600000, aliquota: 21, deducao: 125640 },
                { limite: 4800000, aliquota: 33, deducao: 648000 },
            ]},
            '4': { nome: 'Serviços (Advogados, engenheiros etc)', faixas: [
                { limite: 180000, aliquota: 4.5, deducao: 0 },
                { limite: 360000, aliquota: 9, deducao: 8100 },
                { limite: 720000, aliquota: 10.2, deducao: 12420 },
                { limite: 1800000, aliquota: 14, deducao: 39780 },
                { limite: 3600000, aliquota: 22, deducao: 183780 },
                { limite: 4800000, aliquota: 33, deducao: 828000 },
            ]},
            '5': { nome: 'Serviços (TI, jornalismo etc)', faixas: [
                { limite: 180000, aliquota: 15.5, deducao: 0 },
                { limite: 360000, aliquota: 18, deducao: 4500 },
                { limite: 720000, aliquota: 19.5, deducao: 9900 },
                { limite: 1800000, aliquota: 20.5, deducao: 17100 },
                { limite: 3600000, aliquota: 23, deducao: 62100 },
                { limite: 4800000, aliquota: 30.5, deducao: 540000 },
            ]},
        };

        return {
            html: createCalculatorPage({
                title: 'Calculadora de Simples Nacional',
                description: 'Calcule e simule o imposto do Simples Nacional com base no RBT12 e anexo correspondente.',
                category: 'Impostos',
                categorySlug: 'impostos',
                fields: [
                    { id: 'rbt12', label: 'Receita Bruta 12 meses (R$)', placeholder: 'Ex: 500000', min: 0, hint: 'RBT12 - Soma do faturamento dos últimos 12 meses' },
                    { id: 'fatIsento', label: 'Faturamento do Mês — Isento de ISS (R$)', placeholder: 'Ex: 30000', min: 0, required: false, hint: 'Pelo menos um dos faturamentos do mês é obrigatório. Receita de atividades não sujeitas ao ISS' },
                    { id: 'fatComISS', label: 'Faturamento do Mês — Com ISS (R$)', placeholder: 'Ex: 20000', min: 0, required: false, hint: 'Pelo menos um dos faturamentos do mês é obrigatório. Receita de atividades sujeitas ao ISS' },
                    { id: 'anexo', label: 'Anexo', type: 'select', options: [
                        { value: '1', label: 'Anexo I - Comércio' },
                        { value: '2', label: 'Anexo II - Indústria' },
                        { value: '3', label: 'Anexo III - Serviços' },
                        { value: '4', label: 'Anexo IV - Serviços' },
                        { value: '5', label: 'Anexo V - Serviços (TI)' },
                    ]},
                    { id: 'folha', label: 'Folha Salarial Mensal (R$)', placeholder: 'Ex: 20000', min: 0, required: false, hint: 'Necessário para fator R (Anexo V)' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                const fatIsento = document.getElementById('field-fatIsento');
                const fatComISS = document.getElementById('field-fatComISS');
                if (fatIsento && fatComISS) {
                    const validateReq = () => {
                        if (fatIsento.value || fatComISS.value) {
                            fatIsento.removeAttribute('required');
                            fatComISS.removeAttribute('required');
                        } else {
                            fatIsento.setAttribute('required', 'required');
                            fatComISS.setAttribute('required', 'required');
                        }
                    };
                    fatIsento.addEventListener('input', validateReq);
                    fatComISS.addEventListener('input', validateReq);
                    validateReq();
                }

                initCalculator({
                    fields: [
                        { id: 'rbt12' }, { id: 'fatIsento' }, { id: 'fatComISS' }, { id: 'anexo', type: 'select' }, { id: 'folha' },
                    ],
                    calculate(v) {
                        const fatIsento = v.fatIsento || 0;
                        const fatComISS = v.fatComISS || 0;
                        const faturamentoTotal = fatIsento + fatComISS;
                        if (faturamentoTotal <= 0) throw new Error('Informe ao menos um campo de faturamento');
                        if (v.rbt12 > 4800000) throw new Error('RBT12 excede o limite do Simples Nacional');

                        let anexoUsado = v.anexo;
                        if (v.anexo === '5' && v.folha) {
                            const fatorR = (v.folha * 12) / v.rbt12;
                            if (fatorR >= 0.28) anexoUsado = '3';
                        }

                        const faixasAnexo = anexos[anexoUsado].faixas;
                        let aliquotaNominal, deducao;
                        for (const faixa of faixasAnexo) {
                            if (v.rbt12 <= faixa.limite) {
                                aliquotaNominal = faixa.aliquota;
                                deducao = faixa.deducao;
                                break;
                            }
                        }

                        const aliquotaEfetiva = ((v.rbt12 * (aliquotaNominal / 100)) - deducao) / v.rbt12;
                        const impostoIsento = fatIsento * aliquotaEfetiva;
                        const impostoComISS = fatComISS * aliquotaEfetiva;
                        const impostoTotal = impostoIsento + impostoComISS;

                        return {
                            impostoTotal, impostoIsento, impostoComISS,
                            aliquotaEfetiva: aliquotaEfetiva * 100,
                            aliquotaNominal,
                            anexo: anexos[v.anexo].nome,
                            anexoUsado: anexos[anexoUsado].nome,
                            faturamentoTotal, fatIsento, fatComISS,
                        };
                    },
                    renderResult(r) {
                        return renderSimpleResult('Imposto do Mês', fmt.currency(r.impostoTotal), [
                            { label: 'Faturamento Total', value: fmt.currency(r.faturamentoTotal) },
                            { label: '  ↳ Isento de ISS', value: fmt.currency(r.fatIsento) },
                            { label: '  ↳ Com ISS', value: fmt.currency(r.fatComISS) },
                            { label: 'Imposto s/ Isento', value: fmt.currency(r.impostoIsento) },
                            { label: 'Imposto s/ Com ISS', value: fmt.currency(r.impostoComISS) },
                            { label: 'Anexo', value: r.anexoUsado },
                            { label: 'Alíquota Nominal', value: fmt.percent(r.aliquotaNominal) },
                            { label: 'Alíquota Efetiva', value: fmt.percent(r.aliquotaEfetiva) },
                        ]);
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DE LUCRO PRESUMIDO
    // ==========================================
    function lucroPresumido() {
        return {
            html: createCalculatorPage({
                title: 'Calculadora de Lucro Presumido',
                description: 'Calcule os impostos pelo Lucro Presumido. Mensal: PIS e COFINS. Trimestral: IRPJ e CSLL.',
                category: 'Impostos',
                categorySlug: 'impostos',
                fields: [
                    { id: 'periodo', label: 'Período de Apuração', type: 'select', options: [
                        { value: 'mensal', label: 'Mensal (PIS e COFINS)' },
                        { value: 'trimestral', label: 'Trimestral (IRPJ e CSLL)' },
                    ]},
                    { id: 'faturamento', label: 'Faturamento do Período (R$)', placeholder: 'Ex: 100000', min: 0 },
                    { id: 'atividade', label: 'Tipo de Atividade', type: 'select', options: [
                        { value: 'comercio', label: 'Comércio (presunção 8%)' },
                        { value: 'servicos', label: 'Serviços (presunção 32%)' },
                        { value: 'industria', label: 'Indústria (presunção 8%)' },
                        { value: 'transporte', label: 'Transporte (presunção 16%)' },
                    ]},
                    { id: 'iss', label: 'Alíquota ISS (%)', placeholder: 'Ex: 5', min: 0, max: 5, required: false, hint: 'Aplicável apenas a serviços' },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [{ id: 'periodo', type: 'select' }, { id: 'faturamento' }, { id: 'atividade', type: 'select' }, { id: 'iss' }],
                    calculate(v) {
                        const presuncoes = {
                            comercio: { irpj: 8, csll: 12 },
                            servicos: { irpj: 32, csll: 32 },
                            industria: { irpj: 8, csll: 12 },
                            transporte: { irpj: 16, csll: 12 },
                        };
                        const p = presuncoes[v.atividade];
                        const issVal = v.atividade === 'servicos' ? v.faturamento * ((v.iss || 5) / 100) : 0;

                        if (v.periodo === 'mensal') {
                            const pis = v.faturamento * 0.0065;
                            const cofins = v.faturamento * 0.03;
                            const total = pis + cofins + issVal;
                            const carga = (total / v.faturamento) * 100;
                            return { periodo: 'Mensal', pis, cofins, iss: issVal, total, carga, faturamento: v.faturamento, isMensal: true };
                        } else {
                            const baseIRPJ = v.faturamento * (p.irpj / 100);
                            const baseCSLL = v.faturamento * (p.csll / 100);
                            const irpj = baseIRPJ * 0.15;
                            const adicionalIR = baseIRPJ > 60000 ? (baseIRPJ - 60000) * 0.10 : 0;
                            const csll = baseCSLL * 0.09;
                            const total = irpj + adicionalIR + csll + issVal;
                            const carga = (total / v.faturamento) * 100;
                            return { periodo: 'Trimestral', irpj, adicionalIR, csll, iss: issVal, total, carga, faturamento: v.faturamento, isMensal: false };
                        }
                    },
                    renderResult(r) {
                        const details = [{ label: 'Período', value: r.periodo }, { label: 'Faturamento', value: fmt.currency(r.faturamento) }];
                        if (r.isMensal) {
                            details.push({ label: 'PIS (0,65%)', value: fmt.currency(r.pis) });
                            details.push({ label: 'COFINS (3%)', value: fmt.currency(r.cofins) });
                        } else {
                            details.push({ label: 'IRPJ (15%)', value: fmt.currency(r.irpj) });
                            details.push({ label: 'Adicional IR (10%)', value: fmt.currency(r.adicionalIR) });
                            details.push({ label: 'CSLL (9%)', value: fmt.currency(r.csll) });
                        }
                        details.push({ label: 'ISS', value: fmt.currency(r.iss) });
                        details.push({ label: 'Carga Tributária Efetiva', value: fmt.percent(r.carga) });
                        return renderSimpleResult('Total de Impostos', fmt.currency(r.total), details);
                    }
                });
            }
        };
    }

    // ==========================================
    // CALCULADORA DE LUCRO REAL
    // ==========================================
    function lucroReal() {
        return {
            html: createCalculatorPage({
                title: 'Calculadora de Lucro Real',
                description: 'Calcule e simule impostos pelo regime de Lucro Real com base no lucro efetivo da empresa.',
                category: 'Impostos',
                categorySlug: 'impostos',
                fields: [
                    { id: 'faturamento', label: 'Faturamento Trimestral (R$)', placeholder: 'Ex: 1000000', min: 0 },
                    { id: 'custos', label: 'Custos (R$)', placeholder: 'Ex: 400000', min: 0 },
                    { id: 'despesas', label: 'Despesas Operacionais (R$)', placeholder: 'Ex: 200000', min: 0 },
                    { id: 'folha', label: 'Folha Salarial (R$)', placeholder: 'Ex: 150000', min: 0, required: false },
                ],
                calculate: v => v,
                renderResult: v => v,
            }),
            init: () => {
                initCalculator({
                    fields: [
                        { id: 'faturamento' }, { id: 'custos' }, { id: 'despesas' }, { id: 'folha' },
                    ],
                    calculate(v) {
                        const lucro = v.faturamento - v.custos - v.despesas - (v.folha || 0);
                        if (lucro < 0) {
                            return { prejuizo: true, lucro };
                        }

                        const irpj = lucro * 0.15;
                        const adicionalIR = lucro > 60000 ? (lucro - 60000) * 0.10 : 0;
                        const csll = lucro * 0.09;
                        const pis = v.faturamento * 0.0165;
                        const cofins = v.faturamento * 0.076;
                        const total = irpj + adicionalIR + csll + pis + cofins;
                        const carga = (total / v.faturamento) * 100;

                        return { lucro, irpj, adicionalIR, csll, pis, cofins, total, carga, prejuizo: false };
                    },
                    renderResult(r) {
                        if (r.prejuizo) {
                            return renderSimpleResult('Resultado', 'Prejuízo', [
                                { label: 'Lucro/Prejuízo', value: fmt.currency(r.lucro) },
                                { label: 'Status', value: 'Sem imposto sobre lucro (prejuízo fiscal)' },
                            ]);
                        }
                        return renderSimpleResult('Total de Impostos', fmt.currency(r.total), [
                            { label: 'Lucro Tributável', value: fmt.currency(r.lucro) },
                            { label: 'IRPJ (15%)', value: fmt.currency(r.irpj) },
                            { label: 'Adicional IR', value: fmt.currency(r.adicionalIR) },
                            { label: 'CSLL (9%)', value: fmt.currency(r.csll) },
                            { label: 'PIS (1,65%)', value: fmt.currency(r.pis) },
                            { label: 'COFINS (7,6%)', value: fmt.currency(r.cofins) },
                            { label: 'Carga Efetiva', value: fmt.percent(r.carga) },
                        ]);
                    }
                });
            }
        };
    }

    const routes = {
        '/impostos/irpf': irpf,
        '/impostos/simples-nacional': simplesNacional,
        '/impostos/lucro-presumido': lucroPresumido,
        '/impostos/lucro-real': lucroReal,
    };

    return { routes, renderCategory };
})();
