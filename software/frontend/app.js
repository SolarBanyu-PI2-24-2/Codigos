const express = require('express');
const path = require('path');
const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS e JS)
app.use(express.static(path.join(__dirname, 'public')));

// Redireciona a raiz (/) para a página de login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Rota para página de login
app.get('/login', (req, res) => {
    res.render('index'); // Renderiza o arquivo index.ejs
});

app.get('/home', (req, res) => {
    res.render('home', { currentUrl: '/home' });
});

app.get('/monitoramento', (req, res) => {
    res.render('monitoramento', { currentUrl: '/monitoramento' });
});

app.get('/relatorio', (req, res) => {
    res.render('relatorio', { currentUrl: '/relatorio' });
});

app.get('/alertas', (req, res) => {
    res.render('alertas', { currentUrl: '/alertas' });
});

app.get('/faq', (req, res) => {
    res.render('faq', { currentUrl: '/faq' });
});

app.get('/tutorial', (req, res) => {
    res.render('tutorial', { currentUrl: '/tutorial' });
});

app.get('/info-gerais', (req, res) => {
    res.render('info-gerais', { currentUrl: '/info-gerais' });
});

app.get('/solarbanyu', (req, res) => {
    res.render('solarbanyu', { currentUrl: '/solarbanyu' });
});

app.get('/configuracoes', (req, res) => {
    res.render('configuracoes', { currentUrl: '/configuracoes' });
});


// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
