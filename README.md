# 📈 StockWatch - AI-Powered Stock Watchlist

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

🔗 **Live Demo:** [real-time-stock-market-app-jet.vercel.app](https://real-time-stock-market-app-jet.vercel.app)

---

## Overview

A full-stack stock watchlist application that combines real-time market data, 
AI-generated news summaries, and automated email alerts, built with a 
production-grade event-driven architecture using Inngest for background job 
processing.

---

## Features

- **📊 Market Dashboard** — Live overview of market indices and trending stocks
- **⭐ Personal Watchlist** — Add and manage stocks; persisted per user account
- **🤖 AI News Summaries** — Gemini API summarises the latest news for each 
  watched stock, delivered via automated background jobs
- **📧 Daily Email Alerts** — Inngest fan-out pipeline sends personalised 
  watchlist digests to each user on a schedule
- **🔐 Authentication** — Secure user accounts via Better Auth
- **📱 Responsive UI** — Built with shadcn/ui and Tailwind CSS

---

## Architecture

The core of this app is an **event-driven pipeline** using Inngest:

```
User adds stock → Inngest job triggered → Gemini API fetches & summarises news
                                        → Email alert dispatched per user
```

This fan-out pattern ensures each user gets personalised, up-to-date 
summaries without blocking the main request thread — designed for 
scalability from the start.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui |
| Backend | Next.js API Routes · Inngest (background jobs) |
| AI | Google Gemini API (news summarisation) |
| Database | MongoDB |
| Auth | Better Auth |
| Market Data | TradingView Widgets |
| Deployment | Vercel |

---

## Getting Started

```bash
git clone https://github.com/Arty27/real-time-stock-market-app.git
cd real-time-stock-market-app
npm install
```

Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
INNGEST_EVENT_KEY=your_inngest_key
BETTER_AUTH_SECRET=your_auth_secret
```

```bash
npm run dev        # http://localhost:3000
npx inngest-cli@latest dev   # Inngest dev server
```

---

## Author

**Vinay N** · [LinkedIn](https://linkedin.com/in/vinayn027) · [GitHub](https://github.com/Arty27)
