"use client"

import { useUser } from "@auth0/nextjs-auth0/client";
import useSWR from "swr";
import ProjectCard from "@/components/project-card";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProjectsPage() {
    const { user } = useUser();
    const { data: response, error } = useSWR("/api/projects", fetcher);

    console.log(response)

    if (!response) return <p>Loading…</p>;
    if (error) return <p>Failed to load projects.</p>;

    const projectData = response || []; 


    return (
        <div className="flex flex-wrap items-center justify-center bg-stone-50 font-sans dark:bg-black my-4">
            {projectData.length > 0 ? (
                projectData.map((project) => (
                    <ProjectCard key={project.id} project={project} session={user} />
                ))
            ) : (
                <p>No projects found</p>
            )}
        </div>
    );
}