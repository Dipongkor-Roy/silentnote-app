# 📘 SilentNote — Project Study Guide

এই ফাইলটা পড়লে পুরো প্রজেক্টটা **কী করছে, কীভাবে করছে, কোন ফাইল কী কাজ করে** — সব একসাথে বুঝতে পারবে।

---

## 1. প্রজেক্টটা কী?

**SilentNote** একটা anonymous message অ্যাপ (NGL / Sarahah টাইপ)।

- তুমি Sign In করো → একটা **unique link** পাও (`/u/তোমার-নাম`)।
- ওই link যে কাউকে দাও → সে **login ছাড়াই** তোমাকে anonymous message পাঠাতে পারে।
- তুমি Dashboard-এ message দেখো, delete করো, আর message নেওয়া **On/Off** করতে পারো।

### Tech Stack

| কাজ | টুল |
|---|---|
| Framework | **Next.js 14 (App Router)** — frontend + backend একই প্রজেক্টে |
| Language | **TypeScript** |
| Auth | **NextAuth v4** (Google login + Email Magic Link) |
| Database | **PostgreSQL** (Vercel/Supabase) |
| ORM | **Prisma 4** |
| Validation | **Zod** + **React Hook Form** |
| UI | **Tailwind CSS**, **shadcn/ui (Radix)**, Framer Motion, MagicUI |
| Email | **Resend** + **React Email** (magic link-এর email design) |
| HTTP client | **Axios** |
| Deploy | **Vercel** |

---

## 2. Folder Structure (কোথায় কী আছে)

```
silentnote-app/
├── app/                          ← Next.js App Router (pages + API)
│   ├── layout.tsx                ← পুরো অ্যাপের wrapper (Nav, Footer, Provider, Toaster)
│   ├── page.tsx                  ← Home / Landing page ( / )
│   ├── dashboard/page.tsx        ← User-এর Dashboard ( /dashboard )
│   ├── u/[username]/page.tsx     ← Public page, এখানে message পাঠানো হয় ( /u/xyz )
│   ├── context/AuthProvider.tsx  ← SessionProvider wrapper (প্রায় duplicate, নিচে দেখো)
│   └── api/                      ← Backend API routes
│       ├── auth/[...nextauth]/   ← NextAuth config (options.ts) + route.ts
│       ├── send-message/         ← POST: message পাঠানো (public)
│       ├── get-messages/         ← GET: নিজের সব message (login লাগে)
│       ├── accept-messages/      ← GET/POST: message নেওয়া On/Off (login লাগে)
│       └── delete-message/[messageid]/ ← DELETE: message মোছা (login লাগে)
│
├── components/
│   ├── ui/                       ← shadcn/ui base components (Button, Card, Form, Switch...)
│   ├── custom/                   ← এই প্রজেক্টের নিজস্ব component (MessageCard, Features, Review...)
│   ├── layout/                   ← nav, navbar, sign-in-modal, user-dropdown
│   ├── magicui/                  ← animation component (marquee, shiny-button)
│   ├── shared/                   ← modal, popover, tooltip, icons
│   └── provider/provider.tsx     ← SessionProvider (layout এ ব্যবহার হচ্ছে)
│
├── prisma/schema.prisma          ← Database-এর table/model definition
├── lib/prisma.ts                 ← Prisma client singleton
├── Schemas/                      ← Zod validation schema
├── Types/                        ← TypeScript type (ApiResponse, next-auth extension)
├── Emails/email.tsx              ← Magic link email-এর HTML template
├── middleware.ts                 ← Route protection (redirect logic)
├── next.config.js, vercel.json   ← config
└── .env                          ← secret key/credentials (git-এ push করবে না!)
```

> **Next.js App Router-এর নিয়ম:** `app/xyz/page.tsx` = একটা URL page। `app/api/xyz/route.ts` = একটা API endpoint। `[param]` = dynamic segment।

---

## 3. Database Design (Prisma Schema)

```
User ──┬── 1:N ── Message         (একজন user-এর অনেক message)
       ├── 1:N ── Account         (Google ইত্যাদি OAuth account)
       └── 1:N ── Session         (JWT strategy তে প্রায় ব্যবহার হয় না)

VerificationToken                 (Email magic link-এর token)
```

### মূল দুটো model

**User**
| Field | মানে |
|---|---|
| `id` | cuid (unique string) |
| `name` | unique — Google থেকে আসা পুরো নাম |
| `email` | unique |
| `isAcceptingMessage` | `Boolean`, default **false** → message নেবে কি না |

**Message**
| Field | মানে |
|---|---|
| `id` | auto-increment **Int** |
| `content` | message-এর লেখা |
| `createdAt` | কখন এসেছে |
| `userId` | কার message (Foreign Key) |

