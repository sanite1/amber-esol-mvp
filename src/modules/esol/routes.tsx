import { Route } from "react-router-dom";
import JoinWizard from "./pages/JoinWizard";

/**
 * Routes contributed by the ESOL module to the dashboard AuthRoute tree.
 * Mounted as <EsolRoutes /> so the parent <Routes> picks up the elements.
 */
export const EsolRoutes = () => (
  <>
    <Route path="/join" element={<JoinWizard />} />
  </>
);
