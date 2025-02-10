document.addEventListener("DOMContentLoaded", function () {
    console.log("Script carregado!");

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const notificationButton = document.querySelector(".notification");

    if (searchButton && searchInput) {
        console.log("Elementos de pesquisa encontrados!");

        // Dicionário de páginas disponíveis no site com variações de nomes
        const paginas = {
            "home": "/home",
            "monitoramento": "/monitoramento",
            "relatório": "/relatorio",
            "relatorio": "/relatorio",
            "alertas": "/alertas",
            "faq": "/faq",
            "duvidas": "/faq",
            "ajudas": "/faq",
            "perguntas": "/faq",
            "tutoriais": "/tutorial",
            "tutorial": "/tutorial",
            "informações gerais": "/info-gerais",
            "informacoes gerais": "/info-gerais",
            "solar banyu": "/solarbanyu",
            "solarbanyu": "/solarbanyu",
            "solarBanyu": "/solarbanyu",
            "SolarBanyu": "/solarbanyu",
            "Solar Banyu": "/solarbanyu",
            "configurações": "/configuracoes",
            "configuracoes": "/configuracoes",
        };

        function realizarPesquisa() {
            const query = searchInput.value.trim().toLowerCase();

            if (query === "") {
                alert("Digite algo para pesquisar!");
                return;
            }

            // Verifica se a pesquisa corresponde a uma página (aceita variações de nome)
            const destino = paginas[query];

            if (destino) {
                console.log(`Redirecionando para: ${destino}`);
                window.location.href = destino;
            } else {
                alert("Página não encontrada.");
                console.warn(`Nenhuma página encontrada para: "${query}"`);
            }
        }

        // Evento ao clicar no botão de pesquisa
        searchButton.addEventListener("click", realizarPesquisa);

        // Permitir pesquisa ao pressionar Enter
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                realizarPesquisa();
            }
        });
    } else {
        console.error("IDs search-button ou search-input não encontrados no DOM!");
    }

    // Lógica para o botão de notificações (Redireciona para /alertas)
    if (notificationButton) {
        console.log("Botão de notificações encontrado!");

        notificationButton.addEventListener("click", function () {
            console.log("Redirecionando para alertas...");
            window.location.href = "/alertas";
        });
    } else {
        console.error("Botão de notificações não encontrado no DOM!");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script carregado!");

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const notificationButton = document.querySelector(".notification");
    const logoutButton = document.querySelector(".logout");

    if (searchButton && searchInput) {
        console.log("Elementos de pesquisa encontrados!");

        const paginas = {
            "home": "/home",
            "monitoramento": "/monitoramento",
            "relatório": "/relatorio",
            "relatorio": "/relatorio",
            "alertas": "/alertas",
            "faq": "/faq",
            "tutoriais": "/tutorial",
            "tutorial": "/tutorial",
            "informações gerais": "/info-gerais",
            "informacoes gerais": "/info-gerais",
            "solar banyu": "/solarbanyu",
            "configurações": "/configuracoes",
            "configuracoes": "/configuracoes",
            "sair": "/login"
        };

        function realizarPesquisa() {
            const query = searchInput.value.trim().toLowerCase();

            if (query === "") {
                alert("Digite algo para pesquisar!");
                return;
            }

            const destino = paginas[query];

            if (destino) {
                console.log(`Redirecionando para: ${destino}`);
                window.location.href = destino;
            } else {
                alert("Página não encontrada. Tente outro termo.");
                console.warn(`Nenhuma página encontrada para: "${query}"`);
            }
        }

        searchButton.addEventListener("click", realizarPesquisa);

        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                realizarPesquisa();
            }
        });
    } else {
        console.error("IDs search-button ou search-input não encontrados no DOM!");
    }

    // Botão de Notificações → Redireciona para /alertas
    if (notificationButton) {
        console.log("Botão de notificações encontrado!");
        notificationButton.addEventListener("click", function () {
            console.log("Redirecionando para alertas...");
            window.location.href = "/alertas";
        });
    } else {
        console.error("Botão de notificações não encontrado no DOM!");
    }

    // Botão de Logout → Limpa sessão e redireciona para login
    if (logoutButton) {
        console.log("Botão de logout encontrado!");

        logoutButton.addEventListener("click", function (event) {
            event.preventDefault(); // Impede comportamento padrão do link

            // Remover dados da sessão
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            console.log("Logout efetuado. Redirecionando para a página de login...");
            window.location.href = "/login"; // Redireciona para a página de login (index.ejs)
        });
    } else {
        console.error("Botão de logout não encontrado no DOM!");
    }
});

async function updateNotificationCount() {
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

        // Conta quantos alertas têm `resolvido: false`
        const unresolvedCount = alertas.filter(alerta => !alerta.resolvido).length;

        // Atualiza a contagem no badge da notificação
        const badge = document.getElementById("notification-count");
        
        if (unresolvedCount > 0) {
            badge.textContent = unresolvedCount;
            badge.style.display = "inline-block"; // Exibe a badge se houver alertas
        } else {
            badge.style.display = "none"; // Oculta a badge se não houver alertas
        }

    } catch (error) {
        console.error("Erro ao carregar alertas não resolvidos:", error);
    }
}

// Executa a função ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    updateNotificationCount();
});

