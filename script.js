// Navigation
const navDashboard = document.getElementById('navDashboard');
const navReceitas = document.getElementById('navReceitas');
const navDespesas = document.getElementById('navDespesas');
const navRelatorios = document.getElementById('navRelatorios');
const navAjuda = document.getElementById('navAjuda');
const dashboardContent = document.getElementById('dashboardContent');
const receitasContent = document.getElementById('receitasContent');
const despesasContent = document.getElementById('despesasContent');
const relatoriosContent = document.getElementById('relatoriosContent');
const ajudaContent = document.getElementById('ajudaContent');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const backToDashboardFromDespesasBtn = document.getElementById('backToDashboardFromDespesasBtn');
const backToDashboardFromRelatoriosBtn = document.getElementById('backToDashboardFromRelatoriosBtn');
const navItems = document.querySelectorAll('.nav-item');

// Helpers
const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatDate = (value) => {
    if (!value) {
        return new Date().toLocaleDateString('pt-BR');
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
};

const normalizeCurrency = (value) => {
    if (!value) return 0;
    return Number(value.replace(/\./g, '').replace(',', '.'));
};

// Função para trocar de página
function showPage(pageName) {
    // Esconder todas as páginas
    dashboardContent.style.display = 'none';
    receitasContent.style.display = 'none';
    despesasContent.style.display = 'none';
    relatoriosContent.style.display = 'none';
    ajudaContent.style.display = 'none';

    // Remover active de todos os itens do menu
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Mostrar página selecionada e ativar item do menu
    if (pageName === 'dashboard') {
        dashboardContent.style.display = 'block';
        navDashboard.classList.add('active');
    } else if (pageName === 'receitas') {
        receitasContent.style.display = 'block';
        navReceitas.classList.add('active');
    } else if (pageName === 'despesas') {
        despesasContent.style.display = 'block';
        navDespesas.classList.add('active');
    } else if (pageName === 'relatorios') {
        relatoriosContent.style.display = 'block';
        navRelatorios.classList.add('active');
        updateReports();
    } else if (pageName === 'ajuda') {
        ajudaContent.style.display = 'block';
        navAjuda.classList.add('active');
    }
}

// Event listeners para navegação
navDashboard.addEventListener('click', () => {
    showPage('dashboard');
});

backToDashboardBtn.addEventListener('click', () => {
    showPage('dashboard');
});

backToDashboardFromDespesasBtn.addEventListener('click', () => {
    showPage('dashboard');
    updateDashboard();
});

if (backToDashboardFromRelatoriosBtn) {
    backToDashboardFromRelatoriosBtn.addEventListener('click', () => {
        showPage('dashboard');
        updateDashboard();
    });
}

// Dashboard - Elementos
const totalReceitasEl = document.getElementById('totalReceitas');
const totalDespesasEl = document.getElementById('totalDespesas');
const saldoAtualEl = document.getElementById('saldoAtual');
const recentTransactionsList = document.getElementById('recentTransactionsList');
const tabReceitas = document.getElementById('tabReceitas');
const tabDespesas = document.getElementById('tabDespesas');

let currentTab = 'receitas'; // 'receitas' ou 'despesas'

// Função para calcular totais
function calculateTotals() {
    const totalReceitas = receitasData.reduce((sum, receita) => {
        return sum + normalizeCurrency(receita.valor);
    }, 0);

    const totalDespesas = despesasData.reduce((sum, despesa) => {
        return sum + normalizeCurrency(despesa.valor);
    }, 0);

    const saldoAtual = totalReceitas - totalDespesas;

    return { totalReceitas, totalDespesas, saldoAtual };
}

// Função para atualizar cards do Dashboard
function updateDashboardCards() {
    const { totalReceitas, totalDespesas, saldoAtual } = calculateTotals();

    totalReceitasEl.textContent = `R$ ${formatCurrency(totalReceitas)}`;
    totalDespesasEl.textContent = `R$ ${formatCurrency(totalDespesas)}`;
    saldoAtualEl.textContent = `R$ ${formatCurrency(saldoAtual)}`;
}

// Função para renderizar transações recentes
function renderRecentTransactions() {
    recentTransactionsList.innerHTML = '';

    let transactions = [];

    if (currentTab === 'receitas') {
        // Pegar últimas 4 receitas
        transactions = receitasData
            .slice()
            .sort((a, b) => {
                const dateA = new Date(a.data.split('/').reverse().join('-'));
                const dateB = new Date(b.data.split('/').reverse().join('-'));
                return dateB - dateA;
            })
            .slice(0, 4)
            .map(receita => ({
                ...receita,
                type: 'income'
            }));
    } else {
        // Pegar últimas 4 despesas
        transactions = despesasData
            .slice()
            .sort((a, b) => {
                const dateA = new Date(a.data.split('/').reverse().join('-'));
                const dateB = new Date(b.data.split('/').reverse().join('-'));
                return dateB - dateA;
            })
            .slice(0, 4)
            .map(despesa => ({
                ...despesa,
                type: 'expense'
            }));
    }

    if (transactions.length === 0) {
        recentTransactionsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <p>Nenhuma ${currentTab === 'receitas' ? 'receita' : 'despesa'} cadastrada ainda.</p>
            </div>
        `;
        return;
    }

    transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';

        const iconColor = transaction.type === 'income' ? '#10b981' : '#ef4444';
        const iconPath = transaction.type === 'income'
            ? 'M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z'
            : 'M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z';

        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        const amountSign = transaction.type === 'income' ? '+' : '-';

        item.innerHTML = `
            <div class="transaction-icon ${transaction.type}">
                <svg width="24" height="24" fill="${iconColor}" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="${iconPath}" clip-rule="evenodd"/>
                </svg>
            </div>
            <div class="transaction-details">
                <div class="transaction-description">${transaction.nome}</div>
                <div class="transaction-date">${transaction.data}</div>
            </div>
            <div class="transaction-amount ${amountClass}">${amountSign} R$ ${transaction.valor}</div>
        `;
        recentTransactionsList.appendChild(item);
    });
}

// Função para atualizar todo o Dashboard
function updateDashboard() {
    updateDashboardCards();
    renderRecentTransactions();
}

// Event listeners para tabs
tabReceitas.addEventListener('click', () => {
    currentTab = 'receitas';
    tabReceitas.classList.add('active');
    tabDespesas.classList.remove('active');
    renderRecentTransactions();
});

tabDespesas.addEventListener('click', () => {
    currentTab = 'despesas';
    tabDespesas.classList.add('active');
    tabReceitas.classList.remove('active');
    renderRecentTransactions();
});

// Atualizar Dashboard quando abrir a página
navDashboard.addEventListener('click', () => {
    showPage('dashboard');
    updateDashboard();
});

// Paginação de Receitas
const receitasTableBody = document.getElementById('receitasTableBody');
const receitasTotalCount = document.getElementById('receitasTotalCount');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationInfo = document.getElementById('paginationInfo');

let receitasData = [
    { data: '04/11/2025', nome: 'Serviço Prestado - Cliente ABC', descricao: '-', valor: '1.200,00' },
    { data: '05/11/2025', nome: 'Venda de Produto #1234', descricao: '-', valor: '850,00' },
    { data: '06/11/2025', nome: 'Consultoria Técnica', descricao: '-', valor: '2.500,00' },
    { data: '07/11/2025', nome: 'Venda de Produto #1235', descricao: '-', valor: '1.100,00' },
    { data: '08/11/2025', nome: 'Serviço de Manutenção', descricao: '-', valor: '750,00' },
    { data: '09/11/2025', nome: 'Venda de Produto #1236', descricao: '-', valor: '950,00' },
    { data: '10/11/2025', nome: 'Serviço Prestado - Cliente DEF', descricao: '-', valor: '1.800,00' },
    { data: '11/11/2025', nome: 'Venda de Produto #1237', descricao: '-', valor: '650,00' },
    { data: '12/11/2025', nome: 'Consultoria em Marketing', descricao: '-', valor: '3.200,00' },
    { data: '13/11/2025', nome: 'Venda de Produto #1238', descricao: '-', valor: '1.350,00' },
    { data: '14/11/2025', nome: 'Serviço de Desenvolvimento', descricao: '-', valor: '4.500,00' },
    { data: '15/11/2025', nome: 'Venda de Produto #1239', descricao: '-', valor: '880,00' },
    { data: '16/11/2025', nome: 'Serviço Prestado - Cliente GHI', descricao: '-', valor: '1.600,00' },
    { data: '17/11/2025', nome: 'Venda de Produto #1240', descricao: '-', valor: '720,00' },
    { data: '18/11/2025', nome: 'Consultoria Financeira', descricao: '-', valor: '2.800,00' },
    { data: '19/11/2025', nome: 'Venda de Produto #1241', descricao: '-', valor: '1.050,00' },
    { data: '20/11/2025', nome: 'Serviço de Suporte', descricao: '-', valor: '1.400,00' },
    { data: '21/11/2025', nome: 'Venda de Produto #1242', descricao: '-', valor: '920,00' },
    { data: '22/11/2025', nome: 'Serviço Prestado - Cliente JKL', descricao: '-', valor: '1.750,00' },
    { data: '23/11/2025', nome: 'Venda de Produto #1243', descricao: '-', valor: '680,00' },
    { data: '24/11/2025', nome: 'Consultoria em TI', descricao: '-', valor: '3.500,00' },
    { data: '25/11/2025', nome: 'Venda de Produto #1244', descricao: '-', valor: '1.120,00' },
    { data: '26/11/2025', nome: 'Serviço de Design', descricao: '-', valor: '1.300,00' },
    { data: '27/11/2025', nome: 'Venda de Produto #1245', descricao: '-', valor: '990,00' },
    { data: '28/11/2025', nome: 'Serviço Prestado - Cliente MNO', descricao: '-', valor: '2.100,00' }
];

let currentPageReceitas = 1;
const itemsPerPageReceitas = 20;

// Filtros de receitas
let receitasFilters = {
    dataInicial: null,
    dataFinal: null,
    ordenacao: 'newest'
};

const getTotalPagesReceitas = () => Math.max(1, Math.ceil(getFilteredReceitas().length / itemsPerPageReceitas));

const updateReceitasCount = () => {
    const filteredCount = getFilteredReceitas().length;
    receitasTotalCount.textContent = `${filteredCount} receita${filteredCount !== 1 ? 's' : ''}`;
};

const addReceita = ({ nome, valor, data, descricao }) => {
    receitasData.unshift({
        data: formatDate(data),
        nome: nome || 'Receita sem nome',
        descricao: descricao || '-',
        valor: formatCurrency(valor)
    });
    updateReceitasCount();
    currentPageReceitas = 1;
    renderReceitas();
    updateDashboard();
};

// Função para converter data brasileira (dd/mm/yyyy) para objeto Date
function parseDataBrasileira(dataStr) {
    const parts = dataStr.split('/');
    if (parts.length === 3) {
        // Formato: dd/mm/yyyy
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return null;
}

// Função para filtrar receitas
function getFilteredReceitas() {
    let filtered = [...receitasData];

    // Aplicar filtro de data inicial
    if (receitasFilters.dataInicial) {
        const dataInicial = new Date(receitasFilters.dataInicial);
        filtered = filtered.filter(receita => {
            const dataReceita = parseDataBrasileira(receita.data);
            return dataReceita && dataReceita >= dataInicial;
        });
    }

    // Aplicar filtro de data final
    if (receitasFilters.dataFinal) {
        const dataFinal = new Date(receitasFilters.dataFinal);
        dataFinal.setHours(23, 59, 59, 999); // Incluir todo o dia final
        filtered = filtered.filter(receita => {
            const dataReceita = parseDataBrasileira(receita.data);
            return dataReceita && dataReceita <= dataFinal;
        });
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
        const dateA = parseDataBrasileira(a.data);
        const dateB = parseDataBrasileira(b.data);

        if (receitasFilters.ordenacao === 'newest') {
            return dateB - dateA; // Mais recentes primeiro
        } else {
            return dateA - dateB; // Mais antigos primeiro
        }
    });

    return filtered;
}

// Função para renderizar receitas da página atual
function renderReceitas() {
    const filteredReceitas = getFilteredReceitas();
    const totalPagesReceitas = getTotalPagesReceitas();

    if (currentPageReceitas > totalPagesReceitas) {
        currentPageReceitas = totalPagesReceitas;
    }

    const startIndex = (currentPageReceitas - 1) * itemsPerPageReceitas;
    const endIndex = startIndex + itemsPerPageReceitas;
    const pageData = filteredReceitas.slice(startIndex, endIndex);

    receitasTableBody.innerHTML = '';

    if (pageData.length === 0) {
        receitasTableBody.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280; grid-column: 1 / -1;">
                <p>Nenhuma receita encontrada com os filtros aplicados.</p>
            </div>
        `;
    } else {
        pageData.forEach(receita => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div class="table-col">${receita.data}</div>
                <div class="table-col">${receita.nome}</div>
                <div class="table-col">${receita.descricao}</div>
                <div class="table-col income-value">+ R$ ${receita.valor}</div>
            `;
            receitasTableBody.appendChild(row);
        });
    }

    updatePagination(totalPagesReceitas);
    updateReceitasCount();
}

// Função para atualizar controles de paginação
function updatePagination(totalPagesReceitas) {
    paginationInfo.textContent = `Página ${currentPageReceitas} de ${totalPagesReceitas}`;

    prevPageBtn.disabled = currentPageReceitas === 1;
    nextPageBtn.disabled = currentPageReceitas === totalPagesReceitas;
}

// Event listeners para paginação
prevPageBtn.addEventListener('click', () => {
    if (currentPageReceitas > 1) {
        currentPageReceitas--;
        renderReceitas();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPageReceitas < getTotalPagesReceitas()) {
        currentPageReceitas++;
        renderReceitas();
    }
});

// Event listeners para filtros de receitas
const dataInicialReceitas = document.getElementById('dataInicialReceitas');
const dataFinalReceitas = document.getElementById('dataFinalReceitas');
const ordenacaoReceitas = document.getElementById('ordenacaoReceitas');
const aplicarFiltrosReceitas = document.getElementById('aplicarFiltrosReceitas');
const limparFiltrosReceitas = document.getElementById('limparFiltrosReceitas');

if (aplicarFiltrosReceitas) {
    aplicarFiltrosReceitas.addEventListener('click', () => {
        receitasFilters.dataInicial = dataInicialReceitas.value || null;
        receitasFilters.dataFinal = dataFinalReceitas.value || null;
        receitasFilters.ordenacao = ordenacaoReceitas.value;
        currentPageReceitas = 1;
        renderReceitas();
    });
}

if (limparFiltrosReceitas) {
    limparFiltrosReceitas.addEventListener('click', () => {
        dataInicialReceitas.value = '';
        dataFinalReceitas.value = '';
        ordenacaoReceitas.value = 'newest';
        receitasFilters.dataInicial = null;
        receitasFilters.dataFinal = null;
        receitasFilters.ordenacao = 'newest';
        currentPageReceitas = 1;
        renderReceitas();
    });
}

// Renderizar receitas quando a página de receitas for aberta
navReceitas.addEventListener('click', () => {
    showPage('receitas');
    renderReceitas();
});

// Renderizar receitas na primeira carga se estiver na página de receitas
if (receitasContent && receitasContent.style.display !== 'none') {
    renderReceitas();
}

updateReceitasCount();

// Paginação de Despesas
const despesasTableBody = document.getElementById('despesasTableBody');
const despesasTotalCount = document.getElementById('despesasTotalCount');
const prevPageDespesasBtn = document.getElementById('prevPageDespesasBtn');
const nextPageDespesasBtn = document.getElementById('nextPageDespesasBtn');
const paginationDespesasInfo = document.getElementById('paginationDespesasInfo');

// Dados das despesas (25 despesas para exemplo)
let despesasData = [
    { data: '02/11/2025', nome: 'Conta de Luz - Estabelecimento', descricao: '-', valor: '850,00' },
    { data: '03/11/2025', nome: 'Fornecedor XYZ Ltda', descricao: '-', valor: '450,00' },
    { data: '04/11/2025', nome: 'Aluguel do Escritório', descricao: '-', valor: '2.500,00' },
    { data: '05/11/2025', nome: 'Material de Escritório', descricao: '-', valor: '320,00' },
    { data: '06/11/2025', nome: 'Conta de Água', descricao: '-', valor: '180,00' },
    { data: '07/11/2025', nome: 'Fornecedor ABC Comércio', descricao: '-', valor: '1.200,00' },
    { data: '08/11/2025', nome: 'Internet e Telefone', descricao: '-', valor: '250,00' },
    { data: '09/11/2025', nome: 'Combustível', descricao: '-', valor: '380,00' },
    { data: '10/11/2025', nome: 'Manutenção de Equipamentos', descricao: '-', valor: '650,00' },
    { data: '11/11/2025', nome: 'Fornecedor DEF Ltda', descricao: '-', valor: '920,00' },
    { data: '12/11/2025', nome: 'Seguro do Veículo', descricao: '-', valor: '450,00' },
    { data: '13/11/2025', nome: 'Material de Limpeza', descricao: '-', valor: '150,00' },
    { data: '14/11/2025', nome: 'Fornecedor GHI S.A.', descricao: '-', valor: '1.800,00' },
    { data: '15/11/2025', nome: 'Taxa Bancária', descricao: '-', valor: '120,00' },
    { data: '16/11/2025', nome: 'Conta de Gás', descricao: '-', valor: '95,00' },
    { data: '17/11/2025', nome: 'Fornecedor JKL Comércio', descricao: '-', valor: '1.350,00' },
    { data: '18/11/2025', nome: 'Manutenção Predial', descricao: '-', valor: '580,00' },
    { data: '19/11/2025', nome: 'Material de Marketing', descricao: '-', valor: '420,00' },
    { data: '20/11/2025', nome: 'Fornecedor MNO Ltda', descricao: '-', valor: '750,00' },
    { data: '21/11/2025', nome: 'Estacionamento', descricao: '-', valor: '200,00' },
    { data: '22/11/2025', nome: 'Serviço de Contabilidade', descricao: '-', valor: '1.100,00' },
    { data: '23/11/2025', nome: 'Fornecedor PQR S.A.', descricao: '-', valor: '1.600,00' },
    { data: '24/11/2025', nome: 'Material de Expediente', descricao: '-', valor: '280,00' },
    { data: '25/11/2025', nome: 'Manutenção de Software', descricao: '-', valor: '350,00' },
    { data: '26/11/2025', nome: 'Fornecedor STU Comércio', descricao: '-', valor: '980,00' }
];

let currentPageDespesas = 1;
const itemsPerPageDespesas = 20;

// Filtros de despesas
let despesasFilters = {
    dataInicial: null,
    dataFinal: null,
    ordenacao: 'newest'
};

const getTotalPagesDespesas = () => Math.max(1, Math.ceil(getFilteredDespesas().length / itemsPerPageDespesas));

const updateDespesasCount = () => {
    const filteredCount = getFilteredDespesas().length;
    despesasTotalCount.textContent = `${filteredCount} despesa${filteredCount !== 1 ? 's' : ''}`;
};

const addDespesa = ({ nome, valor, data, descricao }) => {
    despesasData.unshift({
        data: formatDate(data),
        nome: nome || 'Despesa sem nome',
        descricao: descricao || '-',
        valor: formatCurrency(valor)
    });
    updateDespesasCount();
    currentPageDespesas = 1;
    renderDespesas();
    updateDashboard();
};

// Função para filtrar despesas
function getFilteredDespesas() {
    let filtered = [...despesasData];

    // Aplicar filtro de data inicial
    if (despesasFilters.dataInicial) {
        const dataInicial = new Date(despesasFilters.dataInicial);
        filtered = filtered.filter(despesa => {
            const dataDespesa = parseDataBrasileira(despesa.data);
            return dataDespesa && dataDespesa >= dataInicial;
        });
    }

    // Aplicar filtro de data final
    if (despesasFilters.dataFinal) {
        const dataFinal = new Date(despesasFilters.dataFinal);
        dataFinal.setHours(23, 59, 59, 999); // Incluir todo o dia final
        filtered = filtered.filter(despesa => {
            const dataDespesa = parseDataBrasileira(despesa.data);
            return dataDespesa && dataDespesa <= dataFinal;
        });
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
        const dateA = parseDataBrasileira(a.data);
        const dateB = parseDataBrasileira(b.data);

        if (despesasFilters.ordenacao === 'newest') {
            return dateB - dateA; // Mais recentes primeiro
        } else {
            return dateA - dateB; // Mais antigos primeiro
        }
    });

    return filtered;
}

// Função para renderizar despesas da página atual
function renderDespesas() {
    const filteredDespesas = getFilteredDespesas();
    const totalPagesDespesas = getTotalPagesDespesas();

    if (currentPageDespesas > totalPagesDespesas) {
        currentPageDespesas = totalPagesDespesas;
    }

    const startIndex = (currentPageDespesas - 1) * itemsPerPageDespesas;
    const endIndex = startIndex + itemsPerPageDespesas;
    const pageData = filteredDespesas.slice(startIndex, endIndex);

    despesasTableBody.innerHTML = '';

    if (pageData.length === 0) {
        despesasTableBody.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280; grid-column: 1 / -1;">
                <p>Nenhuma despesa encontrada com os filtros aplicados.</p>
            </div>
        `;
    } else {
        pageData.forEach(despesa => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div class="table-col">${despesa.data}</div>
                <div class="table-col">${despesa.nome}</div>
                <div class="table-col">${despesa.descricao}</div>
                <div class="table-col expense-value">- R$ ${despesa.valor}</div>
            `;
            despesasTableBody.appendChild(row);
        });
    }

    updatePaginationDespesas(totalPagesDespesas);
    updateDespesasCount();
}

// Função para atualizar controles de paginação de despesas
function updatePaginationDespesas(totalPagesDespesas) {
    paginationDespesasInfo.textContent = `Página ${currentPageDespesas} de ${totalPagesDespesas}`;

    prevPageDespesasBtn.disabled = currentPageDespesas === 1;
    nextPageDespesasBtn.disabled = currentPageDespesas === totalPagesDespesas;
}

// Event listeners para paginação de despesas
prevPageDespesasBtn.addEventListener('click', () => {
    if (currentPageDespesas > 1) {
        currentPageDespesas--;
        renderDespesas();
    }
});

nextPageDespesasBtn.addEventListener('click', () => {
    if (currentPageDespesas < getTotalPagesDespesas()) {
        currentPageDespesas++;
        renderDespesas();
    }
});

// Event listeners para filtros de despesas
const dataInicialDespesas = document.getElementById('dataInicialDespesas');
const dataFinalDespesas = document.getElementById('dataFinalDespesas');
const ordenacaoDespesas = document.getElementById('ordenacaoDespesas');
const aplicarFiltrosDespesas = document.getElementById('aplicarFiltrosDespesas');
const limparFiltrosDespesas = document.getElementById('limparFiltrosDespesas');

if (aplicarFiltrosDespesas) {
    aplicarFiltrosDespesas.addEventListener('click', () => {
        despesasFilters.dataInicial = dataInicialDespesas.value || null;
        despesasFilters.dataFinal = dataFinalDespesas.value || null;
        despesasFilters.ordenacao = ordenacaoDespesas.value;
        currentPageDespesas = 1;
        renderDespesas();
    });
}

if (limparFiltrosDespesas) {
    limparFiltrosDespesas.addEventListener('click', () => {
        dataInicialDespesas.value = '';
        dataFinalDespesas.value = '';
        ordenacaoDespesas.value = 'newest';
        despesasFilters.dataInicial = null;
        despesasFilters.dataFinal = null;
        despesasFilters.ordenacao = 'newest';
        currentPageDespesas = 1;
        renderDespesas();
    });
}

// Renderizar despesas quando a página de despesas for aberta
navDespesas.addEventListener('click', () => {
    showPage('despesas');
    renderDespesas();
});

navRelatorios.addEventListener('click', () => {
    showPage('relatorios');
});

navAjuda.addEventListener('click', () => {
    showPage('ajuda');
});

// // FAQ Functionality
// const faqItems = document.querySelectorAll('.faq-item');
// const faqFilterBtns = document.querySelectorAll('.faq-filter-btn');

// // Expandir/Colapsar FAQ items
// faqItems.forEach(item => {
//     const question = item.querySelector('.faq-question');
//     question.addEventListener('click', () => {
//         const isActive = item.classList.contains('active');

//         // Fechar todos os outros itens
//         faqItems.forEach(otherItem => {
//             if (otherItem !== item) {
//                 otherItem.classList.remove('active');
//             }
//         });

//         // Toggle do item clicado
//         if (isActive) {
//             item.classList.remove('active');
//         } else {
//             item.classList.add('active');
//         }
//     });
// });

// // Filtros FAQ
// faqFilterBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//         // Remover active de todos os botões
//         faqFilterBtns.forEach(b => b.classList.remove('active'));
//         // Adicionar active no botão clicado
//         btn.classList.add('active');

//         const filter = btn.getAttribute('data-filter');

//         // Filtrar FAQ items (por enquanto mostra todos, pode ser expandido depois)
//         // Esta funcionalidade pode ser implementada quando houver mais FAQs categorizadas
//     });
// });

// // Support Form Functionality
// const supportForm = document.getElementById('supportForm');
// const supportMessage = document.getElementById('supportMessage');
// const charCount = document.getElementById('charCount');
// const supportFileUploadArea = document.getElementById('supportFileUploadArea');
// const supportFile = document.getElementById('supportFile');
// const clearSupportFormBtn = document.getElementById('clearSupportFormBtn');

// // Contador de caracteres
// if (supportMessage && charCount) {
//     supportMessage.addEventListener('input', () => {
//         const length = supportMessage.value.length;
//         charCount.textContent = length;

//         if (length > 1000) {
//             charCount.style.color = '#ef4444';
//         } else {
//             charCount.style.color = '#6b7280';
//         }
//     });
// }

// // Upload de arquivo
// if (supportFileUploadArea && supportFile) {
//     supportFileUploadArea.addEventListener('click', () => {
//         supportFile.click();
//     });

//     supportFile.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const fileSize = file.size / 1024 / 1024; // MB
//             if (fileSize > 5) {
//                 alert('O arquivo deve ter no máximo 5MB');
//                 supportFile.value = '';
//                 return;
//             }

//             const fileUploadContent = supportFileUploadArea.querySelector('.file-upload-content span');
//             fileUploadContent.textContent = file.name;
//         }
//     });

//     // Drag and drop
//     supportFileUploadArea.addEventListener('dragover', (e) => {
//         e.preventDefault();
//         supportFileUploadArea.querySelector('.file-upload-content').style.borderColor = '#2563eb';
//     });

//     supportFileUploadArea.addEventListener('dragleave', () => {
//         supportFileUploadArea.querySelector('.file-upload-content').style.borderColor = '#d1d5db';
//     });

//     supportFileUploadArea.addEventListener('drop', (e) => {
//         e.preventDefault();
//         supportFileUploadArea.querySelector('.file-upload-content').style.borderColor = '#d1d5db';

//         const file = e.dataTransfer.files[0];
//         if (file) {
//             const fileSize = file.size / 1024 / 1024;
//             if (fileSize > 5) {
//                 alert('O arquivo deve ter no máximo 5MB');
//                 return;
//             }
//             supportFile.files = e.dataTransfer.files;
//             const fileUploadContent = supportFileUploadArea.querySelector('.file-upload-content span');
//             fileUploadContent.textContent = file.name;
//         }
//     });
// }

// // Limpar formulário
// if (clearSupportFormBtn && supportForm) {
//     clearSupportFormBtn.addEventListener('click', () => {
//         supportForm.reset();
//         if (charCount) charCount.textContent = '0';
//         if (supportFileUploadArea) {
//             const fileUploadContent = supportFileUploadArea.querySelector('.file-upload-content span');
//             fileUploadContent.textContent = 'Clique para selecionar ou arraste um arquivo';
//         }
//     });
// }

// // Submit do formulário
// if (supportForm) {
//     supportForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         console.log('Formulário de suporte enviado:', new FormData(supportForm));
//         alert('Solicitação enviada com sucesso! Entraremos em contato em até 24 horas úteis.');
//         supportForm.reset();
//         if (charCount) charCount.textContent = '0';
//         if (supportFileUploadArea) {
//             const fileUploadContent = supportFileUploadArea.querySelector('.file-upload-content span');
//             fileUploadContent.textContent = 'Clique para selecionar ou arraste um arquivo';
//         }
//     });
// }

// Renderizar despesas na primeira carga se estiver na página de despesas
if (despesasContent && despesasContent.style.display !== 'none') {
    renderDespesas();
}

updateDespesasCount();

const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const newIncomeBtn = document.getElementById('newIncomeBtn');
const newExpenseBtn = document.getElementById('newExpenseBtn');

// Modal de Nova Receita
const incomeModalOverlay = document.getElementById('incomeModalOverlay');
const closeIncomeModalBtn = document.getElementById('closeIncomeModalBtn');
const cancelIncomeBtn = document.getElementById('cancelIncomeBtn');
const fileUploadArea = document.getElementById('fileUploadArea');
const incomeFile = document.getElementById('incomeFile');
const incomeForm = document.getElementById('incomeForm');

// Modal de Nova Despesa
const expenseModalOverlay = document.getElementById('expenseModalOverlay');
const closeExpenseModalBtn = document.getElementById('closeExpenseModalBtn');
const cancelExpenseBtn = document.getElementById('cancelExpenseBtn');
const expenseFileUploadArea = document.getElementById('expenseFileUploadArea');
const expenseFile = document.getElementById('expenseFile');
const expenseForm = document.getElementById('expenseForm');

// Modal de Gerar DAS
const dasModalOverlay = document.getElementById('dasModalOverlay');
const closeDasModalBtn = document.getElementById('closeDasModalBtn');
const cancelDasBtn = document.getElementById('cancelDasBtn');
const dasForm = document.getElementById('dasForm');
const gerarDasBtn = document.getElementById('gerarDasBtn');
const mesAnoReferenciaInput = document.getElementById('mesAnoReferencia');
let dasDatePicker = null;

// Função para abrir modal
function openModal() {
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
}

// Função para fechar modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Função para abrir modal de Nova Receita
function openIncomeModal() {
    incomeModalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
}

// Função para fechar modal de Nova Receita
function closeIncomeModal() {
    incomeModalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    incomeForm.reset();
}

// Função para abrir modal de Nova Despesa
function openExpenseModal() {
    expenseModalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
}

// Função para fechar modal de Nova Despesa
function closeExpenseModal() {
    expenseModalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    expenseForm.reset();
}

// Função para formatar data em português (mês de ano)
function formatMonthYear(date) {
    if (!date) return '';
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const d = new Date(date);
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${month} de ${year}`;
}

// Função para inicializar o datepicker do DAS
function initDasDatePicker() {
    if (mesAnoReferenciaInput && !dasDatePicker && typeof flatpickr !== 'undefined') {
        // Parsear valor inicial se existir (ex: "dezembro de 2025")
        let initialDate = null;
        if (mesAnoReferenciaInput.value && mesAnoReferenciaInput.value.includes('de')) {
            const months = {
                'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
                'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
                'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
            };
            const parts = mesAnoReferenciaInput.value.toLowerCase().split(' de ');
            if (parts.length === 2) {
                const month = months[parts[0]];
                const year = parts[1];
                if (month && year) {
                    initialDate = `${year}-${month}`;
                }
            }
        }

        dasDatePicker = flatpickr(mesAnoReferenciaInput, {
            locale: 'pt',
            dateFormat: 'Y-m',
            defaultDate: initialDate || '2025-12',
            mode: 'single',
            allowInput: false,
            clickOpens: true,
            static: false,
            onChange: function (selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    mesAnoReferenciaInput.value = formatMonthYear(selectedDates[0]);
                }
            },
            onReady: function (selectedDates, dateStr, instance) {
                // Formatar valor inicial
                if (dateStr) {
                    const date = new Date(dateStr + '-01');
                    mesAnoReferenciaInput.value = formatMonthYear(date);
                }
            }
        });

        // Permitir clicar no ícone de calendário para abrir o datepicker
        const calendarIcon = mesAnoReferenciaInput.parentElement.querySelector('.calendar-icon');
        if (calendarIcon) {
            calendarIcon.style.cursor = 'pointer';
            calendarIcon.addEventListener('click', () => {
                dasDatePicker.open();
            });
        }
    }
}

// Função para abrir modal de Gerar DAS
function openDasModal() {
    dasModalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    // Inicializar datepicker se ainda não foi inicializado
    setTimeout(() => {
        initDasDatePicker();
    }, 100);
}

// Função para fechar modal de Gerar DAS
function closeDasModal() {
    dasModalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    // Não resetar o formulário, apenas fechar o modal
    // dasForm.reset();
}

// Abrir modal principal
openModalBtn.addEventListener('click', openModal);

// Fechar modal principal ao clicar no X
closeModalBtn.addEventListener('click', closeModal);

// Fechar modal principal ao clicar fora dele
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Fechar modal de receita ao clicar no X
closeIncomeModalBtn.addEventListener('click', closeIncomeModal);

// Cancelar formulário de receita
cancelIncomeBtn.addEventListener('click', closeIncomeModal);

// Fechar modal de receita ao clicar fora dele
incomeModalOverlay.addEventListener('click', (e) => {
    if (e.target === incomeModalOverlay) {
        closeIncomeModal();
    }
});

// Fechar modal de despesa ao clicar no X
closeExpenseModalBtn.addEventListener('click', closeExpenseModal);

// Cancelar formulário de despesa
cancelExpenseBtn.addEventListener('click', closeExpenseModal);

// Fechar modal de despesa ao clicar fora dele
expenseModalOverlay.addEventListener('click', (e) => {
    if (e.target === expenseModalOverlay) {
        closeExpenseModal();
    }
});

// Abrir modal de Gerar DAS
if (gerarDasBtn) {
    gerarDasBtn.addEventListener('click', openDasModal);
}

// Fechar modal de Gerar DAS ao clicar no X
if (closeDasModalBtn) {
    closeDasModalBtn.addEventListener('click', closeDasModal);
}

// Cancelar formulário de DAS
if (cancelDasBtn) {
    cancelDasBtn.addEventListener('click', closeDasModal);
}

// Fechar modal de DAS ao clicar fora dele
if (dasModalOverlay) {
    dasModalOverlay.addEventListener('click', (e) => {
        if (e.target === dasModalOverlay) {
            closeDasModal();
        }
    });
}

// Máscara de moeda para o campo Valor do Lucro
const valorLucroInput = document.getElementById('valorLucro');
if (valorLucroInput) {
    valorLucroInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value) / 100).toFixed(2);
            value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            e.target.value = value;
        }
    });
}

