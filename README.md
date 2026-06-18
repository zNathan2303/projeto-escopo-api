# Projeto Escopo - API

Backend da plataforma de levantamento de requisitos, Escopo, como Trabalho de Conclusão de Curso (TCC) no curso de Desenvolvimento de Sistemas no SENAI.

A API é responsável pela autenticação de usuários, gerenciamento de projetos, controle de permissões e integração com o banco de dados.

## Sobre o projeto

O sistema foi desenvolvido com o objetivo de centralizar todo o levantamento de requisitos de projetos, permitindo:

- Autenticação de usuários
- Gerenciamento de projetos
- Criação, edição e versionamento de documentos
- Criação de registros
- Documentação de reuniões entre o time e clientes

Este repositório contém exclusivamente o backend da aplicação.

## Tecnologias utilizadas

- Node.js
- JavaScript
- Express
- Knex
- MySQL
- Zod
- JWT
- Bcrypt

## Estrutura de pastas

```sql
src/
├── routes/      -- Rotas da API
├── controllers/ -- Validações e regras de negócio
├── models/      -- Camada de acesso ao banco de dados
├── middlewares/ -- Middlewares para autenticação, autorização, tratamento de erros, etc.
├── config/      -- Configurações de determinados itens (ex.: banco de dados)
├── errors/      -- Classes de erro que são usadas para lançar erro de algum status code específico
├── cache/       -- Dados de determinadas tabelas do banco que não irão sofrer alterações
└── utils/       -- Funções auxiliares reaproveitadas em diversos arquivos
```

## Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js 22.15.0+
- npm 10.9.2+
- MySQL

## Como executar o projeto

### 1. Executar o Dump do banco de dados

1. Crie um banco de dados chamado db_escopo.
2. Use o Dump localizado no [repositório](https://github.com/EdvanOAlves/projeto-escopo-db) do banco de dados.

### 2. Clonar o repositório

```bash
git clone https://github.com/zNathan2303/projeto-escopo-api
```

### 3. Entrar na pasta do projeto

```bash
cd projeto-escopo-api
```

### 4. Instalar dependências

```bash
npm i
```

### 5. Configurar variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

```env
JWT_SECRET=
AZURE_STORAGE_TOKEN=
AZURE_STORAGE_CONTAINER=
AZURE_STORAGE_ACCOUNT=
FRONTEND_URL=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
```

### 6. Iniciar servidor

```bash
npm run dev
```

Servidor disponível em:

```txt
http://localhost:8080
```

## Convenções do projeto

- Commits seguindo Conventional Commits.
- Validação utilizando Zod.
- Retorno de erros usando `throw new 'NomeDaClasse('mensagem de erro')'`, sendo as classes específicas em `errors/`, deixando o handler de erros global cuidar do retorno da mensagem de erro.
- Validação de usuários e níveis de acesso utilizando middlewares nos endpoints.

## Repositórios relacionados

Frontend:

- https://github.com/Samys003/projeto-escopo-web

Banco de dados:

- https://github.com/EdvanOAlves/projeto-escopo-db

Mobile:

- https://github.com/AndreRT77/projeto-escopo-mobile

## Equipe

- [Nathan](https://www.linkedin.com/in/nathandasilvacosta/) - Backend
- [Edvan](https://www.linkedin.com/in/edvan-alves/) - Banco de dados e Frontend
- [Samara](https://www.linkedin.com/in/samara-santos-b92160397/) - Frontend
- [André](https://www.linkedin.com/in/andr%C3%A9-roberto-tavares-03a36b316/) - Frontend
