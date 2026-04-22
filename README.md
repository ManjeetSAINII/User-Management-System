
# User-Management-System
A lightweight, JavaScript-powered user management system for seamless user authentication, registration, and profile management. Features include secure login, role-based access control, and a responsive UI. Ideal for web developers or learning JavaScript-based backend systems. Contributions and feedback welcome!

Features:-

User Registration & Login: Secure account creation and authentication with password hashing.
Role-Based Access Control: Assign roles (e.g., admin, user) to manage permissions.
Profile Management: Users can update their profiles (e.g., name, email).
Responsive UI: Clean and user-friendly interface for web browsers.
RESTful API: Backend endpoints for seamless integration with frontend or other services.
Local Storage/Session Management: Persist user sessions securely in the browser.

Technologies Used:-

JavaScript: Core language for both frontend and backend logic.
Node.js (optional, if applicable): Backend runtime for API and server logic.
Express.js (optional, if applicable): Framework for building RESTful APIs.
HTML/CSS: For the frontend user interface.
Local Storage: For client-side data persistence.

Installation:-

Clone the Repository:
git clone https://github.com/ManjeetSAINII/user-management-system.git
cd user-management-system
Install Dependencies (if using Node.js):
npm install
Run the Application:

For frontend, open index.html in a browser or use a local server (e.g., npx http-server).

Usage
Start the Server (if using Node.js):
npm start

Access the Application:


Open http://localhost:3000 (or your configured port) in a browser.
Register a new user or log in with existing credentials.
Admins can manage users via the /admin route (if implemented).


API Endpoints (if applicable):-
POST /api/register: Create a new user.
POST /api/login: Authenticate a user.
GET /api/users: Retrieve user data (admin only).

Contributing:-
Contributions are welcome! To contribute:


Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

Please follow the Code of Conduct and ensure your code adheres to the project's style guidelines.
=======
# UserManagement

A production-grade full-stack user management system built with Next.js 16, TypeScript, Prisma 7, and SQLite. Features authentication, role-based access control, audit logging, and a full admin UI.

---

## Features

- **Authentication** — JWT-based login with httpOnly cookies (7-day sessions)
- **Role-Based Access Control** — ADMIN / MANAGER / USER roles with enforced permissions
- **User Management** — Create, read, update, delete users with search, filter, sort, and pagination
- **Audit Logging** — Every action (CREATE, UPDATE, DELETE, LOGIN) recorded with actor and timestamp
- **Profile Management** — Users can edit their own name, email, mobile, and password
- **Dashboard** — Stats overview with recent users and activity feed
- **Responsive UI** — Clean dark-mode-ready interface built with Tailwind CSS v4

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via libSQL |
| ORM | Prisma 7 (adapter pattern) |
| Auth | JWT (jose) + bcryptjs |
| Validation | Zod + React Hook Form |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ManjeetSAINII/User-Management-System
cd usermanagement

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-change-this-in-production"
```

### Database Setup

```bash
# Run migrations to create the database schema
npx prisma migrate dev

# Seed the database with demo users
npm run db:seed
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | user123 |
| User | alice@example.com | user123 |

---

## Project Structure

```
usermanagement/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST /api/auth/login
│   │   │   ├── logout/route.ts      # POST /api/auth/logout
│   │   │   └── me/route.ts          # GET  /api/auth/me
│   │   ├── users/
│   │   │   ├── route.ts             # GET (list) + POST (create)
│   │   │   └── [id]/route.ts        # GET, PATCH, DELETE by ID
│   │   ├── stats/route.ts           # GET dashboard stats
│   │   └── audit/route.ts           # GET audit logs (admin only)
│   ├── login/page.tsx               # Login page
│   ├── dashboard/page.tsx           # Dashboard with stats
│   ├── users/page.tsx               # User table with CRUD
│   ├── profile/page.tsx             # Edit own profile
│   ├── audit-log/page.tsx           # Audit log viewer
│   └── generated/prisma/            # Prisma generated client
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       └── StatCard.tsx
├── lib/
│   ├── db.ts                        # Prisma client singleton
│   ├── auth.ts                      # JWT + cookie utilities
│   └── validations.ts               # Zod schemas
├── prisma/
│   ├── schema.prisma                # Database schema
│   ├── seed.ts                      # Demo data seeder
│   └── migrations/                  # Migration history
├── middleware.ts                    # Route protection + header injection
├── prisma.config.ts                 # Prisma 7 config (database URL)
└── .env                             # Environment variables
```

---

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, sets auth cookie |
| POST | `/api/auth/logout` | Any | Clears auth cookie |
| GET | `/api/auth/me` | Any | Returns current user |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Any | List users (search, filter, sort, paginate) |
| POST | `/api/users` | ADMIN | Create new user |
| GET | `/api/users/:id` | ADMIN or own | Get user by ID |
| PATCH | `/api/users/:id` | ADMIN or own | Update user |
| DELETE | `/api/users/:id` | ADMIN | Delete user |

### Other

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/stats` | Any | Dashboard statistics |
| GET | `/api/audit` | ADMIN | Paginated audit logs |

#### Query parameters for `GET /api/users`

| Param | Type | Description |
|---|---|---|
| search | string | Filter by name or email |
| role | string | Filter by role (ADMIN/MANAGER/USER) |
| status | string | Filter by status (ACTIVE/INACTIVE/SUSPENDED) |
| sortBy | string | Field to sort by (name/email/role/createdAt) |
| sortOrder | string | asc or desc |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

---

## Role Permissions

| Action | ADMIN | MANAGER | USER |
|---|---|---|---|
| View all users | Yes | Yes | No |
| Create users | Yes | No | No |
| Edit any user | Yes | No | No |
| Edit own profile | Yes | Yes | Yes |
| Delete users | Yes | No | No |
| View audit log | Yes | No | No |
| Change user roles | Yes | No | No |

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:seed      # Seed database with demo users
npx prisma studio    # Open Prisma visual database browser
npx prisma migrate dev --name <name>   # Create a new migration
```

---

## Deploying to Vercel

Live login URL:

[https://user-management-system-9aynd048h-sainis-projects-970a1e11.vercel.app/login](https://user-management-system-9aynd048h-sainis-projects-970a1e11.vercel.app/login)

> **Important:** SQLite does not work on Vercel. Vercel runs serverless functions with no persistent filesystem — your `dev.db` file will not survive between requests.

### Step 1 — Migrate to Turso (free, 1-minute setup)

[Turso](https://turso.tech) is a hosted libSQL database (same protocol as your current SQLite). No code changes needed in Prisma — only the URL changes.

```bash
# Install Turso CLI
npm install -g @turso/cli

# Login and create a database
turso auth login
turso db create usermanagement

# Get your credentials
turso db show usermanagement --url     # → libsql://...
turso db tokens create usermanagement  # → your auth token
```

### Step 2 — Update your environment variables on Vercel

In your Vercel project dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=libsql://usermanagement-manjeetsainii.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=your-token-here
JWT_SECRET=your-production-secret
```

`NEXTAUTH_URL` is not required because this project uses custom JWT auth with an httpOnly cookie, not NextAuth/Auth.js.

After editing environment variables, redeploy the Vercel project so the serverless functions receive the new values.

### Step 3 — Update lib/db.ts for Turso

```typescript
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma || new PrismaClient({ adapter } as never);
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### Step 4 — Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect your GitHub repo at vercel.com and it auto-deploys on push
```

### Step 5 — Run migrations on production

```bash
DATABASE_URL="libsql://..." npx prisma migrate deploy
```

---

## Local Development with Prisma Studio

To visually browse and edit your database:

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555).
