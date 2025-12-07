import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { Roboto_Mono } from "next/font/google";
import { getHero } from "@/lib/db";

const robotoMono = Roboto_Mono({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-roboto-mono",
});

const HERO_PLACEHOLDER_AVATAR = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const fallbackHero = {
    avatar: "/cvwi.jpeg",
    fullName: "Iman Anooshehpour",
    shortDescription: "Software Developer, Instructor, Youtuber, and Tech Content Creator",
    longDescription:
        "Hello! I'm Iman (pronounced /i:man/), a name that embodies 'faith', a quality deeply rooted in my personal and professional life. My journey in tech is driven by a love for crafting seamless interfaces and delivering exceptional user experiences, bridging the gap between human-centered design and the technical prowess of Full-stack Engineering. Fascinated by the power of technology to transform ideas into tangible solutions, I thrive in blending aesthetics with functionality to create digital experiences that resonate with users. Let me know your software needs/ideas/problems; I'll take care of both Front-end and Back-end.",
};

export default async function MyHero() {
    const hero = await getHero().catch(() => null);
    const avatarSource = (() => {
        const trimmed = hero?.avatar?.trim();
        if (trimmed && trimmed.length > 0 && trimmed !== HERO_PLACEHOLDER_AVATAR) {
            return trimmed;
        }
        if (fallbackHero.avatar.startsWith("data:") || fallbackHero.avatar.startsWith("/")) {
            return fallbackHero.avatar;
        }
        return HERO_PLACEHOLDER_AVATAR;
    })();

    const fullName = hero?.fullName || fallbackHero.fullName;
    const shortDescription = hero?.shortDescription || fallbackHero.shortDescription;
    const longDescription = hero?.longDescription || fallbackHero.longDescription;

    return (
        <div className="flex min-h-auto w-full flex-col items-stretch justify-center gap-4 bg-stone-500 p-4 lg:flex-row lg:gap-6 lg:p-8">
            <Card className="flex w-full flex-col items-center justify-center p-8 text-center lg:flex-[2]">
                <Image
                    src={avatarSource}
                    alt={fullName}
                    width={150}
                    height={150}
                    className="mx-auto mb-4 rounded-full object-cover"
                    unoptimized={avatarSource.startsWith("data:")}
                />
                <h1 className="mb-4 text-4xl font-bold">{fullName}</h1>
                <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                    {shortDescription}
                </p>
            </Card>
            <Card className="flex w-full flex-col justify-center p-8 text-center lg:flex-[5]">
                <p className={robotoMono.className} >{longDescription}</p>
            </Card>
            
        </div>
    );
}