// DashboardRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/routes/AuthRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import MainLayout from "./layout/MainLayout";
import Profile from "./pages/student/Profile";
import "react-quill/dist/quill.snow.css";
import ErrorPage from "./pages/student/ErrorPage";
import Dashboard from "./pages/student/Dashboard";
import Payments from "./pages/student/Payments";
import Settings from "./pages/student/Settings";
import MyTutors from "./pages/student/MyTutors";
import FindTutors from "./pages/student/FindTutors";
import MyLessons from "./pages/student/MyLessons";
import Messages from "./pages/student/Messages";
import TutorDetail from "./pages/student/TutorDetail";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorLessons from "./pages/tutor/TutorLessons";
import TutorAvailability from "./pages/tutor/TutorAvailability";
import TutorStudents from "./pages/tutor/TutorStudents";
import TutorProfile from "./pages/tutor/TutorProfile";
import TutorReviews from "./pages/tutor/TutorReviews";
import TutorMessages from "./pages/tutor/TutorMessages";
import TutorEarnings from "./pages/tutor/TutorEarnings";
import TutorSettings from "./pages/tutor/TutorSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTutors from "./pages/admin/AdminTutors";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTickets from "./pages/admin/AdminTickets";

export const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Protected Dashboard */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-tutors" element={<MyTutors />} />
          <Route path="/tutors" element={<FindTutors />} />
          <Route path="/lessons" element={<MyLessons />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/tutors/:id" element={<TutorDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/tutor/home" element={<TutorDashboard />} />
          <Route path="/tutor/lessons" element={<TutorLessons />} />
          <Route path="/tutor/availability" element={<TutorAvailability />} />
          <Route path="/tutor/students" element={<TutorStudents />} />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/tutor/reviews" element={<TutorReviews />} />
          <Route path="/tutor/messages" element={<TutorMessages />} />
          <Route path="/tutor/earnings" element={<TutorEarnings />} />
          <Route path="/tutor/settings" element={<TutorSettings />} />

          <Route path="/admin/home" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/tutors" element={<AdminTutors />} />
          <Route path="/admin/lessons" element={<AdminLessons />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
        </Route>
      </Route>

      {/* Public Auth Routes */}
      <Route path="/*" element={<Auth />} />

      {/* Global 404 - Standalone full page */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
