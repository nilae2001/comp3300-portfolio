import { auth0 } from "@/lib/auth0";
import { redirect, notFound } from "next/navigation";
import { getProjectById } from "@/lib/db";
import EditProjectForm from "@/components/edit-project-form";

export default async function EditProjectPage({ params }) {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login");

  const { uuid } = await params;
  
  const project = await getProjectById(uuid);
  if (!project) notFound();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <EditProjectForm project={project} uuid={uuid} />
    </div>
  );
}