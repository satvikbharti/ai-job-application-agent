"use client";

import type { ElementType } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  ComputerProgramming01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricItem = {
  label: string;
  value: string;
  icon: ElementType;
};

type ProfileCompletenessCardProps = {
  progress: number;
  contactCount: number;
  experienceCount: number;
  educationCount: number;
  projectCount: number;
  extraCount: number;
};

export function ProfileCompletenessCard({
  progress,
  contactCount,
  experienceCount,
  educationCount,
  projectCount,
  extraCount,
}: ProfileCompletenessCardProps) {
  const tone =
    progress >= 80
      ? {
          label: "Almost there",
          message: "Your profile is looking strong",
          description: "A few finishing touches will make it stand out even more.",
          color: "#10b981",
          badgeClassName: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        }
      : progress >= 50
        ? {
            label: "On track",
            message: "You're making solid progress",
            description: "Add a bit more detail to sharpen your profile.",
            color: "#f59e0b",
            badgeClassName: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
          }
        : {
            label: "Getting started",
            message: "Start filling in your profile",
            description: "Complete the basics to build a stronger first impression.",
            color: "#38bdf8",
            badgeClassName: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
          };

  const metrics: MetricItem[] = [
    {
      label: "Basic contact details",
      value: `${contactCount}/4`,
      icon: User02Icon,
    },
    {
      label: "Experience entries",
      value: `${experienceCount} ${experienceCount === 1 ? "entry" : "entries"}`,
      icon: Briefcase01Icon,
    },
    {
      label: "Education & portfolio",
      value: `${educationCount + projectCount + extraCount} ${educationCount + projectCount + extraCount === 1 ? "item" : "items"}`,
      icon: ComputerProgramming01Icon,
    },
  ];

  return (
    <Card className="border-primary/15 bg-linear-to-br from-background via-primary/5 to-background shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Profile completeness</CardTitle>
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]", tone.badgeClassName)}>
            {tone.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-background/80 p-3">
          <div
            className="relative flex size-24 shrink-0 items-center justify-center rounded-full p-1"
            style={{
              background: `conic-gradient(${tone.color} ${progress * 3.6}deg, hsl(var(--muted)) 0deg)`,
            }}
          >
            <div className="flex size-full items-center justify-center rounded-full bg-background text-lg font-semibold">
              {progress}%
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">{tone.message}</p>
            <p className="text-sm text-muted-foreground">{tone.description}</p>
          </div>
        </div>

        <div className="grid gap-2">
          {metrics.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-3.5" />
                </div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
