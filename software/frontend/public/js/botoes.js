document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de relatório carregado!");

    // Botão de Download do Relatório
    document.getElementById('downloadButton').addEventListener('click', function() {
        const chartCanvas = document.getElementById('solarChart');

        const options = {
            margin: 10,
            filename: 'relatorio_solarbanyu.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(chartCanvas).set(options).save();
    });

    // Botão de Compartilhamento
    const shareButton = document.getElementById("shareButton");
    const shareModal = document.getElementById("shareModal");
    const closeShareModal = document.getElementById("closeShareModal");

    shareButton.addEventListener("click", () => {
        shareModal.style.display = "flex";
    });

    closeShareModal.addEventListener("click", () => {
        shareModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === shareModal) {
            shareModal.style.display = "none";
        }
    });

    // Compartilhamento
    document.getElementById("shareWhatsApp").addEventListener("click", () => {
        const reportUrl = window.location.href;
        const message = encodeURIComponent("Confira meu relatório do SolarBanyu: " + reportUrl);
        window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
    });

    document.getElementById("shareEmail").addEventListener("click", () => {
        const reportUrl = window.location.href;
        const subject = encodeURIComponent("Relatório do SolarBanyu");
        const body = encodeURIComponent("Olá,\n\nConfira meu relatório do SolarBanyu no link abaixo:\n\n" + reportUrl);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });

    document.getElementById("copyLink").addEventListener("click", () => {
        const reportUrl = window.location.href;
        navigator.clipboard.writeText(reportUrl).then(() => {
            alert("Link copiado para a área de transferência!");
        }).catch(err => {
            console.error("Erro ao copiar o link:", err);
        });
    });

    // Botão de Suporte
    const supportButton = document.getElementById("supportButton");
    const supportModal = document.getElementById("supportModal");
    const closeSupportModal = document.getElementById("closeSupportModal");

    supportButton.addEventListener("click", () => {
        supportModal.style.display = "flex";
    });

    closeSupportModal.addEventListener("click", () => {
        supportModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === supportModal) {
            supportModal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script FAQ carregado!");

    // Botão e modal de suporte
    const supportButton = document.getElementById("supportButton");
    const supportModal = document.getElementById("supportModal");
    const closeSupportModal = document.getElementById("closeSupportModal");

    if (supportButton && supportModal && closeSupportModal) {
        console.log("Elementos do modal de suporte encontrados!");

        // Abrir modal ao clicar no botão "Pedir suporte"
        supportButton.addEventListener("click", () => {
            supportModal.style.display = "flex";
        });

        // Fechar modal ao clicar no "X"
        closeSupportModal.addEventListener("click", () => {
            supportModal.style.display = "none";
        });

        // Fechar modal ao clicar fora da área do modal
        window.addEventListener("click", (event) => {
            if (event.target === supportModal) {
                supportModal.style.display = "none";
            }
        });
    } else {
        console.error("Erro: Elementos do modal de suporte não encontrados!");
    }
});

