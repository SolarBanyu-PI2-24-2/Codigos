function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "francisca" && password === "1234") {
        window.location.href = "/home"; // Redireciona para a Home
    } else {
        alert("Usuário ou senha incorretos.");
    }
}
