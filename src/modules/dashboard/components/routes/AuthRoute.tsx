import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../../pages/onboarding/Login";
import ForgotPassword from "../../pages/onboarding/ForgotPassword";
import VerifyEmail from "../../pages/onboarding/VerifyEmail";
import ResetPassword from "../../pages/onboarding/ResetPassword";
import ConfirmEmail from "../../pages/onboarding/ConfirmEmail";
import SignupChoice from "../../pages/onboarding/SignupChoice";
import StudentRegister from "../../pages/onboarding/StudentRegister";
import EsolJoin from "../../pages/onboarding/EsolJoin";
import JoinWizard from "../../../esol/pages/JoinWizard";
// D10 — platform-shell 404 page. Mounted here as the trailing
// catch-all so any URL not matched by either the marketing routes
// (above this router) or the auth screens (below) renders the
// platform's "Page not found" card instead of a blank pane.
import NotFound from "../../../platform/pages/NotFound";

export const Auth: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/signup" element={<Signup />} /> */}

      <Route path="/signup" element={<SignupChoice />} />
      <Route path="/signup/student" element={<StudentRegister />} />
      {/* /signup/tutor removed in v2 pivot — tutor applications via /contact */}
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/verify/:id/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route path="/esol/join" element={<EsolJoin />} />
      {/* Function 2 To-Do 5 — five-screen wizard. Newer entry point. */}
      <Route path="/join" element={<JoinWizard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Auth;
