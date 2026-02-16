import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout: React.FC = () => {
  return (
    <Box>
      <Navbar />

      <Box>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;
