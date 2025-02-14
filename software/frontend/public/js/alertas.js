function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

async function loadHomePageData() {
    console.log("Carregando dados da página Home...");

    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        // Fazer as chamadas da API separadamente
        const userResponse = await fetch("http://localhost:8000/app/user/profile/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!userResponse.ok) throw new Error("Erro ao buscar usuário.");
        const userData = await userResponse.json();      
        
        

        const deviceResponse = await fetch("http://localhost:8000/app/dispositivos/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!deviceResponse.ok) throw new Error("Erro ao buscar dispositivo.");
        const deviceData = await deviceResponse.json();

        console.log("Dispositivos:", deviceData);          

        

    } catch (error) {
        console.error("Erro ao carregar dados da página de alertas:", error);
    }
}

async function loadAlert() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/app/alertas/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar alertas.");
        }

        const data = await response.json();

        updateDaysWithoutCriticalAlerts(data);
        
        // Referência ao corpo da tabela
        const tbody = document.querySelector(".alerts-section table tbody");
        tbody.innerHTML = ""; // Limpa as linhas antigas

        // Mapeia os níveis de prioridade
        const prioridadeMap = {
            1: { texto: "Baixa", classe: "low" },
            2: { texto: "Média", classe: "medium" },
            3: { texto: "Alta", classe: "high" },
            4: { texto: "Crítica", classe: "urgent" }
        };

        // Adiciona os alertas à tabela
        data.forEach(alerta => {
            const row = document.createElement("tr");
        
        // **Adiciona o atributo data-prioridade corretamente**
            row.setAttribute("data-prioridade", alerta.prioridade);

            // Formata a data para DD/MM/YYYY
            const dataFormatada = new Date(alerta.criado_em).toLocaleDateString("pt-BR");

            row.innerHTML = `
                <td>${alerta.id.toString().padStart(5, "0")}</td>
                <td class="${prioridadeMap[alerta.prioridade].classe}">${prioridadeMap[alerta.prioridade].texto}</td>
                <td>${alerta.tipo}</td>
                <td>${dataFormatada}</td>
                <td><button class="btn resolver-btn ${alerta.resolvido ? 'resolved' : ''}" 
                data-id="${alerta.id}" 
                data-resolvido="${alerta.resolvido}" 
                ${alerta.resolvido ? 'disabled' : ''}>
            ${alerta.resolvido ? "Resolvido" : "Resolver"}
        </button>
                <td><button class="btn report">Reportar alerta</button></td>
            `;

            tbody.appendChild(row);
        });

        // Mensagem caso não haja alertas
        const msgSemAlertas = document.querySelector(".alerts-section p");
        msgSemAlertas.style.display = data.length > 0 ? "none" : "block";

    } catch (error) {
        console.error("Erro ao carregar informações dos alertas:", error);
    }
}

async function loadGeneralInfo() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/app/dispositivos/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar dispositivo.");
        }
        const deviceData = await response.json();

        if (deviceData.length === 0) {
            console.warn("Nenhum dispositivo encontrado.");
            return;
        }

        
        // Agora busca os dados do sensor
        const sensorDataResponse = await fetch("http://localhost:8000/app/dados_sensores/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!sensorDataResponse.ok) {
            throw new Error("Erro ao buscar informações gerais dos sensores.");
        }
        const sensorData = await sensorDataResponse.json();

        
    } catch (error) {
        console.error("Erro ao carregar informações gerais dos sensores:", error);
    }

}

async function loadSensorData() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/app/alertas/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar alertas.");
        }

        const data = await response.json();
        document.getElementById("total-alertas").innerText = `${data.length} alerta(s)`;
        //data.length
    } catch (error) {
    console.error("Erro ao carregar informações dos alertas:", error);
    } 
}

