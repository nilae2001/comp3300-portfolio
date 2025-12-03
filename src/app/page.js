import MyNavBar from "@/components/MyNavBar";
import MyHero from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/project-preview";
import GitHubCalendar from "@/components/github-calendar";



export default function Home() {
  return (
    <>
      {/* <div className="flex  items-center justify-center bg-zinc-50 font-sans dark:bg-black items-start"> */}
        {/* <MyNavBar /> */}
      {/* </div> */}
      <div className="flex items-start justify-start justify-center">
        <MyHero />
      </div>
      <GitHubCalendar username="nilae2001" />
      <ProjectPreviewCard cardNumber={3}/>
    </>
  );
}
