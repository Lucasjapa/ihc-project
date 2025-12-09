// Tutorial Data
const tutorialsData = {
    'getting-started': {
        title: 'Primeiros Passos',
        steps: [
            {
                icon: 'ph-user-circle-plus',
                title: 'Crie sua conta',
                description: 'Acesse a página de cadastro e preencha seus dados pessoais e informações do seu negócio. Isso levará apenas alguns minutos.'
            },
            {
                icon: 'ph-house-line',
                title: 'Explore o Dashboard',
                description: 'Após o login, você verá o painel principal com resumo de receitas, despesas e saldo. Familiarize-se com a interface.'
            },
            {
                icon: 'ph-plus-circle',
                title: 'Adicione sua primeira transação',
                description: 'Clique em "Novo Lançamento" e registre sua primeira receita ou despesa. Você pode anexar comprovantes para manter tudo organizado.'
            },
            {
                icon: 'ph-chart-bar',
                title: 'Visualize seus relatórios',
                description: 'Acesse a seção de Relatórios para ver gráficos e análises das suas finanças. Use os filtros para personalizar a visualização.'
            }
        ]
    },
    'add-income': {
        title: 'Adicionar Receitas',
        steps: [
            {
                icon: 'ph-cursor-click',
                title: 'Clique em Novo Lançamento',
                description: 'No dashboard, localize e clique no botão azul "Novo Lançamento" no canto superior direito.'
            },
            {
                icon: 'ph-arrow-circle-up',
                title: 'Selecione Nova Receita',
                description: 'Na janela que abrir, escolha a opção "Nova Receita" para registrar uma entrada de dinheiro.'
            },
            {
                icon: 'ph-note-pencil',
                title: 'Preencha os dados',
                description: 'Informe o nome da receita, valor, data e uma descrição opcional. Você também pode anexar um comprovante clicando na área de upload.'
            }
        ]
    },
    'add-expense': {
        title: 'Registrar Despesas',
        steps: [
            {
                icon: 'ph-cursor-click',
                title: 'Clique em Novo Lançamento',
                description: 'No dashboard, clique no botão "Novo Lançamento" localizado no topo da página.'
            },
            {
                icon: 'ph-arrow-circle-down',
                title: 'Selecione Nova Despesa',
                description: 'Escolha a opção "Nova Despesa" para registrar um gasto do seu negócio.'
            },
            {
                icon: 'ph-note-pencil',
                title: 'Complete o formulário',
                description: 'Preencha todos os campos: nome da despesa, valor, data e descrição. Anexe notas fiscais ou comprovantes se necessário.'
            }
        ]
    },
    'reports': {
        title: 'Gerar Relatórios',
        steps: [
            {
                icon: 'ph-sidebar',
                title: 'Acesse Relatórios',
                description: 'No menu lateral esquerdo, clique em "Relatórios" para acessar a página de análises financeiras.'
            },
            {
                icon: 'ph-calendar-blank',
                title: 'Selecione o período',
                description: 'Use os filtros de data para escolher o período que deseja analisar. Você pode usar filtros rápidos ou datas personalizadas.'
            },
            {
                icon: 'ph-funnel',
                title: 'Aplique filtros adicionais',
                description: 'Refine sua análise usando filtros de tipo de transação, valor mínimo/máximo e outros critérios disponíveis.'
            },
            {
                icon: 'ph-chart-line-up',
                title: 'Analise os gráficos',
                description: 'Visualize os gráficos gerados automaticamente: evolução mensal, distribuição de receitas e despesas, e tendências.'
            },
            {
                icon: 'ph-download-simple',
                title: 'Exporte se necessário',
                description: 'Clique em "Exportar" para baixar o relatório em PDF ou Excel e compartilhar com seu contador.'
            }
        ]
    },
    'filters': {
        title: 'Usar Filtros',
        steps: [
            {
                icon: 'ph-list-bullets',
                title: 'Acesse a lista de transações',
                description: 'Vá para a página de Receitas ou Despesas onde você verá todas as suas transações listadas.'
            },
            {
                icon: 'ph-funnel-simple',
                title: 'Abra os filtros',
                description: 'Clique no ícone de funil ou na área de filtros no topo da lista para expandir as opções de filtragem.'
            },
            {
                icon: 'ph-check-square',
                title: 'Aplique os filtros desejados',
                description: 'Selecione os critérios que deseja usar: período, valor, tipo, categoria, etc. Os resultados serão atualizados automaticamente.'
            }
        ]
    },
    'export': {
        title: 'Exportar Dados',
        steps: [
            {
                icon: 'ph-file-text',
                title: 'Acesse Relatórios',
                description: 'Navegue até a página de Relatórios onde você encontrará todas as suas análises financeiras.'
            },
            {
                icon: 'ph-sliders',
                title: 'Configure o relatório',
                description: 'Ajuste os filtros e o período para incluir exatamente os dados que você deseja exportar.'
            },
            {
                icon: 'ph-file-arrow-down',
                title: 'Escolha o formato',
                description: 'Clique em "Exportar" e selecione o formato desejado: PDF para visualização ou Excel para análises adicionais.'
            },
            {
                icon: 'ph-check-circle',
                title: 'Baixe o arquivo',
                description: 'O arquivo será gerado e baixado automaticamente. Você pode abri-lo, imprimir ou enviar para seu contador.'
            }
        ]
    }
};