// Função para abrir a imagem em uma nova aba
function openImageInNewTab(imagePath) {
    try {
        // Abrir a imagem em uma nova aba
        window.open(imagePath, '_blank');
    } catch (error) {
        console.error('Erro ao abrir a imagem:', error);
        alert('Erro ao abrir o DAS. Por favor, tente novamente.');
    }
}

// Submit do formulário - Gerar DAS
if (dasForm) {
    dasForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Abrir a imagem do DAS em uma nova aba
        openImageInNewTab('novo-modelo-das-nov2018.png');
        // Fechar modal após gerar
        closeDasModal();
    });
}

// Fechar modais ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (dasModalOverlay.classList.contains('active')) {
            closeDasModal();
        } else if (expenseModalOverlay.classList.contains('active')) {
            closeExpenseModal();
        } else if (incomeModalOverlay.classList.contains('active')) {
            closeIncomeModal();
        } else if (modalOverlay.classList.contains('active')) {
            closeModal();
        }
    }
});

// Ações dos botões do modal principal
newIncomeBtn.addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
        openIncomeModal();
    }, 200);
});

newExpenseBtn.addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
        openExpenseModal();
    }, 200);
});

// Upload de arquivo
fileUploadArea.addEventListener('click', () => {
    incomeFile.click();
});

incomeFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileUploadContent = fileUploadArea.querySelector('.file-upload-content span');
        fileUploadContent.textContent = file.name;
    }
});

// Upload de arquivo - Despesa
expenseFileUploadArea.addEventListener('click', () => {
    expenseFile.click();
});

expenseFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileUploadContent = expenseFileUploadArea.querySelector('.file-upload-content span');
        fileUploadContent.textContent = file.name;
    }
});

// Submit do formulário - Receita
incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(incomeForm);
    addReceita({
        nome: formData.get('name'),
        valor: normalizeCurrency(formData.get('value')),
        data: formData.get('date'),
        descricao: formData.get('description')
    });
    closeIncomeModal();
});

// Submit do formulário - Despesa
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(expenseForm);
    addDespesa({
        nome: formData.get('name'),
        valor: normalizeCurrency(formData.get('value')),
        data: formData.get('date'),
        descricao: formData.get('description')
    });
    closeExpenseModal();
});

// Inicializar Dashboard ao carregar a página
updateDashboard();

// Charts variables
let cashFlowChart = null;
let profitMarginChart = null;
let revenueExpenseChart = null;
let monthlyEvolutionChart = null;

// Generate monthly data from receitas and despesas
function getMonthlyData() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const monthlyReceitas = [0, 0, 0, 0, 0, 0];
    const monthlyDespesas = [0, 0, 0, 0, 0, 0];

    // Simular distribuição dos dados pelos meses (em produção, isso viria dos dados reais)
    const totalReceitas = receitasData.reduce((sum, item) => sum + normalizeCurrency(item.valor), 0);
    const totalDespesas = despesasData.reduce((sum, item) => sum + normalizeCurrency(item.valor), 0);

    // Distribuir valores pelos meses (simulação)
    for (let i = 0; i < 6; i++) {
        monthlyReceitas[i] = (totalReceitas / 6) * (1 + (i * 0.1));
        monthlyDespesas[i] = (totalDespesas / 6) * (1 + (i * 0.05));
    }

    return { months, monthlyReceitas, monthlyDespesas };
}

