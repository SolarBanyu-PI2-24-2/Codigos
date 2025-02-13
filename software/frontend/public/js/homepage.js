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
        const userResponse = await fetch("http://localhost:8000/api/user/profile/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!userResponse.ok) throw new Error("Erro ao buscar usuário.");
        const userData = await userResponse.json();

        document.getElementById("user-name-home").textContent = `Seja bem-vinda, ${userData.first_name}`;
        document.getElementById("installation-title").textContent = `SolarBanyu da ${userData.first_name}`;

        const addressResponse = await fetch("http://localhost:8000/api/address/user/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!addressResponse.ok) throw new Error("Erro ao buscar endereço.");
        const addressData = await addressResponse.json();

        document.getElementById("installation-address").textContent = `${addressData.rua}, ${addressData.numero}`;
        document.getElementById("installation-state").textContent = `${addressData.estado}, Brasil`;

        const deviceResponse = await fetch("http://localhost:8000/api/dispositivos/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!deviceResponse.ok) throw new Error("Erro ao buscar dispositivo.");
        const deviceData = await deviceResponse.json();

        console.log("Dispositivos:", deviceData);

        if (deviceData.length === 0) {
            document.getElementById("unit-count").textContent = "Nenhuma unidade instalada";
            document.getElementById("installation-date").textContent = "Não cadastrado";
            document.getElementById("serial-number").textContent = "Não cadastrado";
            document.getElementById("system-model").textContent = "Não cadastrado";
            document.getElementById("system-capacity").textContent = "Não cadastrado";
            return;
        }

        const device = deviceData[0];

       

        document.getElementById("unit-count").textContent = `${deviceData.length} Unidade(s) instalada(s)`;
        const installationDate = new Date(device.data_instalacao + "T00:00:00");
        const currentDate = new Date();
        const currentDays = Math.floor((currentDate - installationDate) / (1000 * 60 * 60 * 24));
        document.getElementById("installation-date").textContent = formatDate(installationDate);
        document.getElementById("serial-number").textContent = device.num_serie;
        document.getElementById("system-model").textContent = device.modelo;
        document.getElementById("system-capacity").textContent = device.capacidade;

    } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
    }
}

async function loadAlert() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/alertas/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar alertas.");
        }

        const data = await response.json();
        
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

            // Formata a data para DD/MM/YYYY
            const dataFormatada = new Date(alerta.criado_em).toLocaleDateString("pt-BR");

            row.innerHTML = `
                <td>${alerta.id.toString().padStart(5, "0")}</td>
                <td>${alerta.tipo}</td>
                <td>${dataFormatada}</td>
                <td class="${prioridadeMap[alerta.prioridade].classe}">${prioridadeMap[alerta.prioridade].texto}</td>
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
        const response = await fetch("http://localhost:8000/api/dispositivos/", {
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

        // Pega a data de instalação do primeiro dispositivo
        const installationDate = new Date(deviceData[0].data_instalacao);
        const currentDate = new Date();
        const currentDays = Math.floor((currentDate - installationDate) / (1000 * 60 * 60 * 24)); // Calcula os dias de operação

        // Atualiza o contador de dias
        document.getElementById("current-days-home").innerText = `${currentDays} dia(s)`;

        // Agora busca os dados do sensor
        const sensorDataResponse = await fetch("http://localhost:8000/api/dados-sensores/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!sensorDataResponse.ok) {
            throw new Error("Erro ao buscar informações gerais dos sensores.");
        }
        const sensorData = await sensorDataResponse.json();

        // Filtra os dados do sensor de volume de água (verifique o ID correto)
        const sum_litros = Math.round(sensorData
            .filter(item => item.sensor === 2)  // Verifique se '6' é o ID correto
            .reduce((acumulador, item) => acumulador + item.valor, 0));

        // Atualiza a quantidade de água dessalinizada
        document.getElementById("total-water-home").innerText = `${sum_litros} L`;

        const sum_energia = Math.round(sensorData
            .filter(item => item.sensor === 3)  // Verifique se '6' é o ID correto
            .reduce((acumulador, item) => acumulador + item.valor, 0));

        // Atualiza a quantidade de água dessalinizada
        document.getElementById("total-energy-home").innerText = `${sum_energia} kWh`;

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
        const response = await fetch("http://localhost:8000/api/alertas/", {
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



document.addEventListener("DOMContentLoaded", () => {
    loadGeneralInfo();
    loadHomePageData();
    loadAlert();
});
