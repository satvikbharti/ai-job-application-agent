"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon, Loading03Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function OnboardingResumeDialog() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isPending, startTransition] = useTransition();

  function uploadResume() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a resume file to continue.");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append("resume", file);

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

      router.refresh();
    });
  }

  return (
    <Dialog open onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] gap-5 sm:max-w-lg"
      >
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HugeiconsIcon icon={File02Icon} strokeWidth={2} className="size-5" />
          </div>
          <DialogTitle className="text-base">Upload your resume</DialogTitle>
          <DialogDescription>
            Add your resume to set up your profile. We will parse it, save it, and fill your profile so you can review it before applying.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
            <span className="flex size-9 items-center justify-center rounded-md bg-background ring-1 ring-border">
              <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="size-4" />
            </span>
            <span className="text-sm font-medium text-foreground">
              {fileName || "Choose a PDF, DOCX, or text resume"}
            </span>
            <span className="text-xs text-muted-foreground">Maximum file size: 8 MB</span>
            <Input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="sr-only"
              disabled={isPending}
              onChange={(event) => {
                setFileName(event.target.files?.[0]?.name || "");
                setError("");
              }}
            />
          </label>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <Button size="lg" className="w-full" disabled={isPending} onClick={uploadResume}>
          {isPending ? (
            <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
          ) : (
            <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="size-4" />
          )}
          {isPending ? "Parsing resume..." : "Upload and continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