// **Atualiza os "Dias sem alertas críticos"**
function updateDaysWithoutCriticalAlerts(alerts) {
    const lastCriticalAlert = alerts
        .filter(alert => alert.prioridade === 4) // Prioridade 4 = Crítica
        .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))[0];

    let daysWithoutCritical = 0;
    if (lastCriticalAlert) {
        const lastDate = new Date(lastCriticalAlert.criado_em);
        const currentDate = new Date();
        daysWithoutCritical = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
    }

    document.querySelector(".days-without-alerts h2").textContent = `${daysWithoutCritical} dias`;
}


// **Filtro de pesquisa**
document.querySelector(".search-input").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll(".alerts-section table tbody tr");

    rows.forEach(row => {
        
        const tipo = row.cells[2].textContent.toLowerCase();

        if (tipo.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


// **Ordenação**
document.querySelector(".sort-dropdown").addEventListener("change", function () {
    const criteria = this.value;
    console.log(`Ordenando por: ${criteria}`); // Para verificar se o evento está disparando

    const tbody = document.querySelector(".alerts-section table tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    if (rows.length === 0) {
        console.warn("Nenhum alerta encontrado para ordenar.");
        return;
    }

    rows.sort((a, b) => {
        // Tratamento de datas no formato DD/MM/YYYY
        const dateA = new Date(a.cells[3].textContent.split('/').reverse().join('-'));
        const dateB = new Date(b.cells[3].textContent.split('/').reverse().join('-'));

        // Obtém o valor da prioridade diretamente do atributo data-prioridade
        const numPriorityA = Number(a.getAttribute("data-prioridade"));
        const numPriorityB = Number(b.getAttribute("data-prioridade"));

        console.log(`Comparando prioridades: ${numPriorityA} vs ${numPriorityB}`);

        if (criteria === "recent") return dateB - dateA;
        if (criteria === "oldest") return dateA - dateB;
        if (criteria === "priority") return numPriorityB - numPriorityA; // Ordem: 4 → 3 → 2 → 1

        return 0;
    });

    // Atualiza a tabela com a nova ordenação
    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));

    console.log("Ordenação aplicada.");
});

// **Aplica estilo nos botões já resolvidos**
document.querySelectorAll(".resolver-btn").forEach(button => {
    if (button.getAttribute("data-resolvido") === "true") {
        button.classList.add("resolved");
        button.disabled = true; // Impede clique no botão já resolvido
    }
});

function addEventListenersToButtons() {
    document.querySelectorAll(".resolver-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const alertId = this.getAttribute("data-id");
            const resolvido = this.getAttribute("data-resolvido") === "true";

            // Se já está resolvido, não faz nada
            if (resolvido) return;

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`http://localhost:8000/app/alertas/${alertId}/`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ resolvido: true })
                });

                if (!response.ok) {
                    throw new Error("Erro ao atualizar alerta.");
                }

                // Atualiza o botão visualmente sem recarregar a página
                this.textContent = "Resolvido";
                this.setAttribute("data-resolvido", "true");
                this.classList.add("resolved");
                this.disabled = true; // Desativa o botão para evitar múltiplos cliques

            } catch (error) {
                console.error("Erro ao atualizar alerta:", error);
            }
        });
    });

    /* document.querySelectorAll(".report").forEach(button => {
        const alertId = button.getAttribute("data-id");

        // **Verifica se o alerta específico foi reportado**
        if (localStorage.getItem(`alerta_reportado_${alertId}`) === "true") {
            button.textContent = "Reportado";
            button.classList.add("reported");
            button.disabled = true;
        }

        button.addEventListener("click", function () {
            this.textContent = "Reportado"; // Muda o texto do botão
            this.classList.add("reported"); // Adiciona uma classe para estilizar
            this.disabled = true; // Desativa o botão para evitar múltiplos cliques

            // **Salva apenas esse alerta no localStorage**
            localStorage.setItem(`alerta_reportado_${alertId}`, "true");
        });
    });*/ //Ajustar no futuro
}

document.addEventListener("DOMContentLoaded", () => {
    loadGeneralInfo();
    loadHomePageData();
    loadAlert().then(() => {
        addEventListenersToButtons(); // Adiciona eventos após carregar alertas
    });
});

