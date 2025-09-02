# ClinicaOn API Wrapper

Uma API wrapper HTTP construída com Fastify para integração com o sistema ClinicaOn. Esta API fornece endpoints RESTful para autenticação e gerenciamento de agenda, abstraindo a complexidade da comunicação direta com a API do ClinicaOn.

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Autenticação](#autenticação)
- [Exemplos](#exemplos)
- [Desenvolvimento](#desenvolvimento)
- [Deploy](#deploy)

## ✨ Características

- **API RESTful**: Interface HTTP limpa e padronizada
- **Autenticação JWT**: Gerenciamento automático de tokens de acesso
- **Documentação Swagger**: Interface interativa para testes
- **Middleware de Autenticação**: Proteção automática de rotas
- **Validação de Schema**: Validação automática de entrada e saída
- **Logging**: Sistema de logs integrado
- **Auto-login**: Login automático na inicialização (opcional)
- **TypeScript**: Tipagem forte e segurança de tipos

## 🛠 Tecnologias

- **[Fastify](https://fastify.io/)** - Framework web rápido e eficiente
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Axios](https://axios-http.com/)** - Cliente HTTP para comunicação com APIs
- **[JSON Web Token](https://jwt.io/)** - Padrão para tokens de autenticação
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação interativa da API

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Clonando o repositório

```bash
git clone <repository-url>
cd clinicaon-api
```

### Instalando dependências

```bash
npm install
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configuração do Servidor
PORT=3000

# ClinicaOn API Configuration
CLINICAON_BASE_URL=https://api.clinicaon.com.br

# Auto-login (Opcional)
CLINICAON_EMAIL=seu.email@exemplo.com
CLINICAON_PASSWORD=sua_senha
```

### Configuração de Ambiente

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `PORT` | Porta do servidor | Não | `3000` |
| `CLINICAON_BASE_URL` | URL base da API ClinicaOn | Não | `https://api.clinicaon.com.br` |
| `CLINICAON_EMAIL` | Email para auto-login | Não | - |
| `CLINICAON_PASSWORD` | Senha para auto-login | Não | - |

## 🚀 Uso

### Desenvolvimento

```bash
# Iniciar em modo de desenvolvimento com hot-reload
npm run dev

# Verificação de tipos
npm run typecheck

# Linting
npm run lint
```

### Produção

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

### Acesso à API

- **Servidor**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/`
- **Documentação Swagger**: `http://localhost:3000/docs`

## 📚 Endpoints

### Health Check

#### `GET /`

Endpoint de verificação de saúde do serviço.

**Resposta:**
```json
{
  "status": "healthy",
  "service": "ClinicaOn API Wrapper",
  "timestamp": "2025-01-08T15:30:00.000Z"
}
```

---

## 🔐 Autenticação

### `POST /api/auth/login`

Autentica usuário no sistema ClinicaOn.

**Parâmetros do Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 12345,
    "userName": "usuario@exemplo.com",
    "nomeUsuario": "João Silva",
    "nomeUnidade": "Clínica Principal",
    "unidadeId": 1,
    "tipoAssinatura": 1,
    "nutricional": false
  }
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Authentication failed",
  "message": "Invalid credentials"
}
```

### `GET /api/auth/status`

Verifica o status da autenticação atual.

**Resposta:**
```json
{
  "authenticated": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📅 Agenda

> **Nota**: Todos os endpoints de agenda requerem autenticação válida.

### `GET /api/agenda`

Busca agendamentos em um período específico.

**Parâmetros de Query:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `startDate` | string (ISO date) | Sim | Data de início (ex: `2025-01-08T03:00:00.000Z`) |
| `endDate` | string (ISO date) | Sim | Data de fim (ex: `2025-01-09T03:00:00.000Z`) |
| `semFalta` | boolean | Não | Excluir faltas (padrão: `false`) |
| `status` | string | Não | Filtrar por status (ex: `"Confirmado"`) |

**Exemplo de Requisição:**
```bash
GET /api/agenda?startDate=2025-01-08T03:00:00.000Z&endDate=2025-01-09T03:00:00.000Z&semFalta=true
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "horaInicio": "09:00",
      "horaFim": "10:00",
      "nomePessoa": "Maria Silva",
      "telefone": "(11) 1234-5678",
      "celular": "(11) 99999-9999",
      "servicos": ["Consulta", "Exame"],
      "status": "Confirmado"
    }
  ],
  "count": 1
}
```

### `GET /api/agenda/date/{date}`

Busca agendamentos para uma data específica (endpoint de conveniência).

**Parâmetros de Path:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `date` | string (YYYY-MM-DD) | Data específica |

**Parâmetros de Query:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `semFalta` | boolean | Excluir faltas (padrão: `false`) |
| `status` | string | Filtrar por status |

**Exemplo de Requisição:**
```bash
GET /api/agenda/date/2025-01-08?semFalta=true&status=Confirmado
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "date": "2025-01-08",
  "data": [
    {
      "id": 12345,
      "horaInicio": "09:00",
      "horaFim": "10:00",
      "nomePessoa": "Maria Silva",
      "telefone": "(11) 1234-5678",
      "celular": "(11) 99999-9999",
      "servicos": ["Consulta", "Exame"],
      "status": "Confirmado"
    }
  ],
  "count": 1
}
```

---

## 💡 Exemplos

### Exemplo Completo de Uso

```javascript
// 1. Fazer login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  })
});

const loginData = await loginResponse.json();
console.log('Login realizado:', loginData.success);

// 2. Verificar status da autenticação
const statusResponse = await fetch('http://localhost:3000/api/auth/status');
const statusData = await statusResponse.json();
console.log('Autenticado:', statusData.authenticated);

// 3. Buscar agenda do dia
const today = new Date().toISOString().split('T')[0];
const agendaResponse = await fetch(`http://localhost:3000/api/agenda/date/${today}`);
const agendaData = await agendaResponse.json();
console.log(`Agendamentos encontrados: ${agendaData.count}`);
```

### Exemplo com cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com","password":"senha123"}'

# Buscar agenda
curl "http://localhost:3000/api/agenda/date/2025-01-08?semFalta=true"
```

### Exemplo com Python

```python
import requests
from datetime import datetime

# Configuração
base_url = "http://localhost:3000"

# Login
login_data = {
    "email": "usuario@exemplo.com",
    "password": "senha123"
}

response = requests.post(f"{base_url}/api/auth/login", json=login_data)
login_result = response.json()

if login_result.get("success"):
    print("Login realizado com sucesso!")
    
    # Buscar agenda de hoje
    today = datetime.now().strftime("%Y-%m-%d")
    agenda_response = requests.get(f"{base_url}/api/agenda/date/{today}")
    agenda_data = agenda_response.json()
    
    print(f"Agendamentos encontrados: {agenda_data['count']}")
    for agendamento in agenda_data['data']:
        print(f"- {agendamento['horaInicio']} - {agendamento['nomePessoa']}")
```

---

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
src/
├── index.ts              # Ponto de entrada da aplicação
├── middleware/
│   └── auth.ts          # Middleware de autenticação
├── routes/
│   ├── auth.ts          # Rotas de autenticação
│   └── agenda.ts        # Rotas de agenda
├── services/
│   └── clinicaon-client.ts  # Cliente para API ClinicaOn
└── types/
    ├── auth.ts          # Tipos de autenticação
    ├── agenda.ts        # Tipos de agenda
    └── relatorios.ts    # Tipos de relatórios
```

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter ESLint |
| `npm run typecheck` | Verifica os tipos TypeScript |

### Adicionando Novos Endpoints

1. **Definir tipos** em `src/types/`
2. **Implementar no cliente** em `src/services/clinicaon-client.ts`
3. **Criar rota** em `src/routes/`
4. **Registrar rota** em `src/index.ts`

### Middleware de Autenticação

O middleware `requireAuth` verifica automaticamente se existe um token válido:

```typescript
import { requireAuth } from '../middleware/auth';

fastify.get('/protected-endpoint', {
  preHandler: requireAuth,
  // ... configuração da rota
}, async (request, reply) => {
  // Endpoint protegido
});
```

---

## 🚀 Deploy

### Deploy com Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
```

### Deploy no Heroku

```bash
# Configurar variáveis de ambiente
heroku config:set CLINICAON_BASE_URL=https://api.clinicaon.com.br
heroku config:set CLINICAON_EMAIL=seu.email@exemplo.com
heroku config:set CLINICAON_PASSWORD=sua_senha

# Deploy
git push heroku main
```

### Deploy com PM2

```bash
# Instalar PM2
npm install -g pm2

# Build da aplicação
npm run build

# Iniciar com PM2
pm2 start dist/index.js --name "clinicaon-api"

# Configurar para iniciar automaticamente
pm2 startup
pm2 save
```

---

## 📝 Notas Importantes

### Segurança

- **Nunca exponha credenciais** em arquivos de código
- **Use HTTPS** em produção
- **Configure CORS** adequadamente para sua aplicação
- **Monitore logs** para detectar tentativas de acesso não autorizado

### Performance

- **Tokens são gerenciados automaticamente** com renovação antes do vencimento
- **Conexões HTTP são reutilizadas** através do cliente Axios
- **Middleware de autenticação** é otimizado para verificações rápidas

### Limitações

- **Dependente da API ClinicaOn** - indisponibilidades upstream afetam este serviço
- **Token único por instância** - não adequado para múltiplos usuários simultâneos
- **Rate limiting** deve ser implementado conforme necessário

### Monitoramento

Recomenda-se monitorar:
- **Status de saúde**: `GET /`
- **Status de autenticação**: `GET /api/auth/status`
- **Logs de aplicação** para erros e performance
- **Latência da API ClinicaOn**

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Suporte

Para dúvidas ou suporte:

- **Documentação Swagger**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/`
- **Logs**: Verifique os logs da aplicação para detalhes de erros

---

*Última atualização: Janeiro 2025*

