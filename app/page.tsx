import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Briefcase01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.04),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_55%)]"
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="inline-flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
          <span className="text-sm font-semibold tracking-tight">Job Agent</span>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Button render={<Link href="/dashboard" />} size="sm">
              Dashboard
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Button>
          ) : (
            <>
              <Button render={<Link href="/login" />} variant="ghost" size="sm">
                Sign in
              </Button>
              <Button render={<Link href="/signup" />} size="sm">
                Get started
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-16 text-center sm:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
          <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-3.5" />
          AI-powered job applications
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
          Apply to more jobs in less time
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Job Agent helps you tailor applications, track your pipeline, and stay
          organized from search to offer — all in one place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            render={<Link href={user ? "/dashboard" : "/signup"} />}
            size="lg"
            className="h-11 px-6 text-sm"
          >
            {user ? "Go to dashboard" : "Create free account"}
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
          {!user && (
            <Button
              render={<Link href="/login" />}
              variant="outline"
              size="lg"
              className="h-11 px-6 text-sm"
            >
              Sign in
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
