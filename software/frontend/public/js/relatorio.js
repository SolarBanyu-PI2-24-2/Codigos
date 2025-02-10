async function loadUnresolvedAlerts() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/alertas/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar alertas.");

        const alertas = await response.json();
        const unresolvedCount = alertas.filter(alerta => !alerta.resolvido).length;

        document.querySelector(".box.alerts h2").textContent = `${unresolvedCount} alertas não resolvidos`;

    } catch (error) {
        console.error("Erro ao carregar alertas não resolvidos:", error);
    }
}


function formatDate(dateString) {
    const date = new Date(dateString);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
        return "Data Inválida"; // Retorna um aviso se a data não for válida
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam no índice 0
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}


async function loadLastUpdate() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/dados-sensores/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar dados dos sensores.");

        const sensores = await response.json();

        console.log("Dados recebidos dos sensores:", sensores); // Verifica o retorno da API

        if (sensores.length === 0) {
            document.querySelector(".update-info p").textContent = "Nenhuma atualização registrada";
            return;
        }

        // Pega o campo correto que representa a data
        const timestamps = sensores
            .map(sensor => sensor.criado_em || sensor.timestamp) // Ajuste para o campo correto
            .filter(ts => ts) // Remove valores nulos/indefinidos
            .map(ts => {
                console.log("Timestamp antes da conversão:", ts); // Verifica os valores individuais
                return new Date(ts);
            })
            .filter(date => !isNaN(date.getTime())); // Filtra datas inválidas

        if (timestamps.length === 0) {
            document.querySelector(".update-info p").textContent = "Data inválida";
            return;
        }

        // Obtém a data mais recente
        const lastDate = new Date(Math.max(...timestamps));
        console.log("Última atualização válida:", lastDate);

        // Aplica a função formatDate()
        document.querySelector(".update-info p").textContent = formatDate(lastDate);

    } catch (error) {
        console.error("Erro ao carregar última atualização:", error);
        document.querySelector(".update-info p").textContent = "Erro ao obter data";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadUnresolvedAlerts();
    loadLastUpdate();
});
