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


