document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os botões e os modais
    const supportButton = document.querySelector('.support-btn');
    const addUnitButton = document.querySelector('.add-unit-btn');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Função para abrir modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Função para fechar modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Eventos para abrir os modais
    if (supportButton) {
        supportButton.addEventListener('click', () => {
            openModal('supportModal');
        });
    }

    if (addUnitButton) {
        addUnitButton.addEventListener('click', () => {
            openModal('addUnitModal');
        });
    }

    // Eventos para fechar os modais
    closeButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Evento do formulário de adicionar unidade
    const addUnitForm = document.getElementById('addUnitForm');
    if (addUnitForm) {
        addUnitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const serialNumber = document.getElementById('serialNumber').value;
            alert(`Unidade com número de série ${serialNumber} adicionada com sucesso!`);
            closeModal('addUnitModal');
        });
    }
});
