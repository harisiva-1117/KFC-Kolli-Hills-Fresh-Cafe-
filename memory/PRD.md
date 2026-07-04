# Kolli Hills Fresh Cafe — PRD & Implementation Log

## Problem Statement (original)
Build a premium, modern, elegant, memorable commercial cafe website for **Kolli Hills Fresh Cafe** (KFC Karavalli) — a 24-hour pickup-only cafe + general store on the road to Kolli Hills, Tamil Nadu. Phone: +91 90801 31442. Prep 10–15 minutes. Pay at counter.

The site must combine Nature + Premium Cafe + Modern Shopping + Travel + Hospitality + Kolli Hills. Colors: Forest Green, Coffee Brown, Warm Beige, Cream White, Gold Accent, Dark Charcoal. Framer Motion animations. Original design, not a tutorial or bootstrap ecommerce template.

## User Personas
- **Traveller / Tourist** — driving to Kolli Hills, wants to order ahead, pick up, keep moving.
- **Local Owner (Admin)** — manages products, prices, images, and orders. (deferred)
- **Return Visitor** — comes back for honey/spices/dry-fruits.

## Core Requirements (locked)
- Homepage-first (approved) → then Menu → Cart → Checkout → Order Tracking → Admin.
- Pickup-only order flow, pay at counter, on-site notifications (no SMS/WhatsApp in v1).
- Google Maps: https://maps.app.goo.gl/XBeX74ddxnQcfs2A7 (Karavalli).
- Keep existing React + FastAPI + MongoDB template (do NOT rebuild stack).
- Framer Motion for all animations.

## What's Been Implemented — Feb 2026

### ✅ Phase 2 — MongoDB CRUD + Live Data (Feb 2026)
- **Backend** (`/app/backend/server.py`):
  - `Category` model + full CRUD: `GET/POST /api/categories`, `GET/PATCH/DELETE /api/categories/{slug}`.
  - `Product` model with `ProductVariant[{label, price}]` + full CRUD: `GET/POST /api/products` (with filters `?category=`, `?best_seller=`, `?available_only=`), `GET/PATCH/DELETE /api/products/{slug}`.
  - Unique indexes on `slug`; secondary indexes on `category_slug`, `is_best_seller`.
  - `seed_if_empty()` on startup — 15 categories + 9 products (6 best-sellers). Idempotent (verified: restart preserves counts).
  - Legacy `StatusCheck` endpoints kept for compat.
- **Frontend**:
  - `/app/frontend/src/lib/api.js` — fetch client using `REACT_APP_BACKEND_URL`.
  - `/app/frontend/src/lib/hooks.js` — `useCategories`, `useBestSellers`, `useProducts` with loading/error/skeleton states.
  - `Categories.jsx` now consumes `useCategories()` → renders 15 cards from DB.
  - `BestSellers.jsx` now consumes `useBestSellers()` → renders 6 cards from DB with real variants `[{label, price}]`.
  - UI unchanged from Phase 1 — pure data-source swap.
- **Verified** (testing_agent iteration_2 + iteration_3):
  - All CRUD endpoints, 404s, 409 duplicates, 204 deletes.
  - Live update flow: PATCH price → reload homepage → new price visible (no redeploy).
  - Skeleton loading states + correct null-price rendering.

### ✅ Homepage v1 (previous iteration)
- **Design system**: Playfair Display (display) + Work Sans (body), forest/coffee/gold/cream palette, grain overlay, custom scrollbar, gold underline hover.
- **Navigation**: Sticky glassmorphism navbar with mobile menu, transparent-over-hero → cream-when-scrolled state.
- **Premium Hero**: cinematic misty forest background, animated logo entry, "Taste the Freshness of Kolli Hills" headline with italic gold "Freshness", Order/Explore CTAs, 24/7 & pickup meta bar, animated scroll indicator, category marquee strip.
- **Categories**: 15 category cards (Tea → Kolli Hills Specials) with hover zoom, gold underline, arrow icon on hover — using curated Unsplash imagery.
- **Best Sellers**: 6 product cards with variants, ratings, "starts at ₹" pricing OR "Final price will be confirmed before pickup." fallback, Add-to-Cart wired to sonner toast.
- **Our Story**: Editorial asymmetric split with image collage (plantation + honey), 3 paragraphs of finalized copy, stat row (24/7, 15+, 10–15 min).
- **Gallery**: Bento masonry with 3 real cafe photos + 3 curated shots, hover overlay with brand caption.
- **Reviews**: 4 elegant testimonial cards with Quote icon, gold star ratings, staggered layout.
- **Contact & Location**: Forest-green section with Google Maps iframe pointing to Kollihills Fresh Cafe, info rows (phone/hours/pickup/payment/address), Get Directions + Call CTAs.
- **Footer**: Big italic tagline "Where every journey finds its perfect pause.", brand block, Explore/Order/Contact columns, socials, copyright.

## Deferred / Backlog
### P0 (next iteration)
- **Menu page** — full product catalog with categories, variants, images, prices, add-to-cart.
- **Cart drawer** — persistent, react-context based, remove/update quantities.
- **Checkout** — customer name + phone, pickup-only, "Place Order" (no payment gateway; pay at counter).
- **Order tracking** — Order ID lookup, status: Received → Confirmed → Ready for Pickup → Collected.

### P1
- **Admin panel** — JWT auth, product CRUD with image upload (object storage), order management, "Ready for Pickup" trigger, dashboard analytics.
- **Backend endpoints** — /api/products, /api/categories, /api/orders (create, list, update status), /api/upload.
- **Real notification** — polling or SSE to notify customer on status change.

### P2
- WhatsApp/SMS notifications (Twilio) — currently on-site only.
- Live inventory / availability toggle.
- Multi-language (Tamil + English).

## Tech Notes
- Frontend: React 19 + CRA + Framer Motion 11 + Tailwind + shadcn + sonner + lucide-react.
- Backend: FastAPI + Motor + MongoDB (unchanged).
- Routing: react-router-dom v7 with single `/` route → `HomePage`.
- All assets served from Unsplash/Pexels + 3 user-provided WhatsApp images.
- Fonts loaded via Google Fonts in `index.css`.

## File Map
- `/app/frontend/src/pages/HomePage.jsx` — page composition
- `/app/frontend/src/components/site/*` — Navbar, Hero, Categories, BestSellers, OurStory, Gallery, Reviews, ContactLocation, Footer
- `/app/frontend/src/lib/cafeData.js` — brand, categories, products, gallery, reviews data
- `/app/frontend/src/index.css` — fonts, CSS variables, grain overlay, animations
