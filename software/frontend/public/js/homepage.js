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
        document.getElementById("installation-date").textContent = device.data_instalacao;
        document.getElementById("serial-number").textContent = device.num_serie;
        document.getElementById("system-model").textContent = device.modelo;
        document.getElementById("system-capacity").textContent = device.capacidade;

    } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
    }
}

// Chamar a função quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
    loadHomePageData();
});
