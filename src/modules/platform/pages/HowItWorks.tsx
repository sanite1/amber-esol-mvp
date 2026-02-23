import { useEffect } from "react";
import AOS from "aos";
import HowItWorksHero from "../components/how-it-works/HowItWorksHero";
import StepsSection from "../components/how-it-works/StepsSection";
import ForStudentsSection from "../components/how-it-works/ForStudentsSection";
import ForTutorsSection from "../components/how-it-works/ForTutorsSection";
import PricingPreview from "../components/how-it-works/PricingPreview";

export default function HowItWorks() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, []);

  return (
    <div>
      <HowItWorksHero />
      <StepsSection />
      <ForStudentsSection />
      <ForTutorsSection />
      <PricingPreview />
      {/* <HowItWorksCTA /> */}
    </div>
  );
}
