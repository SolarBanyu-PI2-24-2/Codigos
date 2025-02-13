async function loadAlertQtd() {
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
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/dados-sensores/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        }); console.log("Dados carregados do sensor:", sensor_data);

        const deviceResponse = await fetch("http://localhost:8000/api/dispositivos/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar informações gerais dos sensores.");
        }
        const deviceData = await deviceResponse.json();
        const data = await response.json();
        sensor_data.push(data);

        const sum_litros = Math.round(sensor_data[0]
            .filter(item => item.sensor === 2)
            .reduce((acumulador, item) => acumulador + item.valor, 0));
        document.getElementById("total-water").innerText = `${sum_litros} L`;

        
        if (deviceData.length > 0) {
            const device = deviceData[0];  
            const installationDate = new Date(device.data_instalacao + "T00:00:00"); // Data de instalação do dispositivo
            const currentDate = new Date();
            const currentDays = Math.floor((currentDate - installationDate) / (1000 * 60 * 60 * 24));
    
            console.log("Data de instalação:", installationDate);
            console.log("Dias em funcionamento:", currentDays);
            console.log("Último item de sensor_data:", sensor_data[sensor_data.length - 1]); 
            console.log("Última leitura do sensor:", sensor_data[sensor_data.length - 1][sensor_data[sensor_data.length - 1].length - 1]);
            console.log("Valor de criado_em:", sensor_data[sensor_data.length - 1][sensor_data[sensor_data.length - 1].length - 1]["criado_em"]);
            


    
            document.getElementById("current-days").innerText = `${currentDays} dia(s)`;
        } else {
            console.warn("Nenhum dispositivo encontrado.");
        }
    
        // Garantir que há dados do sensor antes de calcular a última atualização
        // Garantir que há dados do sensor antes de calcular a última atualização
if (sensor_data.length > 0 && sensor_data[sensor_data.length - 1].length > 0) {
    let sensorRecords = sensor_data[sensor_data.length - 1]; // Pegar a lista real dos registros

    // Ordenar os registros corretamente
    sensorRecords.sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));

    // Pegar o último item correto
    let lastRecord = sensorRecords[sensorRecords.length - 1];

    if (lastRecord && lastRecord.criado_em) {
        last_update = new Date(lastRecord.criado_em);
        console.log("Última atualização do sensor:", last_update);

        document.getElementById("last-update").innerText = `${last_update.toLocaleString()}`;
    } else {
        console.warn("Nenhuma leitura válida de sensor encontrada.");
        document.getElementById("last-update").innerText = "Sem dados recentes";
    }
} else {
    console.warn("Nenhuma leitura recente de sensor encontrada.");
    document.getElementById("last-update").innerText = "Sem dados recentes";
}

    

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

let sensor_data = []
const sensorMapping = { // Sensores correspondentes a cada tipo de dado
    "Ph da água": 5,
    "Volume de água dessalinizada": 6,
    "Energia consumida": 7,
    "Temperatura da água": 8
};
document.addEventListener("DOMContentLoaded", loadAlertQtd);
document.addEventListener("DOMContentLoaded", loadGeneralInfo);


document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("waterChart")?.getContext("2d");
    
    if (!ctx) {
        console.error("Erro: Elemento 'waterChart' não encontrado.");
        return;
    }

    // Inicializa o gráfico
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Volume de água dessalinizada",
                data: [],
                borderWidth: 2,
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Tempo" } },
                y: { title: { display: true, text: "Litros" } }
            }
        }
    });

    // Inicializa o gráfico com "Por minutos"
    updateChart("Mensal");
});

function formatDate(timestamp, period) {
    const date = new Date(timestamp);

    
    if (period === "Última Hora") {
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`; // Ex: "18:32"   
    } else if (period === "Últimas 24h") {
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`; // Ex: "18:32"
    } else if (period === "Semanal") {
        const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        return `${diasSemana[date.getDay()]} (${date.getDate()}/${date.getMonth() + 1})`; // Ex: "Seg (12/02)"
    } else if (period === "Mensal") {
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return `${String(date.getDate()).padStart(2, "0")} ${meses[date.getMonth()]}`; // Ex: "08 Fev"
    }
}


// Função para gerar rótulos e dados simulados

