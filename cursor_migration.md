# Cursor migration: Lovable.dev → Local Dev

You asked for two things:

- **Run this project locally (step-by-step, beginner friendly)**
- **Disconnect/remove Lovable-specific dependencies** so it’s a normal local codebase

This document is written for someone who **does not code**. Follow it in order.

---

## Codebase overview (what you have)

### What this app is

- **Framework**: Vite + React + TypeScript
- **Routing / “app framework”**: TanStack Router + TanStack Start (file-based routes)
- **Styling**: Tailwind CSS (via Vite) + Radix UI components
- **Backend / database**: Supabase (`@supabase/supabase-js`)
- **Deployment target**: Cloudflare Workers (Wrangler config present)

### Important folders/files

- **`src/routes/`**: Your pages (each file is a route)
  - Example: `src/routes/index.tsx` is the home page
  - Example: `src/routes/admin.login.tsx` is `/admin/login`
- **`src/router.tsx`**: Router setup + default error page
- **`src/routeTree.gen.ts`**: Auto-generated route tree (do not edit)
- **`src/integrations/supabase/`**: Supabase clients + auth middleware
- **`vite.config.ts`**: Vite config (currently provided by Lovable)
- **`.env`**: Environment variables (Supabase URL/key are here)
- **`wrangler.jsonc`**: Cloudflare Workers config (deploy/runtime config)

### Lovable-specific dependency (what we’re removing)

Right now, your Vite config is:

- `vite.config.ts` imports `defineConfig` from `@lovable.dev/vite-tanstack-config`
- `package.json` contains `@lovable.dev/vite-tanstack-config`
- Your lockfile also includes `lovable-tagger`

This means the build/dev tooling is currently “wrapped” by Lovable’s config package.

---

## Before you start (very important)

### 1) Make a backup copy

1. Close Cursor
2. In File Explorer, copy the whole folder `therjmursalpodcast`
3. Paste it next to it as something like `therjmursalpodcast-backup`

### 2) Security note about `.env`

Your `.env` currently contains Supabase keys/URL. The “publishable/anon” key is *meant* to be public, but you should still treat `.env` as sensitive.

- **Do not** paste your `.env` contents into chats or screenshots.
- **Do not** commit `.env` to GitHub (it’s usually excluded, but double-check).

---

## Phase A — Get it running locally (fastest path)

This gets the site running on your computer using your existing Supabase project.

### Step A1) Install required software (Windows)

Install these once:

- **Node.js (LTS)**:
  - Open PowerShell as normal (not admin)
  - Run:

```bash
winget install OpenJS.NodeJS.LTS
```

- **Git**:

```bash
winget install Git.Git
```

Then **restart your PC** (this avoids PATH issues).

### Step A2) Open the project in Cursor

1. Open Cursor
2. File → Open Folder…
3. Select your folder: `therjmursalpodcast`

### Step A3) Install dependencies

1. Open Cursor’s terminal (Terminal panel)
2. Run:

```bash
npm install
```

Wait until it finishes.

### Step A4) Start the dev server

In the same terminal, run:

```bash
npm run dev
```

You should see a “Local:” URL (commonly `http://localhost:5173`).
Open it in your browser.

### If you get an error: “Cannot find module / missing file”

This repo appears to be **missing image assets** (example: `src/routes/index.tsx` imports `@/assets/rj-hero.jpg`, but there are no `.jpg/.png/.webp` files in the repo).

What to do:

1. In Cursor, press `Ctrl+Shift+F`
2. Search for `@/assets/`
3. For each missing import, do one of these:
   - Put the missing image into `src/assets/` with the exact filename, or
   - Replace the import with a public URL image, or
   - Remove that image usage temporarily

If you want, I can do the “make the app compile without missing assets” pass for you once you tell me what images you want to use.

---

## Phase B — Make Supabase work locally (choose 1 option)

Your app uses Supabase for:

- **Auth** (admin login uses `supabase.auth.signInWithPassword`)
- **Database** (admin role checks query `user_roles` table)

### Option B1 (recommended for beginners): keep using hosted Supabase

Do nothing extra. Your `.env` already has:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

This is enough for the **browser** Supabase client.

### Option B2 (more advanced): run Supabase locally on your computer

Only do this after Phase A works.

1. Install Docker Desktop
2. Install Supabase CLI (Windows)
   - Easiest path is Scoop (a Windows command-line installer):

```bash
powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -useb https://get.scoop.sh | iex"
scoop install supabase
```

If you don’t want Scoop, install the Supabase CLI using the official instructions instead (search: “Supabase CLI install Windows”).

3. From the project folder, run:

```bash
supabase start
```

4. Apply migrations (your repo has `supabase/migrations/*.sql`):

```bash
supabase db reset
```

5. Update `.env` to use the local Supabase URL and anon key printed by the CLI.

Notes:

- Some server-side code expects `SUPABASE_SERVICE_ROLE_KEY` for admin/server operations (`src/integrations/supabase/client.server.ts`).
- You currently **do not** have `SUPABASE_SERVICE_ROLE_KEY` in `.env`, so any feature that uses the server admin client would fail unless you add it.

---

## Phase C — Disconnect Lovable dependencies (the actual “migration”)

Do this only after Phase A is working, so you have a baseline.

### What we are changing

We will remove `@lovable.dev/vite-tanstack-config` and replace it with a normal Vite config that includes the needed plugins.

### Step C1) Remove Lovable package(s)

In the terminal:

```bash
npm uninstall @lovable.dev/vite-tanstack-config
```

Then remove the lock entry by regenerating `package-lock.json` automatically (npm will do this).

### Step C2) Replace `vite.config.ts`

Right now it’s:

- `import { defineConfig } from "@lovable.dev/vite-tanstack-config";`

We’ll replace it with standard Vite config using:

- `@vitejs/plugin-react`
- `vite-tsconfig-paths`
- `@tailwindcss/vite`
- TanStack Start/Router plugin(s) required by your app
- (Optional) Cloudflare/Vinxi related config, depending on your local target

Because Lovable’s config currently bundles several plugins and assumptions, this step is the one that can “break the build” if we miss one plugin.

### Step C3) Verify dev/build still work

Run:

```bash
npm run dev
```

Then:

```bash
npm run build
```

If both work, you are fully disconnected from Lovable’s build tooling.

---

## Phase D — Cloudflare deployment (optional, after migration)

You have `wrangler.jsonc` which points to:

- `"main": "@tanstack/react-start/server-entry"`

That’s a Cloudflare Workers entrypoint for TanStack Start.

If you want to deploy:

1. Install Wrangler
2. Authenticate with Cloudflare
3. Deploy using Wrangler commands

I’m not writing the full deployment guide here because your request was focused on **local dev + removing Lovable**. If you want it, I can add it.

---

## Quick “success checklist”

You’re done when:

- `npm install` succeeds
- `npm run dev` opens the site locally
- (Optional) Admin login works (requires Supabase tables + a user with admin role)
- `@lovable.dev/vite-tanstack-config` is removed and `vite.config.ts` is standard Vite config

