# Especificações do banco de dados

Este documento apresenta a estrutura e os principais componentes do banco de dados para o sistema SolarBanyu - Dessalinizador Solar. O objetivo é detalhar as tecnologias utilizadas, como SQL e PostgreSQL, e fornecer uma visão clara sobre a modelagem e a organização dos dados.

O PostgreSQL é um Sistema de Gerenciamento de Banco de Dados Relacional (SGBD) robusto e open-source, amplamente utilizado por sua confiabilidade, desempenho e extensibilidade. Ele suporta padrões SQL avançados, permite a criação de consultas complexas e oferece recursos como transações ACID, replicação, controle de concorrência e suporte a extensões. Sua flexibilidade o torna ideal para atender às necessidades do sistema SolarBanyu.

Os principais elementos abordados incluem:

- Modelo Entidade-Relacionamento (MER): Representação conceitual das entidades, atributos e relacionamentos do sistema.
- Diagrama Entidade-Relacionamento (DER): Versão diagramática do MER, ilustrando as conexões entre as entidades.
- Diagrama Lógico de Dados (DLD): Detalhamento lógico da estrutura do banco, com as tabelas e relacionamentos.
- Dicionário de Dados: Descrição das tabelas, atributos e suas propriedades, incluindo tipos de dados, restrições e relacionamentos.
Essa documentação serve como referência técnica para o desenvolvimento, manutenção e ampliação do banco de dados do sistema SolarBanyu.

