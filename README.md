# LifePattern Web MVP

A real Next.js SaaS starter for LifePattern: a private personal insight platform that helps users understand stress, energy, and life patterns.

## What is included

- Next.js 15 app router project
- TypeScript
- Tailwind CSS
- Landing page
- Onboarding
- Daily check-in screen
- Dashboard
- Insight detail page
- Weekly report
- Monthly Life Clarity Report
- Privacy center
- Mock discovery engine in `lib/discovery-engine.ts`
- Supabase schema in `supabase/schema.sql`
- Supabase client setup in `lib/supabase.ts`

## What is not fully connected yet

This is a working website project, but the backend is scaffolded, not fully wired.

Still needed for production:

1. Create Supabase project
2. Run `supabase/schema.sql`
3. Add env variables from `.env.example`
4. Replace mock data with Supabase queries/mutations
5. Add real auth pages/actions
6. Add Claude/OpenAI insight wording API route
7. Deploy to Vercel

## Run locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Recommended next build steps

1. Wire `/check-in` form to Supabase `checkins`, `tags`, and `checkin_tags` tables.
2. Add Supabase Auth sign up/login.
3. Move `generateInsights()` to a server API route.
4. Store generated insights in the `insights` table.
5. Add weekly cron job to generate reports.
6. Add Claude API only for insight wording, not pattern detection.

## Product rule

Do not add more features until the first 5 discovery types are useful:

- Biggest stress trigger
- Biggest energy drain
- Biggest energy source
- Best day formula
- Sleep–mood correlation
