import { ProfileEditor } from "@/components/profile/profile-editor";
import {
  emptyResumeProfile,
  normalizeParsedResume,
  type ParsedResumeProfile,
} from "@/lib/resume-profile";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: accountProfile }, { data: resumeProfile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,email")
      .eq("id", user?.id || "")
      .maybeSingle(),
    supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user?.id || "")
      .maybeSingle(),
  ]);

  const initialProfile: ParsedResumeProfile = normalizeParsedResume({
    ...emptyResumeProfile,
    fullName: accountProfile?.full_name || "",
    email: accountProfile?.email || user?.email || "",
    phone: resumeProfile?.phone || "",
    location: resumeProfile?.location || "",
    headline: resumeProfile?.headline || "",
    professionalSummary: resumeProfile?.professional_summary || "",
    skills: resumeProfile?.skills || [],
    workExperience: resumeProfile?.work_experience || [],
    education: resumeProfile?.education || [],
    projects: resumeProfile?.projects || [],
    certifications: resumeProfile?.certifications || [],
    links: resumeProfile?.links || [],
    additionalDetails: resumeProfile?.additional_details || [],
  });

  return <ProfileEditor initialProfile={initialProfile} />;
}
