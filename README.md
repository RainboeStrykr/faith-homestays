# Faith The Retreat — Homestay Website

A fullstack website and booking platform for **Faith The Retreat**, a warm, cosy homestay in Siliguri, West Bengal — the gateway to Sikkim, Bhutan, and the Eastern Himalayas.

---

## Features

- Full-viewport video hero with transparent nav that transitions on scroll
- Ethos / philosophy section introducing the property
- Rooms grid with 9 room cards and a scroll-reactive canvas glitch effect; clicking a card opens the per-room detail view inline
- Per-room detail view with a sticky price & booking panel; dormitory rooms support per-bed pricing that scales with guest count
- Amenities, Gallery (12-image auto-scrolling infinite slider), and Testimonials sections
- Booking flow: "Reserve This Room" → `/booking/confirm` form → UPI QR advance payment → confirmation page
- Reservation requests persisted to Supabase (PostgreSQL) via tRPC
- Room prices can be overridden at runtime via the `room_prices` table without redeploying
- Password-protected admin portal at `/admin` — view all reservations with pagination, confirm/cancel status, delete all, and manage room prices

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v3, shadcn/ui (Radix UI) |
| Animations | GSAP + ScrollTrigger, three.js (GLSL canvas), Motion (Framer Motion v12) |
| Backend | Hono, tRPC 11 |
| Database | Drizzle ORM, Supabase (PostgreSQL) |
| Auth | Custom password-based admin session (HS256 JWT, HttpOnly cookie) |
| Routing | React Router v7 |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Push schema to Supabase
npm run db:push

# 4. Start development server
npm run dev

# 5. Build for production
npm run build
```

---

## Environment Variables

```env
# Secret for signing admin session JWTs (any long random string)
APP_SECRET=

# Supabase PostgreSQL connection URI (use port 5432, not 6543)
DATABASE_URL=

