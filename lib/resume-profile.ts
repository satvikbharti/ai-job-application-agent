import type { Json } from "@/lib/database.types";

export type WorkExperience = {
  company: string;
  title: string;
  duration: string;
  responsibilities: string[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  duration: string;
  details: string[];
};

export type ProjectItem = {
  name: string;
  description: string;
  technologies: string[];
  links: string[];
};

export type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
  link: string;
};

export type ResumeLink = {
  label: string;
  url: string;
};

export type ParsedResumeProfile = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  professionalSummary: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  links: ResumeLink[];
  additionalDetails: string[];
};

export const emptyResumeProfile: ParsedResumeProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  professionalSummary: "",
  skills: [],
  workExperience: [],
  education: [],
  projects: [],
  certifications: [],
  links: [],
  additionalDetails: [],
};

export function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

export function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(normalizeString).filter(Boolean);
}

export function normalizeParsedResume(value: unknown): ParsedResumeProfile {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};

  return {
    fullName: normalizeString(input.fullName),
    email: normalizeString(input.email),
    phone: normalizeString(input.phone),
    location: normalizeString(input.location),
    headline: normalizeString(input.headline),
    professionalSummary: normalizeString(input.professionalSummary),
    skills: normalizeStringArray(input.skills),
    workExperience: Array.isArray(input.workExperience)
      ? input.workExperience.map((item) => {
          const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
          return {
            company: normalizeString(entry.company),
            title: normalizeString(entry.title),
            duration: normalizeString(entry.duration),
            responsibilities: normalizeStringArray(entry.responsibilities),
          };
        })
      : [],
    education: Array.isArray(input.education)
      ? input.education.map((item) => {
          const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
          return {
            institution: normalizeString(entry.institution),
            degree: normalizeString(entry.degree),
            duration: normalizeString(entry.duration),
            details: normalizeStringArray(entry.details),
          };
        })
      : [],
    projects: Array.isArray(input.projects)
      ? input.projects.map((item) => {
          const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
          return {
            name: normalizeString(entry.name),
            description: normalizeString(entry.description),
            technologies: normalizeStringArray(entry.technologies),
            links: normalizeStringArray(entry.links),
          };
        })
      : [],
    certifications: Array.isArray(input.certifications)
      ? input.certifications.map((item) => {
          const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
          return {
            name: normalizeString(entry.name),
            issuer: normalizeString(entry.issuer),
            date: normalizeString(entry.date),
            link: normalizeString(entry.link),
          };
        })
      : [],
    links: Array.isArray(input.links)
      ? input.links.map((item) => {
          const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
          return {
            label: normalizeString(entry.label),
            url: normalizeString(entry.url),
          };
        })
      : [],
    additionalDetails: normalizeStringArray(input.additionalDetails),
  };
}
