import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Spinner } from "@/components/ui/spinner";

function LoginFormFallback() {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-border/60">
      <Spinner className="size-5" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your dashboard and manage job applications."
    >
      <Suspense fallback={<LoginFormFallback />}>
        <AuthForm mode="sign-in" />
      </Suspense>
    </AuthLayout>
  );
}
