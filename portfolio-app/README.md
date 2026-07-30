# Lika Ninidze — Portfolio (with admin panel)

A small full-stack app: an Express backend serving your portfolio content from
a JSON file, a public site that renders it, and a password-protected `/admin`
panel where you can edit everything — experience, skills, languages,
education, courses, contact info — without touching code.

## Project structure

```
portfolio-app/
├── server/            Express backend
│   ├── index.js        entry point
│   ├── contentStore.js reads/writes data/content.json
│   └── routes/
│       ├── auth.js      login/logout/status (session-based)
│       └── content.js   GET (public) + PUT (admin-only) content
├── data/
│   └── content.json    all portfolio content lives here
├── public/             the public-facing site
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js      fetches /api/content and renders the page
├── admin/               the admin panel
│   ├── index.html
│   ├── css/admin.css
│   └── js/admin.js
├── package.json
└── .env.example
```

## Setup

1. **Install dependencies** (requires internet access — this was built in an
   offline sandbox so it hasn't been run end-to-end yet, but it uses standard,
   well-known packages):

   ```bash
   cd portfolio-app
   npm install
   ```

2. **Create your `.env` file** from the example and set a real password:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env`:
   ```
   ADMIN_PASSWORD=pick-a-real-password
   SESSION_SECRET=some-long-random-string
   PORT=3000
   ```

   You can generate a good session secret with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Run it:**

   ```bash
   npm start
   ```

   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## How the admin panel works

- `/admin` shows a login screen. Enter the password from your `.env`.
- Once logged in, you get a dashboard with a section for every part of the
  site: Hero, About, Experience, Skills, Languages, Education, Courses, and
  Contact.
- Lists (experience, skills, languages, courses, paragraphs, stats) can have
  rows added or removed with the **+ Add** buttons and the small **Remove** /
  **×** buttons.
- **Save Changes** sends the whole content object to the backend, which
  overwrites `data/content.json`. The public site reads that same file, so
  changes appear immediately on refresh — no redeploy needed.
- Login is a signed, `httpOnly` session cookie, valid for 8 hours, so closing
  the tab doesn't require logging back in immediately.

## Notes on how it's built

- **No database.** Content lives in `data/content.json`. This keeps things
  simple for a single-person site — if you outgrow it later, swapping
  `contentStore.js` for a real database (SQLite, Postgres, etc.) only touches
  that one file.
- **Single admin user.** There's one password, stored in `.env`, never in
  the code or the JSON file. It's compared with `bcryptjs` rather than a
  plain string check.
- **Same design system.** The public site keeps the reservation-desk visual
  identity (ticket-style experience cards, the guest confirmation card in the
  hero) from the original static version — it's just data-driven now instead
  of hardcoded.

## Deploying

Any Node host works (Render, Railway, a small VPS, etc.). Just make sure to:
- Set `ADMIN_PASSWORD` and `SESSION_SECRET` as environment variables on the host.
- Keep `data/content.json` on persistent storage — if your host's filesystem
  resets on every deploy, your edits will be lost. For that case, consider
  moving `contentStore.js` to a database instead.