|SolarBanyu | Dessalinizador Solar |
|--|--|
| Tecnologias | SQL, [PostgreSQL](https://www.postgresql.org/) |
| Responsáveis | Bruno e Sidney |
| Repositório de códigos | software/bancoDeDados |
| Repositório de documentação| [Acesse aqui](https://documentacao-relatorio-2d8035.gitlab.io/) |

## MER (Modelo Entidade-Relacionamento)

### Entidades e Atributos

**USUARIO**(<ins>id</ins>, nome, email, senha, criado_em, ativo, tipo_usuario)

**DISPOSITIVO**(<ins>id</ins>, nome, usuario_id, criado_em, ativo)

**SENSOR**(<ins>id</ins>, dispositivo_id, tipo, criado_em, ativo)

**TIPO_SENSOR**(<ins>id</ins>, nome, descricao)

**DADOS_SENSOR**(<ins>id</ins>, sensor_id, valor, unidade, criado_em)

**ALERTA**(<ins>id</ins>, dispositivo_id, tipo, descricao, criado_em, atualizado_em, resolvido)

**CONSUMO**(<ins>id</ins>, dispositivo_id, valor, criado_em, atualizado_em)


### Cardinalidade

USUARIO - tem - DISPOSITIVO (1:N)
Um USUARIO tem um ou vários DISPOSITIVOS

DISPOSITIVO - utiliza - SENSOR (1:N)
Um DISPOSITIVO utiliza um ou vários SENSORES

SENSOR - é - TIPO_SENSOR (1:1)
Um SENSOR é de um TIPO_SENSOR

SENSOR - apresenta - DADO_SENSOR (1:N)
Um SENSOR apresenta um ou vários DADO_SENSOR

DISPOSITIVO - produz - ALERTA (1:N)
Um DISPOSITIVO produz um ou vários ALERTA

DISPOSITIVO - possui - CONSUMO (1:N)
Um DISPOSITIVO apresenta um ou vários CONSUMO



## DER (Diagrama Entidade-Relacionamento)

## DLD (Diagrama Lógico de Dados)

## Dicionário de Dados

### Entidade: USUÁRIO
Descrição: Armazena informações dos usuários do sistema.
| Atributo       | Propriedades do Atributo | Tipo de Dado | Tamanho | Descrição                       |
|----------------|--------------------------|-------------|---------|---------------------------------|
| id             | Chave Primária           | UUID      |         | Identificador único do usuário.|
| nome           | Não Nulo                | VARCHAR     | 255     | Nome completo do usuário.      |
| email          | Não Nulo, Único         | VARCHAR     | 255     | Email do usuário.              |
| senha          | Não Nulo                | VARCHAR     | 255     | Senha de acesso do usuário.    |
| criado_em      | Não Nulo                | TIMESTAMP   |         | Data de criação do usuário.    |
| ativo          | Não Nulo                | BOOLEAN     |         | Status do usuário.             |
| tipo_usuario   | Não Nulo                | VARCHAR     | 50      | Tipo do usuário (admin, comum).|

---

### Entidade: DISPOSITIVO
Descrição: Representa os dispositivos associados aos usuários.
| Atributo       | Propriedades do Atributo | Tipo de Dado | Tamanho | Descrição                              |
|----------------|--------------------------|-------------|---------|----------------------------------------|
| id             | Chave Primária           | UUID      |         | Identificador único do dispositivo.   |
| nome           | Não Nulo                | VARCHAR     | 255     | Nome do dispositivo.                  |
| usuario_id     | Chave Estrangeira        | INTEGER     |         | Relaciona o dispositivo ao usuário.   |
| criado_em      | Não Nulo                | TIMESTAMP   |         | Data de criação do dispositivo.       |
| ativo          | Não Nulo                | BOOLEAN     |         | Status do dispositivo.                |

---

### Entidade: SENSOR
Descrição: Representa os sensores de cada dispositivo.
| Atributo       | Propriedades do Atributo | Tipo de Dado | Tamanho | Descrição                              |
|----------------|--------------------------|-------------|---------|----------------------------------------|
| id             | Chave Primária           | UUID      |         | Identificador único do sensor.        |
| dispositivo_id | Chave Estrangeira        | INTEGER     |         | Relaciona o sensor ao dispositivo.    |
| tipo           | Não Nulo                | VARCHAR     | 50      | Tipo do sensor.                       |
| criado_em      | Não Nulo                | TIMESTAMP   |         | Data de criação do sensor.            |
| ativo          | Não Nulo                | BOOLEAN     |         | Status do sensor.                     |

---

### Entidade: TIPO_SENSOR
Descrição: Representa os tipos de sensores disponíveis.
| Atributo       | Propriedades do Atributo | Tipo de Dado | Tamanho | Descrição                              |
|----------------|--------------------------|-------------|---------|----------------------------------------|
| id             | Chave Primária           | UUID      |         | Identificador único do tipo de sensor.|
| nome           | Não Nulo                | VARCHAR     | 255     | Nome do tipo de sensor.               |
| descricao      |                         | TEXT        |         | Descrição do tipo de sensor.          |

---

### Entidade: DADOS_SENSOR
Descrição: Representa os dados capturados pelos sensores.
| Atributo       | Propriedades do Atributo | Tipo de Dado | Tamanho | Descrição                              |
|----------------|--------------------------|-------------|---------|----------------------------------------|
| id             | Chave Primária           | UUID      |         | Identificador único do dado do sensor.|
| sensor_id      | Chave Estrangeira        | INTEGER     |         | Relaciona o dado ao sensor.           |
| valor          | Não Nulo                | DECIMAL     | 10,2    | Valor capturado pelo sensor.          |
| unidade        | Não Nulo                | VARCHAR     | 50      | Unidade do valor capturado.           |
| criado_em      | Não Nulo                | TIMESTAMP   |         | Data de criação do dado do sensor.    |

---

### Entidade: ALERTA
Descrição: Representa os alertas gerados pelo sistema.
| Atributo       | Propriedades do Atributo | Tipo de Dado | Tamanho | Descrição                              |
|----------------|--------------------------|-------------|---------|----------------------------------------|
| id             | Chave Primária           | UUID      |         | Identificador único do alerta.        |
| dispositivo_id | Chave Estrangeira        | INTEGER     |         | Relaciona o alerta ao dispositivo.    |
| tipo           | Não Nulo                | VARCHAR     | 50      | Tipo do alerta.                       |
| descricao      |                         | TEXT        |         | Descrição do alerta.                  |
| criado_em      | Não Nulo                | TIMESTAMP   |         | Data de criação do alerta.            |
| atualizado_em  |                         | TIMESTAMP   |         | Data de atualização do alerta.        |
| resolvido      | Não Nulo                | BOOLEAN     |         | Indica se o alerta foi resolvido.     |

---

### Entidade: CONSUMO
Descrição: Representa o consumo de água ou energia por dispositivo.
| Atributo       | Propriedades do Atributo | Tipo de Dado | Tamanho | Descrição                              |
|----------------|--------------------------|-------------|---------|----------------------------------------|
| id             | Chave Primária           | UUID      |         | Identificador único do consumo.       |
| dispositivo_id | Chave Estrangeira        | INTEGER     |         | Relaciona o consumo ao dispositivo.   |
| valor          | Não Nulo                | DECIMAL     | 10,2    | Valor do consumo registrado.          |
| criado_em      | Não Nulo                | TIMESTAMP   |         | Data de criação do registro.          |
| atualizado_em  |                         | TIMESTAMP   |         | Data de atualização do registro.      |


## Histórico de versão
| Data | Versão | Descrição | Autores | 
|-------|------|-----------|------------|
| 12/12/2024  | 1.0 | Criação da documentação| Mylena |
| 19/12/2024  | 1.1 | Organização da documentação e criação de MER | Sidney, Bruno e João Bisnoti| 