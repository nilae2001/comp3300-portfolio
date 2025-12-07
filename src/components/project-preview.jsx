import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { createSlug } from "@/lib/utils";

export default async function ProjectPreviewCard({ cardNumber = 3 }) {
  console.log("projects hit");

  let projects = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("API error:", res.status);
      return <div className="text-center p-8">Failed to load projects</div>;
    }

    const data = await res.json();
    projects = data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return <div className="text-center p-8">Error loading projects</div>;
  }

  console.log("projects:", projects);

  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return <div className="text-center p-8">No projects found</div>;
  }

  return (
    <div className="flex flex-row w-full justify-center flex-wrap items-center gap-2">
      {projects.slice(0, cardNumber).map((project, index) => (
        <Card key={index} className="hover:scale-105 transition-transform">
          <CardContent>
            {project.img || project.image ? (
              <Image
                src={project.img || project.image}
                alt={project.title || "Project image"}
                width={100}
                height={100}
              />
            ) : (
              <Skeleton className="h-[300px] w-[300px] bg-gray-300 mb-4" />
            )}

            <CardTitle className="p-1">{project.title}</CardTitle>

            <CardDescription className="p-1">
              {project.desc || project.description}
            </CardDescription>

            <Button asChild className="w-full">
              <Link
                href={`/projects/${project.id || createSlug(project.title)}`}
              >
                View Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
