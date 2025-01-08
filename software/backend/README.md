# Guia de Uso do Docker para o Projeto

## 1. Instalação do Docker e Docker Compose

Antes de começar, é necessário instalar o Docker e o Docker Compose.

### Instalar Docker

#### Windows
- Baixe e instale o [Docker Desktop](https://www.docker.com/products/docker-desktop).

#### macOS
- Use o [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop).

#### Linux
- Para distribuições baseadas em Debian/Ubuntu:
  ```bash
  sudo apt update
  sudo apt install docker.io
  sudo systemctl start docker
  sudo systemctl enable docker

### Instalar o Docker Compose

- Siga as instruções no site oficial do [Docker Compose](https://docs.docker.com/compose/install/).

## 3. Execução do Docker

### Configure o arquivo .env

- Crie um arquivo .env
- Copie o que está em .env_example

### Execute o docker-compose up --build

```bash
docker-compose up --build
```

Isso iniciará os seguintes serviços:
- djangoapp: Aplicação Django rodando na porta 8000
- psql: Banco de dados PostgreSQL.
- pgadmin: Interface gráfica para gerenciar o banco de dados (porta 8080)

### Acessar serviços:
- djando admin: http://localhost:8000/admin
  - user: DJANGO_SUPERUSER_USERNAME em .env
  - senha: DJANGO_SUPERUSER_PASSWORD em .env
- pgadmin: http://localhost:8080
  - email: user@locahost.com
  - senha: password
  
## 4. Criar server para gerenciar bancop

1. Acesso o pgadmin
2. Criar novo servidor
3. Dê um nome
4. Host name/address: Use o nome do contêiner do PostgreSQL (por padrão, psql)
5. maintenance database: solarbanyu_db
6. Use o valor de POSTGRES_USER definido no arquivo .env
7. Use o valor de POSTGRES_PASSWORD definido no arquivo .env