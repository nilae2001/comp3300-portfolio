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
import { TypographyH1, TypographyP } from "./ui/typography";

export default function MyHero() {
  return (
    <Card className="h-max w-full m-2 p-4 flex flex-row w-full ">
      <CardContent className="flex flex-row items-center gap-4">
        <Image
          src={"/profile.png"}
          alt="alt text"
          width={100}
          height={100}
        ></Image>
        <div>
          <TypographyH1>Nila's Portfolio</TypographyH1>
          <TypographyP>
            Hello, my name is Nila. Welcome to my portfolio. I'm a full-stack
            web developer specializing in modern web applications with Next.js,
            React, React Native, and TypeScript. I build scalable solutions that
            solve real-world problems. See projects down belowsies
          </TypographyP>
        </div>
      </CardContent>
    </Card>
  );
}
