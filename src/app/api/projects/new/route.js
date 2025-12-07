import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { insertProject } from "@/lib/db";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  img: z.string().trim().min(1, "Image is required"),
  link: z.string().trim().min(1, "Link is required"),
  keywords: z.array(z.string().trim()).default([]),
});

export const POST = auth0.withApiAuthRequired(async function handler(request) {
  const session = await auth0.getSession();
  const formData = await request.formData();
  const keywordsFromForm = formData.getAll("keywords[]");

  const payload = projectSchema.parse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    img: formData.get("img") ?? "",
    link: formData.get("link") ?? "",
    keywords: keywordsFromForm.length
      ? keywordsFromForm
      : formData.get("keywords")
        ? [formData.get("keywords")]
        : [],
  });
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "You must be logged in to create a project" },
      { status: 401 }
    );
  }

  const project = await insertProject(payload);
  return NextResponse.json(
    { message: "Project created", data: project },
    { status: 201 }
  );
})