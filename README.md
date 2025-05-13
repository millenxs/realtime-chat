
# Chat Real-Time - Full Stack Challenge

Este projeto consiste em um sistema de chat em tempo real, desenvolvido para avaliar habilidades técnicas em Backend, Frontend, segurança, performance, escalabilidade e boas práticas de desenvolvimento.

O sistema implementa funcionalidades essenciais como autenticação, CRUD de usuários, chat em tempo real, histórico de conversas, busca avançada e uma interface moderna e responsiva.


## Tecnologias Utilizadas

### Backend
- **Node.js + TypeScript**: Backend com Express e TypeScript para tipagem e boas práticas.

- **PostgreSQL**: Banco de dados relacional para persistência de dados.

- **Redis**: Cache para otimização de performance.
- **Socket.IO**: Comunicação em tempo real (WebSockets) entre cliente e servidor.
- **Elasticsearch**: Para busca avançada de mensagens e usuários.
- **OAuth2**: Autenticação segura com suporte a 2FA.

### Frontend
- **Next.js + TypeScript**: Framework React para a criação da interface com Server-Side Rendering (SSR).
- **Tailwind CSS**: Framework de estilização para um design moderno e responsivo.
- **WebSockets**: Comunicação em tempo real via Socket.IO.

### DevOps
- **Docker + Docker Compose**: Containerização dos serviços backend, frontend, banco de dados e Redis.
- **GitHub Actions**: Pipeline de CI/CD para automação de testes e deploy.

### testes
- **Jest**: Testes unitários para backend.
- **Cypress**: Testes E2E para frontend.


## Estrutura do Projeto


```bash
  realtime-chat/
├── apps/
│   ├── backend/         # API Node.js com TypeScript
│   └── frontend/        # Next.js com Tailwind CSS
├── packages/
│   ├── shared/          # Tipagens, utils, validações comuns
├── docker/
│   └── ...
├── .github/
│   └── workflows/       # CI/CD
├── docker-compose.yml   # Orquestra serviços (DB, Redis, etc.)
├── README.md
└── docs/
    └── arquitetura.md   # Documento com visão técnica
```
    
## Funcionalidades
- **Autenticação**: Registro, login com OAuth2, e suporte a 2FA.
- **Chat em Tempo Real**: Comunicação via WebSockets entre usuários.
- **Busca**: Busca de usuários e mensagens com Elasticsearch.
- **Histórico de Conversas**: Visualização do histórico com paginação.
- **Segurança**: Proteção contra SQL Injection, XSS, CSRF, criptografia de dados sensíveis.
- **Design Responsivo**: Mobile-first com Tailwind CSS.
- **Modo Escuro**: Tema escuro para a interface.




## Como Rodar o Projeto

#### Pré-requisitos

- **Node.js**: Versão 16 ou superior.
- **Docker**: Para rodar o banco de dados e Redis localmente.
- **DockerCompose**: Para orquestrar os containers.

Clone o projeto

```bash
  git clone https://github.com/millenxs/realtime-chat.git

```

Entre no diretório do projeto

```bash
  cd realtime-chat
```

Rodar o projeto com Docker Compose

```bash
  docker-compose up --build
```

#### Iniciar o Backend
No diretório apps/backend:

```bash
  npm install
  npm run dev
```

#### Iniciar o Frontend
No diretório apps/frontend:
```bash
  npm install
  npm run dev
```
### Acessar o Sistema
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000


## Configurar o Ambiente

No diretório backend e frontend, crie um arquivo .env com as variáveis de ambiente necessárias (exemplo no docker-compose.yml).


## Testes

#### Backend
Para rodar os testes unitários do backend, execute:

```bash
  npm test
```

#### Frontend 
Para rodar os testes E2E do frontend, execute:
```bash
  npm run cypress
```

## Documentação da API

A documentação da API está disponível via Swagger. Para acessá-la:

[Documentação](http://localhost:3001/api-docs)


## Considerações Finais

Este é um projeto de avaliação técnica que desafia suas habilidades em diversas camadas da aplicação, do frontend ao backend, com foco em boas práticas de arquitetura, segurança, performance e escalabilidade.

