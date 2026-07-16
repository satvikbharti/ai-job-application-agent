import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isMissingColumnError(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() || "";
  return message.includes("does not exist") && message.includes("column");
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const resumeId = body?.resumeId;

  if (!resumeId) {
    return NextResponse.json({ error: "Resume id is required." }, { status: 400 });
  }

  const { error: clearError } = await supabase
    .from("resumes")
    .update({ is_primary: false })
    .eq("user_id", user.id);

  if (clearError && !isMissingColumnError(clearError)) {
    return NextResponse.json({ error: clearError.message }, { status: 500 });
  }

  const { error: selectError } = await supabase
    .from("resumes")
    .update({ is_primary: true })
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (selectError && !isMissingColumnError(selectError)) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
