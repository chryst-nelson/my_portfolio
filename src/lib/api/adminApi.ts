import { apiFetch } from "@/lib/api/client";
import type {
  AchievementRequest,
  AchievementResponse,
  CertificationRequest,
  CertificationResponse,
  ContactRequest,
  ContactResponse,
  EducationRequest,
  FaqRequest,
  FaqResponse,
  EducationResponse,
  ExperienceRequest,
  ExperienceResponse,
  ProfileResponse,
  ProfileUpdateRequest,
  ProjectDetailResponse,
  ProjectRequest,
  ProjectSummaryResponse,
  ResumeResponse,
  ResumeUploadRequest,
  SkillRequest,
  SkillResponse,
} from "@/lib/api/types";

// Reads — public endpoints, no token required.
export const getSkills = () => apiFetch<SkillResponse[]>("/api/skills");
export const getProjects = () => apiFetch<ProjectSummaryResponse[]>("/api/projects");
export const getProject = (id: number) => apiFetch<ProjectDetailResponse>(`/api/projects/${id}`);
export const getExperience = () => apiFetch<ExperienceResponse[]>("/api/experience");
export const getProfile = () => apiFetch<ProfileResponse>("/api/profile");
export const getResume = () => apiFetch<ResumeResponse>("/api/resume");
export const getContact = () => apiFetch<ContactResponse>("/api/contact");
export const getEducation = () => apiFetch<EducationResponse[]>("/api/education");
export const getCertifications = () => apiFetch<CertificationResponse[]>("/api/certifications");

// Admin-only read: sees unverified achievements too, unlike the public
// GET /api/achievements (verified-only).
export const getAllAchievements = (token: string) =>
  apiFetch<AchievementResponse[]>("/api/admin/achievements", { token });

// Writes — authenticated, /api/admin/**.
export const createSkill = (token: string, body: SkillRequest) =>
  apiFetch<SkillResponse>("/api/admin/skills", { method: "POST", body, token });

export const updateSkill = (token: string, id: number, body: SkillRequest) =>
  apiFetch<SkillResponse>(`/api/admin/skills/${id}`, { method: "PUT", body, token });

export const deleteSkill = (token: string, id: number) =>
  apiFetch<void>(`/api/admin/skills/${id}`, { method: "DELETE", token });

export const createProject = (token: string, body: ProjectRequest) =>
  apiFetch<ProjectDetailResponse>("/api/admin/projects", { method: "POST", body, token });

export const updateProject = (token: string, id: number, body: ProjectRequest) =>
  apiFetch<ProjectDetailResponse>(`/api/admin/projects/${id}`, { method: "PUT", body, token });

export const deleteProject = (token: string, id: number) =>
  apiFetch<void>(`/api/admin/projects/${id}`, { method: "DELETE", token });

export const createExperience = (token: string, body: ExperienceRequest) =>
  apiFetch<ExperienceResponse>("/api/admin/experience", { method: "POST", body, token });

export const updateExperience = (token: string, id: number, body: ExperienceRequest) =>
  apiFetch<ExperienceResponse>(`/api/admin/experience/${id}`, { method: "PUT", body, token });

export const deleteExperience = (token: string, id: number) =>
  apiFetch<void>(`/api/admin/experience/${id}`, { method: "DELETE", token });

export const updateProfile = (token: string, body: ProfileUpdateRequest) =>
  apiFetch<ProfileResponse>("/api/admin/profile", { method: "PUT", body, token });

export const uploadResume = (token: string, body: ResumeUploadRequest) =>
  apiFetch<ResumeResponse>("/api/admin/resume", { method: "POST", body, token });

export const updateContact = (token: string, body: ContactRequest) =>
  apiFetch<ContactResponse>("/api/admin/contact", { method: "PUT", body, token });

export const createEducation = (token: string, body: EducationRequest) =>
  apiFetch<EducationResponse>("/api/admin/education", { method: "POST", body, token });

export const updateEducation = (token: string, id: number, body: EducationRequest) =>
  apiFetch<EducationResponse>(`/api/admin/education/${id}`, { method: "PUT", body, token });

export const deleteEducation = (token: string, id: number) =>
  apiFetch<void>(`/api/admin/education/${id}`, { method: "DELETE", token });

export const createCertification = (token: string, body: CertificationRequest) =>
  apiFetch<CertificationResponse>("/api/admin/certifications", { method: "POST", body, token });

export const updateCertification = (token: string, id: number, body: CertificationRequest) =>
  apiFetch<CertificationResponse>(`/api/admin/certifications/${id}`, { method: "PUT", body, token });

export const deleteCertification = (token: string, id: number) =>
  apiFetch<void>(`/api/admin/certifications/${id}`, { method: "DELETE", token });

export const createAchievement = (token: string, body: AchievementRequest) =>
  apiFetch<AchievementResponse>("/api/admin/achievements", { method: "POST", body, token });

export const updateAchievement = (token: string, id: number, body: AchievementRequest) =>
  apiFetch<AchievementResponse>(`/api/admin/achievements/${id}`, { method: "PUT", body, token });

export const deleteAchievement = (token: string, id: number) =>
  apiFetch<void>(`/api/admin/achievements/${id}`, { method: "DELETE", token });

// FAQ entries the chat answers directly, before the answer engine runs.
export const getAllFaqs = (token: string) =>
  apiFetch<FaqResponse[]>("/api/admin/faq", { token });

export const createFaq = (token: string, body: FaqRequest) =>
  apiFetch<FaqResponse>("/api/admin/faq", { method: "POST", body, token });

export const updateFaq = (token: string, id: number, body: FaqRequest) =>
  apiFetch<FaqResponse>(`/api/admin/faq/${id}`, { method: "PUT", body, token });

export const deleteFaq = (token: string, id: number) =>
  apiFetch<void>(`/api/admin/faq/${id}`, { method: "DELETE", token });
