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

const projects = [
  {
    title: "Project One",
    desc: "Short blurb.",
    img: "https://placehold.co/300.png",
    link: "#",
  },
  {
    title: "Project Two",
    desc: "Short blurb.",
    img: "https://placehold.co/300.png",
    link: "#",
  },
  {
    title: "Project Three",
    desc: "Short blurb.",
    img: "https://placehold.co/300.png",
    link: "#",
  },
];
export default function ProjectPreviewCard({ cardNumber = 3 }) {
  return (
    <div className="flex flex-row w-full justify-center flex-wrap items-center gap-2">
      {projects.slice(0, cardNumber).map((project, index) => (
        <Card key={index} className="hover:scale-105 transition-transform">
          <CardContent>
            <Skeleton className="w-full h-[300px] w-[300px] bg-gray-300 mb-4"></Skeleton>
            {/* <Image src={project.img} alt="ALT TEXT" width={100} height={100}></Image> */}
            <CardTitle className="p-1">{project.title}</CardTitle>

            <CardDescription className="p-1">{project.desc}</CardDescription>
            <Button href={project.link} className="w-full">Project Link</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
