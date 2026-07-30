# Portfolio — Lika Ninidze

My personal portfolio: a hospitality and reservations professional who's also building web development skills.

🔗 **Live site:** _add your link here_
📂 **Source code:** https://github.com/likunanin/Portfolio

## About this repo

This repo contains a full-stack version of my portfolio site, with a small admin panel for editing the content (experience, skills, education, etc.) without touching code.

All the actual project files live in the [`portfolio-app/`](./portfolio-app) folder:

- `portfolio-app/server/` — Node.js/Express backend
- `portfolio-app/public/` — the public-facing site
- `portfolio-app/admin/` — password-protected admin panel
- `portfolio-app/data/content.json` — all site content
- `portfolio-app/README.md` — full setup and usage instructions

## Quick start

```bash
cd portfolio-app
npm install
cp .env.example .env   # then set ADMIN_PASSWORD and SESSION_SECRET
npm start
```

See `portfolio-app/README.md` for full details on running it and using the admin panel.

## About me

Hospitality and reservations professional based in Tbilisi/Batumi, Georgia — experience in operations, tourism, guest services, and front desk management. Completed courses in Graphic Design, HTML/CSS, JavaScript, and React, and currently learning Python on my own.

## Contact

- Email: likaninidze2002@hotmail.com
- Phone: +995 557 721 007

Any Node host works (Render, Railway, a small VPS, etc.). Just make sure to:
- Set `ADMIN_PASSWORD` and `SESSION_SECRET` as environment variables on the host.
- Keep `data/content.json` on persistent storage — if your host's filesystem
  resets on every deploy, your edits will be lost. For that case, consider
  moving `contentStore.js` to a database instead.
