# Sahil Jangra · KRYZO

KRYZO is the portfolio of Sahil Jangra, a frontend web developer based in Hisar, Haryana, India. The site presents selected projects, skills, experience, education, contact options and practical frontend development content.

The production site is [kryzo.space](https://www.kryzo.space/).

## Features

- Responsive portfolio homepage with dark and light themes.
- Interactive project gallery with filtering and project details.
- Semantic SEO metadata and canonical URLs.
- `ProfilePage`, `Person` and `WebSite` JSON-LD structured data.
- Dedicated crawlable pages for the biography, projects, resume, services and articles.
- XML sitemap and `robots.txt` for search-engine discovery.
- Contact form, email contact and WhatsApp enquiry link.

## Site structure

```text
/
├── index.html                         Homepage and entity hub
├── about/sahil-jangra/                 Biography and Person profile
├── projects/                           Project index
│   └── gg-mouse-pro/                   Project case study
├── resume/                             Resume landing page
├── services/web-development-hisar/    Local web-development services
├── articles/                           Frontend article index
├── images/                             Profile and project images
├── SahilJangraResume.pdf               Downloadable resume
├── styles.css                          Homepage custom styles
├── content-pages.css                   Supporting-page styles
├── script.js                           Homepage interactions
├── robots.txt                          Crawler access rules
└── sitemap.xml                         Canonical URL sitemap
```

## Technology

- HTML5 and semantic document structure
- Tailwind CSS utilities with custom CSS
- Vanilla JavaScript
- Font Awesome icons
- Google Fonts
- Schema.org JSON-LD structured data

## Run locally

This is a static site and does not require a build step.

1. Clone the repository.

   ```bash
   git clone https://github.com/KRYZO-MINE/KRYZO.git
   cd KRYZO
   ```

2. Serve the directory with a local static server. For example:

   ```bash
   npx serve .
   ```

3. Open the local URL shown by the server. A local server is recommended because the supporting pages use root-relative paths such as `/projects/` and `/content-pages.css`.

## SEO deployment notes

- Keep `https://www.kryzo.space/` as the canonical production domain.
- Submit `https://www.kryzo.space/sitemap.xml` in Google Search Console.
- Configure permanent redirects from any controlled duplicate Vercel portfolio domains to the matching KRYZO URLs.
- Keep external identity links limited to profiles that belong to Sahil Jangra and are verified before adding them to `sameAs`.

## Contact

- Email: [sahiljangra5556@gmail.com](mailto:sahiljangra5556@gmail.com)
- Location: Hisar, Haryana, India
- GitHub: [github.com/KRYZO-MINE](https://github.com/KRYZO-MINE)
- Instagram: [instagram.com/brokedplayer](https://instagram.com/brokedplayer)
- YouTube: [youtube.com/@ggteamindia](https://youtube.com/@ggteamindia)
