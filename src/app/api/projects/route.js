import { z } from "zod";
import { getProjects } from "@/lib/db";
import { NextResponse } from "next/server";

const projectSchema = z.object({
  id: z.string().min(1, "id is required"),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  link: z.string().trim().min(1),
  img: z.string().trim().min(1).optional(),
  keywords: z.array(z.string().trim()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});


export async function GET() {

  const projects = await getProjects();
  return NextResponse.json(projects);

}