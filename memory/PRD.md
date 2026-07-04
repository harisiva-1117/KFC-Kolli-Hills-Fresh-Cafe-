# Kolli Hills Fresh Cafe — PRD

## Original Problem Statement
Continue development of the existing public GitHub repo
`https://github.com/harisiva-1117/KFC-Kolli-Hills-Fresh-Cafe-` (Option A).
Preserve the existing homepage, menu, cart, checkout, order tracking, animations,
colors and overall UI exactly. Implement ONLY Phase 4 MVP Admin: JWT auth,
bcrypt password hashing, seed admin, Admin Login, Admin Dashboard, Product CRUD,
Category CRUD, Order Management, Product image upload, Order status update.

## Stack
- **Backend**: FastAPI + Motor (MongoDB) + PyJWT + bcrypt
- **Frontend**: React 19 + React Router 7 + shadcn/ui + Framer Motion + sonner

## User Personas
- **Customer** (unauthenticated): browses catalogue, adds to cart, submits pickup orders, tracks status.
- **Cafe Admin** (JWT-authenticated): manages products, categories, orders, and product images from `/admin`.

## Phase 4 — What's Been Implemented (2026-02)
- JWT + bcrypt auth (`/api/auth/login`, `/api/auth/me`), 12h access tokens, Bearer header.
- Idempotent admin user seeding from `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
- `/admin/login` page + protected `/admin` dashboard with three tabs.
- **Orders tab**: live queue (auto-refreshes every 15s), status filter, status update inline, stat cards (total, revenue, in-queue, ready).
- **Products tab**: search, create/edit/delete with variants parser, image upload, best-seller / availability toggles.
- **Categories tab**: create/edit/delete, active toggle, reorder (↑/↓), delete-blocked-when-products (409).
- **Uploads**: `POST /api/admin/upload` (multipart), served at `/api/uploads/*` (mounted StaticFiles).
- All customer-facing routes (Home, Menu, Cart drawer, Checkout, Order tracker) untouched.

## Test Credentials
- Email: `admin@kollihills.cafe`
- Password: `KolliHills@2026`

## Backlog / Next Actions (P0 → P2)
- **P1**: PDF/CSV export of daily orders (kitchen printout / accounting).
- **P1**: Order status webhook/SMS to customer phone on `ready` (Twilio).
- **P2**: Product bulk edit + drag-and-drop reorder.
- **P2**: Multi-admin roles (staff vs manager) + audit log.
- **P2**: Analytics: best sellers, average order value, peak hours.
- **P2**: Password reset flow (forgot password) for admins.