// Create charts
function createCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está carregado');
        return;
    }

    const { months, monthlyReceitas, monthlyDespesas } = getMonthlyData();

    // Calculate profit margin for each month
    const monthlyProfitMargin = monthlyReceitas.map((receita, i) => {
        const despesa = monthlyDespesas[i];
        const lucro = receita - despesa;
        return receita > 0 ? (lucro / receita) * 100 : 0;
    });

    // Calculate monthly growth
    const monthlyGrowth = monthlyReceitas.map((receita, i) => {
        if (i === 0) return 5;
        const previous = monthlyReceitas[i - 1];
        return previous > 0 ? ((receita - previous) / previous) * 100 : 0;
    });

    // Destroy existing charts if they exist
    if (cashFlowChart) cashFlowChart.destroy();
    if (profitMarginChart) profitMarginChart.destroy();
    if (revenueExpenseChart) revenueExpenseChart.destroy();
    if (monthlyEvolutionChart) monthlyEvolutionChart.destroy();

    // 1. Fluxo de Caixa (Line Chart)
    const cashFlowCtx = document.getElementById('cashFlowChart');
    if (cashFlowCtx) {
        cashFlowChart = new Chart(cashFlowCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Receitas',
                        data: monthlyReceitas,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: false,
                        pointRadius: 4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Despesas',
                        data: monthlyDespesas,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: false,
                        pointRadius: 4,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. Margem de Lucro (Line Chart)
    const profitMarginCtx = document.getElementById('profitMarginChart');
    if (profitMarginCtx) {
        profitMarginChart = new Chart(profitMarginCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Margem de Lucro',
                    data: monthlyProfitMargin,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // 3. Receitas x Despesas (Doughnut Chart)
    const revenueExpenseCtx = document.getElementById('revenueExpenseChart');
    if (revenueExpenseCtx) {
        const totalReceitas = monthlyReceitas.reduce((a, b) => a + b, 0);
        const totalDespesas = monthlyDespesas.reduce((a, b) => a + b, 0);

        revenueExpenseChart = new Chart(revenueExpenseCtx, {
            type: 'doughnut',
            data: {
                labels: ['Receitas', 'Despesas'],
                datasets: [{
                    data: [totalReceitas, totalDespesas],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                }
            }
        });
    }

    // 4. Evolução Mensal (Bar Chart)
    const monthlyEvolutionCtx = document.getElementById('monthlyEvolutionChart');
    if (monthlyEvolutionCtx) {
        monthlyEvolutionChart = new Chart(monthlyEvolutionCtx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Crescimento',
                    data: monthlyGrowth,
                    backgroundColor: monthlyGrowth.map(val => val >= 0 ? '#10b981' : '#ef4444'),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update Reports
function updateReports() {
    const totalReceitas = receitasData.reduce((sum, item) => sum + normalizeCurrency(item.valor), 0);
    const totalDespesas = despesasData.reduce((sum, item) => sum + normalizeCurrency(item.valor), 0);
    const lucroLiquido = totalReceitas - totalDespesas;
    const margemLucro = totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0;

    // Atualizar valores
    document.getElementById('totalReceitasReport').textContent = `R$ ${formatCurrency(totalReceitas)}`;
    document.getElementById('totalDespesasReport').textContent = `R$ ${formatCurrency(totalDespesas)}`;
    document.getElementById('lucroLiquidoReport').textContent = `R$ ${formatCurrency(lucroLiquido)}`;
    document.getElementById('margemLucroReport').textContent = `${margemLucro.toFixed(1)}%`;

    // Simular mudanças percentuais (em produção, isso viria de dados históricos)
    const receitasChange = 12.8;
    const despesasChange = 5.2;
    const lucroChange = 18.3;
    const margemChange = 2.3;

    document.getElementById('receitasChange').textContent = `+${receitasChange}%`;
    document.getElementById('despesasChange').textContent = `+${despesasChange}%`;
    document.getElementById('lucroChange').textContent = `+${lucroChange}%`;
    document.getElementById('margemChange').textContent = `+${margemChange}%`;

    // Create charts
    createCharts();
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
