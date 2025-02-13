// Função para carregar alertas não resolvidos
async function loadUnresolvedAlerts() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/alertas/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }  // Corrigido para usar template literals
        });

        if (!response.ok) throw new Error("Erro ao buscar alertas.");

        const alertas = await response.json();
        const unresolvedCount = alertas.filter(alerta => !alerta.resolvido).length;

        document.querySelector(".box.alerts h2").textContent = `${unresolvedCount} alertas não resolvidos`;  // Corrigido para usar template literals

    } catch (error) {
        console.error("Erro ao carregar alertas não resolvidos:", error);
    }
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
        return "Data Inválida"; // Retorna um aviso se a data não for válida
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam no índice 0
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;  // Corrigido para usar template literals
}

// Função para carregar a última atualização
async function loadLastUpdate() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/dados-sensores/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }  // Corrigido para usar template literals
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

// Função para carregar o gráfico do relatório
// Função para carregar o gráfico do relatório (agora com dados mensais)
function loadReportChart() {
    const token = localStorage.getItem("token");

    // Verifica se o token existe
    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    // Chama a API para pegar os dados necessários (Agora com período "Mensal")
    fetch("http://localhost:8000/api/dados-sensores?sensor_id=2&period=Mensal", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        // Agrupar dados por mês
        const groupedData = groupDataByMonth(data);

        // Formata as datas e valores para o gráfico
        const labels = Object.keys(groupedData);  // Meses
        const volumeDeAgua = labels.map(month => groupedData[month].volumeDeAgua);  // Volume de água
        const temperatura = labels.map(month => groupedData[month].temperatura);  // Temperatura
        const phAgua = labels.map(month => groupedData[month].phAgua);  // pH da água
        const energia = labels.map(month => groupedData[month].energia);  // Energia consumida

        // Criar o gráfico
        const ctx = document.getElementById('solarChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,  // Meses como labels
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: temperatura,
                        borderColor: 'rgb(255, 99, 132)',  // Cor vermelha
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'pH da água',
                        data: phAgua,
                        borderColor: 'rgb(173, 216, 230)',  // Cor azul claro
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Volume de água dessalinizada (L)',
                        data: volumeDeAgua,
                        borderColor: 'rgb(54, 162, 235)',  // Cor azul
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Consumo de energia (kWh)',
                        data: energia,
                        borderColor: 'rgb(255, 159, 64)',  // Cor laranja
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error("Erro ao carregar dados para o gráfico:", error);
    });
}

// Função para agrupar os dados por mês
function groupDataByMonth(data) {
    const grouped = {};

    data.forEach(dado => {
        const date = new Date(dado.criado_em);
        const month = `${date.getMonth() + 1}-${date.getFullYear()}`; // Ex: 01-2025

        // Inicializa o mês no objeto agrupado
        if (!grouped[month]) {
            grouped[month] = {
                volumeDeAgua: 0,
                temperatura: 0,
                phAgua: 0,
                energia: 0,
                count: 0
            };
        }

        // Agrupa os dados
        if (dado.sensor === 2) grouped[month].volumeDeAgua += dado.valor;
        if (dado.sensor === 3) grouped[month].energia += dado.valor;
        if (dado.sensor === 4) grouped[month].temperatura += dado.valor;
        if (dado.sensor === 5) grouped[month].phAgua += dado.valor;

        grouped[month].count++;
    });

    // Calcular a média para cada mês
    Object.keys(grouped).forEach(month => {
        grouped[month].volumeDeAgua /= grouped[month].count;
        grouped[month].temperatura /= grouped[month].count;
        grouped[month].phAgua /= grouped[month].count;
        grouped[month].energia /= grouped[month].count;
    });

    return grouped;
}


// Carregar alertas e última atualização ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
    loadUnresolvedAlerts();
    loadLastUpdate();
    loadReportChart();
});
