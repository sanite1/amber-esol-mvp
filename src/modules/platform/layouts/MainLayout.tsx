import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Public marketing-shell layout.
 *
 * The wrapping `.amber-platform` class scopes the design system
 * (src/styles/amber-design-system.css) to these routes only —
 * the dashboard, teacher and learner shells use their own
 * typography and surface colours.
 */
const MainLayout: React.FC = () => {
  return (
    <div className="amber-platform">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
