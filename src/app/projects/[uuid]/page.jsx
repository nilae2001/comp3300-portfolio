import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { getProjectById } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import DeleteProjectButton from "@/components/delete-project-button";
import EditProjectButton from "@/components/edit-project-button"


export default async function Page({ params }) {
    const { uuid } = await params
    const foundProject = await getProjectById(uuid)
    const session = await auth0.getSession();

    console.log("found project", foundProject)

    return (
        <>
            {foundProject == null ? (
                notFound()
            ) : (
                <div className="flex flex-col w-full items-center justify-center bg-stone-50 font-sans dark:bg-black my-4">
                    <Card className="m-2 w-min-screen py-2 gap-2 bg-stone-500">
                        <CardHeader>
                            <CardTitle className="text-lg text-stone-50">{foundProject.title}</CardTitle>
                            {foundProject.keywords && (
                                <div className="flex gap-2 my-2 flex-wrap">
                                    {foundProject.keywords.map((keyword, index) => (
                                        <Badge variant="outline" key={index} className="bg-stone-700 text-stone-200">{keyword}</Badge>
                                    ))}
                                </div>
                            )}
                            <CardAction className={'flex gap-2'}>
                                <Button variant="outline" asChild>
                                    <Link href={foundProject.link} rel="noopener noreferrer">
                                        🔗
                                    </Link>
                                </Button>
                                {session?.user?.email &&
                                    <>
                                        <EditProjectButton id={uuid} />
                                        <DeleteProjectButton id={uuid} />
                                    </>
                                }
                            </CardAction>
                        </CardHeader>
                        <CardContent className="flex gap-2 justify-center">
                            <CardDescription className="text-stone-300 dark:text-stone-600">{foundProject.description}</CardDescription>
                            <Image width={300} height={300} src={foundProject.img} alt={foundProject.title} className="object-contain rounded self-center" />
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}