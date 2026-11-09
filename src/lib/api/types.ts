export interface SkillResponse {
  id: number;
  name: string;
  category: string;
  proficiency: string | null;
  currentlyLearning: boolean;
}

export interface ProjectSummaryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
}

export interface ProjectScreenshotResponse {
  id: number;
  url: string;
  caption: string | null;
  sortOrder: number;
}

export interface ProjectChallengeResponse {
  id: number;
  challenge: string;
  lessonLearned: string | null;
}

export interface ProjectDetailResponse extends ProjectSummaryResponse {
  problemSolved: string | null;
  technologies: SkillResponse[];
  screenshots: ProjectScreenshotResponse[];
  challenges: ProjectChallengeResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceResponse {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  responsibilities: string | null;
  technologies: SkillResponse[];
  achievements: string[];
}

export interface ProfileResponse {
  id: number;
  fullName: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  interests: string | null;
  careerGoals: string | null;
  updatedAt: string;
}

export interface ResumeResponse {
  fileUrl: string;
  version: string | null;
  uploadedAt: string;
}

export interface ContactResponse {
  email: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  otherLinks: Record<string, string> | null;
}

export interface EducationResponse {
  id: number;
  institution: string;
  degree: string | null;
  course: string | null;
  details: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface CertificationResponse {
  id: number;
  name: string;
  provider: string | null;
  issuedDate: string | null;
  credentialUrl: string | null;
}

export interface AchievementResponse {
  id: number;
  title: string;
  description: string | null;
  date: string | null;
  verified: boolean;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresInMs: number;
}

export interface SkillRequest {
  name: string;
  category: string;
  proficiency: string;
  currentlyLearning: boolean;
}

export interface ProjectRequest {
  name: string;
  slug: string;
  description: string;
  problemSolved: string;
  category: string;
  githubUrl: string;
  liveUrl: string;
  technologyIds: number[];
}

export interface ExperienceRequest {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  responsibilities: string;
  technologyIds: number[];
  achievements: string[];
}

export interface ProfileUpdateRequest {
  fullName: string;
  title: string;
  bio: string;
  location: string;
  interests: string;
  careerGoals: string;
}

export interface ResumeUploadRequest {
  fileUrl: string;
  version: string;
}

export interface ContactRequest {
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  otherLinks: Record<string, string> | null;
}

export interface EducationRequest {
  institution: string;
  degree: string;
  course: string;
  details: string;
  startDate: string | null;
  endDate: string | null;
}

export interface CertificationRequest {
  name: string;
  provider: string;
  issuedDate: string | null;
  credentialUrl: string;
}

export interface AchievementRequest {
  title: string;
  description: string;
  date: string | null;
  verified: boolean;
}

export interface FaqResponse {
  id: number;
  question: string;
  answer: string;
  keywords: string | null;
  enabled: boolean;
}

export interface FaqRequest {
  question: string;
  answer: string;
  keywords: string | null;
  enabled: boolean;
}
