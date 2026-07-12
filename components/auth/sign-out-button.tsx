"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? (
        <Spinner className="size-3.5" />
      ) : (
        <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-3.5" />
      )}
      Sign out
    </Button>
  );
}
