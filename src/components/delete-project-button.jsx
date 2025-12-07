"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";

export default function DeleteProjectButton({ id }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const deleteHandle = async () => {
    if (!window.confirm("Delete this project?")) return;

    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete project");
      return;
    }

    toast.success("Project deleted");
    router.push("/projects");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="p-4 rounded bg-red-500 hover:bg-red-800"
      disabled={isPending}
      onClick={() => startTransition(deleteHandle)}
    >
      {isPending ? "Deleting…" : "🗑️"}
    </Button>
  );
}