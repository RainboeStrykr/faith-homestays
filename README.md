# Faith The Retreat — Fullstack Homestay Website

A fullstack landing page and booking platform for **Faith The Retreat**, a warm, cosy homestay in Siliguri, West Bengal — the gateway to Sikkim, Bhutan, and the Eastern Himalayas.

## Features

- Full-viewport video hero with left-aligned headline, subtitle, and CTAs (`Explore Rooms` / `Contact Us` via WhatsApp); transparent nav overlays the video until scroll
- Ethos / philosophy section introducing the property
- Rooms & Residences grid with 9 room cards (scroll-reactive canvas glitch effect); clicking a card renders the per-room detail view inline without a page change
- Per-room detail view (`RoomDetail`) rendered from `src/data/rooms.ts` with a sticky price & booking panel; dormitory rooms support per-bed pricing that scales with guest count
- Amenities section listing property facilities
- Photo gallery section — 12 property images in an auto-scrolling infinite slider with hover captions
- Testimonials section — sliding guest review cards
- Booking Inquiry split section: a GLSL animated shader on the left and a reservation form on the right; submitting routes to `/booking/confirm`
- CTA banner above the footer
- Reservation requests persist to Supabase (PostgreSQL) via tRPC; room detail "Reserve This Room" also routes through the booking confirm flow
- Auth0 Google sign-in; authenticated users have name/email pre-filled in forms; a `/dashboard` page shows booking history
- Admin role support via `role` enum on the `users` table
- Room prices can be overridden at runtime via the `room_prices` database table without redeploying

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui (Radix UI primitives)
- GSAP + ScrollTrigger for scroll-triggered fade-ins and parallax
- three.js for the booking inquiry GLSL shader
- tRPC 11 + Hono + Drizzle ORM + Supabase (PostgreSQL)
- Auth0 (Google OAuth2)
- React Router v7
- Embla Carousel / Infinite Slider for the gallery
- Motion (Framer Motion v12) for micro-animations
- Zod + React Hook Form for form validation

## Quick Start

1. Clone / extract this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, Auth0 credentials, and Admin credentials
4. Run database migrations: `npm run db:push`
5. Run the dev server: `npm run dev`
6. Build for production: `npm run build`

## Configuration

Display content lives inline in sections and in `src/data/rooms.ts`; only reservation writes are persisted. To re-skin for a different property, edit the following:

- **`src/sections/Header.tsx`** — brand wordmark (`FAITH`), nav items (`Rooms`, `Amenities`, `Gallery`, `Contact`), and mobile drawer
- **`src/sections/Hero.tsx`** — hero eyebrow, big title (`Welcome to Faith The Retreat`), subtitle, CTA buttons, WhatsApp link. Background video: `/videos/walkthrough-generation.mp4`
- **`src/sections/Ethos.tsx`** — philosophy / ethos quote and tags
- **`src/sections/RoomGrid.tsx`** — heading and eyebrow; cards rendered from `src/data/rooms.ts`
- **`src/sections/Amenities.tsx`** — amenities heading and bullet grid. Background: `/videos/spatial.mp4`
- **`src/sections/Gallery.tsx`** — heading `Our Gallery`, 12-image infinite slider from `public/images/gallery/`
- **`src/sections/Testimonials.tsx`** — heading `Testimonials` and guest review cards
- **`src/sections/BookingInquiry.tsx`** — left GLSL shader, right reservation form (routes to `/booking/confirm`)
- **`src/sections/CTA.tsx`** — above-footer call-to-action banner
- **`src/sections/Footer.tsx`** — brand logo, nav columns, contact details (email, phone, Instagram, address)
- **`src/sections/Preloader.tsx`** — intro splash with the brand wordmark
- **`src/pages/RoomDetail.tsx`** — per-room detail view; "Reserve This Room" routes to `/booking/confirm`
- **`src/pages/BookingConfirm.tsx`** — booking confirmation + tRPC mutation to persist the reservation
- **`src/pages/Dashboard.tsx`** — authenticated user booking history
- **`src/data/rooms.ts`** — **source of truth for all 9 rooms** (id, title, client, img, tagline, description, features, price, priceNote, sqm, occupancy, bed, perBed, maxGuests, capacity)
- **`index.html`** — `<title>` and meta tags
- **`api/reservation-router.ts`** — tRPC router that persists submissions to `reservation_requests`

## Rooms

Nine room types are defined in `src/data/rooms.ts`, grouped into three collections:

