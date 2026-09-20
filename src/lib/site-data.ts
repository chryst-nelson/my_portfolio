/**
 * Single source of truth for portfolio content.
 * Everything here mirrors the current CV (public/Aka_Cornelius.pdf).
 */

export const profile = {
  name: "Aka Cornelius Chigozie",
  shortName: "Aka Cornelius",
  handle: "chigolite",
  role: "Frontend Developer",
  location: "Nigeria",
  timezone: "Africa/Lagos",
  email: "chrystnelson@gmail.com",
  phone: "+234 903 631 5065",
  phoneHref: "tel:+2349036315065",
  siteUrl: "https://chigozie-one.vercel.app/",
  resume: "/Aka_Cornelius.pdf",
  headline: "Building responsive web & mobile interfaces.",
  summary:
    "Frontend developer working with React.js, Next.js, Tailwind CSS, Material UI and React Native. I build reusable UI components, integrate REST APIs, implement JWT authentication and ship real-time interfaces with Socket.IO.",
  availability: "Open to frontend roles",
  now: "Building an AI-powered portfolio with Spring Boot and LLM integration",
} as const;

export const socials = {
  github: "https://github.com/chryst-nelson",
  linkedin: "https://www.linkedin.com/in/aka-cornelius-chigozie-489835252/",
  twitter: "https://x.com/aka_cornelius",
} as const;

export const navItems = [
  { id: "about", label: "About", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "experience", label: "Experience", index: "03" },
  { id: "projects", label: "Projects", index: "04" },
  { id: "contact", label: "Contact", index: "05" },
] as const;

export const stackTicker = [
  "React.js",
  "Next.js",
  "JavaScript (ES6+)",
  "Tailwind CSS",
  "Material UI",
  "React Native",
  "Socket.IO",
  "REST APIs",
  "JWT Auth",
  "Firebase",
  "MongoDB",
  "PostgreSQL",
  "GitHub Actions",
  "Docker",
] as const;

export const about = {
  lead: "I turn designs and API contracts into fast, accessible interfaces that hold up on real devices.",
  body: "Most of my work sits in the React ecosystem: reusable component architecture, state management, API integration and authentication. I care about responsiveness and usability, and I'm growing my backend skills with Spring Boot and Java so I can reason about the whole request path, not just the screen.",
  focus: [
    {
      title: "Frontend engineering",
      text: "Component architecture, responsive layouts and state management with React.js and Next.js, styled with Tailwind CSS and Material UI.",
    },
    {
      title: "Mobile",
      text: "Cross-platform apps with React Native (Expo), sharing patterns and logic with the web.",
    },
    {
      title: "APIs & real-time",
      text: "REST API integration, JWT authentication and live interfaces built on Socket.IO.",
    },
    {
      title: "Backend foundations",
      text: "Node.js and Express APIs today; Spring Boot and Java in progress.",
    },
  ],
  education: [
    {
      title: "B.Sc. in Statistics",
      place: "Enugu State University of Science and Technology",
      period: "2024 – Present",
    },
    {
      title: "Full Stack Web Development Certification",
      place: "Coursera (Meta)",
      period: "2023",
    },
  ],
  certifications: [
    {
      title: "Meta Front-End / Full Stack Developer Professional Certificate",
      place: "Coursera",
    },
    {
      title: "Firebase for Web Development",
      place: "Self-directed training (YouTube/Docs)",
    },
  ],
} as const;

export interface SkillItem {
  name: string;
  /** Marks skills that are actively being learned, not yet production-proven. */
  learning?: boolean;
}

export interface SkillGroup {
  label: string;
  items: SkillItem[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    items: [
      { name: "React.js" },
      { name: "Next.js" },
      { name: "JavaScript (ES6+)" },
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "Tailwind CSS" },
      { name: "Material UI" },
      { name: "React Native (Expo)" },
      { name: "Responsive Design" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "REST APIs" },
      { name: "JWT Authentication" },
      { name: "Socket.IO" },
      { name: "Spring Boot", learning: true },
    ],
  },
  {
    label: "Database & Cloud",
    items: [
      { name: "MongoDB" },
      { name: "Firebase" },
      { name: "PostgreSQL" },
      { name: "Cloudinary" },
    ],
  },
  {
    label: "Tools & DevOps",
    items: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "GitHub Actions" },
      { name: "Docker" },
      { name: "Postman" },
      { name: "Vercel" },
      { name: "Render" },
      { name: "Figma-to-Code" },
    ],
  },
  {
    label: "Core concepts",
    items: [
      { name: "Component Architecture" },
      { name: "State Management" },
      { name: "API Integration" },
      { name: "Authentication" },
      { name: "Performance Optimization" },
      { name: "Cross-Browser Compatibility" },
    ],
  },
];

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  mode: string;
  bullets: string[];
  tags: string[];
  highlight?: { value: string; label: string };
}

export const experience: ExperienceEntry[] = [
  {
    role: "Frontend Developer (Internship)",
    company: "NdiliaTalent",
    period: "2025 – 2026",
    mode: "Remote",
    bullets: [
      "Developed responsive user interfaces using React.js and Tailwind CSS for a football talent discovery platform.",
      "Integrated RESTful APIs for dynamic data rendering, authentication flows and user interactions.",
      "Improved mobile responsiveness and reduced UI bugs by 40% through systematic component testing and refactoring.",
      "Collaborated with backend and design teams to deliver consistent, accessible and performant interfaces.",
    ],
    tags: ["React.js", "Tailwind CSS", "REST APIs"],
    highlight: {
      value: "40%",
      label: "fewer UI bugs after component testing and refactoring",
    },
  },
  {
    role: "Software Developer Intern",
    company: "Enugu State Tech Hub",
    period: "2022 – 2023",
    mode: "On-site",
    bullets: [
      "Built and consumed RESTful APIs with Node.js and Express, strengthening my grasp of client-server architecture and frontend integration.",
      "Implemented JWT-based authentication and session handling for secure application login experiences.",
      "Participated in team sprints and architecture discussions covering backend services and frontend integration.",
    ],
    tags: ["Node.js", "Express", "REST APIs", "JWT"],
  },
];

export interface Project {
  id: string;
  title: string;
  kind: string;
  status?: "in-progress";
  summary: string;
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: "learnerx",
    title: "LearnerX",
    kind: "Learning management system",
    summary:
      "A multi-role learning platform for learners and instructors with role-based dashboard views, responsive data-driven dashboards and course and content delivery.",
    technologies: ["Next.js", "REST APIs", "Cloudinary"],
  },
  {
    id: "chat-up",
    title: "Chat-Up",
    kind: "Real-time chat",
    summary:
      "A real-time chat application with live message rendering, chat room UI and message history views.",
    technologies: ["React", "Socket.IO", "Redux"],
  },
  {
    id: "ai-portfolio",
    title: "AI-Powered Portfolio",
    kind: "Spring Boot + LLM",
    status: "in-progress",
    summary:
      "An interactive portfolio whose Spring Boot backend uses LLM integration to answer visitor questions about projects, skills and experience.",
    technologies: ["Spring Boot", "Java", "REST APIs", "LLM integration"],
  },
];
