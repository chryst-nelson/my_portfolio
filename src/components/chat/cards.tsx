import { Download, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import type {
  ContactResponse,
  ExperienceResponse,
  ProjectDetailResponse,
  ProjectSummaryResponse,
  ResumeResponse,
  SkillResponse,
} from "@/lib/api/types";

const link =
  "inline-flex items-center gap-1.5 text-sm text-fg transition-colors hover:text-accent";
const box = "mt-3 border border-line bg-surface p-4";
const tag =
  "border border-line-strong px-2 py-0.5 font-mono text-[11px] text-muted";

function Tags({ items }: { items: { id: number; name: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t.id} className={tag}>
          {t.name}
        </span>
      ))}
    </div>
  );
}

function ProjectLinks({
  githubUrl,
  liveUrl,
}: {
  githubUrl: string | null;
  liveUrl: string | null;
}) {
  if (!githubUrl && !liveUrl) return null;
  return (
    <div className="mt-3 flex gap-4">
      {githubUrl && (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={link}>
          <Github className="h-3.5 w-3.5" aria-hidden="true" /> Code
        </a>
      )}
      {liveUrl && (
        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={link}>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Live
        </a>
      )}
    </div>
  );
}

export function ProjectCard({ project }: { project: ProjectDetailResponse }) {
  return (
    <div className={box}>
      <p className="font-display text-xl leading-tight">{project.name}</p>
      {project.category && <p className="eyebrow mt-1">{project.category}</p>}
      {project.description && (
        <p className="mt-2 text-sm text-muted">{project.description}</p>
      )}
      {project.problemSolved && (
        <p className="mt-2 text-sm text-muted">
          <span className="text-fg">Problem solved: </span>
          {project.problemSolved}
        </p>
      )}
      <Tags items={project.technologies} />
      <ProjectLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
    </div>
  );
}

export function ProjectListCard({ projects }: { projects: ProjectSummaryResponse[] }) {
  if (projects.length === 0) return null;
  return (
    <div className="mt-3 grid gap-3">
      {projects.map((p) => (
        <div key={p.id} className="border border-line bg-surface p-4">
          <p className="font-display text-xl leading-tight">{p.name}</p>
          {p.category && <p className="eyebrow mt-1">{p.category}</p>}
          {p.description && (
            <p className="mt-2 line-clamp-3 text-sm text-muted">{p.description}</p>
          )}
          <ProjectLinks githubUrl={p.githubUrl} liveUrl={p.liveUrl} />
        </div>
      ))}
    </div>
  );
}

export function SkillListCard({ skills }: { skills: SkillResponse[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {skills.map((s) => (
        <span key={s.id} className={`${tag} inline-flex items-center gap-1.5 text-fg`}>
          {s.name}
          {s.currentlyLearning && (
            <span className="text-[10px] uppercase tracking-wider text-accent">
              learning
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export function ExperienceCard({ experience }: { experience: ExperienceResponse[] }) {
  if (experience.length === 0) return null;
  return (
    <div className="mt-3 grid gap-3">
      {experience.map((e) => (
        <div key={e.id} className="border border-line bg-surface p-4">
          <p className="text-sm">
            {e.role} <span className="text-muted">·</span> {e.company}
          </p>
          <p className="eyebrow mt-1">
            {e.startDate} — {e.endDate ?? "Present"}
          </p>
          <Tags items={e.technologies} />
        </div>
      ))}
    </div>
  );
}

export function ContactCard({ contact }: { contact: ContactResponse }) {
  return (
    <div className={`${box} flex flex-col gap-2`}>
      <a href={`mailto:${contact.email}`} className={link}>
        <Mail className="h-4 w-4 text-muted" aria-hidden="true" /> {contact.email}
      </a>
      {contact.linkedinUrl && (
        <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className={link}>
          <Linkedin className="h-4 w-4 text-muted" aria-hidden="true" /> LinkedIn
        </a>
      )}
      {contact.githubUrl && (
        <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className={link}>
          <Github className="h-4 w-4 text-muted" aria-hidden="true" /> GitHub
        </a>
      )}
      {contact.otherLinks &&
        Object.entries(contact.otherLinks).map(([label, url]) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer" className={link}>
            {label}
          </a>
        ))}
    </div>
  );
}

export function ResumeCard({ resume }: { resume: ResumeResponse }) {
  return (
    <div className={box}>
      <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
        <Download className="h-4 w-4" aria-hidden="true" />
        Download résumé{resume.version ? ` (${resume.version})` : ""}
      </a>
    </div>
  );
}
