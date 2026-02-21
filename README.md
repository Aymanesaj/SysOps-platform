# Heimdall SysOps Platform

A full-stack **Next.js App Router** platform for DevOps training, built to feel like a practical engineering command center.

Heimdall helps members:
- authenticate with GitHub,
- browse sessions and assignments,
- generate repositories from templates,
- and submit repository links for review.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Philosophy](#project-philosophy)
- [Project Structure](#project-structure)
- [Core Product Flows](#core-product-flows)
  - [1) Authentication](#1-authentication)
  - [2) Dashboard Experience](#2-dashboard-experience)
  - [3) Assignment Mission Control](#3-assignment-mission-control)
  - [4) Repository Workflow](#4-repository-workflow)
- [Database Schema (Prisma)](#database-schema-prisma)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker & Compose](#docker--compose)
- [CI Pipeline](#ci-pipeline)
- [Makefile Notes](#makefile-notes)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: NextAuth/Auth.js (GitHub OAuth)
- **Animation/UI Extras**: framer-motion, lucide-react

---

## Project Philosophy

- **Learn by building**: every feature represents real DevOps tasks.
- **Clean architecture**: minimal abstractions, clear boundaries.
- **No overengineering**: practical implementation with production-minded defaults.

---

## Project Structure

```text
src/
 ├── app/            # Routes/pages + API handlers
 ├── components/     # Reusable UI components
 ├── lib/            # Integrations/utilities (auth, prisma, github)
 ├── server/         # Server-side business logic
 ├── types/          # Shared TS type declarations
prisma/
 └── schema.prisma   # Prisma data model
```

---

## Core Product Flows

### 1) Authentication

- Uses GitHub OAuth via NextAuth.
- Auth config is centralized in `src/lib/auth.ts`.
- Route handlers are exported from:
  - `src/app/api/auth/[...nextauth]/route.ts`

At runtime:
1. user clicks sign-in,
2. GitHub OAuth completes,
3. JWT/session callbacks enrich the session,
4. authenticated pages consume the session.

### 2) Dashboard Experience

`/dashboard` shows:
- key member stats,
- workshop cards with progress,
- launch actions into assignments.

This view is intended as the daily command center for members.

### 3) Assignment Mission Control

`/assignments/[assignmentId]` provides:
- mission-style instructions,
- deadline + status metadata,
- template repository link,
- action module for repo generation and submission.

### 4) Repository Workflow

`AssignmentActions` enables two user actions:
1. **Generate Repo** (from GitHub template)
2. **Link Repo** (submit repository URL)

A mini terminal panel shows feedback states (info/success/error) to make long-running actions transparent.

---

## Database Schema (Prisma)

Defined in `prisma/schema.prisma`.

Main models:
- `User`
- `Session`
- `Assignment`
- `Submission`

Key constraints:
- one submission per `(assignmentId, userId)` pair,
- relational links from sessions -> assignments -> submissions,
- submission status lifecycle enum.

---

## API Endpoints

### Auth
- `GET/POST /api/auth/[...nextauth]`

### Submissions
- `POST /api/submissions`
  - validates payload,
  - validates GitHub repo URL format,
  - upserts member + submission.

### Repository Generation
- `POST /api/repositories/generate`
  - calls GitHub template generation endpoint,
  - returns generated repository metadata.

---

## Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/heimdall_sysops?schema=public"

AUTH_SECRET="replace-with-long-random-secret"
AUTH_GITHUB_ID="github-oauth-app-client-id"
AUTH_GITHUB_SECRET="github-oauth-app-client-secret"

# used by repo generation API
GITHUB_TEMPLATE_TOKEN="github-token-with-template-repo-permissions"
```

---

## Local Development

Install dependencies and run:

```bash
npm install
npx prisma generate
npm run dev
```

Open:
- `http://localhost:3000`

Useful scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
```

---

## Docker & Compose

### Dockerfile

The project includes a multi-stage production Dockerfile:
- installs deps,
- builds Next.js output,
- runs as non-root user,
- serves on port `3000`.

### docker-compose

`docker-compose.yml` orchestrates:
- `db` (`postgres:15-alpine`)
- `web` (Next.js app built from local Dockerfile)

Run:

```bash
docker compose up --build
```

---

## CI Pipeline

GitHub Actions workflow: `.github/workflows/ci.yml`

High-level order:
1. install dependencies,
2. generate Prisma client,
3. lint,
4. build.

The pipeline also includes cache usage and build-safe dummy env vars.

---

## Makefile Notes

I could not find a `Makefile` in this repository snapshot at the time this README was written.

If you have added one locally but it is not committed yet, commit it and this section can be updated with an exact target-by-target reference.

A typical Heimdall Makefile would usually include targets such as:
- `install`
- `dev`
- `build`
- `lint`
- `prisma-generate`
- `prisma-migrate`
- `docker-up`
- `docker-down`

---

## Troubleshooting

### `next: not found`
Dependencies are missing. Run:
```bash
npm install
```

### Prisma client errors during build
Generate Prisma client:
```bash
npx prisma generate
```

### OAuth login fails
Verify:
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `AUTH_SECRET`
- GitHub OAuth callback URL configuration.

### DB connection errors
Verify `DATABASE_URL` and PostgreSQL availability.

---

If you want, I can do a second pass and tailor this README to your exact Makefile once it is committed.
