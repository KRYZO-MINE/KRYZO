/* =========================================================================
   KRYZO — Centralized Project Directory Data
   -------------------------------------------------------------------------
   This is the SINGLE SOURCE OF TRUTH for the /projects directory.
   UI code (projects.js) never hardcodes project information, so adding a
   future project only means editing this file.

   `ogImage` paths are absolute from the site root:
     - /projects/images/...  -> KRYZO ecosystem project previews
     - /images/...           -> earlier portfolio project previews
   Everything else was taken from each project's live website (real og:*
   tags and detected asset signatures). Nothing here is invented.
   ========================================================================= */

const KRYZO_PROJECTS = [
  {
    id: "medi-desk",
    name: "Medi-Desk",
    shortDescription: "Offline medicine information and symptom search platform.",
    description:
      "Medi-Desk (Medi Void) is an offline medicine information tool covering 110+ medicines. Users can search by symptom in Hinglish, Hindi or English and get matching medicines — with no internet connection required.",
    url: "https://medivoid.kryzo.space",
    category: "Web Application",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript", "Offline JSON Data"],
    ogImage: "/projects/images/medivoid.jpg",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "oinst",
    name: "Oinst",
    shortDescription: "14-in-1 vehicle, phone, UPI, PAN and identity intelligence lookup.",
    description:
      "OINST is a single dashboard offering 14 intelligence lookups — Vehicle RC, Challan, Phone, UPI, PAN, Telegram, Aadhaar and more. Raw API responses are automatically formatted into a clean, readable report.",
    url: "https://oinst.kryzo.space",
    category: "Developer Tool",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript", "REST APIs"],
    ogImage: "/projects/images/oinst.jpg",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "india-vip-escort",
    name: "India VIP Escort",
    shortDescription: "Multi-city service directory covering 50+ Indian cities.",
    description:
      "India VIP Escort is a multi-city service directory covering Delhi, Mumbai, Bengaluru and 50+ Indian cities, with city-wise listings, real photographs and direct contact details.",
    url: "https://escort.kryzo.space",
    category: "Business",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript", "Font Awesome"],
    ogImage: "/projects/images/escort.png",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "invisent",
    name: "InviSent",
    shortDescription: "Personalized WhatsApp Web link generator.",
    description:
      "InviSent creates personalized WhatsApp Web links. Prepare custom messages for each contact and open the chat to review and send manually — no bulk-send, no spam.",
    url: "https://invisent.kryzo.space",
    category: "Utility",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript"],
    ogImage: "/projects/images/invisent.png",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "kryzo-crm",
    name: "Kryzo CRM",
    shortDescription: "Lead management CRM for calls, demos and follow-ups.",
    description:
      "Kryzo CRM helps sales teams manage leads, daily calls, demos, TSS requests and follow-ups in one place, with a fast data-entry workflow designed to minimise clicks.",
    url: "https://crm.kryzo.space",
    category: "Business",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript", "LocalStorage"],
    ogImage: "/projects/images/crm.png",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "chatlens",
    name: "ChatLens",
    shortDescription: "AI chat and Ollama transcript viewer.",
    description:
      "ChatLens parses and formats raw Ollama terminal logs into a clean, modern chat interface, making AI conversation transcripts far easier to read and navigate.",
    url: "https://chatlens.kryzo.space",
    category: "Developer Tool",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript", "Marked.js"],
    ogImage: "/projects/images/chatlens.png",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "find-the-gay",
    name: "Find The Gay",
    shortDescription: "A light-hearted spin-the-wheel party game.",
    description:
      "Find The Gay is a fun party game: add your friends, spin the colourful wheel and crown the \u201cgay of the day\u201d. The page bursts into pink with hearts, sparkles and rainbow celebrations.",
    url: "https://findthegay.kryzo.space",
    category: "Entertainment",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript"],
    ogImage: "/projects/images/findtheagay.png",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "fabric-battle",
    name: "Fabric Battle",
    shortDescription: "Free Fire tournament platform with real-time updates.",
    description:
      "FabricBattle is a Free Fire tournament platform listing professional tournaments with real-time match updates for the elite battleground.",
    url: "https://fabricbattle.kryzo.space",
    category: "Gaming",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    ogImage: "/projects/images/fabric-battle.png",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "es-hpanel",
    name: "ES Hpanel",
    shortDescription: "Free Fire admin dashboard.",
    description:
      "ES Hpanel (FF Admin Dashboard) is an administrative dashboard for Free Fire management, built with Chart.js and vanilla JavaScript. The live site exposes no Open Graph metadata, so KRYZO shows a branded fallback preview.",
    url: "https://eshpanel.kryzo.space",
    category: "Admin Panel",
    technologies: ["HTML5", "CSS3", "JavaScript", "Chart.js"],
    ogImage: "/projects/images/eshpanel.png",
    status: "Live",
    github: "",
    launchDate: ""
  },

  /* ---- Earlier portfolio projects (featured on the homepage) ---- */
  {
    id: "gg-mouse-pro",
    name: "GG Mouse Pro",
    shortDescription: "Precision gaming utility for Android mouse and keyboard mapping.",
    description:
      "A precision gaming mobile utility website offering high-precision mouse and keyboard mapping for Android devices, with a store-style landing experience.",
    url: "https://ggmousepro-in.vercel.app/",
    category: "Gaming Utility",
    technologies: ["HTML5", "CSS3", "JavaScript", "Font Awesome"],
    ogImage: "/images/Cleveroad.jpg",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "yt-thumbnail-grabber",
    name: "YT Thumbnail Grabber",
    shortDescription: "Download YouTube thumbnails from any video link.",
    description:
      "A sleek web application that allows users to easily grab and download YouTube thumbnails by pasting the video link.",
    url: "https://chitar.vercel.app",
    category: "Web Tool",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    ogImage: "/images/Game Dashboard Design.jpg",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "developer-portfolio",
    name: "Developer Portfolio",
    shortDescription: "Portfolio website for a Python expert and security analyst.",
    description:
      "A personal portfolio website for a Python Expert & Security Analyst, featuring a clean UI, skills overview, and a downloadable CV.",
    url: "https://dilawar-info.vercel.app",
    category: "Portfolio",
    technologies: ["HTML5", "CSS3", "JavaScript", "Font Awesome"],
    ogImage: "/images/Capture d'\u00e9cran 2025-10-22 182207.png",
    status: "Live",
    github: "",
    launchDate: ""
  },
  {
    id: "evergreen-academy",
    name: "Evergreen Academy",
    shortDescription: "Educational institution website with courses and mission.",
    description:
      "An educational institution website showcasing the academy's history, mission, vision, and courses with a professional design.",
    url: "https://mohit-school.vercel.app",
    category: "Education",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    ogImage: "/images/Task manager app.jpg",
    status: "Live",
    github: "",
    launchDate: ""
  }
];

/* Expose globally so projects.js can consume it across classic scripts. */
window.KRYZO_PROJECTS = KRYZO_PROJECTS;
