import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/routes/ScrollToTop";
import RouteFallback from "../../components/RouteFallback";

// ── F19.3 — lazy-loaded page chunks ──────────────────────────────
// Every page below is split into its own bundle. CRA's default
// react-scripts config recognises React.lazy + dynamic import and
// emits a separate chunk per page. First paint of the marketing
// shell drops from ~all pages → just MainLayout + Home.
//
// Diagnostics is intentionally lazy too — it's rarely loaded but
// pulls auth + role-detection helpers, no reason to ship eagerly.
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const BlogsPage = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Contact = lazy(() => import("./pages/Contact"));
const FindTutors = lazy(() => import("./pages/FindTutors"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const TutorDetail = lazy(() => import("./pages/TutorDetail"));
const EsolForOrgs = lazy(() => import("./pages/EsolForOrgs"));
const BridgeMethod = lazy(() => import("./pages/BridgeMethod"));

// NOTE: the platform's own ./components/routes/AuthRouter is a stub
// that redirects to /home. The REAL auth screens (Login, Signup,
// ForgotPassword, ResetPassword, ConfirmEmail, VerifyEmail, the
// EsolJoin landing, and the JoinWizard) live in the dashboard module
// and are re-exported through its AuthRoute router. Lazy because
// most marketing visitors never hit /login.
const Auth = lazy(() => import("../dashboard/components/routes/AuthRoute"));

// Final Addendum §13 — standalone ROI calculator. Mounted
// OUTSIDE MainLayout so the marketing navbar doesn't bleed
// into the focused single-purpose funnel page.
const RoiCalculator = lazy(() => import("../public/pages/RoiCalculator"));
const Diagnostics = lazy(() => import("../shared/Diagnostics"));

// F19.5 — SPA health probe for load balancers. Tiny inline component;
// no need to lazy-load.
const HealthCheck: React.FC = () => (
  <pre style={{ margin: 0, padding: "16px", fontFamily: "monospace" }}>ok</pre>
);

export const PlatformRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      {/* Single Suspense boundary wraps every route. A page-level
          boundary would let the navbar render before the page
          body, but the navbar's already eager-loaded so wrapping
          all routes is simpler and produces the same UX. */}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* F19.5 — SPA health route. Placed before MainLayout so
              the LB probe doesn't pull in the navbar / footer chunks. */}
          <Route path="/_health" element={<HealthCheck />} />

          {/* Routes that share the Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            {/* ── New ESOL marketing IA (Project Silk rebrand) ── */}
            <Route path="/for-organisations" element={<EsolForOrgs />} />
            <Route path="/bridge-method" element={<BridgeMethod />} />

            {/* ── Legacy marketplace pages — kept reachable for any
                stale links but no longer surfaced in the navbar.
                `/esol` and `/esol/for-organisations` are intentionally
                dropped here: the `/esol` prefix is now the learner
                shell's namespace (see utils/getModule). The pages
                above replace them at top-level URLs. */}
            <Route path="/tutors" element={<FindTutors />} />
            <Route path="/tutors/:id" element={<TutorDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>

          {/* Final Addendum §13 — public ROI calculator. Sits
              OUTSIDE the MainLayout wrapper so it renders without
              the marketing navbar; placed BEFORE the /* catch-all
              so it matches before falling through to the Auth
              (login/signup) screens. No auth, no login redirect. */}
          <Route path="/roi-calculator" element={<RoiCalculator />} />

          {/* M0.5 — runtime diagnostics. No auth, no layout chrome.
              Reachable from every shell (mounted in DashboardRoutes
              too) so a stuck deploy is one URL away from being
              understood. */}
          <Route path="/__diag" element={<Diagnostics />} />

          {/* Routes without Navbar (e.g., login/signup) */}
          <Route path="/*" element={<Auth />} />
        </Routes>
      </Suspense>
    </>
  );
};
