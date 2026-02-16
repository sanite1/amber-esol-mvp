import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HelpCenter from "./pages/HelpCenter";
import BlogsPage from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./components/routes/AuthRouter";
import TermsOfService from "./pages/TermsOfService";
import ScrollToTop from "./components/routes/ScrollToTop";
import Contact from "./pages/Contact";
import FindTutors from "./pages/FindTutors";
import HowItWorks from "./pages/HowItWorks";
import TutorDetail from "./pages/TutorDetail";

export const PlatformRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Routes that share the Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tutors/:slug" element={<TutorDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/tutors" element={<FindTutors />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Route>

        {/* Routes without Navbar (e.g., login/signup) */}
        <Route path="/*" element={<Auth />} />
      </Routes>
    </>
  );
};
