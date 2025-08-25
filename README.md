# FastClear Portsmouth – Quote & Booking Site

A simple, fast Next.js website with an instant quote calculator and booking request form.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Create a free account at https://vercel.com and import this project (from a GitHub repo) or use **'Deploy' → 'Import'** and upload the folder.
2. After deploy, go to **Settings → Domains** and add your domain:
   - `fastclearportsmouth.co.uk`
   - Optional: add `www.fastclearportsmouth.co.uk` as well.
3. At your registrar, add DNS records exactly as Vercel shows (usually A @ → 76.76.21.21 and CNAME www → cname.vercel-dns.com).
4. Enable HTTPS (Vercel auto-provisions SSL).

## Email/Notifications (optional)

- Fastest: connect the booking form to Formspree or Formsubmit.
- Set the `FORMSPREE_ENDPOINT` value in `/pages/index.tsx` where indicated.