# Password for the /admin page
ADMIN_PASSWORD=
```

---

## Rooms

Nine room types defined in `src/data/rooms.ts`:

**Premium & Family Collection**
| ID | Room | Price |
|----|------|-------|
| 01 | Standard Deluxe Cosy Room | ₹1,650 / night |
| 02 | Superior Deluxe AC Room | ₹2,450 / night |
| 03 | Premium Family Suite | ₹2,300 / night |

**Standard Comfort & Value**
| ID | Room | Price |
|----|------|-------|
| 04 | Standard Deluxe AC Room | ₹1,750 / night |
| 05 | Standard Backpacker's Twin Room | ₹1,250 / night |
| 06 | Standard Cosy Room | ₹1,050 / night |
| 07 | Standard Single Room | ₹800 / night |

**Backpacker Dormitories** (per-bed pricing)
| ID | Room | Price |
|----|------|-------|
| 08 | Premium AC Dormitory – Mixed Bunk | ₹850 / bed / night |
| 09 | Premium AC Dormitory – Private Bunk | ₹950 / bed / night |

Dormitory rooms (`perBed: true`) multiply the price by the number of beds selected. All prices are inclusive of taxes.

---

## Database Schema

Defined in `db/schema.ts`, two tables in Supabase:

**`reservation_requests`**
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| check_in_date | varchar | |
| check_out_date | varchar | |
| guests | varchar | |
| room_type | varchar | Display name of the room |
| room_id | varchar | ID from `src/data/rooms.ts` |
| full_name | varchar | |
| email | varchar | |
| phone | varchar | Stored with +91 prefix |
| message | text | Optional |
| status | enum | `pending` / `confirmed` / `cancelled` |
| created_at | timestamp | |

**`room_prices`**
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| room_id | varchar UNIQUE | Matches ID in `src/data/rooms.ts` |
| price | varchar | e.g. `₹1,800` |
| price_note | varchar | e.g. `per night, taxes included` |
| updated_at | timestamp | |

> Room prices in `room_prices` override the defaults in `src/data/rooms.ts` without a redeploy.

---

## Admin Portal

Visit `/admin` — protected by the `ADMIN_PASSWORD` env var.

- **Login** at `/admin/login` with the password; session lasts 30 days via a signed HttpOnly cookie
- **Reservations** — paginated list (10 per page), confirm / cancel / reset-to-pending each booking, delete all
- **Room Prices** — inline editor to override any room's price and price note

---

## Booking Flow

1. Customer browses rooms on the homepage → clicks a room card → opens the room detail view
2. Clicks **Reserve This Room** → navigated to `/booking/confirm?roomId=...&guests=...`
3. Fills in check-in/out dates, guest count, name, email, phone, optional message
4. Scans the UPI QR code and pays ₹500 advance → checks the confirmation checkbox
5. Clicks **I've Paid – Confirm Booking** → reservation saved to DB with status `pending`
6. Confirmation page shown: "We will contact you about your reservation soon"
7. Reservation appears in the admin portal immediately

---

## Project Structure

```
.
├── api/
│   ├── auth0/             # Admin JWT session (sign + verify HS256 tokens)
│   ├── lib/               # env, cookies, vite dev-server utils
│   ├── queries/           # DB connection (Drizzle + postgres.js)
│   ├── auth-router.ts     # tRPC: login, logout, me
│   ├── listing-router.ts  # tRPC: getRoomPrices, updateRoomPrice
│   ├── reservation-router.ts # tRPC: create, allReservations, updateStatus, deleteAll, checkAvailability
│   ├── middleware.ts       # publicQuery + adminQuery procedures
│   ├── context.ts         # tRPC context — reads admin session cookie
│   ├── router.ts          # App router (combines all sub-routers)
│   └── boot.ts            # Hono server entry point
├── contracts/
│   └── constants.ts       # Session config, error messages, paths
├── db/
│   ├── migrations/        # Drizzle-generated SQL migrations
│   └── schema.ts          # reservation_requests + room_prices tables
├── public/
│   ├── images/            # Room photos, gallery, payment QR, logo
│   └── videos/            # Hero video (placeholder-1.mp4), amenities video (spatial.mp4)
├── src/
│   ├── data/
│   │   └── rooms.ts       # Source of truth for all 9 rooms
│   ├── pages/
│   │   ├── AdminLogin.tsx # /admin/login — password form
│   │   ├── Dashboard.tsx  # /admin — reservations + price management
│   │   ├── BookingConfirm.tsx # /booking/confirm — booking form + QR payment
│   │   └── RoomDetail.tsx # Inline room detail view (rendered on homepage)
│   ├── sections/          # Header, Hero, Ethos, RoomGrid, Amenities, Gallery,
│   │                      # Testimonials, CTA, Footer, Preloader
│   ├── providers/
│   │   └── trpc.tsx       # tRPC React client + QueryClient provider
│   └── App.tsx            # Routes: /admin/login, /admin, /booking/confirm, *
├── drizzle.config.ts
├── vite.config.ts
├── Dockerfile
└── .env.example
```

---

## Customisation

To re-skin for a different property, edit:

- **`src/data/rooms.ts`** — all room content (id, title, images, descriptions, features, pricing)
- **`src/sections/Hero.tsx`** — headline, subtitle, CTA buttons, background video
- **`src/sections/Footer.tsx`** — contact details (email, phone, Instagram, address)
- **`src/sections/Ethos.tsx`** — philosophy quote and tags
- **`src/sections/Amenities.tsx`** — facility list and background video
- **`src/sections/Testimonials.tsx`** — guest review cards
- **`src/sections/Header.tsx`** — brand wordmark and nav items
- **`public/images/gallery/`** — replace `gallery (1).jpg` … `gallery (12).jpg`
- **`public/images/payment-qr.png`** — UPI QR code for advance payment
- **`index.html`** — page `<title>` and meta tags

> Do not move room content into the database. `src/data/rooms.ts` is the single source of truth for displayed room data — only reservation writes and optional price overrides are persisted.

---

## Notes

- Use Supabase's **session pooler (port 5432)**, not the transaction pooler (port 6543) — the transaction pooler enforces statement timeouts that break queries
- The canvas glitch effect in `RoomGrid.tsx` reacts to scroll speed — it is the site's primary identity interaction, don't remove it
- WhatsApp direct contact: [+91 89188 03065](https://wa.me/918918803065)
