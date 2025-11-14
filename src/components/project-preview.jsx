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
  const projects = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
  )
    .then((res) => res.json())
    .then((data) => data.projects)
    .catch((error) => {
      console.error(error);
      return [];
    });

  return (
    <div className="flex flex-row w-full justify-center flex-wrap items-center gap-2">
      {projects.slice(0, cardNumber).map((project, index) => (
        <Card key={index} className="hover:scale-105 transition-transform">
          <CardContent>
            {project.img ? (
              <Image
                src={project.img}
                alt="ALT TEXT"
                width={100}
                height={100}
              ></Image>
            ) : (
              <Skeleton className=" h-[300px] w-[300px] bg-gray-300 mb-4"></Skeleton>
            )}

            <CardTitle className="p-1">{project.title}</CardTitle>

            <CardDescription className="p-1">{project.desc}</CardDescription>
            <Button href={project.link} className="w-full">
              <Link href={`/projects/${createSlug(project.title)}`}>
              Project Link
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
