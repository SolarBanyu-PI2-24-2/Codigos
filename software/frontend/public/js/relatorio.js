// Função para carregar alertas não resolvidos
async function loadUnresolvedAlerts() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("https://solarbanyu-backend.onrender.com/app/alertas/", {
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
        const response = await fetch("https://solarbanyu-backend.onrender.com/app/dados_sensores/", {
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
async function loadReportChart() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        // Busca todos os dados dos sensores
        const response = await fetch("https://solarbanyu-backend.onrender.com/app/dados_sensores", {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar dados dos sensores.");
        }

        const data = await response.json();

        // Agrupa os dados por mês/ano
        const groupedData = groupDataByYearAndMonth(data);

        // Extrai os dados para o gráfico
        const labels = Object.keys(groupedData).sort(); // Ex: 01-2025, 02-2025
        const volumeDeAgua = labels.map(month => groupedData[month].volumeDeAgua);
        const temperatura = labels.map(month => groupedData[month].temperatura);
        const phAgua = labels.map(month => groupedData[month].phAgua);
        const energia = labels.map(month => groupedData[month].energia);

        // Renderiza o gráfico
        const ctx = document.getElementById('solarChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {            
                labels: labels,
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: temperatura,
                        borderColor: '#8B0000', 
                        backgroundColor: '#8B0000', 
                        borderWidth: 5,
                        fill: true
                    },
                    {
                        label: 'pH da água',
                        data: phAgua,
                        borderColor: '#FF1493', 
                        backgroundColor: '#FF1493', 
                        borderWidth: 5,
                        fill: true
                    },
                    {
                        label: 'Volume de água dessalinizada (L)',
                        data: volumeDeAgua,
                        borderColor: '#0000CD', 
                        backgroundColor: '#0000CD', 
                        borderWidth: 5,
                        fill: true
                    },
                    {
                        label: 'Tensão (V)',
                        data: energia,
                        borderColor: '#FF8C00', 
                        backgroundColor: '#FF8C00', 
                        borderWidth: 5,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Médias Mensais dos Sensores - SolarBanyu',
                        color: '#333',
                        font: {
                            size: 18
                        }
                    },
                    legend: {
                        display: true  // Oculta a legenda completa
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 14 // Fonte dos rótulos no eixo X
                            }
                        },
                        title: {
                            display: true,
                            text: 'Ano/Mês',
                            color: '#333',
                            font: {
                                size: 18
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Média dos Valores',
                            color: '#333',
                            font: {
                                size: 18
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao carregar dados para o gráfico:", error);
    }
}

// Função para agrupar os dados por ano/mês e calcular as médias
function groupDataByYearAndMonth(data) {
    const grouped = {};

    data.forEach(dado => {
        const date = new Date(dado.criado_em);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Ex: 2025-02

        // Inicializa o agrupamento se não existir
        if (!grouped[yearMonth]) {
            grouped[yearMonth] = {
                volumeDeAgua: 0,
                temperatura: 0,
                phAgua: 0,
                energia: 0,
                volumeCount: 0,
                tempCount: 0,
                phCount: 0,
                energiaCount: 0
            };
        }

        // Associa os dados com os sensores conhecidos
        switch (dado.sensor_id) {
            case "03f6b35e-df01-424e-a9be-b4908a7729c8": // FLUXO_AGUA
                grouped[yearMonth].volumeDeAgua += parseFloat(dado.valor);
                grouped[yearMonth].volumeCount++;
                break;

            case "c21273ba-5c8e-4f48-ac3b-570e68688923": // TEMPERATURA_AGUA
                grouped[yearMonth].temperatura += parseFloat(dado.valor);
                grouped[yearMonth].tempCount++;
                break;

            case "1860f484-e5de-4f25-89e3-70ee65ea7bf8": // PH_AGUA
                grouped[yearMonth].phAgua += parseFloat(dado.valor);
                grouped[yearMonth].phCount++;
                break;

            case "baf40a3e-8bf7-48db-a187-0b0d6cbf9a09": // TENSAO
                grouped[yearMonth].energia += parseFloat(dado.valor);
                grouped[yearMonth].energiaCount++;
                break;
        }
    });

    // Calcula as médias para cada mês
    Object.keys(grouped).forEach(month => {
        const g = grouped[month];
        g.volumeDeAgua = g.volumeCount > 0 ? (g.volumeDeAgua / g.volumeCount).toFixed(2) : 0;
        g.temperatura = g.tempCount > 0 ? (g.temperatura / g.tempCount).toFixed(2) : 0;
        g.phAgua = g.phCount > 0 ? (g.phAgua / g.phCount).toFixed(2) : 0;
        g.energia = g.energiaCount > 0 ? (g.energia / g.energiaCount).toFixed(2) : 0;
    });

    return grouped;
}


// Carregar alertas e última atualização ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
    loadUnresolvedAlerts();
    loadLastUpdate();
    loadReportChart();
});
