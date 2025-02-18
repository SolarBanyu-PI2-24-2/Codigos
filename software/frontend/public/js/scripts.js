/// Login

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("login-button");

    if (loginButton) {
        loginButton.addEventListener("click", async function () {
            console.log("Botão de login clicado!");
            await validateLogin();
        });
    } else {
        console.error("Botão de login não encontrado no DOM!");
    }
});

async function validateLogin() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/app/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log("Login bem-sucedido:", data);
            localStorage.setItem("token", data.token); // Armazena o token
            localStorage.setItem("userId", data.user.id);
            // Redirecionamento seguro após 1 segundo
            setTimeout(() => {
                window.location.href = "/home";
            }, 1000);
        } else {
            console.warn("Erro no login:", data);
            alert(data.error || "Credenciais inválidas.");
        }
    } catch (error) {
        console.error("Erro ao conectar ao backend:", error);
        alert("Erro ao conectar ao servidor. Verifique sua conexão.");
    }
}
//___________________________________


// Logout
document.addEventListener("DOMContentLoaded", function () {
    const logoutLink = document.getElementById("logout-link");

    if (logoutLink) {
        logoutLink.addEventListener("click", async function (event) {
            event.preventDefault(); // Impede o redirecionamento padrão do link

            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login"; // Redireciona para login
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/app/logout/", {
                    method: "POST",
                    headers: {
                        "Authorization": `Token ${token}`
                    },
                });

                if (response.ok) {
                    console.log("Logout bem-sucedido.");
                    alert("Logout realizado com sucesso!");

                    // Remover o token do armazenamento local
                    localStorage.removeItem("token");

                    // Redirecionar para a página de login
                    window.location.href = "/index";
                } else {
                    console.warn("Erro ao tentar deslogar:", response.statusText);
                    alert("Erro ao tentar deslogar. Tente novamente.");
                }
            } catch (error) {
                console.error("Erro ao conectar ao backend:", error);
                alert("Erro ao conectar ao servidor.");
            }
        });
    } else {
        console.error("Elemento de logout não encontrado no DOM!");
    }
});
//_______________________________________


// Dados do usuário
async function loadUserInfo() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/app/usuario/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar informações do usuário.");
        }

        const data = await response.json();

        // Atualiza os elementos HTML com os dados do usuário
        document.getElementById("user-name").textContent = data.nome;
        document.getElementById("user-profession").innerHTML = `${data.profissao}<br>1 Unidade SolarBanyu`;

    } catch (error) {
        console.error("Erro ao carregar informações do usuário:", error);
    }
}
document.addEventListener("DOMContentLoaded", loadUserInfo);
///______________________________________


// Configurações: Endereço e Informações do Usuário
async function loadUserAddress() {
    // usuario não possui endereço
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/app/address/user/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar o endereço.");
        }

        const data = await response.json();

        // Atualiza o campo de endereço no HTML
        document.getElementById("address").value = `${data.rua}, ${data.numero}, ${data.bairro || ''}, ${data.cidade}, ${data.estado}`;

    } catch (error) {
        console.error("Erro ao carregar informações do endereço:", error);
        document.getElementById("address").value = "Endereço não encontrado";
    }
}

