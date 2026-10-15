# Expert Driving Centre — website

Plain HTML pages, one CSS file, one JS file. Nothing to install — open a page in
VS Code, change the words, save, refresh the browser.

## Folder

```
expert-driving-centre/
├── index.html        Home
├── about.html        About
├── packages.html     Packages & prices
├── contact.html      Contact details + enquiry form
├── 404.html          "Page not found"
│
├── css/
│   └── style.css     all the styling (colours at the top)
├── js/
│   └── main.js       menu, FAQ, animations, contact form — no need to edit
├── images/           logo, icons, share picture
│
├── robots.txt  sitemap.xml  site.webmanifest   (for Google / phones)
└── README.md
```

Everything you'd want to change — words, prices, phone number — is written
straight into the `.html` pages. Each page is split into clearly labelled
sections (`<!-- ====== HERO ====== -->`, `<!-- ====== FAQ ====== -->` …).

## Things that appear on more than one page

Because each page is self-contained, a few things are repeated. When you change
one of these, use **Find in files (Ctrl+Shift+F)** in VS Code to catch every copy:

| If you change…        | It's also in…                                                         |
|-----------------------|-----------------------------------------------------------------------|
| A price               | `packages.html`, `index.html` (3 cards + Google info at the top), `contact.html` dropdown |
| Phone number          | every page (header, footer, call bar) — search `0430 512 726` **and** `+61430512726` |
| Email                 | every page footer, `contact.html`, Google info in `index.html`        |
| Menu or footer links  | every page — the header and footer blocks are identical on all five    |
| Suburbs               | `index.html` and `contact.html` (chips + dropdown)                     |

"Save $…" badge = (hours × $65, plus $160 if car hire is included) − price.

## Before going live

1. **Domain** — the pages assume `https://www.expertdrivingcentre.com.au`. If yours is
   different, Find & Replace it across the folder (Ctrl+Shift+H).
2. **Test the form** once it's online — send yourself an enquiry. It goes to the email the
   Web3Forms key was made with (check spam the first time).
3. Check the lesson hours on `contact.html` and the GST line on `packages.html`.

## Publish on GitHub Pages (free)

1. Create a **public** repository, e.g. `expert-driving-centre`.
2. Upload the *contents* of this folder — `index.html` must be at the top level.
3. **Settings → Pages** → Source: *Deploy from a branch*, `main`, `/ (root)` → Save.
4. Live in a minute or two at `https://YOUR-USERNAME.github.io/expert-driving-centre/`.

Own domain: **Settings → Pages → Custom domain**, then at your registrar add `A` records
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `CNAME`
for `www` → `YOUR-USERNAME.github.io`. Tick **Enforce HTTPS** once offered.

## After launch
- Add the site to Google Search Console and submit `sitemap.xml`.
- Put the link on your Google Business Profile.
- Add a few real Google reviews to the home page — there's a template in a comment in `index.html`.
