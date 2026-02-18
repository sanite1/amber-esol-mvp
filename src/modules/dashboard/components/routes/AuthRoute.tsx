import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../../pages/onboarding/Login";
import Signup from "../../pages/onboarding/Signup";
import ForgotPassword from "../../pages/onboarding/ForgotPassword";
import VerifyEmail from "../../pages/onboarding/VerifyEmail";
import ResetPassword from "../../pages/onboarding/ResetPassword";
import ConfirmEmail from "../../pages/onboarding/ConfirmEmail";
import SignupChoice from "../../pages/onboarding/SignupChoice";
import StudentRegister from "../../pages/onboarding/StudentRegister";
import TutorRegister from "../../pages/onboarding/TutorRegister";

export const Auth: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/signup" element={<Signup />} /> */}

      <Route path="/signup" element={<SignupChoice />} />
      <Route path="/signup/student" element={<StudentRegister />} />
      <Route path="/signup/tutor" element={<TutorRegister />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/verify/:id/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default Auth;
