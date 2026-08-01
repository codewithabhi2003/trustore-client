# Trustore — Frontend (Client)

This is the React (Vite) client for Trustore, built against the API contract in the
master prompt. It's a **frontend-only** build — there's no `server/` yet, so pages
that call `/api/...` will show friendly error toasts until a backend is running.

## Run it

```bash
cd client
npm install
cp .env.example .env   # then fill in VITE_RAZORPAY_KEY_ID if you have one
npm run dev
```

Opens at http://localhost:5173. Point `VITE_API_URL` at your Express server once it exists
(defaults to `http://localhost:5000/api`).

## What's built

- Full theme system (light default, dark toggle, CSS variables exactly per spec)
- Routing for all customer, store-owner, and admin pages
- Auth, Cart (localStorage, grouped by store), Theme, and Location contexts
- AI Shopping Assistant flow: text input → Groq extraction → Dynamic Store Clustering →
  ranked ClusterCards with the full score breakdown + 100m border-store callout
- Store browsing (grid + Leaflet map), store detail + products, cart, checkout (Razorpay)
- Store-owner: registration wizard (map pin + document upload), dashboard, product CRUD,
  order management, sales analytics (recharts)
- Admin: dashboard, pending-store queue, document verification (approve/reject),
  customer management, platform orders, analytics

## What's not built yet

- The entire `server/` (Express + MongoDB + Groq + Razorpay + Cloudinary)
- Real data — every list/chart is wired to the real endpoint paths from the spec and
  will populate correctly once the backend exists
- CartDrawer (slide-in mini-cart) — the full `/cart` page covers this for now
- Seed scripts, deployment config

## Notes

- Every relative import and all 24 routed pages were checked with `tsc --noEmit`
  (syntax-only pass) — zero errors.
- Leaflet's CSS is imported once in `main.jsx`, per the spec's note about map tiles
  not rendering otherwise.
- The AI assistant keeps a 1s submit debounce and a 1.5s minimum "thinking" display,
  matching the Groq free-tier rate-limit note in the master prompt.
