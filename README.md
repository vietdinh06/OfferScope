# OfferScope

OfferScope is a Next.js application for parsing and comparing job offers.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in your Supabase and Gemini credentials.
3. Apply the SQL migration in `supabase/migrations/20261003190000_offer_workflow.sql` to your Supabase project.
4. Install dependencies with `npm install`.
5. Start the app with `npm run dev`.

## Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional; defaults to `gemini-2.0-flash`)

The app gracefully degrades when these are not configured so the project can still build locally, but authentication and PDF parsing require valid values at runtime. Gemini is called through its REST API, so no additional AI SDK package is required.

## Product milestones

- Production MVP: authenticated offer ingestion, structured extraction, persistent history, and friendly error states.
- Async processing foundation: `processing_jobs` tracks queued, processing, completed, and failed document work. Use `GET /api/jobs/:id` to read a job status.
- Offer comparison: select two saved offers, adjust preference weights, and save a transparent comparison.

Production preview:
https://offerscope.netlify.app/home
