import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Spinner } from "@/components/ui/spinner";

function SignUpFormFallback() {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-border/60">
      <Spinner className="size-5" />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Job Agent and start applying smarter today."
    >
      <Suspense fallback={<SignUpFormFallback />}>
        <AuthForm mode="sign-up" />
      </Suspense>
    </AuthLayout>
  );
}
