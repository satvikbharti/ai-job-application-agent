import { ResumeManager } from "@/components/dashboard/resume-manager";
import { createClient } from "@/lib/supabase/server";

function formatFileSize(size: number | null) {
  if (!size) return "Unknown size";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ResumePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  const resumesWithLinks = await Promise.all(
    (resumes || []).map(async (resume) => {
      const { data } = await supabase.storage
        .from("resumes")
        .createSignedUrl(resume.file_path, 60 * 10);

      return {
        ...resume,
        signedUrl: data?.signedUrl || "",
        fileSizeLabel: formatFileSize(resume.file_size),
      };
    })
  );

  return <ResumeManager initialResumes={resumesWithLinks} />;
}
