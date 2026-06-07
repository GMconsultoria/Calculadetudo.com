/**
 * CalculaDeTudo - Módulo Curiosidades
 * 
 * Calculadora de tempo entre fatos históricos
 */

const CuriosidadesModule = (() => {
    const { fmt, createCategoryPage, renderSimpleResult } = CalcComponents;

    // ---- Fatos Históricos ----
    const fatosHistoricos = [
        { id: 'hoje', label: '📅 Data de Hoje', date: null },
        { id: 'custom', label: '✏️ Data Personalizada', date: null },
        { id: 'descobrimento-brasil', label: '🇧🇷 Descobrimento do Brasil', date: '1500-04-22', ano: 1500 },
        { id: 'independencia-brasil', label: '🇧🇷 Independência do Brasil', date: '1822-09-07', ano: 1822 },
        { id: 'abolicao-escravatura', label: '🇧🇷 Abolição da Escravatura', date: '1888-05-13', ano: 1888 },
        { id: 'proclamacao-republica', label: '🇧🇷 Proclamação da República', date: '1889-11-15', ano: 1889 },
        { id: 'inconfidencia-mineira', label: '🇧🇷 Inconfidência Mineira', date: '1789-03-15', ano: 1789 },
        { id: 'morte-tiradentes', label: '🇧🇷 Morte de Tiradentes', date: '1792-04-21', ano: 1792 },
        { id: 'copa-brasil-2014', label: '🇧🇷 Copa do Mundo no Brasil', date: '2014-06-12', ano: 2014 },
        { id: 'nascimento-jesus', label: '✝️ Nascimento de Jesus Cristo', date: '0001-12-25', ano: 1 },
        { id: 'crucificacao-jesus', label: '✝️ Crucificação de Jesus', date: '0033-04-07', ano: 33 },
        { id: 'descobrimento-america', label: '🌎 Descobrimento da América', date: '1492-10-12', ano: 1492 },
        { id: 'tratado-tordesilhas', label: '🌎 Tratado de Tordesilhas', date: '1494-06-07', ano: 1494 },
        { id: 'queda-imperio-romano', label: '🏛️ Queda do Império Romano', date: '0476-09-04', ano: 476 },
        { id: 'renascimento', label: '🎨 Início do Renascimento', date: '1400-01-01', ano: 1400 },
        { id: 'nascimento-da-vinci', label: '🎨 Nascimento de Leonardo da Vinci', date: '1452-04-15', ano: 1452 },
        { id: 'revolucao-francesa', label: '🇫🇷 Revolução Francesa', date: '1789-07-14', ano: 1789 },
        { id: 'independencia-eua', label: '🇺🇸 Independência dos EUA', date: '1776-07-04', ano: 1776 },
        { id: 'revolucao-russa', label: '🇷🇺 Revolução Russa', date: '1917-11-07', ano: 1917 },
        { id: 'inicio-ww1', label: '⚔️ Início da 1ª Guerra Mundial', date: '1914-07-28', ano: 1914 },
        { id: 'fim-ww1', label: '⚔️ Fim da 1ª Guerra Mundial', date: '1918-11-11', ano: 1918 },
        { id: 'inicio-ww2', label: '⚔️ Início da 2ª Guerra Mundial', date: '1939-09-01', ano: 1939 },
        { id: 'fim-ww2', label: '⚔️ Fim da 2ª Guerra Mundial', date: '1945-09-02', ano: 1945 },
        { id: 'bomba-hiroshima', label: '☢️ Bomba de Hiroshima', date: '1945-08-06', ano: 1945 },
        { id: 'declaracao-direitos-humanos', label: '🕊️ Declaração Universal dos Direitos Humanos', date: '1948-12-10', ano: 1948 },
        { id: 'homem-lua', label: '🚀 Chegada do Homem à Lua', date: '1969-07-20', ano: 1969 },
        { id: 'queda-muro-berlim', label: '🧱 Queda do Muro de Berlim', date: '1989-11-09', ano: 1989 },
        { id: 'fim-urss', label: '🇷🇺 Fim da União Soviética', date: '1991-12-25', ano: 1991 },
        { id: 'inicio-internet', label: '🌐 Início da Internet Pública', date: '1983-01-01', ano: 1983 },
        { id: '11-setembro', label: '🇺🇸 Atentado de 11 de Setembro', date: '2001-09-11', ano: 2001 },
        { id: 'pandemia-covid', label: '🦠 Pandemia de COVID-19 (declaração OMS)', date: '2020-03-11', ano: 2020 },
        { id: 'muralha-china', label: '🏯 Construção da Grande Muralha da China', date: '-0221-01-01', ano: -221 },
    ];

    const calculadoras = [
        { name: 'Tempo entre Fatos Históricos', route: '/curiosidades/fatos-historicos', keywords: ['curiosidade', 'história', 'fato', 'tempo', 'passado', 'guerra', 'descobrimento'] },
    ];

    calculadoras.forEach(c => {
        CalcSearch.register({ ...c, category: 'Curiosidades', categorySlug: 'curiosidades' });
    });

    function renderCategory() {
        return createCategoryPage({
            title: 'Curiosidades',
            description: 'Descubra quanto tempo se passou entre os grandes fatos da história da humanidade.',
            icon: '🏛️',
            color: 'var(--cat-curiosidades)',
            colorLight: '#fef9c3',
            items: calculadoras.map(c => ({
                title: c.name,
                description: c.keywords.slice(0, 3).join(', '),
                route: c.route
            })),
            editorialContent: `
                <h2>O Tempo da História: Perspectivas que Mudam Tudo</h2>
                <p>A história é árida quando só envolve datas memorizadas. Mas se torna fascinante quando você percebe <em>o quanto de tempo realmente se passou</em>. Sabia que entre o nascimento de Cleópatra e o primeiro iPhone, o avanço tecnológico de Cleópatra é MAIS DISTANTE do nascimento de Jesus do que de nós hoje?</p>
                <p>Nossa seção de Curiosidades foi criada para transformar a percepção da história com uma única ferramenta poderosa: a <strong>calculadora de Tempo entre Fatos Históricos</strong>. Mais de 30 marcos clássicos já estão pré-carregados, de antes de Cristo até a Pandemia de COVID-19.</p>

                <h3>Por que calcular tempo histórico é fascinante?</h3>
                <ul>
                    <li><strong>Perspectiva Real:</strong> A 2ª Guerra Mundial terminou há menos de 80 anos. A chegada do homem à Lua aconteceu há menos de 60. Humanamente, isso é o tempo de vida de um único ser humano!</li>
                    <li><strong>Comparações Surpreendentes:</strong> Use nossa ferramenta para comparar qualquer par de eventos: quantas gerações humanas se passaram da Inconfidência Mineira até hoje? Quantas Olimpíadas ocorreram desde a Independência do Brasil?</li>
                    <li><strong>Fun Facts Automáticos:</strong> Ao calcular um período, exibimos além do número de dias, as estimativas de <em>batimentos cardíacos</em> que um coração humano teria dado nesse período. Uma forma visceral de entender a escala do tempo.</li>
                </ul>

                <div class="example-box">
                    <h4>Curiosidade: Da Conquista da Lua ao ChatGPT</h4>
                    <p>Entre a chegada do homem à Lua (20 de julho de 1969) e o lançamento do ChatGPT ao público (30 de novembro de 2022), passaram-se aproximadamente <strong>53 anos e 4 meses</strong>.</p>
                    <p>Pense nisso: em pouco mais de 5 décadas, a humanidade foi da conquista do espaço sideral à criação de uma inteligência artificial que conversa como um humano. Use nossa calculadora para explorar e descobrir outros paríes de eventos marcantes da história!</p>
                </div>

                <h3>Como Funciona a Calculadora</h3>
                <p>A ferramenta oferece dois modos de uso:</p>
                <ol>
                    <li>Selecione <strong>dois eventos pré-definidos</strong> da lista (do Nascimento de Jesus à Pandemia de COVID-19) e clique em Calcular.</li>
                    <li>Use a opção <strong>"Data Personalizada"</strong> em qualquer um dos campos para inserir manualmente qualquer data, permitindo calcular o tempo até ou desde qualquer momento da história.</li>
                </ol>
                <p>O resultado inclui a diferença em <strong>anos, meses, dias, horas, minutos e segundos</strong>, além de dados curiosos como o número de gerações humanas e Olimpíadas realizadas nesse período.</p>

                <h3>Inspire-se: Combinações que vai querer tentar</h3>
                <p>Confira estas comparações que garantem revelarões chocantes:</p>
                <ul>
                    <li>Queda do Império Romano → Proclamação da República do Brasil</li>
                    <li>Homem na Lua → Hoje</li>
                    <li>1ª Guerra Mundial → 2ª Guerra Mundial (e compare com o quanto já estamos de paz...)</li>
                </ul>
            `
        });
    }

    // ==========================================
    // CALCULADORA DE FATOS HISTÓRICOS
    // ==========================================
    function fatosHistoricosCalc() {
        const optionsHTML = fatosHistoricos.map(f =>
            `<option value="${f.id}">${f.label}</option>`
        ).join('');

        const html = `
            <div class="calc-page">
                <nav class="calc-breadcrumb" aria-label="Breadcrumb">
                    <a href="/">Início</a>
                    <span class="sep">›</span>
                    <a href="/categoria/curiosidades">Curiosidades</a>
                    <span class="sep">›</span>
                    <span>Tempo entre Fatos Históricos</span>
                </nav>

                <header class="calc-header">
                    <h1 class="calc-title">Tempo entre Fatos Históricos</h1>
                    <p class="calc-description">Selecione dois marcos históricos e descubra exatamente quanto tempo se passou entre eles.</p>
                </header>

                <div class="calc-form" id="calc-form">
                    <div class="form-group">
                        <label class="form-label" for="field-fato-inicio">Fato Histórico Inicial</label>
                        <select class="form-select form-input" id="field-fato-inicio" required>
                            <option value="">Selecione...</option>
                            ${optionsHTML}
                        </select>
                    </div>

                    <div class="form-group" id="grupo-data-inicio" style="display:none;">
                        <label class="form-label" for="field-data-inicio">Data Inicial Personalizada</label>
                        <input type="date" class="form-input" id="field-data-inicio">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="field-fato-fim">Fato Histórico Final</label>
                        <select class="form-select form-input" id="field-fato-fim" required>
                            <option value="">Selecione...</option>
                            ${optionsHTML}
                        </select>
                    </div>

                    <div class="form-group" id="grupo-data-fim" style="display:none;">
                        <label class="form-label" for="field-data-fim">Data Final Personalizada</label>
                        <input type="date" class="form-input" id="field-data-fim">
                    </div>

                    <div class="btn-group">
                        <button type="button" class="btn btn-primary" id="btn-calculate">Calcular</button>
                        <button type="button" class="btn btn-secondary" id="btn-clear">Limpar</button>
                    </div>
                </div>

                <div class="calc-result" id="calc-result"></div>

                <div class="curiosidades-timeline" id="curiosidades-timeline">
                    <h3 class="timeline-title">📜 Linha do Tempo</h3>
                    <div class="timeline-items">
                        ${fatosHistoricos.filter(f => f.date && f.id !== 'custom' && f.id !== 'hoje').sort((a, b) => a.ano - b.ano).map(f => `
                            <div class="timeline-item" data-ano="${f.ano}">
                                <span class="timeline-dot"></span>
                                <div class="timeline-content">
                                    <span class="timeline-year">${f.ano < 0 ? Math.abs(f.ano) + ' a.C.' : f.ano}</span>
                                    <span class="timeline-label">${f.label.replace(/^.+?\s/, '')}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        return {
            html,
            init: () => {
                const selectInicio = document.getElementById('field-fato-inicio');
                const selectFim = document.getElementById('field-fato-fim');
                const grupoDataInicio = document.getElementById('grupo-data-inicio');
                const grupoDataFim = document.getElementById('grupo-data-fim');
                const btnCalc = document.getElementById('btn-calculate');
                const btnClear = document.getElementById('btn-clear');
                const resultDiv = document.getElementById('calc-result');

                // Show/hide custom date fields
                selectInicio.addEventListener('change', () => {
                    grupoDataInicio.style.display = selectInicio.value === 'custom' ? 'block' : 'none';
                });
                selectFim.addEventListener('change', () => {
                    grupoDataFim.style.display = selectFim.value === 'custom' ? 'block' : 'none';
                });

                function getDateFromFato(fatoId, customInputId) {
                    if (fatoId === 'hoje') return new Date();
                    if (fatoId === 'custom') {
                        const val = document.getElementById(customInputId).value;
                        if (!val) throw new Error('Selecione uma data personalizada');
                        return new Date(val + 'T00:00:00');
                    }
                    const fato = fatosHistoricos.find(f => f.id === fatoId);
                    if (!fato || !fato.date) throw new Error('Fato não encontrado');

                    // Handle ancient dates
                    if (fato.ano < 100) {
                        const d = new Date();
                        let dateStr = fato.date;
                        let isBCE = false;
                        if (dateStr.startsWith('-')) {
                            isBCE = true;
                            dateStr = dateStr.substring(1);
                        }
                        const parts = dateStr.split('-');
                        let year = parseInt(parts[0], 10);
                        if (isBCE) year = -year;
                        d.setFullYear(year, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                        d.setHours(0, 0, 0, 0);
                        return d;
                    }
                    return new Date(fato.date + 'T00:00:00');
                }

                function getLabelFromFato(fatoId) {
                    if (fatoId === 'hoje') return 'Data de Hoje';
                    if (fatoId === 'custom') return 'Data Personalizada';
                    const fato = fatosHistoricos.find(f => f.id === fatoId);
                    return fato ? fato.label.replace(/^.+?\s/, '') : 'Desconhecido';
                }

                btnCalc.addEventListener('click', () => {
                    try {
                        if (!selectInicio.value || !selectFim.value) {
                            CalcComponents.showToast('Selecione os dois fatos históricos', 'error');
                            return;
                        }

                        let dataInicio = getDateFromFato(selectInicio.value, 'field-data-inicio');
                        let dataFim = getDateFromFato(selectFim.value, 'field-data-fim');

                        // Ensure inicio < fim
                        if (dataInicio > dataFim) {
                            [dataInicio, dataFim] = [dataFim, dataInicio];
                        }

                        const diffMs = Math.abs(dataFim - dataInicio);
                        const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                        const totalHoras = Math.floor(diffMs / (1000 * 60 * 60));
                        const totalMinutos = Math.floor(diffMs / (1000 * 60));
                        const totalSegundos = Math.floor(diffMs / 1000);
                        const totalSemanas = Math.floor(totalDias / 7);

                        // Calculate years, months, days
                        let anos = dataFim.getFullYear() - dataInicio.getFullYear();
                        let meses = dataFim.getMonth() - dataInicio.getMonth();
                        let dias = dataFim.getDate() - dataInicio.getDate();

                        if (dias < 0) {
                            meses--;
                            const mesAnterior = new Date(dataFim.getFullYear(), dataFim.getMonth(), 0).getDate();
                            dias += mesAnterior;
                        }
                        if (meses < 0) {
                            anos--;
                            meses += 12;
                        }

                        // Fun facts
                        const geracoes = Math.floor(anos / 25);
                        const olimpiadas = Math.floor(anos / 4);
                        const seculos = (anos / 100).toFixed(1);

                        const labelInicio = getLabelFromFato(selectInicio.value);
                        const labelFim = getLabelFromFato(selectFim.value);

                        resultDiv.innerHTML = `
                            <div class="result-title">Tempo entre: ${labelInicio} → ${labelFim}</div>
                            <div class="result-value">${anos} anos, ${meses} meses e ${dias} dias</div>
                            <div class="result-details">
                                <div class="result-row">
                                    <span class="result-row-label">Total de dias</span>
                                    <span class="result-row-value">${fmt.number(totalDias, 0)}</span>
                                </div>
                                <div class="result-row">
                                    <span class="result-row-label">Total de semanas</span>
                                    <span class="result-row-value">${fmt.number(totalSemanas, 0)}</span>
                                </div>
                                <div class="result-row">
                                    <span class="result-row-label">Total de horas</span>
                                    <span class="result-row-value">${fmt.number(totalHoras, 0)}</span>
                                </div>
                                <div class="result-row">
                                    <span class="result-row-label">Total de minutos</span>
                                    <span class="result-row-value">${fmt.number(totalMinutos, 0)}</span>
                                </div>
                                <div class="result-row">
                                    <span class="result-row-label">Total de segundos</span>
                                    <span class="result-row-value">${fmt.number(totalSegundos, 0)}</span>
                                </div>
                            </div>
                            <div class="curiosidades-fun-facts">
                                <h4>🤓 Curiosidades</h4>
                                <div class="fun-fact-grid">
                                    <div class="fun-fact-item">
                                        <span class="fun-fact-value">${seculos}</span>
                                        <span class="fun-fact-label">séculos</span>
                                    </div>
                                    <div class="fun-fact-item">
                                        <span class="fun-fact-value">${fmt.number(geracoes, 0)}</span>
                                        <span class="fun-fact-label">gerações humanas</span>
                                    </div>
                                    <div class="fun-fact-item">
                                        <span class="fun-fact-value">${fmt.number(olimpiadas, 0)}</span>
                                        <span class="fun-fact-label">Olimpíadas</span>
                                    </div>
                                    <div class="fun-fact-item">
                                        <span class="fun-fact-value">${fmt.number(totalDias * 24 * 60 * 72, 0)}</span>
                                        <span class="fun-fact-label">batimentos cardíacos</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        resultDiv.classList.add('active');
                        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                    } catch (err) {
                        CalcComponents.showToast('Erro: ' + err.message, 'error');
                    }
                });

                btnClear.addEventListener('click', () => {
                    selectInicio.selectedIndex = 0;
                    selectFim.selectedIndex = 0;
                    grupoDataInicio.style.display = 'none';
                    grupoDataFim.style.display = 'none';
                    resultDiv.classList.remove('active');
                    resultDiv.innerHTML = '';
                });
            }
        };
    }

    const routes = {
        '/curiosidades/fatos-historicos': fatosHistoricosCalc,
    };

    return { routes, renderCategory };
})();
