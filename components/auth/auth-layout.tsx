import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  SparklesIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons";

const features = [
  {
    icon: SparklesIcon,
    title: "AI-powered applications",
    description: "Tailor every resume and cover letter to the job in seconds.",
  },
  {
    icon: Target01Icon,
    title: "Track your pipeline",
    description: "See every application, status, and follow-up in one place.",
  },
  {
    icon: Briefcase01Icon,
    title: "Apply smarter",
    description: "Focus on roles that match your skills and career goals.",
  },
];

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.05),_transparent_55%)]"
        />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <HugeiconsIcon
                icon={Briefcase01Icon}
                strokeWidth={2}
                className="size-4 text-white"
              />
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">
              Job Agent
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              AI Job Application Agent
            </p>
            <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-white">
              Land your next role with less effort
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Automate applications, personalize outreach, and stay organized
              from search to offer.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature.title} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
                  <HugeiconsIcon
                    icon={feature.icon}
                    strokeWidth={2}
                    className="size-4 text-zinc-200"
                  />
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-100">
                    {feature.title}
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-zinc-500">
          Built for modern job seekers
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="mb-8 flex w-full max-w-md items-center justify-between lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon
                icon={Briefcase01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </span>
            <span className="text-sm font-semibold">Job Agent</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
