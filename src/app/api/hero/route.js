import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import image2uri, { extTypeMap } from "image2uri";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { getHero, upsertHero } from "@/lib/db";

const heroSchema = z.object({
  avatar: z
    .string()
    .trim()
    .min(1, "Avatar is required")
    .refine((value) => value.startsWith("data:"), "Avatar must be a data URL"),
  fullName: z.string().trim().min(2, "Full name is required").max(200, "Full name is too long"),
  shortDescription: z
    .string()
    .trim()
    .min(2, "Short description is required")
    .max(120, "Short description must be 120 characters or fewer"),
  longDescription: z.string().trim().min(10, "Long description is required").max(5000),
});

export async function GET() {
  const hero = await getHero();
  return NextResponse.json({ data: hero });
}

export const PUT = auth0.withApiAuthRequired(async function handler(request) {
  const session = await auth0.getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "You must be logged in to edit the hero section" }, { status: 401 });
  }

  const formData = await request.formData();
  const avatarFile = formData.get("avatarFile");
  const avatarFromForm = formData.get("avatar");
  const avatarDataUrl = await toDataUrl(avatarFile, avatarFromForm);

  const payload = heroSchema.parse({
    avatar: avatarDataUrl ?? "",
    fullName: formData.get("fullName") ?? "",
    shortDescription: formData.get("shortDescription") ?? "",
    longDescription: formData.get("longDescription") ?? "",
  });

  const hero = await upsertHero(payload);
  return NextResponse.json({ message: "Hero updated", data: hero }, { status: 200 });
});

function getExtFromMime(type) {
  const entry = Object.entries(extTypeMap).find(([, mime]) => mime === type);
  return entry ? entry[0] : "";
}

async function toDataUrl(file, fallbackString) {
  const fallback =
    typeof fallbackString === "string" && fallbackString.trim().length > 0 ? fallbackString.trim() : "";

  if (file && typeof file === "object" && typeof file.arrayBuffer === "function") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extFromName = path.extname(file.name || "") || "";
    const derivedExt = extFromName || getExtFromMime(file.type);
    const mimeType = extTypeMap[derivedExt] ?? file.type ?? "application/octet-stream";
    const tmpFilePath = path.join(os.tmpdir(), `${randomUUID()}${derivedExt || ".bin"}`);

    fs.writeFileSync(tmpFilePath, buffer);
    try {
      const uri = await image2uri(tmpFilePath, derivedExt ? { ext: derivedExt } : undefined);
      if (typeof uri === "string" && uri.length > 0) {
        if (uri.startsWith("data:")) {
          return uri;
        }
        return `data:${mimeType};base64,${uri}`;
      }
    } catch (error) {
      console.error("Failed to convert avatar with image2uri", error);
    } finally {
      fs.rmSync(tmpFilePath, { force: true });
    }
  }

  return fallback;
}