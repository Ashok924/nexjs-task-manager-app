# ✅ Task Manager — Next.js Full-Stack App

A modern, full-stack **Task Management** application with authentication, real-time optimistic UI updates, Postgres persistence, and a clean accessible interface.

---

## 🚀 Live Features

| Feature | Details |
|---|---|
| 🔐 **Authentication** | Email/password sign-in & sign-up via Neon Auth (Better Auth) |
| 📝 **Task CRUD** | Create, Read, Update, Delete tasks with full form validation |
| ⚡ **Optimistic UI** | Instant UI updates on mutations; auto-reverts on server error |
| 🔍 **Debounced Search** | Searches task titles client-side with a debounced query hook |
| 📄 **Pagination** | Configurable rows-per-page (10/50/100/150/200) |
| 🗄️ **Postgres Database** | Persistent data via Neon serverless PostgreSQL + Prisma ORM |
| 💬 **Toast Notifications** | Success/error feedback via Sonner toasts |
| 🛑 **Error Boundaries** | Global React Error Boundary with fallback UI |
| ♿ **Accessibility** | Radix UI Dialog & Alert Dialog primitives (ARIA, focus trap, ESC key) |
| 📱 **Responsive** | Fully responsive layout using Tailwind CSS v4 |

---

## 🛠️ Tech Stack

### Core Framework
| Package | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x (Turbopack) | Full-stack React framework (App Router) |
| **React** | 19.x | UI rendering |
| **TypeScript** | 5.x | Type safety across the entire codebase |

### Database & ORM
| Package | Version | Purpose |
|---|---|---|
| **Prisma** | 5.x | Type-safe ORM for PostgreSQL |
| **@prisma/client** | 5.x | Auto-generated database client |
| **Neon** | Cloud | Serverless PostgreSQL database (pooled connection) |

### Authentication
| Package | Version | Purpose |
|---|---|---|
| **@neondatabase/auth** | 0.2.0-beta | Full-stack auth SDK (Better Auth under the hood) |

### State Management & Data Fetching
| Package | Version | Purpose |
|---|---|---|
| **@tanstack/react-query** | 5.x | Server state, caching, optimistic mutations |

### UI & Styling
| Package | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **@radix-ui/react-dialog** | 1.x | Accessible modal dialog primitive |
| **@radix-ui/react-alert-dialog** | 1.x | Accessible confirmation dialog primitive |
| **Sonner** | 2.x | Toast notification library |
| **react-error-boundary** | 6.x | React Error Boundary wrapper |

### Validation
| Package | Version | Purpose |
|---|---|---|
| **Zod** | 4.x | Runtime schema validation for API payloads |

---

## 📁 Project Structure

```
task-manager-nextjs-app/
│
├── app/
│   ├── layout.tsx                  # Root layout — NeonAuthUIProvider wrapper
│   ├── page.tsx                    # Home page — fetches tasks from DB (Server Component)
│   ├── globals.css                 # Global Tailwind + Neon Auth UI styles
│   ├── providers.tsx               # React Query (TanStack) provider
│   ├── loading.tsx                 # Full-page loading skeleton
│   │
│   ├── auth/
│   │   ├── layout.tsx              # Auth layout — full-screen centered (no app shell)
│   │   └── [path]/page.tsx         # Dynamic auth view: /auth/sign-in, /auth/sign-up
│   │
│   ├── account/
│   │   └── [path]/page.tsx         # Account views: /account/settings, /account/security
│   │
│   ├── tasks/
│   │   └── [id]/page.tsx           # Task detail page — fetches single task from DB
│   │
│   ├── api/
│   │   ├── auth/[...path]/route.ts # Neon Auth proxy API handler
│   │   └── tasks/
│   │       ├── route.ts            # GET (list + search) | POST (create) tasks
│   │       └── [id]/route.ts       # GET | PUT (update) | DELETE a task by ID
│   │
│   ├── components/
│   │   ├── TaskManager.tsx         # Main task list + CRUD UI (Client Component)
│   │   └── ui/
│   │       ├── AppShell.tsx        # App shell — header (UserButton) + footer wrapper
│   │       ├── AddTaskModal.tsx    # Radix Dialog — add/edit task form with validation
│   │       ├── DeleteTaskAlert.tsx # Radix AlertDialog — delete confirmation with loading
│   │       └── GlobalErrorFallback.tsx  # Error Boundary fallback UI
│   │
│   ├── hooks/
│   │   └── useDebounce.ts          # Generic debounce hook (used for search input)
│   │
│   ├── lib/
│   │   ├── prisma.ts               # Prisma singleton client (prevents hot-reload leaks)
│   │   └── auth/
│   │       ├── server.ts           # Neon Auth server instance (getSession, middleware)
│   │       └── client.ts           # Neon Auth browser client (for React components)
│   │
│   └── utils/
│       ├── types.ts                # TypeScript types: Task, JSONPlaceholderTodo
│       ├── validations.ts          # Zod schemas: taskSchema, updateTaskSchema
│       └── constants.ts            # Shared app constants
│
├── prisma/
│   └── schema.prisma               # Database schema — Task model definition
│
├── middleware.ts                   # Edge middleware — protects /, /tasks/*, /account/*
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
└── .env                            # Environment variables (not committed to Git)
```

