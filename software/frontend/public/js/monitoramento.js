document.addEventListener("DOMContentLoaded", async function () {
    console.log("📡 Iniciando carregamento dos dados...");

    try {
        // ✅ Buscar os dados do EJS e converter para JSON
        const jsonDataSensores = document.getElementById("dados-sensores").textContent;
        const jsonDataAlertas = document.getElementById("dados-alertas").textContent;

        const dadosSensores = JSON.parse(jsonDataSensores);
        const alertas = JSON.parse(jsonDataAlertas);

        console.log("📡 Dados dos Sensores Recebidos no Frontend:", dadosSensores);
        console.log("⚠️ Alertas Recebidos no Frontend:", alertas);

        if (!dadosSensores.length) {
            console.warn("⚠️ Nenhum dado de sensor encontrado.");
        }

        // Processar os dados para gráficos
        const dadosProcessados = processarDadosSensores(dadosSensores);
        atualizarCartoes(dadosProcessados, alertas.length);

        // Criar gráfico inicial
        const sensoresDisponiveis = Object.keys(dadosProcessados);
        if (sensoresDisponiveis.length === 0) {
            console.warn("⚠️ Nenhum sensor encontrado para exibir no gráfico.");
            return;
        }

        const sensorInicial = sensoresDisponiveis[0];
        const ctx = document.getElementById("waterChart").getContext("2d");
        let waterChart = criarGrafico(ctx, sensorInicial, dadosProcessados[sensorInicial].mensal, "Meses");

        configurarDropdowns(waterChart, dadosProcessados);

    } catch (error) {
        console.error("❌ Erro ao processar dados do EJS no Frontend:", error);
    }
});

// ✅ Processar os dados dos sensores para o gráfico
function processarDadosSensores(dadosSensores) {
    let dadosProcessados = {};

    dadosSensores.forEach(dado => {
        if (!dado.sensor || !dado.sensor.tipo) return;
        const tipo = dado.sensor.tipo;

        if (!dadosProcessados[tipo]) {
            dadosProcessados[tipo] = { semanal: [0, 0, 0, 0], mensal: Array(12).fill(0) };
        }

        const mesDado = new Date(dado.criado_em).getMonth();
        dadosProcessados[tipo].mensal[mesDado] += dado.valor;
    });

    console.log("📊 Dados Processados para Gráficos:", dadosProcessados);
    return dadosProcessados;
}

// ✅ Criar gráfico inicial
function criarGrafico(ctx, titulo, dados, eixoX) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [{
                label: titulo,
                data: dados,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 2
            }]
        },
        options: { responsive: true }
    });
}

// ✅ Atualizar cartões de informação
function atualizarCartoes(dados, totalAlertas) {
    const totalAgua = dados["Volume de Água"]?.mensal.reduce((a, b) => a + b, 0) || 0;
    document.getElementById("total-agua").textContent = `${totalAgua} L`;
    document.getElementById("dias-funcionamento").textContent = "Carregado da API";
    document.getElementById("total-alertas").textContent = totalAlertas + " alertas";
    document.getElementById("ultima-atualizacao").textContent = new Date().toLocaleDateString("pt-BR");
}

// ✅ Configurar dropdowns
function configurarDropdowns(grafico, dados) {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.innerHTML = "";

    Object.keys(dados).forEach(tipo => {
        let li = document.createElement("li");
        li.textContent = tipo;
        li.onclick = function () {
            mudarGrafico(grafico, tipo, dados[tipo].mensal);
            document.getElementById("dropdownButton").innerText = tipo + " ⬇️";
        };
        dropdownMenu.appendChild(li);
    });

    document.getElementById("dropdownButton").innerText = Object.keys(dados)[0] + " ⬇️";
}

// ✅ Trocar gráfico ao clicar no dropdown
function mudarGrafico(grafico, titulo, novosDados) {
    grafico.data.datasets[0].label = titulo;
    grafico.data.datasets[0].data = novosDados;
    grafico.update();
}

// ✅ Buscar Dados da API (Se necessário)
async function fetchData(url) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: "cors",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erro ao buscar dados da API:", error);
        return [];
    }
}

// Exemplo de uso (se precisar buscar diretamente da API)
async function carregarDadosMonitoramento() {
    const dadosSensores = await fetchData("http://localhost:8000/api/dados-sensores/");
    const alertas = await fetchData("http://localhost:8000/api/alertas/");

    console.log("📡 Dados Sensores:", dadosSensores);
    console.log("⚠️ Alertas:", alertas);
}
carregarDadosMonitoramento();