function generateData(period) {
    let labels = [];
    let data = [];

    if (!sensor_data[0] || !sensor_data[0].length) {
        console.error("Erro: Nenhum dado disponível em sensor_data.");
        return { labels, data, unidade: "" };
    }

    console.log("Período selecionado:", period);
    console.log("Dados antes de serem filtrados:", sensor_data);
    // Obtém o sensor correto para o tipo de dado atual
    let sensorId = sensorMapping[currentDataType];

    // Filtra os dados pelo sensor correspondente
    let sensorValues = sensor_data[0].filter(item => item.id === sensorId);
  

    // Ordena os dados pela data de criação
    sensorValues.sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
    console.log("Labels gerados:", labels);
    console.log("Dados gerados:", data);
   

    // Define a unidade
    let unidade = sensorValues.length > 0 ? sensorValues[0].unidade : "";
   
    console.log(`Labels gerados para ${period}:`, labels);
    console.log(`Dados gerados para ${period}:`, data);
    
    let now = new Date();
    let timeFrame = {
        "Última Hora": 60 * 60 * 1000, // 1 hora
        "Últimas 24h": 24 * 60 * 60 * 1000, // 24 horas
        "Semanal": 7 * 24 * 60 * 60 * 1000, // 7 dias
        "Mensal": 30 * 24 * 60 * 60 * 1000 // 30 dias
    };

    let filteredData = sensorValues.filter(item => {
        let itemDate = new Date(item.criado_em);
        console.log("Data convertida:", itemDate);
        return now - itemDate <= timeFrame[period];
      

    }); console.log("Dados filtrados para o período:", filteredData);

 if (period === "Última Hora") {
        // Exibe os valores EXATAMENTE por minuto (se houver)
        let timeMap = new Map();
        filteredData.forEach(item => {
            let key = `${item.criado_em.substring(11, 16)}`; // Formato "HH:mm"
            timeMap.set(key, item.valor);
        });

        for (let i = 59; i >= 0; i--) {
            let pastTime = new Date(now - i * 60000);
            let key = `${pastTime.getHours()}:${String(pastTime.getMinutes()).padStart(2, "0")}`;
            labels.push(key);
            data.push(timeMap.get(key) || null); // Apenas adiciona se houver dado real
        }
    } 
    else if (period === "Últimas 24h") {
        // Exibe os valores por HORA (se houver)
        let timeMap = new Map();
        filteredData.forEach(item => {
            let key = `${item.criado_em.substring(11, 13)}h`; // Formato "HHh"
            timeMap.set(key, item.valor);
        });

        for (let i = 23; i >= 0; i--) {
            let pastTime = new Date(now - i * 3600000);
            let key = `${pastTime.getHours()}h`;
            labels.push(key);
            data.push(timeMap.get(key) || null);
        }
    } 
    else if (period === "Semanal" || period === "Mensal") {
        // Exibe os valores por DIA (se houver)
        let timeMap = new Map();
        filteredData.forEach(item => {
            let key = `${item.criado_em.substring(8, 10)}/${item.criado_em.substring(5, 7)}`; // Formato "DD/MM"
            timeMap.set(key, item.valor);
        });

        let days = period === "Semanal" ? 7 : 30;
        for (let i = days - 1; i >= 0; i--) {
            let pastTime = new Date(now - i * 86400000);
            let key = `${String(pastTime.getDate()).padStart(2, "0")}/${String(pastTime.getMonth() + 1).padStart(2, "0")}`;
            labels.push(key);
            data.push(timeMap.get(key) || null);
        }
    }

    return { labels, data, unidade };
}



// Atualiza o gráfico com os dados reais
function updateChart(period) {
    console.log("Atualizando gráfico para o período:", period);
    let { labels, data, unidade } = generateData(period);

    if (labels.length === 0 || data.length === 0) {
        console.warn("Nenhum dado encontrado para o período selecionado.");
        return;
    }

    myChart.data.labels = labels;
    myChart.data.datasets[0].label = `${currentDataType} (${unidade})`;
    myChart.data.datasets[0].data = data;
    myChart.options.scales.y.title.text = unidade;
    myChart.update();
}

// Função para mudar o período ao clicar no dropdown
window.changePeriod = function (period) {
    document.getElementById("periodDropdownButton").innerText = `Período: ${period}`;
    updateChart(period);
};

// Abre e fecha o dropdown ao clicar no botão
document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.getElementById("periodDropdownButton");
    const dropdownMenu = document.getElementById("periodDropdownMenu");

    if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que o clique feche imediatamente
            dropdownMenu.classList.toggle("show");
        });

        // Fecha o dropdown ao clicar fora dele
        document.addEventListener("click", function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    } else {
        console.error("Erro: Dropdown de período não encontrado.");
    }
});

// Variável global para armazenar o tipo de dado escolhido
let currentDataType = "Volume de água dessalinizada";

// Dados simulados para cada tipo de gráfico
const dataTypes = {
    "Volume de água dessalinizada": { min: 5, max: 50, unidade: "Litros" },
    "Energia consumida": { min: 200, max: 500, unidade: "kWh" },
    "Ph da água": { min: 6, max: 8, unidade: "pH" },
    "Temperatura da água": { min: 15, max: 30, unidade: "°C" }
};

// Função para atualizar o gráfico quando o tipo de dado muda
window.changeChart = function (dataType) {
    if (!dataTypes[dataType]) {
        console.error("Tipo de dado inválido:", dataType);
        return;
    }

    // Atualiza o botão do dropdown com o nome do dado escolhido
    document.getElementById("dropdownButton").innerText = dataType;

    // Atualiza o tipo de dado global
    currentDataType = dataType;

    // Atualiza o gráfico com os novos dados
    updateChart(document.getElementById("periodDropdownButton").innerText.split(": ")[1]);
};

// Abrir e fechar o dropdown do tipo de gráfico
document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que o clique feche imediatamente
            dropdownMenu.classList.toggle("show");
        });

        // Fecha o dropdown ao clicar fora dele
        document.addEventListener("click", function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    } else {
        console.error("Erro: Dropdown do tipo de gráfico não encontrado.");
    }
});