---

## 🗃️ Database Schema

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("todo")    // "todo" | "in_progress" | "done"
  priority    String   @default("medium")  // "low" | "medium" | "high"
  dueDate     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔐 Authentication Flow

1. **Unauthenticated** user visits `/` → Edge middleware intercepts → Redirected to `/auth/sign-in`.
2. User signs in or registers via the Neon Auth UI (`AuthView` component).
3. Auth session stored securely in **encrypted HTTP cookies** (using `NEON_AUTH_COOKIE_SECRET`).
4. On success, user is redirected back to `/` (task dashboard).
5. `UserButton` in the app header allows viewing account settings or signing out.

Protected routes (via `middleware.ts` matchers):
- `/` — Task dashboard
- `/tasks/*` — Task detail pages
- `/account/*` — User account management

---

## ⚙️ API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks (supports `?q=` search query) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/[id]` | Get a single task by ID |
| `PUT` | `/api/tasks/[id]` | Update a task by ID |
| `DELETE` | `/api/tasks/[id]` | Delete a task by ID |

All mutation endpoints validate the request body using **Zod** schemas before touching the database.

---

## ⚡ Optimistic UI Updates

The app uses **TanStack React Query** mutations for instant UI feedback:

- On **create**: A temporary task (with `id: Date.now()`) is prepended to the list immediately.
- On **update**: The task is updated in the cache instantly before the server responds.
- On **delete**: The task is removed from the cache instantly.
- On **error**: The cache is rolled back to its previous state, and a toast error is shown.
- On **settle**: The query cache is invalidated and refreshed from the server.

---

## 🧰 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A **Neon** account at [neon.tech](https://neon.tech) (free tier available)

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/nexjs-task-manager-app.git
cd nexjs-task-manager-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# ─── Neon PostgreSQL Database ────────────────────────────────────────
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require&channel_binding=require"

# ─── Neon Authentication ─────────────────────────────────────────────
# Get this from: Neon Console → Your Project → Branch → Auth → Configuration
NEON_AUTH_BASE_URL="https://<your-endpoint>.neonauth.<region>.aws.neon.tech/<dbname>/auth"

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEON_AUTH_COOKIE_SECRET="your-secure-random-secret-at-least-32-characters"
```

> **Where to find these values:**
> - `DATABASE_URL`: Neon Console → Your Project → **Connection Details** → Connection String
> - `NEON_AUTH_BASE_URL`: Neon Console → Your Project → Branch → **Auth** → Configuration tab
> - `NEON_AUTH_COOKIE_SECRET`: Generate securely using the command above

### 4. Push the Database Schema

```bash
npx prisma db push
```

This will create the `Task` table in your Neon database.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the sign-in page on first load.

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the project |
| `npx prisma db push` | Sync Prisma schema to the database |
| `npx prisma studio` | Open the Prisma database browser UI |

---

## 🌐 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | Neon PostgreSQL connection string |
| `NEON_AUTH_BASE_URL` | ✅ Yes | Neon Auth endpoint URL from Console |
| `NEON_AUTH_COOKIE_SECRET` | ✅ Yes | A cryptographically secure random secret (min 32 chars) |

---

## 🔒 Security Notes

- **Never commit `.env`** to version control — it is listed in `.gitignore`.
- The database connection uses **SSL** (`sslmode=require`) and **channel binding** for additional security.
- Auth session cookies are **encrypted** using `NEON_AUTH_COOKIE_SECRET`.
- All API routes validate input via **Zod** before executing database operations.

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/) — The React Framework
- [Neon](https://neon.tech/) — Serverless Postgres & Auth
- [Prisma](https://www.prisma.io/) — Next-generation Node.js ORM
- [TanStack Query](https://tanstack.com/query) — Powerful async state management
- [Radix UI](https://www.radix-ui.com/) — Unstyled accessible components
- [Sonner](https://sonner.emilkowal.ski/) — Beautiful toast notifications
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
