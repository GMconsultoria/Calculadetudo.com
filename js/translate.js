/**
 * CalculaDeTudo - Sistema de Tradução
 * 
 * Tradução client-side com dicionário de strings para 10 idiomas.
 */

const TranslateSystem = (() => {
    const translations = {
        pt: {
            // Navbar
            'Financeira': 'Financeira',
            'Investimentos': 'Investimentos',
            'Impostos': 'Impostos',
            'Conversores': 'Conversores',
            'Datas': 'Datas',
            'Saúde': 'Saúde',
            'Científica': 'Científica',
            'Curiosidades': 'Curiosidades',
            // Home
            '🧮 100% gratuito e aberto': '🧮 100% gratuito e aberto',
            'Todas as calculadoras que você precisa em um só lugar': 'Todas as calculadoras que você precisa em um só lugar',
            'Categorias': 'Categorias',
            'Populares': 'Populares',
            'Calcular': 'Calcular',
            'Limpar': 'Limpar',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': 'Buscar calculadora... (ex: juros, IMC, IRPF)',
            // Footer
            'Todos os direitos reservados.': 'Todos os direitos reservados.',
            // Common
            'Início': 'Início',
            'Voltar ao Início': 'Voltar ao Início',
            'Página não encontrada': 'Página não encontrada',
        },
        en: {
            'Financeira': 'Financial',
            'Investimentos': 'Investments',
            'Impostos': 'Taxes',
            'Conversores': 'Converters',
            'Datas': 'Dates',
            'Saúde': 'Health',
            'Científica': 'Scientific',
            'Curiosidades': 'Trivia',
            '🧮 100% gratuito e aberto': '🧮 100% free and open',
            'Todas as calculadoras que você precisa em um só lugar': 'All the calculators you need in one place',
            'Categorias': 'Categories',
            'Populares': 'Popular',
            'Calcular': 'Calculate',
            'Limpar': 'Clear',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': 'Search calculator... (e.g.: interest, BMI, tax)',
            'Todos os direitos reservados.': 'All rights reserved.',
            'Início': 'Home',
            'Voltar ao Início': 'Back to Home',
            'Página não encontrada': 'Page not found',
            'Juros Simples': 'Simple Interest',
            'Juros Compostos': 'Compound Interest',
            'Cálculo de Montante': 'Amount Calculation',
            'Taxas (Nominal, Real, Efetiva)': 'Rates (Nominal, Real, Effective)',
            'Valor Presente': 'Present Value',
            'Valor Futuro': 'Future Value',
            'Financiamento (SAC/PRICE)': 'Financing (SAC/PRICE)',
            'Ponto de Equilíbrio': 'Break-Even Point',
            'Correção Monetária': 'Monetary Correction',
            'Renda Fixa (CDB, Selic, Poupança)': 'Fixed Income (CDB, Selic, Savings)',
            'Calculadora do Primeiro Milhão': 'First Million Calculator',
            'Selic vs Poupança': 'Selic vs Savings',
            'Reserva de Emergência': 'Emergency Fund',
            'Imposto de Renda (IRPF)': 'Income Tax (IRPF)',
            'Simples Nacional': 'Simples Nacional',
            'Lucro Presumido': 'Presumed Profit',
            'Lucro Real': 'Actual Profit',
            'Conversor de Moedas': 'Currency Converter',
            'Conversor de Medidas': 'Unit Converter',
            'Conversor de Temperatura': 'Temperature Converter',
            'Somar/Subtrair Datas': 'Add/Subtract Dates',
            'Tempo Restante': 'Time Remaining',
            'Tempo Vivido': 'Time Lived',
            'IMC': 'BMI',
            'Consumo de Água': 'Water Intake',
            'Necessidade de Proteína': 'Protein Needs',
            'Física': 'Physics',
            'Química': 'Chemistry',
            'Progressões (PA/PG)': 'Progressions (AP/GP)',
            'Trigonometria': 'Trigonometry',
            'Matrizes e Determinantes': 'Matrices & Determinants',
            'Fatoração': 'Factoring',
            'Números Complexos': 'Complex Numbers',
            'Derivadas': 'Derivatives',
            'Integrais': 'Integrals',
            'Tempo entre Fatos Históricos': 'Time Between Historical Events',
            // Home page
            'Financeira, investimentos, impostos, conversores, datas, saúde e científica. Rápido, simples e sem complicação.': 'Financial, investments, taxes, converters, dates, health and scientific. Fast, simple and hassle-free.',
            'Juros, financiamentos, taxas, VPL, TIR e mais.': 'Interest, financing, rates, NPV, IRR and more.',
            'Renda fixa, poupança, simuladores e reserva.': 'Fixed income, savings, simulators and reserve.',
            'IRPF, Simples Nacional, Lucro Presumido e Real.': 'IRPF, Simples Nacional, Presumed and Actual Profit.',
            'Moedas, medidas, volume e temperatura.': 'Currencies, measures, volume and temperature.',
            'Diferenças, contagens e tempo vivido.': 'Differences, counts and time lived.',
            'IMC, hidratação e necessidade proteica.': 'BMI, hydration and protein needs.',
            'Física, química, trigonometria, matrizes e mais.': 'Physics, chemistry, trigonometry, matrices and more.',
            'Tempo entre fatos históricos e muito mais.': 'Time between historical events and more.',
            'calculadoras': 'calculators',
            '12 calculadoras': '12 calculators',
            '4 calculadoras': '4 calculators',
            '3 calculadoras': '3 calculators',
            '9 calculadoras': '9 calculators',
            '1 calculadoras': '1 calculator',
            'Primeiro Milhão': 'First Million',
            'Financiamento': 'Financing',
            'PA e PG': 'AP and GP',
            // Footer
            'Mais': 'More',
            'Sobre': 'About',
            'Todas as calculadoras que você precisa, em um só lugar. Rápido, gratuito e sem complicação.': 'All the calculators you need, in one place. Fast, free and hassle-free.',
            'Desenvolvido com ❤️ para simplificar seus cálculos do dia a dia.': 'Developed with ❤️ to simplify your everyday calculations.',
            '© 2026 CalculaDeTudo. Todos os direitos reservados.': '© 2026 CalculaDeTudo. All rights reserved.',
            // Calculators - common
            'Capital Inicial (R$)': 'Initial Capital (R$)',
            'Taxa de Juros (% ao mês)': 'Interest Rate (% per month)',
            'Período (meses)': 'Period (months)',
            'Aporte Mensal (R$)': 'Monthly Contribution (R$)',
            'Capital Inicial': 'Initial Capital',
            'Juros Acumulados': 'Accumulated Interest',
            'Taxa Mensal': 'Monthly Rate',
            'Período': 'Period',
            'Montante Final': 'Final Amount',
            'Total Investido': 'Total Invested',
            'Rendimento': 'Yield',
            'Montante': 'Amount',
            'Capital': 'Capital',
            'Juros': 'Interest',
            'Tipo': 'Type',
            'Taxa Equivalente': 'Equivalent Rate',
            'Taxa Original': 'Original Rate',
            'Período convertido': 'Converted Period',
            'Valor Futuro (R$)': 'Future Value (R$)',
            'Taxa de Desconto (% ao mês)': 'Discount Rate (% per month)',
            'Desconto': 'Discount',
            'Valor Presente (R$)': 'Present Value (R$)',
            'Taxa (% ao mês)': 'Rate (% per month)',
            'Rendimento Total': 'Total Yield',
            'Investimento Inicial (R$)': 'Initial Investment (R$)',
            'Investimento': 'Investment',
            'Fluxos considerados': 'Considered cash flows',
            '✅ Projeto Viável': '✅ Viable Project',
            '❌ Projeto Inviável': '❌ Unviable Project',
            'Taxa Interna de Retorno': 'Internal Rate of Return',
            'TIR mensal': 'Monthly IRR',
            'TIR anual (equivalente)': 'Annual IRR (equivalent)',
            'Períodos': 'Periods',
            'Ganho obtido (R$)': 'Gain obtained (R$)',
            'Ganho Total': 'Total Gain',
            'Lucro Líquido': 'Net Profit',
            'Valor Financiado (R$)': 'Financed Value (R$)',
            'Prazo (meses)': 'Term (months)',
            'Sistema de Amortização': 'Amortization System',
            'Total de Juros': 'Total Interest',
            'Total Pago': 'Total Paid',
            'Mês': 'Month',
            'Parcela': 'Installment',
            'Amortização': 'Amortization',
            'Saldo': 'Balance',
            'Custo Fixo Mensal (R$)': 'Monthly Fixed Cost (R$)',
            'Preço de Venda Unitário (R$)': 'Unit Selling Price (R$)',
            'Custo Variável Unitário (R$)': 'Unit Variable Cost (R$)',
            'Receita no Breakeven': 'Breakeven Revenue',
            'Margem de Contribuição': 'Contribution Margin',
            'Custo Fixo': 'Fixed Cost',
            'Valor Original (R$)': 'Original Value (R$)',
            'Índice de Correção': 'Correction Index',
            'Período (anos)': 'Period (years)',
            'Valor Corrigido': 'Corrected Value',
            'Correção': 'Correction',
            'Taxa anual usada': 'Annual rate used',
            // Saude
            'Peso (kg)': 'Weight (kg)',
            'Altura (m)': 'Height (m)',
            'Índice de Massa Corporal': 'Body Mass Index',
            'Peso ideal': 'Ideal weight',
            'Abaixo do peso': 'Underweight',
            'Peso normal': 'Normal weight',
            'Sobrepeso': 'Overweight',
            'Obesidade Grau I': 'Obesity Grade I',
            'Obesidade Grau II': 'Obesity Grade II',
            'Obesidade Grau III': 'Obesity Grade III',
            'Nível de Atividade Física': 'Physical Activity Level',
            'Consumo Recomendado': 'Recommended Intake',
            'Em mililitros': 'In milliliters',
            'Objetivo': 'Goal',
            'Proteína Diária': 'Daily Protein',
            'Média Recomendada': 'Recommended Average',
            // Datas
            'Data Inicial': 'Start Date',
            'Data Final': 'End Date',
            'Quantidade': 'Quantity',
            'Unidade': 'Unit',
            'Operação': 'Operation',
            // Breadcrumbs
            'Calculadoras financeiras para juros, investimentos, financiamentos e mais.': 'Financial calculators for interest, investments, financing and more.',
            'Calculadoras para saúde e bem-estar: IMC, hidratação e nutrição.': 'Health and wellness calculators: BMI, hydration and nutrition.',
            // Curiosidades
            'Tempo entre Fatos Históricos': 'Time Between Historical Events',
            'Selecione dois marcos históricos e descubra exatamente quanto tempo se passou entre eles.': 'Select two historical milestones and find out exactly how much time has passed between them.',
            'Fato Histórico Inicial': 'Initial Historical Event',
            'Fato Histórico Final': 'Final Historical Event',
            'Selecione...': 'Select...',
            'Data Inicial Personalizada': 'Custom Start Date',
            'Data Final Personalizada': 'Custom End Date',
            'Total de dias': 'Total days',
            'Total de semanas': 'Total weeks',
            'Total de horas': 'Total hours',
            'Total de minutos': 'Total minutes',
            'Total de segundos': 'Total seconds',
            '📜 Linha do Tempo': '📜 Timeline',
            '🤓 Curiosidades': '🤓 Fun Facts',
            'séculos': 'centuries',
            'gerações humanas': 'human generations',
            'Olimpíadas': 'Olympics',
            'batimentos cardíacos': 'heartbeats',
            'A calculadora que você procura não existe.': 'The calculator you are looking for does not exist.',
            'Selecione': 'Select',
            'Este campo é obrigatório': 'This field is required',
            'Preencha todos os campos obrigatórios': 'Fill in all required fields',
        },
        es: {
            'Financeira': 'Financiera',
            'Investimentos': 'Inversiones',
            'Impostos': 'Impuestos',
            'Conversores': 'Conversores',
            'Datas': 'Fechas',
            'Saúde': 'Salud',
            'Científica': 'Científica',
            'Curiosidades': 'Curiosidades',
            '🧮 100% gratuito e aberto': '🧮 100% gratuito y abierto',
            'Todas as calculadoras que você precisa em um só lugar': 'Todas las calculadoras que necesitas en un solo lugar',
            'Categorias': 'Categorías',
            'Populares': 'Populares',
            'Calcular': 'Calcular',
            'Limpar': 'Limpiar',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': 'Buscar calculadora... (ej: interés, IMC, impuestos)',
            'Todos os direitos reservados.': 'Todos los derechos reservados.',
            'Início': 'Inicio',
            'Voltar ao Início': 'Volver al Inicio',
            'Página não encontrada': 'Página no encontrada',
            'Juros Simples': 'Interés Simple',
            'Juros Compostos': 'Interés Compuesto',
            'Conversor de Moedas': 'Conversor de Monedas',
            'IMC': 'IMC',
            'Tempo entre Fatos Históricos': 'Tiempo entre Hechos Históricos',
        },
        fr: {
            'Financeira': 'Financière',
            'Investimentos': 'Investissements',
            'Impostos': 'Impôts',
            'Conversores': 'Convertisseurs',
            'Datas': 'Dates',
            'Saúde': 'Santé',
            'Científica': 'Scientifique',
            'Curiosidades': 'Curiosités',
            '🧮 100% gratuito e aberto': '🧮 100% gratuit et ouvert',
            'Todas as calculadoras que você precisa em um só lugar': 'Toutes les calculatrices dont vous avez besoin en un seul endroit',
            'Categorias': 'Catégories',
            'Populares': 'Populaires',
            'Calcular': 'Calculer',
            'Limpar': 'Effacer',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': 'Rechercher une calculatrice... (ex: intérêt, IMC)',
            'Todos os direitos reservados.': 'Tous droits réservés.',
            'Início': 'Accueil',
            'Voltar ao Início': "Retour à l'Accueil",
            'Página não encontrada': 'Page non trouvée',
            'Tempo entre Fatos Históricos': 'Temps entre événements historiques',
        },
        it: {
            'Financeira': 'Finanziaria',
            'Investimentos': 'Investimenti',
            'Impostos': 'Tasse',
            'Conversores': 'Convertitori',
            'Datas': 'Date',
            'Saúde': 'Salute',
            'Científica': 'Scientifica',
            'Curiosidades': 'Curiosità',
            '🧮 100% gratuito e aberto': '🧮 100% gratuito e aperto',
            'Todas as calculadoras que você precisa em um só lugar': 'Tutte le calcolatrici di cui hai bisogno in un unico posto',
            'Categorias': 'Categorie',
            'Populares': 'Popolari',
            'Calcular': 'Calcolare',
            'Limpar': 'Pulire',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': 'Cerca calcolatrice... (es: interessi, IMC)',
            'Todos os direitos reservados.': 'Tutti i diritti riservati.',
            'Início': 'Home',
            'Voltar ao Início': 'Torna alla Home',
            'Página não encontrada': 'Pagina non trovata',
            'Tempo entre Fatos Históricos': 'Tempo tra eventi storici',
        },
        de: {
            'Financeira': 'Finanzen',
            'Investimentos': 'Investitionen',
            'Impostos': 'Steuern',
            'Conversores': 'Umrechner',
            'Datas': 'Daten',
            'Saúde': 'Gesundheit',
            'Científica': 'Wissenschaft',
            'Curiosidades': 'Kuriositäten',
            '🧮 100% gratuito e aberto': '🧮 100% kostenlos und offen',
            'Todas as calculadoras que você precisa em um só lugar': 'Alle Rechner die Sie brauchen an einem Ort',
            'Categorias': 'Kategorien',
            'Populares': 'Beliebt',
            'Calcular': 'Berechnen',
            'Limpar': 'Löschen',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': 'Rechner suchen... (z.B.: Zinsen, BMI)',
            'Todos os direitos reservados.': 'Alle Rechte vorbehalten.',
            'Início': 'Startseite',
            'Voltar ao Início': 'Zurück zur Startseite',
            'Página não encontrada': 'Seite nicht gefunden',
            'Tempo entre Fatos Históricos': 'Zeit zwischen historischen Ereignissen',
        },
        zh: {
            'Financeira': '金融',
            'Investimentos': '投资',
            'Impostos': '税务',
            'Conversores': '转换器',
            'Datas': '日期',
            'Saúde': '健康',
            'Científica': '科学',
            'Curiosidades': '趣闻',
            '🧮 100% gratuito e aberto': '🧮 100% 免费开放',
            'Todas as calculadoras que você precisa em um só lugar': '您需要的所有计算器集于一处',
            'Categorias': '分类',
            'Populares': '热门',
            'Calcular': '计算',
            'Limpar': '清除',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': '搜索计算器...',
            'Todos os direitos reservados.': '版权所有。',
            'Início': '首页',
            'Voltar ao Início': '返回首页',
            'Página não encontrada': '页面未找到',
            'Tempo entre Fatos Históricos': '历史事件之间的时间',
        },
        hi: {
            'Financeira': 'वित्तीय',
            'Investimentos': 'निवेश',
            'Impostos': 'कर',
            'Conversores': 'कनवर्टर',
            'Datas': 'तिथियां',
            'Saúde': 'स्वास्थ्य',
            'Científica': 'वैज्ञानिक',
            'Curiosidades': 'रोचक तथ्य',
            '🧮 100% gratuito e aberto': '🧮 100% मुफ्त और खुला',
            'Todas as calculadoras que você precisa em um só lugar': 'आपको जरूरत के सभी कैलकुलेटर एक ही जगह',
            'Categorias': 'श्रेणियां',
            'Populares': 'लोकप्रिय',
            'Calcular': 'गणना करें',
            'Limpar': 'साफ करें',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': 'कैलकुलेटर खोजें...',
            'Todos os direitos reservados.': 'सर्वाधिकार सुरक्षित।',
            'Início': 'होम',
            'Voltar ao Início': 'होम पर वापस',
            'Página não encontrada': 'पृष्ठ नहीं मिला',
            'Tempo entre Fatos Históricos': 'ऐतिहासिक घटनाओं के बीच का समय',
        },
        ja: {
            'Financeira': 'ファイナンス',
            'Investimentos': '投資',
            'Impostos': '税金',
            'Conversores': 'コンバーター',
            'Datas': '日付',
            'Saúde': '健康',
            'Científica': '科学',
            'Curiosidades': 'トリビア',
            '🧮 100% gratuito e aberto': '🧮 100%無料＆オープン',
            'Todas as calculadoras que você precisa em um só lugar': '必要なすべての計算機を一か所に',
            'Categorias': 'カテゴリー',
            'Populares': '人気',
            'Calcular': '計算する',
            'Limpar': 'クリア',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': '計算機を検索...',
            'Todos os direitos reservados.': '全著作権所有。',
            'Início': 'ホーム',
            'Voltar ao Início': 'ホームに戻る',
            'Página não encontrada': 'ページが見つかりません',
            'Tempo entre Fatos Históricos': '歴史的出来事間の時間',
        },
        ko: {
            'Financeira': '금융',
            'Investimentos': '투자',
            'Impostos': '세금',
            'Conversores': '변환기',
            'Datas': '날짜',
            'Saúde': '건강',
            'Científica': '과학',
            'Curiosidades': '상식',
            '🧮 100% gratuito e aberto': '🧮 100% 무료 및 오픈',
            'Todas as calculadoras que você precisa em um só lugar': '필요한 모든 계산기를 한 곳에서',
            'Categorias': '카테고리',
            'Populares': '인기',
            'Calcular': '계산',
            'Limpar': '지우기',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': '계산기 검색...',
            'Todos os direitos reservados.': '모든 권리 보유.',
            'Início': '홈',
            'Voltar ao Início': '홈으로 돌아가기',
            'Página não encontrada': '페이지를 찾을 수 없습니다',
            'Tempo entre Fatos Históricos': '역사적 사건 사이의 시간',
        },
        ar: {
            'Financeira': 'المالية',
            'Investimentos': 'الاستثمارات',
            'Impostos': 'الضرائب',
            'Conversores': 'المحولات',
            'Datas': 'التواريخ',
            'Saúde': 'الصحة',
            'Científica': 'العلمية',
            'Curiosidades': 'معلومات عامة',
            '🧮 100% gratuito e aberto': '🧮 مجاني ومفتوح 100%',
            'Todas as calculadoras que você precisa em um só lugar': 'جميع الآلات الحاسبة التي تحتاجها في مكان واحد',
            'Categorias': 'الفئات',
            'Populares': 'الشائعة',
            'Calcular': 'احسب',
            'Limpar': 'مسح',
            'Buscar calculadora... (ex: juros, IMC, IRPF)': '...ابحث عن آلة حاسبة',
            'Todos os direitos reservados.': 'جميع الحقوق محفوظة.',
            'Início': 'الرئيسية',
            'Voltar ao Início': 'العودة للرئيسية',
            'Página não encontrada': 'الصفحة غير موجودة',
            'Tempo entre Fatos Históricos': 'الوقت بين الأحداث التاريخية',
        }
    };

    const languages = [
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: '한국어', flag: '🇰🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    let currentLang = 'pt';
    // Store original PT text for nodes we've translated
    const originalTexts = new Map();

    function translate(key) {
        if (currentLang === 'pt') return key;
        const dict = translations[currentLang];
        return (dict && dict[key]) || key;
    }

    function walkTextNodes(root, callback) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const tag = node.parentElement ? node.parentElement.tagName : '';
                if (['SCRIPT','STYLE','NOSCRIPT'].includes(tag)) return NodeFilter.FILTER_REJECT;
                if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        while (walker.nextNode()) callback(walker.currentNode);
    }

    function translatePage(lang) {
        currentLang = lang;
        localStorage.setItem('CalculaDeTudo-lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        const dict = translations[lang];

        // Walk all text nodes in body
        walkTextNodes(document.body, node => {
            const txt = node.textContent.trim();
            if (!txt) return;
            // Store original PT text
            if (!originalTexts.has(node)) originalTexts.set(node, txt);
            const original = originalTexts.get(node);
            if (lang === 'pt') {
                node.textContent = node.textContent.replace(txt, original);
            } else if (dict && dict[original]) {
                node.textContent = node.textContent.replace(txt, dict[original]);
            }
        });

        // Translate placeholders on inputs
        document.querySelectorAll('input[placeholder]').forEach(el => {
            const key = 'ph_' + el.id;
            if (!originalTexts.has(key)) originalTexts.set(key, el.placeholder);
            const orig = originalTexts.get(key);
            if (lang === 'pt') { el.placeholder = orig; }
            else if (dict && dict[orig]) { el.placeholder = dict[orig]; }
        });

        // Update language flag
        const langBtn = document.getElementById('lang-current');
        if (langBtn) {
            const langInfo = languages.find(l => l.code === lang);
            if (langInfo) langBtn.textContent = langInfo.flag;
        }

        // Close dropdown
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.remove('active');
    }

    function init() {
        const saved = localStorage.getItem('CalculaDeTudo-lang');
        if (saved && translations[saved]) {
            currentLang = saved;
            // Apply saved language after a short delay to ensure DOM is ready
            setTimeout(() => translatePage(saved), 100);
        }

        // Language button click handler
        const langToggle = document.getElementById('lang-toggle');
        const langDropdown = document.getElementById('lang-dropdown');

        if (langToggle && langDropdown) {
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('active');
            });

            // Close dropdown on outside click
            document.addEventListener('click', () => {
                langDropdown.classList.remove('active');
            });

            // Language selection
            langDropdown.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const lang = option.dataset.lang;
                    translatePage(lang);
                    // Re-route to re-render content with translations
                    if (window.App && App.route) {
                        App.route();
                    }
                });
            });
        }
    }

    return { init, translate, translatePage, languages, getCurrentLang: () => currentLang };
})();