`Account`, `Session`, `VerificationToken` — এগুলো **NextAuth Prisma Adapter**-এর জন্য বাধ্যতামূলক standard table; নিজে বদলানোর দরকার নেই।

**`onDelete: Cascade`** → User delete হলে তার Account/Session-ও auto delete।

### Build script
```json
"build": "prisma generate && prisma db push && next build"
```
- `prisma generate` → TypeScript client বানায়
- `prisma db push` → schema অনুযায়ী DB table বানায়/আপডেট করে (migration file ছাড়াই)

---

## 4. Authentication — কীভাবে কাজ করে

File: [app/api/auth/[...nextauth]/options.ts](app/api/auth/[...nextauth]/options.ts)

### দুই ধরনের Login

**A) Google Login**
`signIn("google")` → Google-এ redirect → ফিরে এলে NextAuth user তৈরি/খুঁজে নেয় (PrismaAdapter দিয়ে DB-তে save)।

**B) Email Magic Link (password ছাড়া)**
1. User email দেয় → `signIn("email", { email })`
2. NextAuth একটা token বানিয়ে `VerificationToken` table-এ রাখে
3. `sendVerificationRequest` চলে → [Emails/email.tsx](Emails/email.tsx) template render করে **Resend** দিয়ে email পাঠায়
4. User email-এর link-এ click করে → token verify → logged in

### JWT Session Strategy
```ts
session: { strategy: "jwt" }
```
Session DB-তে না রেখে **cookie-র ভিতর JWT token** আকারে থাকে।

### Callbacks (data কীভাবে বইছে)
```
Login হলো → jwt() callback:     user.id, name, email, image → token এ রাখে
Page এ session চাইলে → session() callback: token থেকে session.user এ কপি করে
```
এর ফলে frontend-এ `session.user.id` পাওয়া যায় — যেটা API-তে ব্যবহার হয়।

### TypeScript extension
[Types/next-auth.d.ts](Types/next-auth.d.ts) → NextAuth-এর default `User`/`Session` type-এ `id` ইত্যাদি field যোগ করেছে, নাহলে `session.user.id` লিখলে TS error দিত।

### Session বিভিন্ন জায়গায় কীভাবে নেওয়া হয়

| জায়গা | পদ্ধতি |
|---|---|
| Server component / API | `getServerSession(authOptions)` |
| Client component | `useSession()` (SessionProvider লাগে) |
| Middleware | `getToken({ req })` |

---

## 5. Middleware (Route Protection)

File: [middleware.ts](middleware.ts)

```
Logged in + (/sign-in | /sign-up | /verify | /)  → /dashboard এ পাঠাও
Logged out + /dashboard                           → / এ পাঠাও
```
`matcher: ["/sign-in", "/sign-up", "/dashboard/:path*"]` → শুধু এই route-গুলোতে middleware চলে।

---

## 6. API Routes — বিস্তারিত

| Route | Method | Login? | কাজ |
|---|---|---|---|
| `/api/send-message` | POST | ❌ না | `{username, content}` নিয়ে user খোঁজে → `isAcceptingMessage` check → Message create |
| `/api/get-messages` | GET | ✅ | নিজের সব message, নতুন আগে (`createdAt desc`) |
| `/api/accept-messages` | GET | ✅ | বর্তমান On/Off status |
| `/api/accept-messages` | POST | ✅ | `{acceptMessages: bool}` দিয়ে status update |
| `/api/delete-message/[id]` | DELETE | ✅ | message delete |

সব API-র response format একই ধাঁচের:
```json
{ "success": true/false, "message": "...", ...extra }
```
Type: [Types/ApiResponse.ts](Types/ApiResponse.ts)

---

## 7. Frontend Flow (Page by Page)

### 🏠 Home — [app/page.tsx](app/page.tsx)
Landing page: Hero text, "Get Started" button (logged-out হলে Sign-in modal খোলে), Logo cloud, Demo video, Features, Reviews marquee।

### 🔐 Sign-in Modal — [components/layout/sign-in-modal.tsx](components/layout/sign-in-modal.tsx)
- Email input → magic link, অথবা "Sign In with Google"
- `useSignInModal()` একটা custom hook, যেটা modal-এর open/close state দেয়।

### 🧭 Navbar — [components/layout/nav.tsx](components/layout/nav.tsx) → [navbar.tsx](components/layout/navbar.tsx)
- `nav.tsx` **Server Component**: server-এ session নেয়
- `navbar.tsx` **Client Component**: session prop পেয়ে UI দেখায় (Sign In button অথবা UserDropdown)

### 📊 Dashboard — [app/dashboard/page.tsx](app/dashboard/page.tsx)
1. Page load → `useEffect` এ `fetchMessages()` + `fetchAcceptMessages()` (axios)
2. **Profile URL** = `origin/u/{নামের প্রথম শব্দ}` → Copy button
3. **Switch** → POST `/api/accept-messages` → On/Off
4. **MessageCard** list; Refresh button
5. Delete হলে `handleDeleteMessage` state থেকে সাথে সাথে বাদ দেয় (**Optimistic UI**)

