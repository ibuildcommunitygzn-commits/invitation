# Invitation App

One page. Guests fill in their name and phone number to RSVP, get a thank-you text right
away, and a small "Admin" link at the bottom lets you sign in and download everyone who's
registered as a PDF.

## How it works

- **`public/index.html`** is the whole front end — the RSVP form, the thank-you state, and
  the hidden admin panel, all in one file.
- Submitting the form saves the entry and sends a thank-you SMS through **mNotify**.
- Clicking **Admin** at the bottom reveals a username/password login. Once signed in, you see
  the total registered and a **Download PDF** button.
- Data lives in a local SQLite file (`data/invitations.db`) — no external database needed.

## 1. Install

```bash
npm install
```

## 2. Configure

A `.env` file is already included with your admin username and password filled in
(`ibuildcommunity-eben` / the password you gave me). You still need to fill in:

| Variable | What it is |
|---|---|
| `BASE_URL` | The public URL this will run at once deployed. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Already set — change these if you want different credentials before going live. |
| `SESSION_SECRET` | Random string that signs the admin login session. Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MNOTIFY_API_KEY` | Your API key from [app.bms.africa](https://app.bms.africa) (Developer section). |
| `MNOTIFY_SENDER_ID` | Your approved Sender ID (max 11 characters) — texts appear to come from this name. |
| `EVENT_NAME` | Used in the thank-you text, e.g. "Sarah & Tom's Wedding". Also edit the headline text directly inside `public/index.html` (`<h1>Our Gathering</h1>`) to match. |

**`.env` is git-ignored on purpose** — it holds real credentials and should never be pushed to
GitHub. When you deploy, you'll re-enter these same values as environment variables in your
host's dashboard instead (see below).

## 3. Run it

```bash
npm start
```

Visit `http://localhost:3000` to see the RSVP page. Click **Admin** at the bottom to sign in
and download the PDF.

## 4. Push to GitHub, deploy on a Node host

GitHub itself only serves static files, so it can't run this server or talk to mNotify
directly — you still need a Node host (Render, Railway, Fly.io, etc.) that deploys **from**
your GitHub repo.

1. `git init && git add . && git commit -m "Initial commit"` — your `.gitignore` already keeps
   `.env`, `node_modules`, and the local database out of the repo.
2. Create an empty repo on GitHub (skip the auto-generated README to avoid a merge conflict),
   then `git remote add origin <your-repo-url>`, `git branch -M main`, `git push -u origin main`.
3. On your Node host, choose "Deploy from GitHub" and pick this repo. Build command:
   `npm install`. Start command: `npm start`.
4. In the host's dashboard, add the same environment variables from `.env`
   (`BASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `MNOTIFY_API_KEY`,
   `MNOTIFY_SENDER_ID`, `EVENT_NAME`). Set `BASE_URL` to your real deployed URL.
5. Mount a persistent disk at `data/` in your host's settings, so `invitations.db` survives
   redeploys — otherwise every push wipes the guest list.

## Notes

- Phone numbers are normalized for mNotify's expected local Ghanaian format
  (`+233...` → `0...`). If you'll have guests registering from outside Ghana, double check
  mNotify's docs for that route's expected format.
- Sessions are stored in memory, which is fine for a single server instance.
- There's one shared admin login. If you want more than one admin with separate credentials
  later, say the word and I'll add that.