// Quick Access Navigation
document.querySelectorAll('.quick-card1').forEach(card => {
    card.addEventListener('click', () => {
        const section = card.getAttribute('data-section');
        const targetSection = document.getElementById(`${section}-section`);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Search Functionality
const searchInput = document.getElementById('help-search1');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // Search in FAQ
        document.querySelectorAll('.faq-item1').forEach(item => {
            const question = item.querySelector('.faq-question1 h4').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                if (searchTerm.length > 2) {
                    item.classList.add('active');
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Search in Tutorials
        document.querySelectorAll('.tutorial-card1').forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// FAQ Toggle
document.querySelectorAll('.faq-question1').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item1').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// FAQ Category Filter
document.querySelectorAll('.faq-category-btn1').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');

        // Update active button
        document.querySelectorAll('.faq-category-btn1').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter FAQ items
        document.querySelectorAll('.faq-item1').forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Tutorial Modal
const tutorialModal = document.getElementById('tutorial-modal1');
const closeTutorialBtn = document.querySelector('.close-tutorial1');
let currentTutorial = null;
let currentStep = 0;

function openTutorial(tutorialId) {
    currentTutorial = tutorialsData[tutorialId];
    if (!currentTutorial) return;

    currentStep = 0;
    document.getElementById('tutorial-title1').textContent = currentTutorial.title;
    document.getElementById('total-steps1').textContent = currentTutorial.steps.length;

    updateTutorialStep();
    tutorialModal.classList.remove('hidden');
}

function closeTutorial() {
    tutorialModal.classList.add('hidden');
    currentTutorial = null;
    currentStep = 0;
}

function updateTutorialStep() {
    if (!currentTutorial) return;

    const step = currentTutorial.steps[currentStep];
    const stepIcon = document.querySelector('.step-icon1 i');
    const stepTitle = document.getElementById('step-title1');
    const stepDescription = document.getElementById('step-description1');
    const progressFill = document.querySelector('.progress-fill1');
    const currentStepSpan = document.getElementById('current-step1');
    const btnPrev = document.querySelector('.btn-prev1');
    const btnNext = document.querySelector('.btn-next1');

    // Update content
    stepIcon.className = `ph-bold ${step.icon}`;
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.description;

    // Update progress
    const progress = ((currentStep + 1) / currentTutorial.steps.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentStepSpan.textContent = currentStep + 1;

    // Update buttons
    btnPrev.disabled = currentStep === 0;

    if (currentStep === currentTutorial.steps.length - 1) {
        btnNext.innerHTML = 'Concluir <i class="ph-bold ph-check"></i>';
    } else {
        btnNext.innerHTML = 'Próximo <i class="ph-bold ph-caret-right"></i>';
    }
}

// Tutorial buttons
document.querySelectorAll('.btn-tutorial1').forEach(btn => {
    btn.addEventListener('click', () => {
        const tutorialId = btn.closest('.tutorial-card1').getAttribute('data-tutorial1');
        openTutorial(tutorialId);
    });
});

if (closeTutorialBtn) {
    closeTutorialBtn.addEventListener('click', closeTutorial);
}

document.querySelector('.btn-prev1')?.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateTutorialStep();
    }
});

document.querySelector('.btn-next1')?.addEventListener('click', () => {
    if (currentStep < currentTutorial.steps.length - 1) {
        currentStep++;
        updateTutorialStep();
    } else {
        closeTutorial();
    }
});

// Close modal on overlay click
tutorialModal?.addEventListener('click', (e) => {
    if (e.target === tutorialModal) {
        closeTutorial();
    }
});

// Support Form
const supportForm = document.getElementById('support-form1');
const supportMessage = document.getElementById('support-message1');
const charCount = document.querySelector('.char-count1');
const fileUploadArea1 = document.querySelector('.file-upload-area1');
const fileInput = document.getElementById('support-attachment1');
const successMessage = document.getElementById('success-message1');

// Character counter
if (supportMessage && charCount) {
    supportMessage.addEventListener('input', () => {
        const length = supportMessage.value.length;
        charCount.textContent = `${length} / 1000 caracteres`;

        if (length > 1000) {
            supportMessage.value = supportMessage.value.substring(0, 1000);
            charCount.textContent = '1000 / 1000 caracteres';
        }
    });
}

// File upload
if (fileUploadArea1 && fileInput) {
    fileUploadArea1.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileSize = (file.size / 1024 / 1024).toFixed(2);

            if (file.size > 5 * 1024 * 1024) {
                alert('O arquivo deve ter no máximo 5MB');
                fileInput.value = '';
                return;
            }

            fileUploadArea1.innerHTML = `
                <i class="ph-fill ph-check-circle"></i>
                <span>${fileName}</span>
                <small>${fileSize} MB</small>
            `;
            fileUploadArea1.style.borderColor = 'var(--green)';
            fileUploadArea1.style.background = '#F0FDF4';
        }
    });

    // Drag and drop
    fileUploadArea1.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea1.style.borderColor = 'var(--primary-blue)';
        fileUploadArea1.style.background = '#F9FAFB';
    });

    fileUploadArea1.addEventListener('dragleave', () => {
        fileUploadArea1.style.borderColor = 'var(--border-color)';
        fileUploadArea1.style.background = 'transparent';
    });

    fileUploadArea1.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (file) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }

        fileUploadArea1.style.borderColor = 'var(--border-color)';
        fileUploadArea1.style.background = 'transparent';
    });
}

