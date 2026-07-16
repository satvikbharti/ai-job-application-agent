import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  normalizeParsedResume,
  toJson,
  type ParsedResumeProfile,
} from "@/lib/resume-profile";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const RESUME_BUCKET = "resumes";

const resumeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullName: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    location: { type: "string" },
    headline: { type: "string" },
    professionalSummary: { type: "string" },
    skills: { type: "array", items: { type: "string" } },
    workExperience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          company: { type: "string" },
          title: { type: "string" },
          duration: { type: "string" },
          responsibilities: { type: "array", items: { type: "string" } },
        },
        required: ["company", "title", "duration", "responsibilities"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          duration: { type: "string" },
          details: { type: "array", items: { type: "string" } },
        },
        required: ["institution", "degree", "duration", "details"],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          technologies: { type: "array", items: { type: "string" } },
          links: { type: "array", items: { type: "string" } },
        },
        required: ["name", "description", "technologies", "links"],
      },
    },
    certifications: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          issuer: { type: "string" },
          date: { type: "string" },
          link: { type: "string" },
        },
        required: ["name", "issuer", "date", "link"],
      },
    },
    links: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          url: { type: "string" },
        },
        required: ["label", "url"],
      },
    },
    additionalDetails: { type: "array", items: { type: "string" } },
  },
  required: [
    "fullName",
    "email",
    "phone",
    "location",
    "headline",
    "professionalSummary",
    "skills",
    "workExperience",
    "education",
    "projects",
    "certifications",
    "links",
    "additionalDetails",
  ],
};

function cleanFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 120);
}

function getMimeType(file: File) {
  if (file.type) {
    return file.type;
  }

  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".pdf")) return "application/pdf";
  if (lowerName.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lowerName.endsWith(".txt")) return "text/plain";
  return "application/octet-stream";
}

function parseModelJson(text: string | undefined) {
  if (!text) {
    throw new Error("Gemini did not return resume details.");
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned) as unknown;
}

function isMissingColumnError(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() || "";
  return message.includes("does not exist") && message.includes("column");
}

async function extractResume(file: File): Promise<ParsedResumeProfile> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY or GOOGLE_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = getMimeType(file);

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: [
      {
        text:
          "Extract structured resume data from this file. Return only JSON that matches the provided schema. Use empty strings or empty arrays when a field is missing. Preserve useful bullet points and links.",
      },
      {
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
    ],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseJsonSchema: resumeSchema,
    },
  });

  return normalizeParsedResume(parseModelJson(response.text));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("resume");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a resume file to upload." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Resume must be 8 MB or smaller." }, { status: 400 });
  }

  const fileName = cleanFileName(file.name || "resume");
  const storagePath = `${user.id}/${Date.now()}-${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(storagePath, file, {
      contentType: getMimeType(file),
      upsert: false,
    });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket not found")) {
      return NextResponse.json(
        {
          error:
            "Resume storage is not set up yet. Run supabase-onboarding.sql in your Supabase SQL editor to create the resumes bucket and policies.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const parsedProfile = await extractResume(file);

  const insertPayload = {
    user_id: user.id,
    file_name: file.name,
    file_path: storagePath,
    file_size: file.size,
    mime_type: getMimeType(file),
    parsed_data: toJson(parsedProfile),
    is_primary: true,
  };

  const insertResult = await supabase.from("resumes").insert(insertPayload).select().single();
  let resume = insertResult.data;
  let resumeError = insertResult.error;

  if (resumeError && isMissingColumnError(resumeError)) {
    const fallbackResult = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_path: storagePath,
        file_size: file.size,
        mime_type: getMimeType(file),
        parsed_data: toJson(parsedProfile),
      })
      .select()
      .single();

    resume = fallbackResult.data;
    resumeError = fallbackResult.error;
  }

  if (resumeError) {
    return NextResponse.json({ error: resumeError.message }, { status: 500 });
  }

  const { error: clearPrimaryError } = await supabase
    .from("resumes")
    .update({ is_primary: false })
    .eq("user_id", user.id)
    .neq("id", resume.id);

  if (clearPrimaryError && !isMissingColumnError(clearPrimaryError)) {
    return NextResponse.json({ error: clearPrimaryError.message }, { status: 500 });
  }

  const { error: profileError } = await supabase.from("user_profiles").upsert({
    user_id: user.id,
    phone: parsedProfile.phone,
    location: parsedProfile.location,
    headline: parsedProfile.headline,
    professional_summary: parsedProfile.professionalSummary,
    skills: parsedProfile.skills,
    work_experience: toJson(parsedProfile.workExperience),
    education: toJson(parsedProfile.education),
    projects: toJson(parsedProfile.projects),
    certifications: toJson(parsedProfile.certifications),
    links: toJson(parsedProfile.links),
    additional_details: parsedProfile.additionalDetails,
    onboarding_completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (parsedProfile.fullName || parsedProfile.email) {
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: parsedProfile.fullName || user.user_metadata?.full_name || null,
      email: parsedProfile.email || user.email || null,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ profile: parsedProfile, resume });
}
