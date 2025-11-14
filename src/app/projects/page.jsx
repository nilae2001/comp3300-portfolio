import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectPreviewCard from "@/components/project-preview";
import { TypographyH1 } from "@/components/ui/typography";

export default async function AllProjects() {
  //   const projects = await fetch(
  //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => data.projects)
  //     .catch((error) => {
  //       console.error(error);
  //       return [];
  //     });

  return (
    <>
      <div className="p-5">
        <TypographyH1>Nila's Projects</TypographyH1>
      </div>
      <div className="flex items-center justify-center">
        <ProjectPreviewCard />
      </div>
    </>
  );
}
