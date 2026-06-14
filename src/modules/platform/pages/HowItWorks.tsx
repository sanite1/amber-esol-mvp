import React from "react";
import { Navigate } from "react-router-dom";

/**
 * /how-it-works — redirect to /bridge-method.
 *
 * The legacy "How it works" page (marketplace booking flow) has
 * been retired. The closest replacement is the pedagogy explainer
 * at /bridge-method, so this route silently bounces there.
 *
 * Mirrors design-refs/site/how-it-works.html, which uses a
 * meta-refresh + JS replace to send visitors to bridge-method.html.
 */
const HowItWorks: React.FC = () => {
  return <Navigate to="/bridge-method" replace />;
};

export default HowItWorks;
