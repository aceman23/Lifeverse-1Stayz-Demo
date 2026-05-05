# 1Stayz — Agentic AI Digital Assistants for Churches

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-imn9byw7)

**1Stayz** is a church visitor management platform built by Lifeverse. It helps churches track, engage, and follow up with first-time visitors through intelligent, personalized communication that feels genuinely human.

---

## What It Does

Churches lose most first-time visitors because follow-up is inconsistent or too slow. 1Stayz solves this by giving pastoral teams a single place to manage the entire visitor journey — from the moment someone walks through the door to the day they become a fully integrated member.

---

## Features

- **Visitor Pipeline** — Visual status tracking across every stage: new visitor → thanked → contacted → engaged → escalated → scheduled → returned → integrated
- **Follow-Up Engine** — Automated multi-stage follow-up sequences with status tracking and action prompts
- **Concern Detection** — AI-powered detection of visitor concerns with urgency levels (low / medium / high / critical) and pastoral escalation workflows
- **Conversation Tracking** — Inbound and outbound communication logs across multiple channels with sentiment analysis
- **Appointment Scheduling** — AI-generated scheduling suggestions with built-in meeting invitations
- **Dashboard Analytics** — Real-time stats: new visitors this week, active conversations, concerns raised, and AI recommendations
- **Visitor Profiles** — Full visitor records including family details, contact preferences, visit history, and engagement timeline
- **Ingestion** — Multiple source connections to capture visitor data from forms, events, and other entry points
- **Settings** — User and permission management for the pastoral team

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, React Router 7 |
| Styling | Tailwind CSS 3, PostCSS |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL + Realtime) |
| Auth | Supabase Auth (email/password) |
| Build | Vite 5 |

---

## Project Structure

```
src/
  pages/          # Top-level route pages
  components/
    layout/       # Sidebar and Header
    dashboard/    # Stat cards, pipeline panel, AI recommendations
    visitor/      # Profile components, engagement timeline
    communications/  # Sequence cards and timelines
    conversation/ # Avatar chat and content library
    ingestion/    # Source cards and submission feed
    scheduling/   # Meeting invite cards
    pilot/        # Feedback panel and iteration log
    ui/           # Shared UI (chat widget, status badges)
    auth/         # Protected route wrapper
  lib/            # Supabase client, auth context, hooks, types, utils
supabase/
  migrations/     # Database schema and RLS policies
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Database

All migrations are located in `supabase/migrations/`. They are applied in order and include full RLS (Row Level Security) policies to ensure data is only accessible to authorized users.

To apply migrations, use the Supabase MCP tooling or the Supabase dashboard SQL editor.

---

## Authentication

Authentication uses Supabase's built-in email/password flow. A demo mode is available on the login page for evaluating the platform without credentials.

---

## Brand

1Stayz is a product by **Lifeverse**. Logo assets are located in the `public/` directory.

---

## License

Proprietary. All rights reserved by Lifeverse.
