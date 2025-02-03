document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de alertas carregado!");

    const reportButtons = document.querySelectorAll(".btn.report");
    const reportModal = document.getElementById("reportModal");
    const closeReportModal = document.getElementById("closeReportModal");
    const cancelReport = document.getElementById("cancelReport");
    const reportForm = document.getElementById("reportForm");

    let selectedButton = null;

    if (reportButtons && reportModal && closeReportModal && cancelReport && reportForm) {
        console.log("Elementos do modal de reporte encontrados!");

        // Abrir modal ao clicar em qualquer botão "Reportar Alerta"
        reportButtons.forEach(button => {
            button.addEventListener("click", () => {
                reportModal.style.display = "flex";
                selectedButton = button;
            });
        });

        // Fechar modal ao clicar no "X" ou no botão "Cancelar"
        closeReportModal.addEventListener("click", () => {
            reportModal.style.display = "none";
        });

        cancelReport.addEventListener("click", () => {
            reportModal.style.display = "none";
        });

        // Fechar modal ao clicar fora
        window.addEventListener("click", (event) => {
            if (event.target === reportModal) {
                reportModal.style.display = "none";
            }
        });

        // Enviar formulário
        reportForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const reason = document.getElementById("reason").value;
            const phone = document.getElementById("phone").value;

            if (!reason) {
                alert("Por favor, selecione um motivo para o reporte.");
                return;
            }

            console.log(`Alerta reportado com motivo: ${reason}, telefone: ${phone || "Não informado"}`);

            reportModal.style.display = "none";

            if (selectedButton) {
                selectedButton.textContent = "REPORTADO";
                selectedButton.classList.add("reported");
            }
        });
    } else {
        console.error("Erro: Elementos do modal de reporte não encontrados!");
    }
});
