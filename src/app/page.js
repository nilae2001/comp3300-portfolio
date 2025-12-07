import MyNavBar from "@/components/MyNavBar";
import MyHero from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/project-preview";
import GitHubCalendar from "@/components/github-calendar";
import ContactMe from "@/components/contact-me";


export const revalidate = 0;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen min-w-screen items-center bg-zinc-50 font-sans dark:bg-black">
      <MyHero />
      <ProjectPreviewCard numberOfProjects={3} />
      <GitHubCalendar username="nilae2001" />
      <ContactMe />
    </div>
  );
}