// Form submission
if (supportForm) {
    supportForm.addEventListener('submit1', async (e) => {
        e.preventDefault();

        const formData = new FormData(supportForm);
        const data = Object.fromEntries(formData.entries());

        // Simulate API call
        const submitBtn = supportForm.querySelector('.btn-submit1');
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = 'Enviando...';

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Support form submitted:', data);

        // Show success message
        supportForm.style.display = 'none';
        successMessage.classList.add('active');

        // Reset form after 5 seconds
        setTimeout(() => {
            supportForm.reset();
            supportForm.style.display = 'flex';
            successMessage.classList.remove('active');
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = 'Enviar Solicitação <i class="ph-bold ph-paper-plane-tilt"></i>';

            // Reset file upload area
            if (fileUploadArea1) {
                fileUploadArea1.innerHTML = `
                    <i class="ph-regular ph-upload"></i>
                    <span>Clique para selecionar ou arraste um arquivo</span>
                    <small>PDF, PNG, JPG até 5MB</small>
                `;
                fileUploadArea1.style.borderColor = 'var(--border-color)';
                fileUploadArea1.style.background = 'transparent';
            }
        }, 5000);
    });
}

// Phone mask for support form
const supportPhone = document.getElementById('support-phone1');
if (supportPhone) {
    supportPhone.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        value = value.replace(/(-\d{4})\d+?$/, '$1');
        e.target.value = value;
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close tutorial modal
    if (e.key === 'Escape' && !tutorialModal.classList.contains('hidden')) {
        closeTutorial();
    }

    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
    }
});

// Auto-scroll to section from URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const section = document.querySelector(hash);
        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});
