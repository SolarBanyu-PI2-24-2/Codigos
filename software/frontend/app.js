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

app.get('/pesquisar', (req, res) => {
    const query = req.query.q; // Captura o texto pesquisado da URL
    res.send(`Você pesquisou por: ${query}`); // Exibe o texto pesquisado no navegador
});


app.get("/monitoramento", async (req, res) => {
    try {
        const token = "cbea691eab6b1acecc5fea9557f64e66f4904d9a"// Ajuste para pegar dinamicamente do usuário autenticado.

        // ✅ Agora usamos `await` para buscar os dados da API
        const responseSensores = await fetch("http://localhost:8000/app/dados_sensores/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        const responseAlertas = await fetch("http://localhost:8000/app/alertas/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });

        const dadosSensores = await responseSensores.json();
        const alertas = await responseAlertas.json();

        console.log("📡 Dados Recebidos da API - Sensores:", JSON.stringify(dadosSensores, null, 2));
        console.log("⚠️ Dados Recebidos da API - Alertas:", JSON.stringify(alertas, null, 2));

        res.render("monitoramento", {
            currentUrl: '/monitoramento',
            dadosSensores: dadosSensores || [],
            alertas: alertas || []
        });

    } catch (error) {
        console.error("❌ Erro ao buscar dados da API:", error);
        res.render("monitoramento", {
            currentUrl: '/monitoramento',
            dadosSensores: [],
            alertas: [],
            error: "Erro ao carregar os dados."
        });
    }
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
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});





