import Hero from "@/components/Hero";
// import UpcomingEvents from "@/components/UpcomingEvents";
// import ProjectsSection from "@/components/ProjectsSection";
import ProjectRows from "@/components/ProjectRows";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <UpcomingEvents /> */}
      {/* <ProjectsSection /> */}
      <ProjectRows />
      <AboutSection />
      <ContactSection />
    </>
  );
}
