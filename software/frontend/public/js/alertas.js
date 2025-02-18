// **Função para formatar datas**
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// **Função para carregar os dados da página Home**
async function loadHomePageData() {
    const token = localStorage.getItem("token");
    if (!token) return console.warn("Usuário não autenticado.");

    try {
        const userId = localStorage.getItem("userId");
        const userResponse = await fetch(`https://solarbanyu-backend.onrender.com/app/usuario/${userId}`, {
            method: "GET", headers: { "Authorization": `Token ${token}` }
        });
        if (!userResponse.ok) throw new Error("Erro ao buscar usuário.");

        const deviceResponse = await fetch("https://solarbanyu-backend.onrender.com/app/dispositivos/", {
            method: "GET", headers: { "Authorization": `Token ${token}` }
        });
        if (!deviceResponse.ok) throw new Error("Erro ao buscar dispositivo.");

    } catch (error) {
        console.error("Erro ao carregar dados da página de alertas:", error);
    }
}

// **Função para carregar e exibir alertas com ordenação persistente**
async function loadAlert() {
    const token = localStorage.getItem("token");
    if (!token) return console.warn("Usuário não autenticado.");

    let currentSortCriteria = "recent";

    setInterval(async () => {
        try {
            const response = await fetch("https://solarbanyu-backend.onrender.com/app/alertas/", {
                method: "GET", headers: { "Authorization": `Token ${token}` }
            });
            if (!response.ok) throw new Error("Erro ao buscar alertas.");

            const data = await response.json();
            updateDaysWithoutCriticalAlerts(data);

            const tbody = document.querySelector(".alerts-section table tbody");
            tbody.innerHTML = "";

            const prioridadeMap = {
                "Baixa": { texto: "Baixa", classe: "low" },
                "Média": { texto: "Média", classe: "medium" },
                "Rotina": { texto: "Alta", classe: "high" },
                "Urgente": { texto: "Crítica", classe: "urgent" }
            };

            data.forEach((alerta, index) => {
                const row = document.createElement("tr");
                row.setAttribute("data-prioridade", alerta.prioridade);
                const dataFormatada = new Date(alerta.criado_em).toLocaleDateString("pt-BR");

                row.innerHTML = `
                    <td>${(index + 1).toString().padStart(5, "0")}</td>
                    <td class="${prioridadeMap[alerta.prioridade]?.classe || 'default'}">
                        ${prioridadeMap[alerta.prioridade]?.texto || 'Desconhecida'}
                    </td>
                    <td>${alerta.descricao}</td>
                    <td>${dataFormatada}</td>
                    <td>
                        <button class="btn resolver-btn ${alerta.resolvido ? 'resolved' : ''}"
                            data-id="${alerta.id}"
                            data-resolvido="${alerta.resolvido}"
                            ${alerta.resolvido ? 'disabled' : ''}>
                            ${alerta.resolvido ? "Resolvido" : "Resolver"}
                        </button>
                    </td>
                    <td>
                        <button class="btn report">Reportar alerta</button>
                    </td>`;
                tbody.appendChild(row);
            });

            sortAlerts(currentSortCriteria);
            const msgSemAlertas = document.querySelector(".alerts-section p");
            msgSemAlertas.style.display = data.length > 0 ? "none" : "block";

            addEventListenersToButtons();

        } catch (error) {
            console.error("Erro ao carregar informações dos alertas:", error);
        }
    }, 5000);
}

// **Função para ordenar os alertas**
function sortAlerts(criteria) {
    const tbody = document.querySelector(".alerts-section table tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const parseDate = dateString => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    rows.sort((a, b) => {
        const dateA = parseDate(a.cells[3].textContent);
        const dateB = parseDate(b.cells[3].textContent);
        const priorityA = Number(a.getAttribute("data-prioridade"));
        const priorityB = Number(b.getAttribute("data-prioridade"));

        switch (criteria) {
            case "recent": return dateB - dateA;
            case "oldest": return dateA - dateB;
            case "priority": return priorityB - priorityA;
            default: return 0;
        }
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}

// **Função para atualizar os dias sem alertas críticos**
function updateDaysWithoutCriticalAlerts(alerts) {
    const lastCriticalAlert = alerts
        .filter(alert => alert.prioridade === "Crítica")
        .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))[0];

    let message = "Nenhum alerta crítico registrado";

    if (lastCriticalAlert) {
        const lastDate = new Date(lastCriticalAlert.criado_em);
        const currentDate = new Date();
        const daysWithoutCritical = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        message = `${daysWithoutCritical} dias`;
    }

    document.querySelector(".days-without-alerts h2").textContent = message;
}
// **Filtro de pesquisa**
document.querySelector(".search-input").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll(".alerts-section table tbody tr").forEach(row => {
        const tipo = row.cells[2].textContent.toLowerCase();
        row.style.display = tipo.includes(searchValue) ? "" : "none";
    });
});

// **Evento para troca de ordenação**
document.querySelector(".sort-dropdown").addEventListener("change", function () {
    const criteria = this.value;
    sortAlerts(criteria);
});

// **Adiciona eventos aos botões**
function addEventListenersToButtons() {
    document.querySelectorAll(".resolver-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const alertId = this.getAttribute("data-id");
            const resolvido = this.getAttribute("data-resolvido") === "true";

            if (resolvido) return;

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://solarbanyu-backend.onrender.com/app/alerta/${alertId}/`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ resolvido: true })
                });

                if (!response.ok) throw new Error("Erro ao atualizar alerta.");

                this.textContent = "Resolvido";
                this.classList.add("resolved");
                this.disabled = true;

            } catch (error) {
                console.error("Erro ao atualizar alerta:", error);
            }
        });
    });
}

// **Inicializa a aplicação**
document.addEventListener("DOMContentLoaded", () => {
    loadHomePageData();
    loadAlert();
});