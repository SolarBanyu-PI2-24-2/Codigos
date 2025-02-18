const request = require('supertest');
const app = require('../app'); // Importa a aplicação Express

describe('Testes das rotas da aplicação', () => {

  it('Deve responder com status 302 ao acessar a raiz (redirecionamento)', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/login'); // Verifica se redireciona para /login
  });

  it('Deve carregar a página de login', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>'); // Verifica se retorna HTML
  });

  it('Deve carregar a página home', async () => {
    const res = await request(app).get('/home');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de monitoramento', async () => {
    const res = await request(app).get('/monitoramento');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de relatórios', async () => {
    const res = await request(app).get('/relatorio');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de alertas', async () => {
    const res = await request(app).get('/alertas');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página FAQ', async () => {
    const res = await request(app).get('/faq');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de tutorial', async () => {
    const res = await request(app).get('/tutorial');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de informações gerais', async () => {
    const res = await request(app).get('/info-gerais');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página SolarBanyu', async () => {
    const res = await request(app).get('/solarbanyu');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de configurações', async () => {
    const res = await request(app).get('/configuracoes');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de landing', async () => {
    const res = await request(app).get('/landing');
    expect(res.statusCode).toBe(200);
  });

  it('Deve carregar a página de pesquisa e retornar o texto esperado', async () => {
    const query = 'energia';
    const res = await request(app).get(`/pesquisar?q=${query}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain(`Você pesquisou por: ${query}`);
  });

});
