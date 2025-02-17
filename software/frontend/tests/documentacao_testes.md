## 1. Introdução

Este documento descreve os testes implementados no frontend do projeto, abordando as ferramentas utilizadas, a estrutura dos testes, e o processo de execução e reporte de falhas.

---

## 2. Ferramentas Utilizadas

Os testes foram implementados utilizando as seguintes ferramentas:

- **[Jest](https://jestjs.io/)** - Framework de testes para JavaScript.
- **[Supertest](https://www.npmjs.com/package/supertest)** - Biblioteca para testar APIs no Express.
- **Node.js e NPM** - Gerenciamento do ambiente de execução e dependências.

---

## 3. Estrutura do Projeto de Testes

Os arquivos de teste estão localizados na pasta `tests/`. A estrutura é a seguinte:

```bash
frontend/
│── public/
│── views/
│── tests/               
│   ├── app.test.js      # Testes das rotas principais
│   ├── controllers/     # Testes dos controllers
│   ├── utils/           # Testes das funções auxiliares
│── app.js               # Aplicação principal
│── package.json         # Configuração do projeto
│── README.md           
```

---

## 4. Configuração do Ambiente

Antes de rodar os testes, instale as dependências do projeto com:

```bash
npm install
```

Se precisar instalar manualmente as bibliotecas de teste, use:

```bash
npm install --save-dev jest supertest
```

---

## 5. Execução dos Testes

Para rodar todos os testes, use o comando:

```bash
npm test
```

Se desejar rodar um teste específico:

```bash
npx jest tests/app.test.js
```

Caso precise ver a cobertura de código:

```bash
npm test -- --coverage
```

### Relatório de Cobertura de Testes

A execução do comando `npm test -- --coverage` gera um relatório como o mostrado abaixo:

![Relatório de Cobertura](./tests/coverage-report.png)

---

## 6. Exemplos de Testes Baseados no Projeto

Os exemplos de testes podem ser encontrados na seção de imagens acima.

---

## 7. Como Relatar Erros e Bugs

Caso um teste falhe ou um bug seja encontrado, siga este formato para abrir um **Issue no GitLab**:

### Modelo de Relatório de Erro

**Título:** Erro na Rota `/monitoramento` retorna `500` ao invés de `200`

**Descrição:**  
Ao acessar a rota `/monitoramento`, a API está retornando erro `500 - Internal Server Error`.

**Passos para Reproduzir:**

1. Executar `npm test`
2. O teste `GET /monitoramento` falha com erro 500.

**Comportamento Esperado:**  
A API deveria retornar `200 OK` e um JSON com os dados esperados.

**Logs/Stacktrace:**

```
Error: Cannot read properties of undefined (reading 'data')
```

**Ambiente:**

- Sistema: Windows/Linux
- Versão do Node.js: `16.13.1`
- Versão do NPM: `8.1.2`

---

## 8. Boas Práticas para Testes

- Escreva testes pequenos e independentes - Um teste não deve depender de outro.
- Use `describe` e `it` de forma clara - Isso facilita a leitura dos relatórios de testes.
- Mantenha os testes organizados em pastas - Separe testes de rotas, controllers e funções auxiliares.
- Automatize a execução dos testes - Configure o GitLab CI/CD para rodar os testes automaticamente.

---

## 9. Integração com GitLab CI/CD

Para rodar os testes automaticamente no **GitLab CI/CD**, crie um arquivo `.gitlab-ci.yml` na raiz do projeto com este conteúdo:

```yaml
stages:
  - test

test:
  image: node:16
  before_script:
    - npm install
  script:
    - npm test
```

Isso garante que, sempre que um commit for enviado ao GitLab, os testes rodem automaticamente.

---

## Tabela de Versionamento

| Data       | Versão | Descrição                         | Autores      | Revisor |
| ---------- | ------ | --------------------------------- | ------------ | ------- |
| 16/02/2025 | 1.0    | Adicionando os testes do frontend | Bruno Araújo | -       |
