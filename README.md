# 🎀 Williany faz 18 — Convite Digital

App de convite com confirmação de presença em tempo real, painel admin e banco de dados SQLite na nuvem.

---

## 🗂 Estrutura do projeto

```
williany18/
├── lib/db.js                  # Banco de dados (SQLite via libsql)
├── pages/
│   ├── index.js               # App principal (todas as abas)
│   ├── _app.js
│   └── api/
│       ├── auth.js            # Login do admin
│       ├── guests/
│       │   ├── index.js       # GET lista / POST novo convidado
│       │   └── [id].js        # DELETE / PATCH convidado
├── styles/globals.css
├── .env.local.example
└── README.md
```

---

## 🚀 Rodando localmente

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o ambiente
```bash
cp .env.local.example .env.local
```
O arquivo `.env.local` já vem configurado para SQLite local — não precisa mudar nada para testar.

### 3. Rode o projeto
```bash
npm run dev
```
Acesse: http://localhost:3000

---

## ☁️ Deploy na Vercel (produção)

Para o banco funcionar na Vercel, você precisa do **Turso** (SQLite na nuvem — grátis).

### Passo 1 — Crie o banco Turso

```bash
# Instale o CLI do Turso
curl -sSfL https://get.tur.so/install.sh | bash

# Faça login
turso auth login

# Crie o banco
turso db create williany18

# Pegue a URL do banco
turso db show williany18 --url

# Crie o token de acesso
turso db tokens create williany18
```
Guarde a **URL** e o **TOKEN** gerados.

### Passo 2 — Faça o deploy na Vercel

1. Acesse **vercel.com** e faça login
2. Clique em **Add New Project**
3. Importe este repositório (ou arraste a pasta)
4. Na seção **Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `libsql://williany18-SEU_USUARIO.turso.io` |
| `DATABASE_AUTH_TOKEN` | `SEU_TOKEN` |
| `ADMIN_PASSWORD` | Sua senha secreta |

5. Clique em **Deploy** ✓

---

## 🔐 Painel Admin

- Acesse a aba **Admin** no convite
- Digite a senha configurada em `ADMIN_PASSWORD`
- Funcionalidades:
  - Ver todos os convidados em tempo real
  - Filtrar por status (Confirmado / Talvez / Não vem)
  - Buscar por nome
  - Editar status clicando no badge
  - Remover convidado
  - Exportar lista em CSV
  - Limpar toda a lista

---

## 🛠 Tecnologias

- **Next.js 14** — React + API Routes
- **@libsql/client** — SQLite local e Turso (cloud)
- **Vercel** — Deploy e hospedagem gratuita
