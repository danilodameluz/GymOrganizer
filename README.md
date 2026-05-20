# GymOrganizer

App PWA para gerenciar treinos na academia. Funciona no iPhone via Safari (Adicionar à Tela de Início) e roda offline após o primeiro acesso. Suporta tema claro e escuro.

## Tecnologias

- React + TypeScript + Vite
- Tailwind CSS v4
- Dexie (IndexedDB) — dados no celular
- vite-plugin-pwa — instalável e offline

## Como rodar no Windows

```bash
cd treino-academia
npm install
npm run dev
```

Abra o endereço exibido no terminal (ex.: `http://localhost:5173`).

## Usar no iPhone

1. Faça deploy (Vercel/Netlify) ou use um túnel (ngrok) para ter HTTPS.
2. No iPhone, abra o link no **Safari**.
3. Toque em **Compartilhar** → **Adicionar à Tela de Início**.

> O PWA precisa de **HTTPS** para instalar no iPhone (localhost só funciona no PC).

### Deploy rápido na Vercel

1. Crie conta em [vercel.com](https://vercel.com)
2. Instale a CLI: `npm i -g vercel`
3. Na pasta do projeto: `npm run build` e depois `vercel`

## Funcionalidades

- Criar treinos personalizados do zero
- Exercícios com séries, repetições e peso planejados
- Registrar séries (peso e repetições)
- Cronômetro de descanso (60s, 90s, 120s, 180s)
- Histórico de treinos concluídos
- Dados salvos localmente (IndexedDB)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
