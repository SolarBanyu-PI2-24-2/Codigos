function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}
async function loadConfigurationData() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        // Buscar informações do dispositivo
        const deviceResponse = await fetch("http://localhost:8000/app/dispositivos/", {
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

            const installationDate = new Date(device.data_instalacao + "T00:00:00");
            document.getElementById("installation-date").value = formatDate(installationDate);
            document.getElementById("serial-number").value = device.num_serie || "Não informado";
            document.getElementById("system-model").value = device.modelo || "Não informado";
            document.getElementById("system-capacity").value = (device.capacidade ? device.capacidade + " Litros" : "Não informado");
        

    } catch (error) {
        console.error("Erro ao carregar configurações:", error);
    }
}

// Executa a função quando a página carregar
document.addEventListener("DOMContentLoaded", loadConfigurationData);
