function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "francisca" && password === "1234") {
        window.location.href = "/home"; // Redireciona para a Home
    } else {
        alert("Usuário ou senha incorretos.");
    }
}


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

