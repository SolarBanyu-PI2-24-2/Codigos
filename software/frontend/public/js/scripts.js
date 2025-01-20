// Função de validação de login
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "francisca" && password === "1234") {
        console.log("Login bem-sucedido! Redirecionando para /home."); // Log para depuração
        window.location.href = "/home"; // Redireciona para a Home
    } else {
        console.log("Usuário ou senha incorretos."); // Log para depuração
        alert("Usuário ou senha incorretos.");
    }
}

// Configuração do evento de clique para o botão de login
const loginButton = document.getElementById("login-button");
if (loginButton) {
    loginButton.addEventListener("click", function () {
        console.log("Botão de login clicado!"); // Log para depuração
        validateLogin(); // Chama a função de validação de login
    });
} else {
    console.error("Botão de login não encontrado no DOM!");
}

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


// Lógica para a barra de pesquisa
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

if (searchButton && searchInput) {
    // Evento para o botão de pesquisa
    searchButton.addEventListener("click", function () {
        const query = searchInput.value.trim(); // Captura e remove espaços no input
        console.log("Botão de pesquisa clicado!"); // Log para depuração

        if (query) {
            console.log(`Texto pesquisado: ${query}`); // Log do texto pesquisado
            window.location.href = `/pesquisar?q=${encodeURIComponent(query)}`; // Redireciona com a consulta
        } else {
            console.log("Nenhum texto foi digitado."); // Log para campo vazio
            alert("Digite algo para pesquisar!"); // Exibe alerta se o campo estiver vazio
        }
    });

    // Evento para permitir busca com a tecla Enter
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            console.log("Tecla Enter pressionada!"); // Log para depuração
            searchButton.click(); // Dispara o clique do botão
        }
    });
} else {
    console.error("IDs search-button ou search-input não encontrados no DOM!");
}

// Lógica para o botão de sair (logout)
const logoutButton = document.querySelector(".logout");

if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
        event.preventDefault(); // Impede o redirecionamento padrão do link
        localStorage.clear(); // Limpa os dados locais, se necessário
        sessionStorage.clear(); // Opcional: limpa dados da sessão
        console.log("Logout efetuado. Redirecionando para /login."); // Log para depuração
        window.location.href = "/login"; // Redireciona para a página de login
    });
} else {
    console.error("Botão de logout não encontrado no DOM!");
}

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

