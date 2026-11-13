/**
 * Single source of truth for portfolio content.
 * Mirrors the current CV, plus the infrastructure this site actually runs on.
 */

export const profile = {
  name: "Aka Cornelius Chigozie",
  shortName: "Aka Cornelius",
  role: "Frontend Engineer",
  positioning: "Frontend engineer with backend and DevOps experience",
  location: "Nigeria",
  timezone: "Africa/Lagos",
  email: "chrystnelson@gmail.com",
  phone: "+234 903 631 5065",
  phoneHref: "tel:+2349036315065",
  siteUrl: "https://chigozie-one.vercel.app/",
  resume: "/Aka_Cornelius.pdf",
  headline: "Frontend engineer who also builds the API and ships it.",
  summary:
    "I build interfaces with React, Next.js and Tailwind, write the services behind them in Node and Spring Boot, and run them in production with Docker and GitHub Actions. This site is one example: the page, the API and the server it runs on are all mine.",
  openTo: "Frontend and full-stack roles",
} as const;

export const socials = {
  github: "https://github.com/chryst-nelson",
  linkedin: "https://www.linkedin.com/in/aka-cornelius-chigozie-489835252/",
  twitter: "https://x.com/aka_cornelius",
} as const;

export const navItems = [
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  paragraphs: [
    "I started in the browser and I still spend most of my time there: component architecture, state, forms, responsive layouts, and making an interface hold up on a cheap phone with a bad connection.",
    "Over time I kept following the request past the screen. I've written Node and Express APIs with JWT auth, I'm building in Spring Boot and Java, and I deploy my own work: Docker images, GitHub Actions pipelines, Nginx and TLS on AWS. Knowing what happens after fetch() makes the frontend better.",
    "My degree is in Statistics, so I'm comfortable reading data and building the dashboards that present it.",
  ],
  education: [
    {
      title: "B.Sc. Statistics",
      place: "Enugu State University of Science and Technology",
      period: "2024 – present",
    },
    {
      title: "Meta Front-End / Full Stack Developer Certificate",
      place: "Coursera",
      period: "2023",
    },
  ],
} as const;

export interface StackLayer {
  name: string;
  note: string;
  groups: { label: string; items: string[] }[];
}

export const stackLayers: StackLayer[] = [
  {
    name: "Interface",
    note: "Where I spend most of my time.",
    groups: [
      {
        label: "Web",
        items: [
          "React.js",
          "Next.js (App Router)",
          "TypeScript",
          "JavaScript (ES6+)",
          "Tailwind CSS",
          "Material UI",
          "HTML5 / CSS3",
        ],
      },
      { label: "Mobile", items: ["React Native (Expo)"] },
      {
        label: "Practice",
        items: ["Figma-to-code", "Responsive layouts", "Accessibility", "Component testing"],
      },
    ],
  },
  {
    name: "Services",
    note: "The APIs and data the interface depends on.",
    groups: [
      {
        label: "Backend",
        items: ["Spring Boot", "Java", "Node.js", "Express.js", "REST APIs", "JWT auth", "Socket.IO"],
      },
      {
        label: "Data",
        items: ["PostgreSQL", "Flyway migrations", "MongoDB", "Firebase"],
      },
    ],
  },
  {
    name: "Delivery",
    note: "How it gets to production and stays there.",
    groups: [
      {
        label: "Pipeline",
        items: ["Git / GitHub", "GitHub Actions", "Docker", "GitHub Container Registry"],
      },
      {
        label: "Hosting",
        items: ["AWS EC2", "Nginx", "Let's Encrypt (TLS)", "Vercel", "Self-hosted Ollama"],
      },
      { label: "Tools", items: ["Postman"] },
    ],
  },
];

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  mode: string;
  bullets: string[];
  highlight?: { value: string; label: string };
}

export const experience: ExperienceEntry[] = [
  {
    role: "Frontend Developer Intern",
    company: "NdiliaTalent",
    period: "2025 – 2026",
    mode: "Remote",
    bullets: [
      "Built responsive, accessible UI components with React.js and Tailwind CSS for a sports talent discovery platform.",
      "Integrated REST endpoints for dynamic data, live multi-criteria search filtering and authentication flows.",
      "Cut UI bugs and rendering defects through component testing, state refactoring and mobile responsiveness audits.",
      "Worked with backend engineers and designers to keep the interface accessible and low-latency.",
    ],
    highlight: { value: "40%", label: "fewer UI bugs and rendering defects" },
  },
  {
    role: "Software Developer Intern",
    company: "Enugu State Tech Hub",
    period: "2022 – 2023",
    mode: "Enugu, Nigeria",
    bullets: [
      "Developed modular REST APIs with Node.js and Express for a clean client-server data architecture.",
      "Implemented JWT-based authentication and secure session handling across dashboard features.",
      "Took part in daily stand-ups, architecture reviews and frontend integration sprints.",
    ],
  },
];

export interface Project {
  id: string;
  title: string;
  kind: string;
  summary: string;
  technologies: string[];
  /** Per-layer breakdown, used for the project that spans the whole stack. */
  layers?: { name: string; text: string }[];
  link?: { label: string; href: string };
}

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "This portfolio",
    kind: "Full stack · live",
    summary:
      "A portfolio with an assistant you can question. A Spring Boot answer engine replies from the data in the database, and a small self-hosted model steps in only when the rules have no answer.",
    technologies: ["Next.js", "Spring Boot", "PostgreSQL", "Docker", "GitHub Actions", "AWS EC2", "Ollama"],
    layers: [
      {
        name: "Interface",
        text: "Next.js 15, React 19 and Tailwind on Vercel. The chat streams answers over server-sent events.",
      },
      {
        name: "Services",
        text: "Spring Boot 4 on Java 21, JPA with Flyway migrations, JWT-protected admin panel, per-IP rate limiting.",
      },
      {
        name: "Delivery",
        text: "GitHub Actions builds the image, pushes it to GHCR and deploys over SSH to EC2 behind Nginx and Let's Encrypt. PostgreSQL is managed; Ollama runs on its own server.",
      },
    ],
    link: { label: "Ask the assistant", href: "/ask" },
  },
  {
    id: "learnerx",
    title: "LearnerX",
    kind: "Multi-role learning platform",
    summary:
      "Role-based dashboards for instructors and students on the Next.js App Router, backed by REST APIs for content delivery, progress tracking and quiz analytics.",
    technologies: ["Next.js", "Node.js", "Tailwind CSS"],
  },
  {
    id: "chat-up",
    title: "Chat-Up",
    kind: "Real-time messaging",
    summary:
      "An event-driven chat interface on Socket.IO with live message delivery and room management.",
    technologies: ["React.js", "Socket.IO", "Express"],
  },
];
