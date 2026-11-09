import type { ChatMessageResponse } from "@/lib/chat/types";
import type {
  ContactResponse,
  ExperienceResponse,
  ProjectDetailResponse,
  ProjectSummaryResponse,
  ResumeResponse,
  SkillResponse,
} from "@/lib/api/types";
import {
  ContactCard,
  ExperienceCard,
  ProjectCard,
  ProjectListCard,
  ResumeCard,
  SkillListCard,
} from "@/components/chat/cards";

// Dispatches on response.type. TEXT and payload-less types render prose only.
export function ResponseRenderer({ response }: { response: ChatMessageResponse }) {
  if (!response.payload) return null;

  switch (response.type) {
    case "PROJECT":
      return <ProjectCard project={response.payload as ProjectDetailResponse} />;
    case "PROJECT_LIST":
      return <ProjectListCard projects={response.payload as ProjectSummaryResponse[]} />;
    case "SKILL_LIST":
      return <SkillListCard skills={response.payload as SkillResponse[]} />;
    case "EXPERIENCE":
      return <ExperienceCard experience={response.payload as ExperienceResponse[]} />;
    case "CONTACT":
      return <ContactCard contact={response.payload as ContactResponse} />;
    case "RESUME":
      return <ResumeCard resume={response.payload as ResumeResponse} />;
    default:
      return null;
  }
}
