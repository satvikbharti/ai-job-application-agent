import { NextResponse } from "next/server";
import { normalizeParsedResume, toJson } from "@/lib/resume-profile";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = normalizeParsedResume(await request.json());
  const now = new Date().toISOString();

  const { error: userProfileError } = await supabase.from("user_profiles").upsert({
    user_id: user.id,
    phone: profile.phone,
    location: profile.location,
    headline: profile.headline,
    professional_summary: profile.professionalSummary,
    skills: profile.skills,
    work_experience: toJson(profile.workExperience),
    education: toJson(profile.education),
    projects: toJson(profile.projects),
    certifications: toJson(profile.certifications),
    links: toJson(profile.links),
    additional_details: profile.additionalDetails,
    updated_at: now,
  });

  if (userProfileError) {
    return NextResponse.json({ error: userProfileError.message }, { status: 500 });
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: profile.fullName || null,
    email: profile.email || user.email || null,
    updated_at: now,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
