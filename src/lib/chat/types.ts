export type ChatResponseType =
  | "TEXT"
  | "PROJECT"
  | "PROJECT_LIST"
  | "SKILL_LIST"
  | "EXPERIENCE"
  | "CONTACT"
  | "RESUME"
  | "LINK";

export type ChatMode = "GENERAL" | "RECRUITER" | "DEVELOPER";

export interface ChatMessageResponse {
  type: ChatResponseType;
  message: string;
  payload: unknown; // shape depends on `type` — narrowed in ResponseRenderer
}
