// Função de validação de login
async function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/app/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data); // Exibe a resposta
            alert('Login bem-sucedido!');
            localStorage.setItem('token', data.token); // Armazenar token no localStorage
            window.location.href = "/home"; // Redirecionar para home
        } else {
            alert('Credenciais inválidas.');
        }
    } catch (error) {
        console.error('Erro ao conectar ao backend:', error);
        alert('Erro ao conectar ao servidor.');
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

async function testBackendCommunication() {
    try {
        const response = await fetch('http://localhost:8000/app/api/data'); // Ajuste para a rota real do backend
        if (response.ok) {
            const data = await response.json();
            console.log('Dados do backend:', data); // Exibe no console do navegador
            alert(`Backend respondeu: ${JSON.stringify(data)}`); // Exibe um alerta com os dados
        } else {
            console.error(`Erro ao acessar o backend: ${response.status}`);
            alert(`Erro ao acessar o backend: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro ao conectar ao backend:', error);
        alert('Erro ao conectar ao backend. Verifique os logs.');
    }
}

// Testa a função quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    testBackendCommunication();
});
