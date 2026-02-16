import React, { useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import TrustedBySection from "../components/home/TrustedBySection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import FeaturedTutorsSection from "../components/home/FeaturedTutorsSection";
import TestimonialsSection from "../components/home/Testimonials";
import FAQSection from "../components/home/FAQSection";

export default function Home() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="">
      <HeroSection />
      <TrustedBySection />
      <HowItWorksSection />
      <FeaturedTutorsSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
