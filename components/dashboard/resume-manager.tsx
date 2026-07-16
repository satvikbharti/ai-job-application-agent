"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Download01Icon,
  File02Icon,
  Loading03Icon,
  SparklesIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ResumeRecord = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  parsed_data: unknown;
  is_primary: boolean;
  created_at: string;
  signedUrl: string;
  fileSizeLabel: string;
};

type ResumeManagerProps = {
  initialResumes: ResumeRecord[];
};

function formatStatus(resume: ResumeRecord) {
  const parsed = resume.parsed_data;
  if (parsed && typeof parsed === "object") {
    const data = parsed as Record<string, unknown>;
    const hasContent = Object.values(data).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim().length > 0;
      return Boolean(value);
    });
    if (hasContent) return { label: "Parsed", tone: "emerald" as const };
  }

  return { label: "Pending", tone: "amber" as const };
}

function formatDate(value: string) {
  const date = new Date(value);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

export function ResumeManager({ initialResumes }: ResumeManagerProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState(initialResumes);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const primaryResume = useMemo(() => resumes.find((resume) => resume.is_primary) || resumes[0], [resumes]);

  async function uploadResume() {
    if (!selectedFile) {
      setError("Choose a resume file to upload.");
      return;
    }

    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("resume", selectedFile);

    startTransition(async () => {
      const response = await fetch("/api/onboarding/resume", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error || "Could not upload and parse this resume.");
        return;
      }

      setSelectedFile(null);
      setFileName("");
      setMessage("Resume uploaded and parsed successfully.");
      router.refresh();
    });
  }

  async function selectPrimary(resumeId: string) {
    setMessage("");
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error || "Could not switch the active resume.");
        return;
      }

      setResumes((current) =>
        current.map((resume) => ({ ...resume, is_primary: resume.id === resumeId }))
      );
      setMessage("Primary resume updated.");
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-2 border-b pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Resume library</h1>
          <p className="text-sm text-muted-foreground">
            Keep multiple resumes, check parsing status, and choose the one you want to use for profile updates.
          </p>
        </div>
      </div>

      {(message || error) && (
        <div className={cn(
          "rounded-lg border px-3 py-2 text-sm",
          error ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        )}>
          {error || message}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upload and manage resumes</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Add another copy if you have different versions for different roles.
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-5 text-center">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="size-5" />
              </span>
              <span className="text-sm font-medium">{fileName || "Upload a PDF, DOCX, or text resume"}</span>
              <span className="text-xs text-muted-foreground">We will parse it and keep it available for future edits.</span>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setSelectedFile(file);
                  setFileName(file?.name || "");
                  setError("");
                }}
              />
            </label>
            <Button size="lg" onClick={uploadResume} disabled={isPending || !selectedFile}>
              {isPending ? (
                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-4" />
              )}
              {isPending ? "Parsing resume..." : "Upload and parse"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active resume</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {primaryResume ? (
              <div className="rounded-lg border bg-primary/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{primaryResume.file_name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {primaryResume.fileSizeLabel} • {formatDate(primaryResume.created_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
                    Selected
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4 text-emerald-600" />
                  <span>Used for profile syncing and future applications.</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No resume selected yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All resumes</CardTitle>
        </CardHeader>
        <CardContent>
          {resumes.length ? (
            <div className="grid gap-3">
              {resumes.map((resume) => {
                const status = formatStatus(resume);
                return (
                  <div
                    key={resume.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={File02Icon} strokeWidth={2} className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{resume.file_name}</p>
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                            status.tone === "emerald" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          )}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {resume.fileSizeLabel} · Uploaded {formatDate(resume.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!resume.is_primary && (
                        <Button variant="secondary" size="sm" onClick={() => selectPrimary(resume.id)} disabled={isPending}>
                          Use this resume
                        </Button>
                      )}
                      {resume.signedUrl && (
                        <Button variant="outline" size="sm" nativeButton={false} render={<Link href={resume.signedUrl} target="_blank" />}>
                          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="size-3" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-sm font-medium">No resumes uploaded yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload your first resume to start populating your profile.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
