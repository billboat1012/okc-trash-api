Perfect 👍 here’s a cleaned-up **README.md** tailored to your final setup (using Puppeteer’s bundled Chromium, no extra env vars).

---

# OKC Trash API

Fetch **trash, recycling, and bulky waste pickup dates** for Oklahoma City addresses by scraping the official “My Trash Day” map.

---

## 🚀 Run Locally

```bash
git clone https://github.com/YOURNAME/okc-trash-api.git
cd okc-trash-api
npm install
node server.mjs
```

Server runs at:
👉 `http://localhost:3000`

---

## 🛠️ Endpoints

### Health Check

```
GET /ping
```

Response:

```json
{ "status": "ok", "time": "2025-09-26T12:34:56.789Z" }
```

### Pickup Schedule

```
GET /api/pickups?address=13500 Stonedale dr
```

Example Response:

```json
{
  "address": "13500 STONEDALE DR",
  "trashDay": "Monday",
  "nextRecycle": ["Oct 06, 2025", "Oct 20, 2025", "Nov 03, 2025"],
  "nextBulky": ["Oct 06, 2025", "Nov 03, 2025", "Dec 01, 2025"]
}
```

---

## ☁️ Deploy on Render

This repo includes a **Dockerfile** so it’s ready for Render.

1. Push your repo to GitHub.
2. Go to [Render](https://render.com).
3. **New → Web Service → Connect Repo**.
4. Render will detect the `Dockerfile` automatically.
5. Choose:

   * **Branch**: `main`
   * **Plan**: Free
6. Click **Create Web Service**.

Render will:

* Build Docker image with Puppeteer + Chromium.
* Start server on port 3000.

When live, your API is available at:

```
https://<your-service>.onrender.com
```

Test it:

```
https://<your-service>.onrender.com/ping
https://<your-service>.onrender.com/api/pickups?address=13500 Stonedale dr
```

---

## ⚠️ Notes

* Puppeteer downloads its own Chromium automatically — **no env vars needed**.
* Free plan on Render may spin down between requests (cold start ~30s).
* If the OKC site changes, scraping selectors may need updating.

---

👉 Do you want me to also add a **section for debugging** (with a `DEBUG=true` env flag in code so you can print extra logs when Render misbehaves)?
