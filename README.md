# Guru Multi Services — Website

A complete, responsive multi-page website for a business offering five services:
**Plywood & Timber · Home Repairs · Carpentry & Wood Design · Car & Taxi Booking · Online Billing**

## What's included

```
Guru-Multi-Services/
├── index.html              → Home page (hero, about, why-us, services, stats,
│                              projects, gallery, testimonials, FAQ, booking,
│                              newsletter, contact + map, footer)
├── services/
│   ├── plywood.html        → Plywood & Timber service detail page
│   ├── repairs.html        → Home Repairs service detail page
│   ├── carpentry.html      → Carpentry & Wood Design service detail page
│   ├── taxi.html           → Car & Taxi Booking service detail page
│   └── billing.html        → Online Billing service detail page
├── css/
│   └── style.css           → All design tokens, layout & component styles
├── js/
│   └── script.js           → Preloader, navbar, animations, gallery, forms, etc.
└── README.md                → You are here
```

Every page uses **Bootstrap 5**, **Font Awesome 6** and **Google Fonts** (Playfair
Display, Poppins, Montserrat) loaded from CDN — no build step, no `npm install`.
Just open `index.html` in a browser, or deploy the folder as-is.

## Design system

| Token | Value |
|---|---|
| Dark | `#181818` |
| Wood (primary) | `#A67C52` |
| Wood Dark | `#7B4F28` |
| Gold (accent) | `#D4AF37` |
| Background | `#F9F9F9` |
| Display font | Playfair Display |
| Body font | Poppins |
| Nav / label font | Montserrat |

All values live as CSS variables at the top of `css/style.css` — change them once
and the whole site updates.

## Features already built

- Sticky, scroll-aware navbar with mobile menu
- Full-screen hero with stats bar
- About, "why choose us," services, stats/counters
- Before/after drag comparison slider
- Filterable image gallery with a working lightbox (click, arrows, Esc)
- Testimonials carousel (Bootstrap)
- Accordion FAQ
- Booking form + contact form + newsletter form, all with front-end validation
  and success/error messaging
- 5 individual service pages, each with sticky in-page nav, pricing table,
  benefits, gallery and FAQ
- WhatsApp floating button, back-to-top button, scroll progress bar
- Fully responsive from mobile to desktop
- Respects `prefers-reduced-motion`

## Things to replace before going live

1. **Images** — every image currently points to `https://picsum.photos/...`
   placeholders so the site works immediately. Swap the `src` attributes for
   your own photography (put files in an `/images` folder and update paths).
2. **Phone / email / address** — search for `+91 9441449690,9441448690`,
   `sridhar.sridhar42@gmail.com` and `Thotapalyam opposite to shivan temple ,chittoor, India` across the
   files and replace with your real details.
3. **Google Map embed** — in `index.html`, replace the `src` on the
   `<iframe>` in the Contact section with your actual location
   (Google Maps → Share → Embed a map).
4. **WhatsApp number** — update the `https://wa.me/919441448690` link in every
   file's floating WhatsApp button.
5. **Forms** — the booking, contact and newsletter forms currently show a
   success message on submit but don't send data anywhere. To actually receive
   submissions, connect them to a backend (see below).

## Connecting the forms to a backend

The simplest no-code options:
- **Formspree** or **Getform** — point the form's `action` to their endpoint,
  no server needed.
- **Firebase** — write submitted data to Firestore using the Firebase JS SDK.
- **Custom backend** — Node.js/Express or PHP endpoint that receives the POST
  and emails/stores the booking.

Look for the `handleFormSubmit()` function in `js/script.js` — that's the one
spot to edit to send data to your chosen backend instead of just showing a
success message.

## Deployment (free options)

**GitHub Pages**
1. Create a new GitHub repository and push this folder's contents.
2. Repo → Settings → Pages → set source to the `main` branch, root folder.
3. Your site is live at `https://<username>.github.io/<repo-name>/`.

**Netlify**
1. Go to [netlify.com](https://www.netlify.com) → "Add new site" → "Deploy manually".
2. Drag and drop this whole folder onto the upload area.
3. Netlify gives you a live URL instantly; add a custom domain under
   Site settings → Domain management.

**Vercel**
1. Go to [vercel.com](https://vercel.com) → "Add New Project".
2. Import from GitHub, or drag-and-drop the folder using the Vercel CLI
   (`vercel deploy`).

All three are free for a static site like this one.

## Next phases (optional)

- Connect a real backend (Node.js/Firebase) for bookings, so you get emails/
  SMS instead of just a browser message.
- Add an admin panel to manage bookings, gallery images and testimonials.
- Add online payments (Razorpay/Stripe) for advance booking payments.
- Add SEO: sitemap.xml, robots.txt, structured data (LocalBusiness schema).