### 💌 Public Send Page — [app/u/[username]/page.tsx](app/u/[username]/page.tsx)
- `useParams()` দিয়ে URL থেকে username
- **React Hook Form + Zod** ([Schemas/messageSchema.ts](Schemas/messageSchema.ts)): ১০–৩০০ অক্ষর
- Submit → POST `/api/send-message` → toast → form reset

### 🃏 MessageCard — [components/custom/MessageCard.tsx](components/custom/MessageCard.tsx)
Content + তারিখ (dayjs) + ❌ button → AlertDialog confirm → DELETE API → parent এর `onMessageDelete` call।

### Layout — [app/layout.tsx](app/layout.tsx)
```
<Provider (SessionProvider)>
   background gradient
   <Nav />
   <main>{children}</main>
   <Toaster />      ← toast notification
   <Footer />
</Provider>
```

---

## 8. সম্পূর্ণ Flow (End-to-End)

```
[Owner]                                   [Sender - anonymous]
   │                                             │
1. Google/Email দিয়ে Sign In                      │
   │  └→ NextAuth → DB তে User তৈরি               │
2. /dashboard → Accept Messages = ON              │
   │  └→ POST /api/accept-messages                │
3. Link copy: /u/Dipongkor                        │
   │ ───────── link শেয়ার ──────────────────────▶ │
   │                                       4. /u/Dipongkor খোলে (login লাগে না)
   │                                       5. message লিখে "Send It"
   │                                          └→ POST /api/send-message
   │                                             ├ user খোঁজে (name দিয়ে)
   │                                             ├ isAcceptingMessage? 
   │                                             └ Message.create()
6. Dashboard Refresh → GET /api/get-messages      │
7. চাইলে ❌ → DELETE /api/delete-message/:id       │
```

---

## 9. Environment Variables (`.env`)

| Variable | কাজ |
|---|---|
| `POSTGRES_PRISMA_URL` | DB connection string |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `NEXTAUTH_SECRET` | JWT sign করার secret |
| `NEXTAUTH_URL` | App-এর URL (production এ লাগে) |
| `EMAIL_SERVER_HOST/PORT/USER/PASSWORD`, `EMAIL_FROM` | Email config (`PASSWORD` এ Resend API key ব্যবহার হচ্ছে) |

---

## 10. Run করার নিয়ম

```bash
npm install
# .env তৈরি করো (উপরের variable গুলো)
npm run dev        # prisma generate + next dev  → http://localhost:3000
npm run build      # production build
npm run email      # email template preview (react-email)
```

---

## 11. 🔑 শেখার মূল Concept গুলো (Interview-এও কাজে লাগবে)

1. **App Router, Server vs Client Component** — `"use client"` কখন লাগে (hooks/onClick থাকলে)।
2. **Route Handlers** (`route.ts`) — Next.js-এ backend API।
3. **Dynamic routes** — `[username]`, `[messageid]`, catch-all `[...nextauth]`।
4. **NextAuth** — Providers, Adapter, Callbacks, JWT vs Database session।
5. **Prisma** — schema → model → `findUnique/findFirst/findMany/create/update/delete`, relations।
6. **Middleware** — request আসার আগেই redirect/protect।
7. **Zod + React Hook Form** — type-safe form validation।
8. **Optimistic UI** — server response না আসা পর্যন্ত অপেক্ষা না করে state update।
9. **Prisma singleton** ([lib/prisma.ts](lib/prisma.ts)) — dev mode এ hot reload এ বারবার নতুন connection খোলা আটকাতে।

---

## 12. ⚠️ প্রজেক্টে যে সমস্যা/উন্নতির জায়গা আছে (Code review)

শেখার জন্য এগুলো জানা খুব দরকার — এগুলো ঠিক করলে প্রজেক্ট অনেক professional হবে।

### 🔴 Security

1. **Delete-এ ownership check নেই** — [delete-message/route.ts](app/api/delete-message/[messageid]/route.ts)
   যেকোনো logged-in user যেকোনো message ID দিয়ে অন্যের message delete করতে পারবে।
   Fix: `where: { id, userId: session.user.id }` অথবা আগে find করে owner চেক।

2. **Username matching ভুল** — [send-message/route.ts](app/api/send-message/route.ts)
   `name: { startsWith: username }` → "Di" লিখলে "Dipongkor" এর user পেয়ে যাবে। আবার ২ জনের প্রথম নাম এক হলে (দুজন "Rahim") ভুল মানুষের কাছে message যেতে পারে।
   Fix: আলাদা unique `username` field রাখো; exact match করো।