async function loadUserInfoConfig() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        // Buscar informações do usuário
        const userResponse = await fetch(`http://localhost:8000/app/usuario/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error("Erro ao buscar informações do usuário.");
        }

        const userData = await userResponse.json();

        // Atualiza os dados do usuário no HTML
        document.getElementById("name").value = `${userData.nome}`;
        document.getElementById("email").value = userData.email;
        document.getElementById("profession").value = userData.profissao || "Não informado";

        // TODO: usuario não possui endereco
        // Buscar informações do endereço
        // const addressResponse = await fetch("http://localhost:8000/app/address/user/", {
        //     method: "GET",
        //     headers: {
        //         "Authorization": `Token ${token}`
        //     }
        // });

        // if (!addressResponse.ok) {
        //     throw new Error("Erro ao buscar informações do endereço.");
        // }

        // const addressData = await addressResponse.json();

        // // Atualiza os dados do endereço no HTML
        // document.getElementById("address").value = `${addressData.rua}, ${addressData.numero}, ${addressData.bairro || ''}, ${addressData.cidade}, ${addressData.estado}`;

    } catch (error) {
        console.error("Erro ao carregar informações:", error);
        document.getElementById("address").value = "Endereço não encontrado";
        document.getElementById("name").value = "Usuário não encontrado";
    }
}

async function loadUserDevice() {
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
            throw new Error("Erro ao buscar informações do dispositivo.");
        }

        const data = await response.json();

        if (data.length === 0) {
            console.warn("Nenhum dispositivo encontrado para este usuário.");
            document.getElementById("installation-date").value = "Não cadastrado";
            document.getElementById("serial-number").value = "Não cadastrado";
            document.getElementById("system-model").value = "Não cadastrado";
            document.getElementById("system-capacity").value = "Não cadastrado";
            return;
        }

        const device = data[0]; // Pega o primeiro dispositivo (se houver mais de um)

        // Atualiza os campos no HTML
        document.getElementById("installation-date").value = device.data_instalacao;
        document.getElementById("serial-number").value = device.num_serie;
        document.getElementById("system-model").value = device.modelo;
        document.getElementById("system-capacity").value = device.capacidade;

    } catch (error) {
        console.error("Erro ao carregar informações do dispositivo:", error);
        document.getElementById("installation-date").value = "Erro ao carregar";
        document.getElementById("serial-number").value = "Erro ao carregar";
        document.getElementById("system-model").value = "Erro ao carregar";
        document.getElementById("system-capacity").value = "Erro ao carregar";
    }
}

// Chamar a função quando a página carregar
document.addEventListener("DOMContentLoaded", loadUserDevice);
document.addEventListener("DOMContentLoaded", loadUserAddress);
document.addEventListener("DOMContentLoaded", loadUserInfoConfig);

//_______________________________________________


//teste



// Lógica para alternar as respostas do FAQ
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqAnswer = button.nextElementSibling;
        const icon = button.querySelector('i');

        if (faqAnswer.style.display === 'block') {
            faqAnswer.style.display = 'none';
            icon.classList.remove('active');
        } else {
            faqAnswer.style.display = 'block';
            icon.classList.add('active');
        }
    });
});


// tutoriais
const carousels = document.querySelectorAll('.carousel-container');

carousels.forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    const items = track.children;

    let currentIndex = 0;

    const updateButtons = () => {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === items.length - 1;
    };

    nextButton.addEventListener('click', () => {
        if (currentIndex < items.length - 1) {
            currentIndex++;
            track.style.transform = `translateX(-${currentIndex * 300}px)`;
        }
        updateButtons();
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            track.style.transform = `translateX(-${currentIndex * 300}px)`;
        }
        updateButtons();
    });

    updateButtons();
});


// Lógica para o botão de notificações
const notificationCount = 5; // Número fictício de notificações
const notificationBadge = document.getElementById("notification-count");

if (notificationBadge) {
    notificationBadge.textContent = notificationCount; // Atualiza o número no badge
    console.log(`Badge de notificações atualizado para ${notificationCount}`);
}

const notificationButton = document.querySelector(".notification");
if (notificationButton) {
    notificationButton.addEventListener("click", function () {
        console.log("Botão de notificações clicado! Redirecionando para /alertas.");
        window.location.href = "/alertas"; // Redireciona para a página de alertas
    });
} else {
    console.error("Botão de notificações não encontrado no DOM!");
}

//async function testBackendCommunication() {
//    try {
//        const response = await fetch('http://localhost:8000/app/app/data'); // Ajuste para a rota real do backend
//        if (response.ok) {
//            const data = await response.json();
//            console.log('Dados do backend:', data); // Exibe no console do navegador
//            alert(`Backend respondeu: ${JSON.stringify(data)}`); // Exibe um alerta com os dados
//        } else {
//            console.error(`Erro ao acessar o backend: ${response.status}`);
//            alert(`Erro ao acessar o backend: ${response.status}`);
//        }
//    } catch (error) {
//        console.error('Erro ao conectar ao backend:', error);
//       alert('Erro ao conectar ao backend. Verifique os logs.');
//    }
//}

// Testa a função quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    testBackendCommunication();
});
