# Reddit Tracker Platform

A Reddit post and comments tracker platform built with modern web technologies.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Data Fetching**: [React Query](https://tanstack.com/query/v4)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To enable Support + Feedback ticket emails:

- **`RESEND_API_KEY`**: Resend API key
- **`SUPPORT_EMAIL`**: Destination email address where tickets are sent
- **`TICKETS_FROM_EMAIL`** (optional): Sender email (defaults to `Mira <onboarding@resend.dev>`)

## Supabase

**Creting new migrations from last migrations**

```bash
npx supabase db diff --local -f <file_name>
```

**Generate new types**

```bash
npx supabase gen types --local --lang typescript > src/lib/db.types.ts
```
