import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// import About from "@/src/pages/About";

export const Auth: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<Navigate to="home" replace />} />
      {/* <Route path="/home" element={<Home />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};

export default Auth;
