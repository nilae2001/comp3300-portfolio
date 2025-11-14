import { createSlug } from "@/lib/utils";
// import rest of components needed.
import Image from "next/image";
import { TypographyH1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;

  const projects = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
  )
    .then((res) => res.json())
    .then((data) => data.projects)

    .catch((error) => {
      console.error("Error fetching projects:", error);
      return [];
    });

  const project = projects.find((proj) => createSlug(proj.title) === slug);
  console.log(project);
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-8">
        <TypographyH1>{project.title}</TypographyH1>
        <Image width={400} height={400} src={project.img} />
        <div>{project.desc}</div>
        <Button variant={"outline"} className="m-2">
          <Link href={project.link}>View Project</Link>
        </Button>
      </div>
    </>
  );
}