**Premium & Family Collection**
| ID | Room | Price |
|----|------|-------|
| 01 | Standard Deluxe Cosy Room | ₹1,650 / night |
| 02 | Superior Deluxe AC Room | ₹2,450 / night |
| 03 | Premium Family Suite | ₹2,300 / night |

**Standard Comfort & Value Rooms**
| ID | Room | Price |
|----|------|-------|
| 04 | Standard Deluxe AC Room | ₹1,750 / night |
| 05 | Standard Backpacker's Twin Room | ₹1,250 / night |
| 06 | Standard Cosy Room | ₹1,050 / night |
| 07 | Standard Single Room | ₹800 / night |

**Backpacker Dormitories**
| ID | Room | Price |
|----|------|-------|
| 08 | Premium AC Dormitory – Mixed Bunk | ₹850 / night, per person |
| 09 | Premium AC Dormitory – Private Bunk | ₹950 / night, per person |

Dormitory rooms (`perBed: true`) multiply price by guest count. All prices are inclusive of taxes.

## Database Schema

Three tables, defined in `db/schema.ts`:

- **`users`** — Auth0-managed (id, auth0Sub, name, email, avatar, role enum `user|admin`, createdAt, updatedAt, lastSignInAt)
- **`reservation_requests`** — booking submissions (id, userId nullable, checkInDate, checkOutDate, guests, roomType, roomId nullable, fullName, email, phone, message, status enum `pending|confirmed|cancelled`, createdAt)
- **`room_prices`** — optional runtime price overrides per roomId (id, roomId, price, priceNote, updatedAt); takes precedence over `src/data/rooms.ts` prices when present

Room content (descriptions, features, images) lives on the frontend in `src/data/rooms.ts` — do not duplicate it into the database.

## Required Assets

### Videos (place in `public/videos/`)

- `/videos/walkthrough-generation.mp4` — full-viewport top hero. Recommended: ~10–15 s loop, 1920×1080, property walkthrough or ambient interior
- `/videos/spatial.mp4` — amenities section background. Recommended: ~10 s loop, 1920×1080, dark architectural interior

Either can be omitted — the section falls back to plain `#0b0b0b`.

### Images

Room photos are served from `public/images/` and referenced in `src/data/rooms.ts`. Gallery images are read from `public/images/gallery/` (gallery (1).jpg … gallery (12).jpg).

## Project Structure

```
.
├── api/                   # tRPC routers: auth, reservation, listing. Hono server. Auth0 integration
├── contracts/             # Shared tRPC types and constants
├── db/                    # Drizzle schema, migrations, seed
├── public/
│   ├── images/            # Room photos, gallery shots, QR code, logo
│   └── videos/            # walkthrough-generation.mp4, spatial.mp4
├── src/
│   ├── sections/          # Header, Hero, Ethos, RoomGrid, Amenities, Gallery, Testimonials, BookingInquiry, CTA, Footer, Preloader
│   ├── pages/             # RoomDetail, BookingConfirm, Dashboard, Login
│   ├── components/        # shadcn/ui components + custom UI (InfiniteSlider, SlidingTestimonial, etc.)
│   ├── data/              # rooms.ts — source of truth for all rooms
│   ├── hooks/             # useAuth and other custom hooks
│   └── providers/         # tRPC provider
├── Dockerfile
├── drizzle.config.ts
├── .backend-features.json # Declares ["auth", "db"]
└── .env.example
```

## Design

- Dark-first palette: `#0b0b0b` hero, amenities, gallery, testimonials, booking inquiry; `#0F0F11` footer
- Hero uses a vertical `0.55 → 0.25 → 0.55` black gradient over the video
- Accent colour: `#fee600` (yellow) used on the primary CTA and footer icon highlights
- Fonts: system sans-serif stack, Helvetica Neue display
- Motion: GSAP ScrollTrigger fade-ins and parallax, canvas glitch on room cards (tied to scroll speed), GLSL animated shader in the booking inquiry section

## Notes

- **Do not duplicate `src/data/rooms.ts` into the database** — it is the single source of truth for displayed room content; only reservation writes and optional price overrides are persisted
- The booking inquiry form and each room's "Reserve This Room" button are the only frontend controls wired to the backend
- The canvas glitch effect in `RoomGrid.tsx` reacts to scroll speed — preserve it; it is the repo's identity interaction
- Do not remove `api/auth0/` — it handles Auth0 integration and session management
- WhatsApp booking (`https://wa.me/918918803065`) is provided as a direct contact alternative to the online form
