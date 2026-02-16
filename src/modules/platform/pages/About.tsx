import React, { useEffect } from "react";
import AboutHero from "../components/about/AboutHero";
import OurStory from "../components/about/OurStory";
import MissionValues from "../components/about/OurMission";
import Timeline from "../components/about/Timeline";
import TeamSection from "../components/about/TeamSection";
import AboutCTA from "../components/about/AboutCTA";

export default function About() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      <AboutHero />
      <OurStory />
      <AboutCTA />
      <Timeline />
      <MissionValues />
      <TeamSection />
    </div>
  );
}