3. **Message length server-এ validate হয় না** — Zod validation শুধু frontend-এ। API তে সরাসরি request পাঠিয়ে bypass করা যায়। API তেও `messageSchema.parse()` করো।

4. **Spam protection নেই** — public endpoint এ rate limiting নেই।

### 🟠 Bug / Logic

5. **Message ID type mismatch** — Prisma তে `Int`, কিন্তু [Types/ApiResponse.ts](Types/ApiResponse.ts) এ `string`। কাজ করছে কারণ URL এ string আকারে যায়, তবে type ভুল।

6. **Empty message হলে 404** — [get-messages](app/api/get-messages/route.ts) message না থাকলে 404 + `success:false` দেয়, ফলে Dashboard-এ নতুন user-এর কাছে "Error" toast দেখায়। খালি array `200` দিয়ে return করা উচিত।

7. **Error হলেও HTTP 200** — send-message ও delete-message এ error হলেও status 200 যায়, তাই frontend-এর `catch` ব্লক চলে না, `toast` এ success ভাবে দেখাতে পারে। সঠিক status code (`400/403/404/500`) দাও।

8. **Dashboard-এর `key={index}`** — `key={message.id}` হওয়া উচিত।

9. **Dashboard-এর link** `name.split(' ')[0]` — নামে space/special char থাকলে URL সমস্যা, আর (২) নং সমস্যার সাথে সম্পর্কিত।

### 🟡 Code Quality

10. **PrismaClient বারবার তৈরি** — `accept-messages`, `delete-message`, `get-messages`, `send-message` সব জায়গায় `new PrismaClient()`। অথচ [lib/prisma.ts](lib/prisma.ts) আছে → সেটা import করো। (Serverless এ connection exhaust হতে পারে)

11. **Duplicate SessionProvider** — [app/context/AuthProvider.tsx](app/context/AuthProvider.tsx) ও [components/provider/provider.tsx](components/provider/provider.tsx) একই কাজ করে। একটা রাখো।

12. **Dead/unused code** — `components/ui/input copy.tsx`, sign-in modal এ `signInClicke` state (কখনো true হয় না), `Provider` এ `any` type, `parseInt` এর unreachable check।

13. **Email template এ path ভুল** — `src='/public/logo.png'` email client এ কাজ করবে না; full public URL (`https://domain/logo.png`) দিতে হবে। আবার `baseUrl` এ `https://` prefix জোর করে বসানো।

14. **`from: onboarding@resend.dev`** — Resend এর test sender, শুধু নিজের email এ পাঠাতে পারে। অন্যদের কাছে পাঠাতে নিজের domain verify করতে হবে।

15. **middleware.ts এ দুইবার middleware export** — `export { default } from "next-auth/middleware"` এবং আলাদা `middleware` function — গোলমাল তৈরি করতে পারে। একটাই রাখো।

16. **`metadataBase: localhost`** — production এ আসল domain দাও (SEO/OG image এর জন্য)।

17. **`vercel.json` এর catch-all rewrite `/(.*) → /`** — Next.js এ সাধারণত দরকার হয় না এবং অন্য route (যেমন `/dashboard`) ভাঙতে পারে। Vercel Next.js নিজেই handle করে।

18. **`package.json` এর name `"precedent"`** — template থেকে আসা, `silentnote` করো।

---

## 13. 🚀 পরবর্তী Feature আইডিয়া (practice করার জন্য)

- আলাদা unique `username` সহ onboarding
- Rate limiting (Upstash Redis) / Captcha
- Message-এ "read/unread" mark, pagination
- Delete এ ownership check + unit test
- Zod দিয়ে সব API-র input validation
- Dark mode, message share as image
- Replace Axios → `fetch` / TanStack Query (caching, auto refetch)

---

## 14. ✅ নিজেকে যাচাই করো (Self-quiz)

1. `[...nextauth]` কেন catch-all? → NextAuth `/api/auth/signin`, `/callback/google`, `/session` সব এক handler-এ চালায়।
2. JWT strategy তে `Session` table কেন লাগছে না?
3. `jwt()` আর `session()` callback এর পার্থক্য কী?
4. Server Component আর Client Component এর পার্থক্য কী? `nav.tsx` কেন server, `navbar.tsx` কেন client?
5. Anonymous message পাঠাতে login লাগে না — তাহলে `/api/send-message` কীভাবে সঠিক user খোঁজে?
6. Middleware আর API-র ভিতরে `getServerSession` check — দুটোর দরকার কেন?
7. কেন `lib/prisma.ts` এ `global.prisma` ব্যবহার হয়?
8. Optimistic UI কী? এই প্রজেক্টে কোথায় আছে?
9. কোন কোন security hole আছে (সেকশন ১২)?

---

*Happy Learning! 🎉*
