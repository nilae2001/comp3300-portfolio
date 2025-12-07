import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import EditProjectButton from "./edit-project-button"
import DeleteProjectButton from "./delete-project-button"

export default function ProjectCard({ project, session }) {
    return (
        <Card className="m-2 py-2 w-80 gap-2 hover:scale-105 transition-transform bg-stone-500">
            <Image width={300} height={300} src={project.img} alt={project.title} className="h-[300px] w-[300px] object-contain rounded self-center" />
            <h3 className="px-2 text-lg font-bold text-stone-50">{project.title}</h3>
            <p className="px-2 leading-relaxed h-12 text-sm text-stone-300 dark:text-stone-600 line-clamp-2">{project.description}</p>
            <CardFooter className='flex gap-2 justify-between items-center'>
                <Button variant="outline" className="w-[50px] rounded">
                    <Link href={`/projects/${project.id}`} rel="noopener noreferrer">
                        👁️
                    </Link>
                </Button>
                {session &&
                    <>
                        <EditProjectButton id={project.id} />
                        <DeleteProjectButton id={project.id} />
                    </>
                }
            </CardFooter>
        </Card>
    )
}